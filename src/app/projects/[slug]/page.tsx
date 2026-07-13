"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Project } from "@/interfaces/Project";
import ProjectSlugLoading from "./loading";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Code,
  ExternalLink,
  FileText,
  GitBranch,
  Github,
  Globe,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [hasActiveCaseStudy, setHasActiveCaseStudy] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canSwipePrev, setCanSwipePrev] = useState(false);
  const [canSwipeNext, setCanSwipeNext] = useState(false);

  const fetchCaseStudyStatus = async (projectSlug: string) => {
    try {
      const response = await fetch(`/api/blogs/case-study/${projectSlug}`);
      setHasActiveCaseStudy(response.ok);
    } catch (error) {
      console.error("Error checking case study status:", error);
      setHasActiveCaseStudy(false);
    }
  };

  const fetchFeaturedProjects = async (excludeSlug: string) => {
    try {
      const response = await fetch(`/api/projects/featured?limit=3&exclude=${excludeSlug}`);
      const data = await response.json();

      if (response.ok) {
        setFeaturedProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching featured projects:", error);
    } finally {
      setLoadingFeatured(false);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const resolvedParams = await params;
        const resolvedSlug = resolvedParams.slug;
        
        const response = await fetch(`/api/projects/slug/${resolvedSlug}`);
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error(data.message || "Failed to fetch project");
        }

        const resolvedProject = data.data as Project;
        setProject(resolvedProject);

        if (resolvedProject.hasCaseStudy) {
          await fetchCaseStudyStatus(resolvedSlug);
        } else {
          setHasActiveCaseStudy(false);
        }

        setLoading(false);
        
        // Fetch featured projects after main project is loaded
        fetchFeaturedProjects(resolvedSlug);
      } catch (error) {
        console.error("Error fetching project:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
        setLoading(false);
        setLoadingFeatured(false);
      }
    };

    fetchProject();
  }, [params]);

  useEffect(() => {
    if (!carouselApi) return;

    const updateCarouselShadowState = () => {
      setCanSwipePrev(carouselApi.canScrollPrev());
      setCanSwipeNext(carouselApi.canScrollNext());
    };

    updateCarouselShadowState();
    carouselApi.on("select", updateCarouselShadowState);
    carouselApi.on("reInit", updateCarouselShadowState);

    return () => {
      carouselApi.off("select", updateCarouselShadowState);
      carouselApi.off("reInit", updateCarouselShadowState);
    };
  }, [carouselApi]);

  // Show loading state
  if (loading) {
    return (
      <ProjectSlugLoading />
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[rgb(15,15,15)] dark:via-[rgb(20,20,20)] dark:to-[rgb(27,27,27)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Project
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Show not found if project doesn't exist
  if (!project) {
    notFound();
  }

  // Prepare images for carousel (use thumbnail if no images)
  const carouselImages =
    project.images && project.images.length > 0
      ? project.images
      : [project.thumbnail];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="min-h-fit bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[rgb(15,15,15)] dark:via-[rgb(20,20,20)] dark:to-[rgb(27,27,27)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </motion.div>

          {/* Project Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="secondary" className="mb-4 text-sm">
                {project.category.join(" • ")}
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
            >
              {project.title}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed"
            >
              {project.brief}
            </motion.p>

            {/* Project Links */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              {project.live && (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Link
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Live Demo
                  </Link>
                </Button>
              )}
              
              {project.repository && (
                <Button asChild size="lg" variant="outline">
                  <Link
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    View Code
                  </Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Project Carousel */}
          <motion.div variants={itemVariants} className="max-w-5xl mx-auto">
            <Card className="py-5 px-2 md:px-4 overflow-hidden shadow-2xl border-0">
              <div className="relative">
                <Carousel className="w-full" opts={{ loop: true }} setApi={setCarouselApi}>
                  <CarouselContent>
                    {carouselImages.map((image: string, index: number) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[16/10] w-full max-w-4xl mx-auto relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900"> 
                          <Image
                            src={image}
                            alt={`${project.title} - Image ${index + 1}`}
                            className="w-full h-full object-contain"
                            fill
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center hidden">
                            <div className="text-center">
                              <Code className="w-16 h-16 text-white mx-auto mb-4" />
                              <span className="text-white text-xl font-semibold">
                                Project Screenshot
                              </span>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  {/* Navigation buttons inside the carousel */}
                  {carouselImages.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2 md:left-4 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-200 hover:scale-105" />
                      <CarouselNext className="right-2 md:right-4 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-200 hover:scale-105" />
                    </>
                  )}
                </Carousel>
              </div>
            </Card>
          </motion.div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-8"
            >
              {/* Project Overview */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg text-justify">
                      {project.overview}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Technologies Used */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                      <GitBranch className="w-6 h-6 text-white" />
                    </div>
                    Technologies & Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {project.stack &&
                      Array.isArray(project.stack) &&
                      (project.stack || []).map(
                        (tech: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                            <Badge
                              variant="secondary"
                              className="text-sm px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 border-0"
                            >
                          {tech}
                        </Badge>
                      </motion.div>
                        )
                      )}
                  </div>
                </CardContent>
              </Card>

              {/* Key Features */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.features && project.features.length > 0 ? (
                      project.features.map((feature, index) => {
                        const colors = [
                          "from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20",
                          "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
                          "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
                          "from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20",
                          "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
                          "from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20",
                        ];
                        const dotColors = [
                          "bg-purple-600",
                          "bg-green-600",
                          "bg-orange-600",
                          "bg-cyan-600",
                          "bg-pink-600",
                          "bg-indigo-600",
                        ];
                        const colorClass = colors[index % colors.length];
                        const dotColor = dotColors[index % dotColors.length];

                        return (
                    <motion.div
                            key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index + 1) * 0.1 }}
                            className={`flex items-start gap-3 p-4 bg-gradient-to-r ${colorClass} rounded-lg`}
                          >
                            <div
                              className={`w-2 h-2 ${dotColor} rounded-full mt-2 flex-shrink-0`}
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                    </motion.div>
                        );
                      })
                    ) : (
                      <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-8">
                        No features listed for this project
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Project Info */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status */}
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      project.status === "Completed"
                        ? "bg-green-50 dark:bg-green-900/20"
                        : project.status === "InProgress"
                        ? "bg-yellow-50 dark:bg-yellow-900/20"
                        : "bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        project.status === "Completed"
                          ? "bg-green-500"
                          : project.status === "InProgress"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        project.status === "Completed"
                          ? "text-green-700 dark:text-green-300"
                          : project.status === "InProgress"
                          ? "text-yellow-700 dark:text-yellow-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {project.status === "InProgress"
                        ? "In Progress"
                        : project.status}
                    </span>
                  </div>

                  {/* Category */}
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Code className="w-4 h-4" />
                    <span className="text-sm">
                      {project.category.join(", ")}
                    </span>
                  </div>

                  {/* Associated With */}
                  {(project.education ||
                    project.company ||
                    project.certification ||
                    project.client) && (
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {project.education?.institution ||
                          project.company?.name ||
                          project.certification?.title ||
                          project.client?.name}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {hasActiveCaseStudy && (
                      <Button asChild className="w-full" variant="secondary">
                        <Link href={`/projects/${project.slug}/case_study`}>
                          <FileText className="w-4 h-4 mr-2" />
                          Read Case Study
                        </Link>
                      </Button>
                    )}

                  {project.live && (
                    <Button asChild className="w-full" variant="default">
                      <Link
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </Link>
                    </Button>
                  )}
                  
                  {project.repository && (
                    <Button asChild className="w-full" variant="outline">
                      <Link
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        View Code
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Featured Projects */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>More Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loadingFeatured ? (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                        <p className="text-sm">Loading featured projects...</p>
                      </div>
                    ) : featuredProjects.length > 0 ? (
                      featuredProjects.map((featuredProject) => (
                        <Link
                          key={featuredProject.slug}
                          href={`/projects/${featuredProject.slug}`}
                          className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {featuredProject.thumbnail ? (
                                 <Image
                                  src={featuredProject.thumbnail}
                                  alt={featuredProject.title}
                                  className="w-full h-full object-contain rounded-lg bg-gray-100 dark:bg-gray-900"
                                  width={160}
                                  height={100}
                                  unoptimized
                                />
                              ) : (
                              <Code className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                {featuredProject.title}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {featuredProject.brief}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {featuredProject.status === "InProgress" ? "In Progress" : featuredProject.status}
                                </Badge>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {featuredProject.category.join(", ")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                        <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No featured projects available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
