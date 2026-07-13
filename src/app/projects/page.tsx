"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Project } from "@/interfaces/Project";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ProjectsGridSkeleton } from "./loading";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Web' | 'Desktop App' | 'AI'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const projectsPerPage = 6;

  // Cache for projects using useMemo
  const projectsCache = useMemo(() => {
    const cache = new Map<string, Project[]>();
    return cache;
  }, []);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'Web', label: 'Web Apps' },
    { id: 'Desktop App', label: 'Desktop Apps' },
    { id: 'AI', label: 'AI/ML' }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      const cacheKey = 'all-projects';
      
      // Check cache first
      if (projectsCache.has(cacheKey)) {
        setProjects(projectsCache.get(cacheKey)!);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        const data = await response.json();
        
        if (data.success) {
          setProjects(data.data);
          // Cache the result
          projectsCache.set(cacheKey, data.data);
        } else {
          console.error('Error fetching projects:', data.error);
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [projectsCache]);

  // Filter projects by category with useMemo caching
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') {
      return projects;
    }
    
    return projects.filter(project => 
      project.category.some(cat => 
        cat.toLowerCase() === selectedCategory.toLowerCase() || 
        (selectedCategory === 'Desktop App' && cat.toLowerCase() === 'desktop') ||
        (selectedCategory === 'AI' && cat.toLowerCase() === 'ai')
      )
    );
  }, [projects, selectedCategory]);

  // Reset to page 1 and paginated view when category changes
  useEffect(() => {
    setCurrentPage(1);
    setViewAll(false);
  }, [selectedCategory]);

  // Calculate pagination with useMemo caching
  const { totalPages, currentProjects } = useMemo(() => {
    if (viewAll) {
      return {
        totalPages: 1,
        currentProjects: filteredProjects || []
      };
    }
    
    const total = Math.ceil((filteredProjects?.length || 0) / projectsPerPage);
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const current = (filteredProjects || []).slice(startIndex, endIndex);
    
    return {
      totalPages: total,
      currentProjects: current
    };
  }, [filteredProjects, currentPage, projectsPerPage, viewAll]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[rgb(15,15,15)] dark:via-[rgb(20,20,20)] dark:to-[rgb(27,27,27)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Page Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 py-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            My Projects
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            Explore my latest work and creative solutions across web development, mobile apps, and AI/ML projects.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id as 'all' | 'Web' | 'Desktop App' | 'AI');
                setCurrentPage(1);
              }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/20'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* All Projects Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        >
          <motion.h2 
            id="projects-heading"
            className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
          >
            {selectedCategory === 'all' ? 'All Projects' : `${categories.find(c => c.id === selectedCategory)?.label}`}
          </motion.h2>
          {loading ? (
            <ProjectsGridSkeleton />
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {currentProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </motion.div>
          )}

            {/* Pagination and View All Controls */}
            {!loading && filteredProjects.length > 0 && (
              <motion.div 
                className="flex flex-col items-center gap-6 mt-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.4 }}
              >
                {/* View All Toggle */}
                <div className="flex gap-4">
                  {!viewAll ? (
                    <Button
                      onClick={() => {
                        setViewAll(true);
                      }}
                      variant="outline"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 hover:from-purple-700 hover:to-blue-700"
                    >
                      View All Projects
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setViewAll(false);
                        setCurrentPage(1);
                        document.getElementById('projects-heading')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      variant="outline"
                      className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Back to Pagination
                    </Button>
                  )}
                </div>

                {/* Pagination - only show when not in view all mode and there are multiple pages */}
                {!viewAll && totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => {
                            setCurrentPage(prev => Math.max(prev - 1, 1));
                            document.getElementById('projects-heading')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => {
                              setCurrentPage(page);
                              document.getElementById('projects-heading')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => {
                            setCurrentPage(prev => Math.min(prev + 1, totalPages));
                            document.getElementById('projects-heading')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </motion.div>
            )}
          </motion.div>

        {/* No Projects Message */}
        {!loading && filteredProjects.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              No projects match the selected category.
            </p>
            <Button
              onClick={() => setSelectedCategory('all')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              View All Projects
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 