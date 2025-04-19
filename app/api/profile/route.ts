import { NextResponse } from 'next/server';

export async function GET() {
  const profile = {
    name: "Owais Abdullah",
    email: "mrowaisabdullah@gmail.com",
    whatsapp: "+923262283140",
    location: "Karachi, Pakistan",
    title: "Full-Stack Developer | AI & Automation Specialist",

    summary: "I specialize in crafting intelligent web and app solutions, integrating modern technologies with AI-powered tools and automation workflows.",

    skills: {
      frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js", "Python", "WordPress", "Sanity CMS"],
      databases: ["PostgreSQL", "SQLite", "Redis"],
      auth_validation: ["Clerk", "Zod"],
      ai_automation: ["AI Agents", "Chatbots", "Workflow Automation"],
      tools: ["Git", "Docker", "Figma"]
    },

    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Karachi",
        year: "2020"
      }
    ],

    work_experience: [
      {
        role: "Freelance Full-Stack Developer",
        duration: "2020 - Present",
        responsibilities: [
          "Developed and maintained web applications using React and Next.js.",
          "Integrated AI-powered features into client projects.",
          "Automated workflows to enhance operational efficiency."
        ]
      }
    ],

    projects: [
      {
        name: "FurnitureMart.pk",
        category: "E-commerce",
        description: "An online platform for furniture shopping with a user-friendly interface and secure payment integration."
      },
      {
        name: "AI Content Generator",
        category: "AI Tool",
        description: "A tool that generates high-quality content using advanced AI algorithms."
      },
      {
        name: "Resume Builder",
        category: "Web Application",
        description: "An application that assists users in creating professional resumes with customizable templates."
      }
      // Add more projects as needed
    ],

    achievements: [
      "Developed over 50 web applications for clients worldwide.",
      "Automated business processes leading to a 30% increase in client efficiency.",
      "Recognized for excellence in integrating AI solutions into traditional web platforms."
    ]
  };

  return NextResponse.json(profile);
}
