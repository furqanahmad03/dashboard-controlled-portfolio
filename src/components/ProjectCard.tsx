"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/interfaces/Project";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      <Card className="py-0 group relative overflow-hidden bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full">
        {/* Thumbnail Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900">
          <Image
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            fill
            sizes="(min-width: 1280px) 384px, (min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          {/* Fallback for missing images */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center hidden">
            <div className="text-center">
              <ExternalLink className="w-12 h-12 text-white mx-auto mb-2" />
              <span className="text-white text-sm font-medium">
                Project Image
              </span>
            </div>
          </div>

          {/* Hover Overlay with View Project Button */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Link href={`/projects/${project.slug}`}>
                <Eye className="w-5 h-5 mr-2" />
                View Project
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          {/* Project Title and Category */}
          <div className="mb-4">
            <Link
              className="text-xl flex items-center gap-1 font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-3"
              href={`/projects/${project.slug}`}
            >
              {project.title}
              <ArrowRight className="w-4 h-4 rotate-[-45deg] block lg:hidden" />
            </Link>
            <div className="flex flex-wrap gap-1 mb-3">
              {project.category.slice(0, 3).map((cat, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs font-medium border border-gray-300 dark:border-gray-600"
                >
                  {cat}
                </Badge>
              ))}
              {project.category.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.category.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p
            className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 ${
              project.education ||
              project.company ||
              project.certification ||
              project.client
                ? "line-clamp-3"
                : "line-clamp-4 mb-8"
            }`}
          >
            {project.brief}
          </p>

          {/* Association */}
          {(project.education ||
            project.company ||
            project.certification ||
            project.client) && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Associated with:</span>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400">
                    {project.education?.institution ||
                      project.company?.name ||
                      project.certification?.title ||
                      project.client?.name}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Technologies */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.stack &&
                Array.isArray(project.stack) &&
                (project.stack || []).slice(0, 3).map((tech, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                  >
                    {tech}
                  </Badge>
                ))}
              {project.stack &&
                Array.isArray(project.stack) &&
                (project.stack || []).length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{(project.stack || []).length - 3} more
                  </Badge>
                )}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-2">
            {project.live && (
              <Button asChild size="sm" variant="default" className="flex-1">
                <Link
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Live
                </Link>
              </Button>
            )}

            {project.repository && (
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-1" />
                  Code
                </Link>
              </Button>
            )}

            {!project.live && !project.repository && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 cursor-default"
                disabled
              >
                <Eye className="w-4 h-4 mr-1" />
                This is private project
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
