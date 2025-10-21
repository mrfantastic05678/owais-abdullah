"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import projects  from "@/data/projects"; // Assuming your projects object is stored in /data/projects.ts

const ProjectTabs = () => {
  const categories = Object.keys(projects);
  const [selectedTab, setSelectedTab] = useState(categories[0]);
  console.log(selectedTab)

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
              {projects[category as keyof typeof projects].map((project, index) => (
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
                    <div className="flex items-center">
                      <Link
                        href={project.link}
                        className="text-accent inline-flex items-center group-hover:text-accent/80"
                      >
                        Learn More
                        <span className="ml-3">
                          <FaRegArrowAltCircleRight />
                        </span>
                      </Link>
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