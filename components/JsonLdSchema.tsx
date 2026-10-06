import React from 'react';
import { services } from '@/data/services';

interface JsonLdSchemaProps {
  type: 'home' | 'about' | 'projects' | 'skills' | 'contact' | 'services' | 'service' | 'blog';
  pageUrl: string;
  faqs?: { question: string; answer: string }[];
}

const JsonLdSchema: React.FC<JsonLdSchemaProps> = ({ type, pageUrl, faqs }) => {
  const baseUrl = 'https://owaisabdullah.dev';
  
  // Person Schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    "name": "Owais Abdullah",
    "alternateName": ["Muhammad Owais", "Owais"],
    "jobTitle": ["AI Agents Developer", "Full Stack Developer", "Next.js Developer", "React Developer", "Web Developer"],
    "description": "AI Agents Developer, Full Stack Developer, and Next.js specialist. Expert in React, AI integration, and modern web development.",
    "url": baseUrl,
    "image": `${baseUrl}/assets/owais-abdullah.webp`,
    "sameAs": [
      "https://twitter.com/mrowaisabdullah",
      "https://linkedin.com/in/mrowaisabdullah",
      "https://github.com/MrOwaisAbdullah",
      "https://facebook.com/mrowaisabdullah",
      "https://www.threads.com/@mrowaisabdullah",
      "https://www.instagram.com/mrowaisabdullah/",
      "https://bsky.app/profile/mrowaisabdullah.bsky.social",
      "https://www.reddit.com/user/MrOwaisabdullah/",
      "https://www.quora.com/profile/Mr-Owais-Abdullah"
    ],
    "knowsAbout": [
      "AI Agents Development",
      "Full Stack Development",
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Web Development",
      "AI Integration",
      "Machine Learning",
      "Frontend Development",
      "Backend Development",
      "Wordpress Development",
      "Search Engine Optimization",
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance Developer",
      "url": baseUrl
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Pakistan"
    }
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "Owais Abdullah Portfolio",
    "url": baseUrl,
    "logo": `${baseUrl}/assets/owais_logo.png`,
    "description": "Professional portfolio of Owais Abdullah - AI Agents Developer and Full Stack Developer",
    "founder": {
      "@type": "Person",
      "name": "Owais Abdullah"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "name": "Owais Abdullah Portfolio",
    "url": baseUrl,
    "description": "Professional portfolio showcasing AI Agents Development, Full Stack Development, and Next.js expertise",
    "publisher": {
      "@type": "Person",
      "@id": `${baseUrl}/#person`,
      "name": "Owais Abdullah"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    "url": pageUrl,
    "name": getPageTitle(type),
    "description": getPageDescription(type),
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    },
    "about": {
      "@id": `${baseUrl}/#person`
    },
    "author": {
      "@id": `${baseUrl}/#person`
    },
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "mainEntity": {
      "@id": `${baseUrl}/#person`
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": getBreadcrumbItems(type, baseUrl)
    }
  };

  // CreativeWork Schema for Projects (if on projects page)
  const creativeWorkSchema = type === 'projects' ? {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${pageUrl}#creativework`,
    "name": "Portfolio Projects",
    "description": "Collection of web development and AI integration projects by Owais Abdullah",
    "author": {
      "@id": `${baseUrl}/#person`
    },
    "creator": {
      "@id": `${baseUrl}/#person`
    },
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "genre": ["Web Development", "AI Integration", "Software Development"],
    "keywords": "AI Agents Development, Full Stack Development, Next.js, React, Web Development"
  } : null;

  // Service Schema for Contact page or individual Service page
  const serviceSlug = pageUrl ? pageUrl.split('/').filter(Boolean).pop() : undefined;
  const currentService = serviceSlug && services[serviceSlug] ? services[serviceSlug] : null;

  const serviceSchema = type === 'contact' ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    "name": "AI Agent & Web Development Services",
    "description": "Professional AI agent development, Digital FTE automation, and full-stack web engineering by Owais Abdullah",
    "provider": {
      "@id": `${baseUrl}/#person`
    },
    "serviceType": [
      "AI Agent Development",
      "Digital FTE Systems",
      "Full Stack Development",
      "Next.js SaaS Development"
    ],
    "areaServed": "Worldwide",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": pageUrl
    }
  } : type === 'service' && currentService ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    "name": currentService.title,
    "description": currentService.description,
    "provider": {
      "@id": `${baseUrl}/#person`
    },
    "serviceType": currentService.title,
    "areaServed": "Worldwide",
    "offers": {
      "@type": "Offer",
      "price": currentService.pricing?.[0]?.price ? currentService.pricing[0].price.replace(/[^0-9]/g, "") : "1500",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": pageUrl
    }
  } : null;

  // Services Catalog for /services hub
  const servicesCatalogSchema = type === 'services' ? {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${pageUrl}#catalog`,
    "name": "AI Agent & Software Development Services",
    "itemListElement": Object.values(services).map((srv, idx) => ({
      "@type": "Offer",
      "position": idx + 1,
      "name": srv.title,
      "description": srv.description,
      "url": `${baseUrl}/services/${srv.slug}`,
      "itemOffered": {
        "@type": "Service",
        "name": srv.title,
        "description": srv.description
      }
    }))
  } : null;

  // Blog Archive Schema
  const blogSchema = type === 'blog' ? {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${pageUrl}#blog`,
    "name": "Owais Abdullah Blog — Spec-Driven Development & AI Insights",
    "description": "Get the latest insights on spec-driven development, AI agents, SaaS architecture, and Next.js best practices.",
    "url": pageUrl,
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "author": {
      "@id": `${baseUrl}/#person`
    },
    "inLanguage": "en-US"
  } : null;

  // FAQPage Schema for service pages
  const faqSchema = (type === 'service' && faqs && faqs.length > 0) ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // SoftwareSourceCode Schema for projects page
  const softwareSchema = type === 'projects' ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#projects`,
    "name": "Portfolio Projects by Owais Abdullah",
    "description": "Web development, AI integration, and SaaS projects",
    "numberOfItems": 40,
    "itemListElement": [
      {
        "@type": "SoftwareSourceCode",
        "name": "Octively",
        "description": "AI chatbot SaaS for agencies",
        "codeRepository": "https://github.com/MrOwaisAbdullah",
        "programmingLanguage": ["TypeScript", "Python"],
        "runtimePlatform": "Next.js",
        "url": "https://octively.com"
      },
      {
        "@type": "SoftwareSourceCode",
        "name": "Digital FTE",
        "description": "Autonomous AI employees powered by Claude Code",
        "codeRepository": "https://github.com/MrOwaisAbdullah",
        "programmingLanguage": ["Python"],
        "url": "https://owaisabdullah.dev/projects"
      },
      {
        "@type": "SoftwareSourceCode",
        "name": "TeamFlow",
        "description": "AI-powered team management platform for agencies",
        "programmingLanguage": ["TypeScript"],
        "runtimePlatform": "Next.js",
        "url": "https://teamflow-sigma-opal.vercel.app/"
      }
    ]
  } : null;

  const schemas = [
    personSchema,
    organizationSchema,
    websiteSchema,
    webPageSchema,
    ...(creativeWorkSchema ? [creativeWorkSchema] : []),
    ...(serviceSchema ? [serviceSchema] : []),
    ...(servicesCatalogSchema ? [servicesCatalogSchema] : []),
    ...(blogSchema ? [blogSchema] : []),
    ...(faqSchema ? [faqSchema] : []),
    ...(softwareSchema ? [softwareSchema] : [])
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

// Helper functions
function getPageTitle(type: string): string {
  const titles = {
    home: "Owais Abdullah | AI Agents Developer & Full Stack Developer",
    about: "About Owais Abdullah | AI Agents Developer & Full Stack Developer",
    projects: "Projects | Owais Abdullah - AI Agents Developer & Full Stack Developer",
    skills: "Skills | Owais Abdullah - AI Agents Developer & Full Stack Developer",
    contact: "Contact | Owais Abdullah - AI Agents Developer & Full Stack Developer",
    services: "Services | Owais Abdullah - Spec-Driven Developer & AI Engineer",
    service: "Service | Owais Abdullah - Spec-Driven Developer & AI Engineer",
    blog: "Blog | Owais Abdullah - Spec-Driven Development & AI Insights"
  };
  return titles[type as keyof typeof titles] || titles.home;
}

function getPageDescription(type: string): string {
  const descriptions = {
    home: "Welcome to Owais Abdullah's portfolio. AI Agents Developer, Full Stack Developer, and Next.js specialist. Explore my projects, skills, and experience in modern web development and AI integration.",
    about: "Learn more about Owais Abdullah - AI Agents Developer, Full Stack Developer, and Next.js specialist. Discover my background, expertise, and passion for AI integration and modern web development.",
    projects: "Explore Owais Abdullah's portfolio of projects. AI Agents Developer, Full Stack Developer, and Next.js specialist showcasing innovative web applications, AI integrations, and modern development solutions.",
    skills: "Discover Owais Abdullah's technical skills and expertise. AI Agents Developer, Full Stack Developer, and Next.js specialist proficient in React, TypeScript, AI integration, and modern web technologies.",
    contact: "Get in touch with Owais Abdullah - AI Agents Developer, Full Stack Developer, and Next.js specialist. Available for freelance projects, collaborations, and professional opportunities in web development and AI integration.",
    services: "Explore services offered by Owais Abdullah: Digital FTE Development, AI Agents & Automations, Next.js SaaS Development, CMS & E-commerce, Technical Consulting, and API Development.",
    service: "Professional services by Owais Abdullah - Spec-Driven Developer & AI Engineer specializing in AI Agents, Next.js, and modern web development.",
    blog: "Get the latest insights on spec-driven development, AI agents, SaaS architecture, and Next.js best practices."
  };
  return descriptions[type as keyof typeof descriptions] || descriptions.home;
}

function getBreadcrumbItems(type: string, baseUrl: string) {
  const breadcrumbs = {
    home: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl }
    ],
    about: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "About", "item": `${baseUrl}/about` }
    ],
    projects: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Projects", "item": `${baseUrl}/projects` }
    ],
    skills: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Skills", "item": `${baseUrl}/skills` }
    ],
    contact: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Contact", "item": `${baseUrl}/contact` }
    ],
    services: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": `${baseUrl}/services` }
    ],
    service: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": `${baseUrl}/services` }
    ],
    blog: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${baseUrl}/blog` }
    ]
  };
  return breadcrumbs[type as keyof typeof breadcrumbs] || breadcrumbs.home;
}

export default JsonLdSchema; 