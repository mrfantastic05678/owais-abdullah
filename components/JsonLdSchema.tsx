import React from 'react';

interface JsonLdSchemaProps {
  type: 'home' | 'about' | 'projects' | 'skills' | 'contact' | 'services' | 'service';
  pageUrl: string;
}

const JsonLdSchema: React.FC<JsonLdSchemaProps> = ({ type, pageUrl }) => {
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
    "image": `${baseUrl}/assets/owais-abdullah.png`,
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

  // Service Schema for Contact page
  const serviceSchema = type === 'contact' ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    "name": "Web Development Services",
    "description": "Professional web development and AI integration services by Owais Abdullah",
    "provider": {
      "@id": `${baseUrl}/#person`
    },
    "serviceType": [
      "AI Agents Development",
      "Full Stack Development",
      "Next.js Development",
      "React Development",
      "Web Application Development"
    ],
    "areaServed": "Worldwide",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": pageUrl
    }
  } : null;

  const schemas = [
    personSchema,
    organizationSchema,
    websiteSchema,
    webPageSchema,
    ...(creativeWorkSchema ? [creativeWorkSchema] : []),
    ...(serviceSchema ? [serviceSchema] : [])
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
    service: "Service | Owais Abdullah - Spec-Driven Developer & AI Engineer"
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
    service: "Professional services by Owais Abdullah - Spec-Driven Developer & AI Engineer specializing in AI Agents, Next.js, and modern web development."
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
    ]
  };
  return breadcrumbs[type as keyof typeof breadcrumbs] || breadcrumbs.home;
}

export default JsonLdSchema; 