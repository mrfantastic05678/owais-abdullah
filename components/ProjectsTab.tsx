"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
  repoUrl?: string;
  category: string;
  tags: string[];
  techStack?: string[];
}

interface ProjectsByCategory {
  [category: string]: Project[];
}

const ProjectTabs = () => {
  const [projectsByCategory, setProjectsByCategory] = useState<ProjectsByCategory>({});
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setProjectsByCategory(data.projectsByCategory || {});

        const categories = Object.keys(data.projectsByCategory || {});
        if (categories.length > 0 && !selectedTab) {
          setSelectedTab(categories[0]);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [selectedTab]);

  if (loading) {
    return (
      <section id="projects" className="max-w-7xl mx-auto mt-20 px-5">
        <div className="text-center">
          <h3 className="text-base text-accent font-medium sm:text-lg">
            See My Work
          </h3>
          <h2 className="text-5xl text-foreground font-semibold sm:text-6xl">
            Projects
          </h2>
        </div>
        <div className="flex justify-center mt-10">
          <div className="animate-pulse text-muted-foreground">Loading projects...</div>
        </div>
      </section>
    );
  }

  const categories = Object.keys(projectsByCategory);

  return (
    <section id="projects" className="max-w-7xl mx-auto mt-20 px-5">
      <div className="text-center">
        <h3 className="text-base text-accent font-medium sm:text-lg">
          See My Work
        </h3>
        <h2 className="text-5xl text-foreground font-semibold sm:text-6xl">
          Projects
        </h2>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={categories[0]} className="w-full mt-10">
        <TabsList className="flex flex-wrap justify-center gap-3 p-2 bg-transparent">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setSelectedTab(category)}
              className="px-4 py-2 rounded-lg bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsByCategory[category]?.map((project, index) => (
                <div
                  key={index}
                  className="entrance scroll-smooth border border-border rounded-lg overflow-hidden hover:scale-105 transition duration-300 shadow-lg bg-card"
                >
                  <Image
                    className="lg:h-48 md:h-36 w-full object-cover"
                    src={project.image}
                    alt={project.title}
                    width={500}
                    height={300}
                  />
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      {project.title}
                    </h2>

                    {/* Tags with theme-aware colors */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex items-center gap-4">
                      <Link
                        href={project.link}
                        className="text-accent inline-flex items-center hover:text-accent/80"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project
                        <span className="ml-2">
                          <FaRegArrowAltCircleRight />
                        </span>
                      </Link>
                      {project.repoUrl && project.repoUrl !== "#" && (
                        <Link
                          href={project.repoUrl}
                          className="text-muted-foreground hover:text-foreground text-sm inline-flex items-center"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default ProjectTabs;
