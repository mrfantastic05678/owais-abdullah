/**
 * Unified Agent Tools Definition for Owais Abdullah Portfolio.
 * Shared across Text Chatbot (Google GenAI / Gemini Router) and Live Voice Agent (Gemini Live Bidi WSS).
 */

export interface AgentFunctionCall {
  name: string;
  args: Record<string, unknown>;
}

// Gemini Function Declarations (Used in @google/genai SDK and Live Voice WSS)
export const AGENT_FUNCTION_DECLARATIONS = [
  {
    name: "navigate",
    description:
      "Navigate the visitor's screen to any page or section across Owais Abdullah's portfolio without reloading the browser. Works seamlessly from every page. Valid page targets: '/' (Home), '/about', '/projects', '/services', '/services/digital-fte', '/stack', '/journey', '/blog', '/stores', '/contact', '/search'. Valid home section targets: 'hero', 'about', 'services', 'projects' (or 'work'), 'experience', 'faq', 'contact'.",
    parameters: {
      type: "OBJECT",
      properties: {
        target: {
          type: "STRING",
          description:
            "The destination URL path (e.g. '/blog', '/projects', '/services/digital-fte', '/stack') or section ID ('services', 'projects', 'contact', 'about', 'hero').",
        },
      },
      required: ["target"],
    },
  },
  {
    name: "navigate_to_section",
    description:
      "Alias for navigate. Smoothly navigates the portfolio page to a section (e.g. 'work', 'services', 'contact', 'hero', 'about', 'faq') or full page route.",
    parameters: {
      type: "OBJECT",
      properties: {
        section: {
          type: "STRING",
          description: "The section identifier or path (e.g. 'work', 'services', 'contact', 'blog', 'projects')",
        },
      },
      required: ["section"],
    },
  },
  {
    name: "open_lead_drawer",
    description:
      "Open the interactive project spec intake / quote drawer directly on the visitor's screen in the portfolio chat interface.",
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
  {
    name: "submit_lead",
    description:
      "Directly dispatch a qualified project inquiry to Owais Abdullah's inbox when the visitor provides contact details (name and email/phone/WhatsApp) along with their project requirements.",
    parameters: {
      type: "OBJECT",
      properties: {
        name: {
          type: "STRING",
          description: "The visitor's full name",
        },
        email: {
          type: "STRING",
          description: "The visitor's email address or phone/WhatsApp number",
        },
        message: {
          type: "STRING",
          description: "The visitor's project brief, goals, or requirements",
        },
        serviceType: {
          type: "STRING",
          description: "Optional service category (e.g., AI Agents, Digital FTEs, Next.js SaaS, Full Stack)",
        },
      },
      required: ["name", "email", "message"],
    },
  },
];

// OpenAI-compatible Tools Schema (Used for Gemini Free Router / OpenAI proxy)
export const OPENAI_COMPATIBLE_TOOLS = AGENT_FUNCTION_DECLARATIONS.map((f) => ({
  type: "function" as const,
  function: {
    name: f.name,
    description: f.description,
    parameters: {
      type: "object",
      properties: Object.fromEntries(
        Object.entries(f.parameters.properties).map(([k, v]) => [
          k,
          {
            type: (v as { type: string }).type.toLowerCase(),
            description: (v as { description?: string }).description || "",
          },
        ])
      ),
      required: "required" in f.parameters ? f.parameters.required : [],
    },
  },
}));
