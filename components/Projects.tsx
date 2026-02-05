"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

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

const ProjectCardSkeleton = () => (
  <div className="border border-border rounded-xl overflow-hidden shadow-lg bg-card">
    <Skeleton className="w-full h-48" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-4 pt-2">
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        // Flatten all projects into a single array
        const allProjects = Object.values(data.projectsByCategory || {}).flat() as Project[];
        setProjects(allProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="project" className="max-w-7xl mx-auto scroll-smooth">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-20 text-center"
        >
          <h3 className="text-base text-accent font-medium sm:text-lg">
            See My Previous Work
          </h3>
          <h2 className="text-5xl text-foreground font-semibold sm:text-6xl">
            Projects
          </h2>
        </motion.div>
        <div className="px-5 py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="project" className="max-w-7xl mx-auto scroll-smooth">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-20 text-center"
      >
        <h3 className="text-base text-accent font-medium sm:text-lg">
          See My Previous Work
        </h3>
        <h2 className="text-5xl text-foreground font-semibold sm:text-6xl">
          Projects
        </h2>
      </motion.div>
      <div className="px-5 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={`${project.category}-${index}`}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="scroll-smooth border border-border rounded-lg overflow-hidden shadow-lg bg-card"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="lg:h-48 md:h-36 w-full overflow-hidden"
              >
                <Image
                  className="w-full h-full object-cover"
                  src={project.image}
                  alt={project.title}
                  width={500}
                  height={300}
                  unoptimized
                />
              </motion.div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {project.title}
                </h2>

                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.slice(0, 3).map((tag, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                <p className="text-muted-foreground mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href={project.link}
                      className="text-accent inline-flex items-center hover:text-accent/80"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn More
                      <span className="ml-3">
                        <FaRegArrowAltCircleRight />
                      </span>
                    </Link>
                  </motion.div>
                  {project.repoUrl && project.repoUrl !== "#" && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
