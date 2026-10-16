import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getResend, FROM_ADDRESS, TO_ADDRESS } from "@/lib/email/clients";
import { contactEmailHtml, contactEmailText } from "@/lib/email/contact-template";
import {
  ChatRequestSchema,
  checkRateLimit,
  detectPromptInjection,
  sanitizeUserMessage,
} from "@/lib/chat-security";
import { getCanonicalAgentInstructions } from "@/lib/canonical-context";
import {
  AGENT_FUNCTION_DECLARATIONS,
  OPENAI_COMPATIBLE_TOOLS,
  AgentFunctionCall,
} from "@/lib/agent-tools";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ROUTER_URL = process.env.GEMINI_ROUTER_URL; // e.g. "http://127.0.0.1:8787/v1"

interface ModelResult {
  text: string;
  toolCalls: AgentFunctionCall[];
}

// Helper: Call local or remote gemini-free-router (OpenAI-compatible)
async function callGeminiRouter(
  messages: { role: string; content: string }[]
): Promise<ModelResult> {
  const routerBaseUrl = GEMINI_ROUTER_URL?.replace(/\/$/, "");
  const systemPrompt = getCanonicalAgentInstructions();

  const payload = {
    model: "gemini-2.5-flash",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ],
    tools: OPENAI_COMPATIBLE_TOOLS,
    temperature: 0.7,
  };

  const res = await fetch(`${routerBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GFR_TOKEN || "unused"}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(12000), // 12s timeout for router
  });

  if (!res.ok) {
    throw new Error(`Router returned status ${res.status}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0]?.message;
  const text = choice?.content || "";
  const toolCalls: AgentFunctionCall[] = [];

  if (Array.isArray(choice?.tool_calls)) {
    for (const tc of choice.tool_calls) {
      if (tc.function?.name) {
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(tc.function.arguments || "{}");
        } catch {
          // ignore argument parse error
        }
        toolCalls.push({ name: tc.function.name, args });
      }
    }
  }

  return { text, toolCalls };
}

