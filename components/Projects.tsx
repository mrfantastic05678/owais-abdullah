"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { motion } from "framer-motion";
import projects from "@/data/projects";

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
  // Flatten all projects into a single array
  const allProjects = Object.values(projects).flat();

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
          {allProjects.map((project, index) => (
            <motion.div
              key={index}
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
                />
              </motion.div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {project.title}
                </h2>

                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                <p className="text-muted-foreground mb-3">
                  {project.description}
                </p>
                <div className="flex items-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href={project.link}
                      className="text-accent inline-flex items-center group-hover:text-accent/80"
                    >
                      Learn More
                      <span className="ml-3">
                        <FaRegArrowAltCircleRight />
                      </span>
                    </Link>
                  </motion.div>
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
