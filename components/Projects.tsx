import Image from "next/image";
import React from "react";
import Link from "next/link";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import projects from "@/data/projects";

const Projects = () => {
  // Flatten all projects into a single array
  const allProjects = Object.values(projects).flat();

  return (
    <section id="project" className="max-w-7xl mx-auto scroll-smooth">
      <div className="mt-20 text-center">
        <h3 className="text-base text-accent font-medium sm:text-lg">
          See My Previous Work
        </h3>
        <h2 className="text-5xl text-foreground font-semibold sm:text-6xl">
          Projects
        </h2>
      </div>
      <div className="px-5 py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProjects.map((project, index) => (
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

                <p className="text-muted-foreground mb-3">
                  {project.description}
                </p>
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
      </div>
    </section>
  );
};

export default Projects;