// Helper: Call direct Google GenAI SDK (Default & Fallback)
async function callDirectGoogleGenAI(
  messages: { role: string; content: string }[]
): Promise<ModelResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const systemPrompt = getCanonicalAgentInstructions();

  // Map messages to Gemini SDK structure
  const contents = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await (genAI.models as any).generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      systemInstruction: systemPrompt,
      tools: [
        {
          functionDeclarations: AGENT_FUNCTION_DECLARATIONS,
        },
      ],
      temperature: 0.7,
    },
  });

  const text = response.text || "";
  const toolCalls: AgentFunctionCall[] = [];

  if (Array.isArray(response.functionCalls)) {
    for (const fc of response.functionCalls) {
      if (fc.name) {
        toolCalls.push({
          name: fc.name,
          args: (fc.args || {}) as Record<string, unknown>,
        });
      }
    }
  }

  return { text, toolCalls };
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  // 1. Rate Limiting Protection (Max 15 chat turns per IP per minute)
  if (checkRateLimit(ip, 15, 60_000)) {
    return NextResponse.json(
      { error: "Too many messages in a short time. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  try {
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    // 2. Strict Zod Schema Validation
    const parsed = ChatRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid chat request format.";
      return NextResponse.json({ error: firstError }, { status: 422 });
    }

    const { messages } = parsed.data;

    // 3. Prompt Injection & Jailbreak Pre-defense Inspection
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage && detectPromptInjection(lastUserMessage.content)) {
      return NextResponse.json({
        response:
          "I am Otto AI, Owais Abdullah's technical assistant. I operate strictly within my architectural and development engineering domain and do not disclose system instructions, modify operating parameters, or bypass safety guardrails. How can I assist with your software project?",
      });
    }

    // 4. Sanitize messages before routing to LLM (strip fake lead markers, dangerous tokens)
    const sanitizedMessages = messages.map((m) => ({
      role: m.role,
      content: sanitizeUserMessage(m.content),
    }));

    let modelResult: ModelResult | null = null;

    // 5. Try Gemini Router if configured
    if (GEMINI_ROUTER_URL) {
      try {
        modelResult = await callGeminiRouter(sanitizedMessages);
      } catch (routerErr) {
        console.warn("[chat] Gemini router unreachable or failed, falling back to direct GenAI:", routerErr);
      }
    }

    // 6. Direct Google GenAI fallback
    if (!modelResult) {
      modelResult = await callDirectGoogleGenAI(sanitizedMessages);
    }

    let responseText = modelResult.text || "";
    const toolCalls = [...modelResult.toolCalls];

    // 7. Check for textual lead marker fallback
    const leadMatch = responseText.match(/<!--LEAD:([\s\S]*?):LEAD-->/);
    if (leadMatch && leadMatch[1]) {
      try {
        const lead = JSON.parse(leadMatch[1].trim());
        if (lead.email && lead.name) {
          toolCalls.push({
            name: "submit_lead",
            args: {
              name: lead.name,
              email: lead.email,
              message: lead.message || "Lead submitted via chatbot conversation.",
              serviceType: lead.subject || "Project Spec Intake",
            },
          });
        }
      } catch (err) {
        console.error("[chat] Failed to parse lead marker:", err);
      }
      responseText = responseText.replace(/<!--LEAD:[\s\S]*?:LEAD-->/g, "").trim();
    }

    // 8. Process submit_lead tool calls on the server
    const submitLeadCall = toolCalls.find((tc) => tc.name === "submit_lead");
    if (submitLeadCall) {
      const args = submitLeadCall.args as {
        name?: string;
        email?: string;
        message?: string;
        serviceType?: string;
      };

      if (args.name && args.email) {
        const receivedAt = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Karachi",
          dateStyle: "medium",
          timeStyle: "short",
        });

        try {
          await getResend().emails.send({
            from: FROM_ADDRESS,
            to: TO_ADDRESS,
            replyTo: args.email,
            subject: `[Chatbot Qualified Lead] ${args.serviceType || "Project Spec Intake"}`,
            html: contactEmailHtml({
              name: args.name,
              email: args.email,
              subject: args.serviceType || "AI Chatbot Qualified Lead",
              message: args.message || "Lead submitted via chatbot conversation.",
              ip,
              receivedAt,
            }),
            text: contactEmailText({
              name: args.name,
              email: args.email,
              subject: args.serviceType || "AI Chatbot Qualified Lead",
              message: args.message || "Lead submitted via chatbot conversation.",
              ip,
              receivedAt,
            }),
          });
        } catch (emailErr) {
          console.error("[chat] Failed to forward lead email:", emailErr);
        }
      }
    }

    // 9. If text is empty because the model only emitted a tool call, synthesize a natural response
    if (!responseText.trim()) {
      const navCall = toolCalls.find((tc) => tc.name === "navigate" || tc.name === "navigate_to_section");
      const drawerCall = toolCalls.find((tc) => tc.name === "open_lead_drawer");

      if (navCall) {
        const target = (navCall.args.target as string) || (navCall.args.section as string) || "projects";
        responseText = `I'm navigating you to ${target} right now.`;
      } else if (drawerCall) {
        responseText = "I've opened the project inquiry form right on your screen for you.";
      } else if (submitLeadCall) {
        const name = (submitLeadCall.args.name as string) || "";
        responseText = `Thank you ${name}! Your project brief has been dispatched directly to Owais Abdullah's inbox. He will review your specs and be in touch within 24 hours.`;
      } else {
        responseText = "*Response processed.*";
      }
    }

    return NextResponse.json({ response: responseText, toolCalls }, { status: 200 });
  } catch (error) {
    console.error("[chat] API Error:", error);
    return NextResponse.json({ error: "Error generating response" }, { status: 500 });
  }
}
