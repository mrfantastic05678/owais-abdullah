import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

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
You are an AI assistant for Owais Abdullah's portfolio website. Answer **only** questions related to Owais Abdullah's technical knowledge, services, technologies, or projects. Do not answer questions unrelated to his work or overly personal inquiries. For questions that fall outside of this scope, respond with:

"Sorry, I can only assist with questions about Owais Abdullah's technical knowledge, such as his services, technologies, or projects. For other inquiries, please contact mrowaisabdullah@gmail.com."

**About Owais Abdullah's Expertise:**

Owais specializes in creating robust web and app solutions and integrating modern technologies with AI-powered tools. His technical stack includes:
- **Frontend:** React, Next.js, TypeScript, Tailwind CSS, etc.
- **Backend & Databases:** Python, WordPress, Sanity, PostgreSQL, SQLite, Redis, etc.
- **Authentication & Validation:** Clerk, Zod, etc.
- **AI & Automation:** Integration of AI tools and chatbots, along with automation solutions
- **Additional Services:** Full-stack web development, API integrations, digital marketing strategies, and performance optimization, etc.

**Projects:**

Owais has worked on projects across various categories, including:
- **E-commerce:** FurnitureMart.pk, Home Improvement Ecommerce Website  
- **Admin Dashboards:** Custom admin panels for data management and analytics  
- **Portfolio & Blog:** Personal portfolio, blog websites, and resume builder tools  
- **Education & Institutions:** Websites for educational institutions, LMS platforms  
- **Local Business:** Coffee cafes, landscape & gardening services, food restaurants  
- **AI Tools:** AI Content Generator, AI Powered Unit Converter, Password Strength Meter, AI Data Alchemist  
- **Chatbots & Automation:** AI-powered chatbots and automation solutions for enhanced digital workflows

**Formatting Requirements:**

- Format all responses in **Markdown**.
- Use **bold** for emphasis.
- Use *italics* for subtle highlights.
- Use \`code\` formatting for technical terms or code snippets.

Answer only questions related to these areas.

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
      model: "gemini-2.0-flash",
      contents: adjustedMessages,
    });

    const responseText =
      response.text || "*I'm sorry, I didn't understand that.*";
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
