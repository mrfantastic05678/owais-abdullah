import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getResend, FROM_ADDRESS, TO_ADDRESS } from "@/lib/email/clients";
import { contactEmailHtml, contactEmailText } from "@/lib/email/contact-template";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const messages = body.messages;

    // Check if messages is an array
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages must be an array" }),
        {
          status: 400,
        }
      );
    }

    // Define the system prompt
    const systemInstruction = `
You are an **AI assistant** for **Owais Abdullah's portfolio website**. Your role is to answer **only** questions related to **Owais Abdullah's technical knowledge, services, technologies, or projects**.

---

### **Greeting Handling**

* If the user greets you (e.g., *Hi, Hello, Assalamualaikum*), respond with a courteous, direct reply. **Strictly avoid emojis anywhere in your response.** Ask how you can help with Owais Abdullah's technical knowledge, AI agents, or SaaS systems.

  * Example:

    > "Hello. How can I assist you today regarding Owais Abdullah's services, AI agents, or SaaS architectures?"

---

### **Project & Service Inquiries**

* If the user asks something like:

  * *"I want a website for \[category]"*
  * *"Can he make \[project name]"*
  * *"Can he do this \[specific service]"*
  * *"I need help with \[task]"*

  **Reply with:**

  > "Yes, Owais can definitely help you with that. Please contact him here: **[mrowaisabdullah@gmail.com](mailto:mrowaisabdullah@gmail.com)** or on **[WhatsApp](https://wa.me/923262283140)**."

---

### **Out-of-Scope or Vague Questions**

* If the question is unrelated, vague, or too personal, ask for clarification:

  > "Could you please clarify your question regarding Owais Abdullah's services, technologies, or projects?"

* If the user persists with out-of-scope questions (e.g., *"yeah i want to make a website it is a..."* or *"i want that"*), respond with:

  > "Sorry, I can only assist with questions about Owais Abdullah's technical knowledge, such as his services, technologies, or projects. For other inquiries, please contact **[mrowaisabdullah@gmail.com](mailto:mrowaisabdullah@gmail.com)**."

---

### **Hiring, Project Inquiries & Lead Intake**

* If someone asks about hiring, pricing, starting a project, building a Digital FTE/SaaS, or booking a call:
  1. Ask for their **Name**, **Email address**, and a brief overview of what they want to build or automate.
  2. If the user has already provided their email and requirements (e.g. *"My name is Alex, email alex@example.com, I need a customer support AI agent"*):
     - Warmly confirm that their spec has been submitted to Owais's inbox:
       "Thank you, Alex. I have transmitted your project brief directly to Owais Abdullah's inbox. He will review your specifications and email you at alex@example.com shortly."
     - Also mention they can directly connect on **[WhatsApp](https://wa.me/923262283140)** or email **[mrowaisabdullah@gmail.com](mailto:mrowaisabdullah@gmail.com)** if urgent.
     - Include this exact JSON marker at the very end of your response:
       <!--LEAD:{"name":"<User Name>","email":"<User Email>","subject":"Project Inquiry from Chat","message":"<Full user requirements>"}:LEAD-->

---

### **About Owais Abdullah's Expertise**

* **AI & Agents:** Claude Code, OpenAI Agents SDK, Claude Agent SDK, MCP (Model Context Protocol), Gemini AI, OpenRouter, DeepSeek, Paperclip, OpenClaw, Hermes
* **Frontend:** Next.js (App Router), Astro (for ultra-fast, content-driven websites), React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, GSAP
* **Backend & Databases:** Python (FastAPI), PostgreSQL, Neon Postgres, pgvector, SQLite, Prisma ORM, Sanity CMS
* **Cloud & Infrastructure:** Vercel, Cloudflare R2, AWS S3, Docker, Dokploy, Coolify, Inngest
* **Tools & Automation:** Playwright, Obsidian, Brevo, Resend, Git, GitHub
* **Authentication & Validation:** Better Auth, Clerk, Zod
* **Additional Services:** Full-stack web/app development, API integrations, performance optimization, AI agent orchestration

---

### **Projects Owais Has Built**

* **SaaS Products:** Octively (AI chatbot SaaS), RentParlo (rental management), TeamFlow (team collaboration)
* **AI Tools & Agents:** Digital FTEs (autonomous AI employees), AI Social Post Agent, SEO Blog Agent, YT-to-Social Post Converter, AI Content Generator, AI-powered chatbots
* **E-commerce & Marketplaces:** FurnitureMart.pk, Home Improvement Ecommerce, Renting Platforms
* **Admin Dashboards:** Custom dashboards for data analytics and management
* **Portfolios & Blogs:** Personal portfolio, resume builder, SEO blog agent
* **Education & Institutions:** Quran academies, LMS platforms, education websites
* **Local Businesses:** Coffee cafes, landscape & gardening, food restaurants

---

### **Formatting Rules for All Replies**

* Use **bold** for emphasis.
* Use *italics* for subtle highlights.
* Use \`code\` for technical terms or snippets.
* Keep responses **short, clear, and fully informative**—avoid lengthy explanations.

---
    `;

    // Adjust message formatting to ensure proper role alternation
    let adjustedMessages = [];
    if (messages.length > 0 && messages[0].role === "assistant") {
      // Combine system instruction with the initial assistant message
      const initialAssistantContent =
        systemInstruction + "\n\n" + messages[0].content;
      adjustedMessages = [
        { role: "model", parts: [{ text: initialAssistantContent }] },
        ...messages.slice(1).map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      ];
    } else {
      adjustedMessages = [
        { role: "model", parts: [{ text: systemInstruction }] },
        ...messages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      ];
    }

    // Call the Gemini API
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: adjustedMessages,
    });

    const rawResponseText =
      response.text || "*I'm sorry, I didn't understand that.*";

    let responseText = rawResponseText;

    // Check for lead transmission marker
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
            "chatbot";

          // Forward to verified contact pipeline via Resend
          await getResend().emails.send({
            from: FROM_ADDRESS,
            to: TO_ADDRESS,
            replyTo: lead.email,
            subject: `[Chatbot Lead] ${lead.subject || "Project Spec Inquiry"}`,
            html: contactEmailHtml({
              name: lead.name,
              email: lead.email,
              subject: lead.subject || "AI Chatbot Spec Intake",
              message: lead.message || "Lead submitted via chatbot conversation.",
              ip,
              receivedAt,
            }),
            text: contactEmailText({
              name: lead.name,
              email: lead.email,
              subject: lead.subject || "AI Chatbot Spec Intake",
              message: lead.message || "Lead submitted via chatbot conversation.",
              ip,
              receivedAt,
            }),
          });
        }
      } catch (err) {
        console.error("[chat] Failed to parse and forward lead:", err);
      }

      // Strip internal marker from client response
      responseText = rawResponseText.replace(/<!--LEAD:[\s\S]*?:LEAD-->/g, "").trim();
    }

    return new Response(JSON.stringify({ response: responseText }), {
      status: 200,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Error generating response" }),
      {
        status: 500,
      }
    );
  }
}
