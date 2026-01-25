"use client";
import React from 'react'
import { Timeline } from './ui/Timeline';

const experienceData = [
  {
    title: "2025 - Present",
    content: (
      <div>
        <h3 className="text-xl font-bold text-foreground">Senior Developer</h3>
        <p className="text-sm text-accent">LionUp Digital</p>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mt-2">
          Working as a Senior Developer, managing projects remotely, overseeing web development tasks.
        </p>
      </div>
    ),
  },
  {
    title: "2024 - Present",
    content: (
      <div>
        <h3 className="text-xl font-bold text-foreground">Senior Developer & Manager</h3>
        <p className="text-sm text-accent">AA Marketing</p>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mt-2">
          Managing projects remotely, overseeing web development tasks, and ensuring smooth execution of digital strategies.
        </p>
      </div>
    ),
  },

  {
    title: "2023 - 2024",
    content: (
      <div>
        <h3 className="text-xl font-bold text-foreground">Web Developer & Digital Marketer</h3>
        <p className="text-sm text-accent">OneKlick Digital Co.</p>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mt-2">
          Developed and optimized websites using Next.js, TypeScript, and Tailwind CSS while managing SEO and social media marketing campaigns.
        </p>
      </div>
    ),
  },
  {
    title: "2023",
    content: (
      <div>
        <h3 className="text-xl font-bold text-foreground">Social Media Marketing Intern</h3>
        <p className="text-sm text-accent">Marksman Advertising</p>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mt-2">
          Worked on Facebook Ads Manager, executed ad campaigns, and improved brand visibility through strategic marketing.
        </p>
      </div>
    ),
  },
  {
    title: "2018 - 2020",
    content: (
      <div>
        <h3 className="text-xl font-bold text-foreground">Freelance Graphic Designer</h3>
        <p className="text-sm text-accent">Fiverr</p>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mt-2">
          Designed graphics for social media and branding, focusing on UI elements and digital content creation.
        </p>
      </div>
    ),
  },
];


const Experience = () => {
  return  (
    <div className="w-full">
      <Timeline data={experienceData} />
    </div>
  );
}

export default Experience
