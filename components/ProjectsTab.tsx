"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { RiRefreshLine } from "react-icons/ri";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
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

interface ProjectsByCategory {
  [category: string]: Project[];
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
        <Skeleton className="h-5 w-8" />
      </div>
    </div>
  </div>
);

const ProjectTabs = () => {
  const [projectsByCategory, setProjectsByCategory] = useState<ProjectsByCategory>({});
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({});
  const [loadingMore, setLoadingMore] = useState<Record<string, boolean>>({});
  const PROJECTS_PER_PAGE = 9;

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setProjectsByCategory(data.projectsByCategory || {});

        const categories = Object.keys(data.projectsByCategory || {});
        if (categories.length > 0 && !selectedTab) {
          setSelectedTab(categories[0]);
          // Initialize visible count for each category
          const initialCounts: Record<string, number> = {};
          const initialLoading: Record<string, boolean> = {};
          categories.forEach(cat => {
            initialCounts[cat] = Math.min(PROJECTS_PER_PAGE, (data.projectsByCategory[cat] || []).length);
            initialLoading[cat] = false;
          });
          setVisibleCount(initialCounts);
          setLoadingMore(initialLoading);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [selectedTab]);

  const handleLoadMore = async (category: string) => {
    setLoadingMore(prev => ({ ...prev, [category]: true }));

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    setVisibleCount(prev => ({
      ...prev,
      [category]: Math.min((prev[category] || 0) + PROJECTS_PER_PAGE, (projectsByCategory[category] || []).length)
    }));

    setLoadingMore(prev => ({ ...prev, [category]: false }));
  };

  if (loading) {
    return (
      <section id="projects" className="max-w-7xl mx-auto mt-20 px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-base text-accent font-medium sm:text-lg">
            See My Work
          </h3>
          <h2 className="text-5xl text-foreground font-semibold sm:text-6xl">
            Projects
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  const categories = Object.keys(projectsByCategory);

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

  return (
    <section id="projects" className="max-w-7xl mx-auto mt-20 px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="text-base text-accent font-medium sm:text-lg">
          See My Work
        </h3>
        <h2 className="text-5xl text-foreground font-semibold sm:text-6xl">
          Projects
        </h2>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue={categories[0]} className="w-full mt-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TabsList className="flex flex-wrap justify-center gap-3 p-2 bg-transparent">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setSelectedTab(category)}
                className="px-4 py-2 rounded-lg bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {category}
                <span className="ml-2 text-xs opacity-70">
                  ({projectsByCategory[category]?.length || 0})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>

        {/* Tab Content */}
        {categories.map((category) => {
          const projects = projectsByCategory[category] || [];
          const visibleProjects = projects.slice(0, visibleCount[category] || PROJECTS_PER_PAGE);
          const hasMore = projects.length > (visibleCount[category] || PROJECTS_PER_PAGE);
          const isLoading = loadingMore[category] || false;

          return (
            <TabsContent key={category} value={category} className="mt-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {visibleProjects.map((project, index) => (
                    <motion.div
                      key={`${category}-${index}`}
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="scroll-smooth border border-border rounded-xl overflow-hidden shadow-lg bg-card group"
                    >
                      <div className="relative overflow-hidden">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          className="lg:h-48 md:h-36 w-full"
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
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

                        <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                        <div className="flex items-center gap-4">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                </AnimatePresence>
              </motion.div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleLoadMore(category)}
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="inline-flex items-center gap-2 px-8 py-3 text-foreground bg-card hover:bg-accent hover:text-accent-foreground border-2 border-border hover:border-accent rounded-full font-medium transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <RiRefreshLine className="animate-spin text-lg" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Projects
                        <FaRegArrowAltCircleRight />
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
};

export default ProjectTabs;
