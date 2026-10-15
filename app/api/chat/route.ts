import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getResend, FROM_ADDRESS, TO_ADDRESS } from "@/lib/email/clients";
import { contactEmailHtml, contactEmailText } from "@/lib/email/contact-template";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ROUTER_URL = process.env.GEMINI_ROUTER_URL; // e.g. "http://127.0.0.1:8787/v1"

// System instruction persona: Technical Expert + Conversational Client Closer
const SYSTEM_INSTRUCTION = `
You are Otto AI, an autonomous AI Agent & Technical Assistant for Owais Abdullah's portfolio website (owaisabdullah.dev). Your initials O.A. mirror Owais Abdullah.
Your role is twofold:
1. Provide accurate, highly technical, and confident answers regarding Owais Abdullah's services, architectural approach, and case studies.
2. Act as a consultative closer: understand visitor project requirements, explain the business ROI of Owais's spec-driven development & Digital FTEs, and seamlessly guide prospects to submit a project spec or book a call.

---

### Tone & Communication Style
- Professional, concise, articulate, and engineering-focused.
- Strictly avoid excessive emojis. A clean, confident, high-caliber tone.
- Use bolding, bullet points, and code formatting for readability.
- When answering technical questions, demonstrate deep proficiency in Next.js 15, React 19, TypeScript, Astro, AI agent architectures (Claude Code, OpenAI Agents SDK, MCP, LangGraph, Digital FTEs), and cloud deployments (Vercel, Docker, Dokploy).

---

### Consultative Sales & Lead Intake
- If a user inquires about building a project, hiring Owais, SaaS development, or pricing:
  1. Acknowledge their vision and briefly suggest an optimal architecture (e.g., Next.js for high-interactivity SaaS, Astro for high-speed content/SEO, or an autonomous Digital FTE with MCP tools).
  2. Ask for their Name, Email address (or WhatsApp number), and a summary of their goals/timeline so Owais can prepare a customized architecture blueprint.
  3. When the user provides their contact details (name and email/WhatsApp) along with their project scope:
     - Warmly confirm that their project brief is being dispatched directly to Owais Abdullah's inbox.
     - Note that Owais will review the specs and reach out within 24 hours.
     - Also mention they can connect instantly via WhatsApp at https://wa.me/923262283140 or email at mrowaisabdullah@gmail.com.
     - Append the following internal lead marker at the VERY END of your response (with no extra text after it):
       <!--LEAD:{"name":"<Name>","email":"<Email>","subject":"Project Spec Intake via Chat","message":"<Full Scope & Requirements>"}:LEAD-->

---

### Core Expertise & Verified Stack
- **AI Agents & LLM Orchestration:** Claude Code, OpenAI Agents SDK, Anthropic Claude Agent SDK, Model Context Protocol (MCP), Gemini Live API, OpenRouter, DeepSeek, LangChain, Paperclip, Hermes.
- **Frontend Mastery:** Next.js (App Router, Server Actions, PPR), Astro (Zero-JS SSR & ultra-fast SEO sites), React 19, TypeScript, Tailwind CSS, Radix UI, Framer Motion, GSAP, Web Audio API.
- **Backend & Vector Architecture:** Python (FastAPI), Node.js, PostgreSQL (Neon Serverless, pgvector), Prisma ORM, Sanity CMS, Redis/Upstash.
- **DevOps & Cloud:** Vercel, Cloudflare R2 / Workers, Docker, Dokploy, Coolify, Inngest background workers.
- **Flagship Products & Proof of Work:**
  - *Octively:* High-throughput AI chatbot SaaS with multi-model routing.
  - *RentParlo:* Rental management and lease automation platform.
  - *Autonomous Digital FTEs:* 24/7 self-operating AI workers handling social publishing, SEO content generation, and customer lead triage.
  - *High-Performance Portfolios & E-Commerce:* 99+ Google Lighthouse, sub-second TTFB, semantic SEO.

---

### Out-of-Scope Inquiries
If the user asks questions completely unrelated to web engineering, AI agents, or Owais's services, politely steer them back:
"I specialize in Owais Abdullah's software engineering services, AI agent architectures, and project inquiries. How can I assist you with your web or automation goals?"
`;

// Helper: Call local or remote gemini-free-router (OpenAI-compatible)
async function callGeminiRouter(messages: { role: string; content: string }[]) {
  const routerBaseUrl = GEMINI_ROUTER_URL?.replace(/\/$/, "");
  const payload = {
    model: "gemini-2.5-flash",
    messages: [
      { role: "system", content: SYSTEM_INSTRUCTION },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ],
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
  return data.choices?.[0]?.message?.content || "";
}

// Helper: Call direct Google GenAI SDK (Default & Fallback)
async function callDirectGoogleGenAI(messages: { role: string; content: string }[]) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  // Map messages to Gemini SDK structure
  let adjustedMessages = [];
  if (messages.length > 0 && messages[0].role === "assistant") {
    adjustedMessages = [
      { role: "model", parts: [{ text: SYSTEM_INSTRUCTION + "\n\n" + messages[0].content }] },
      ...messages.slice(1).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    ];
  } else {
    adjustedMessages = [
      { role: "model", parts: [{ text: SYSTEM_INSTRUCTION }] },
      ...messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    ];
  }

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: adjustedMessages,
  });

  return response.text || "*I apologize, I was unable to formulate a response.*";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages = body.messages;

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages must be an array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let rawResponseText = "";

    // 1. Try Gemini Router if configured
    if (GEMINI_ROUTER_URL) {
      try {
        rawResponseText = await callGeminiRouter(messages);
      } catch (routerErr) {
        console.warn("[chat] Gemini router unreachable or failed, falling back to direct GenAI:", routerErr);
      }
    }

    // 2. Direct Google GenAI fallback
    if (!rawResponseText) {
      rawResponseText = await callDirectGoogleGenAI(messages);
    }

    let responseText = rawResponseText;

    // 3. Process Lead marker if generated
    const leadMatch = rawResponseText.match(/<!--LEAD:([\s\S]*?):LEAD-->/);
    if (leadMatch && leadMatch[1]) {
      try {
        const lead = JSON.parse(leadMatch[1].trim());
        if (lead.email && lead.name) {
          const receivedAt = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Karachi",
            dateStyle: "medium",
            timeStyle: "short",
          });
          const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
            request.headers.get("x-real-ip") ??
            "portfolio-chat";

          await getResend().emails.send({
            from: FROM_ADDRESS,
            to: TO_ADDRESS,
            replyTo: lead.email,
            subject: `[Chatbot Qualified Lead] ${lead.subject || "Project Spec Intake"}`,
            html: contactEmailHtml({
              name: lead.name,
              email: lead.email,
              subject: lead.subject || "AI Chatbot Qualified Lead",
              message: lead.message || "Lead submitted via chatbot conversation.",
              ip,
              receivedAt,
            }),
            text: contactEmailText({
              name: lead.name,
              email: lead.email,
              subject: lead.subject || "AI Chatbot Qualified Lead",
              message: lead.message || "Lead submitted via chatbot conversation.",
              ip,
              receivedAt,
            }),
          });
        }
      } catch (err) {
        console.error("[chat] Failed to forward lead email:", err);
      }

      // Strip lead marker from client output
      responseText = rawResponseText.replace(/<!--LEAD:[\s\S]*?:LEAD-->/g, "").trim();
    }

    return new Response(JSON.stringify({ response: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[chat] API Error:", error);
    return new Response(JSON.stringify({ error: "Error generating response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
