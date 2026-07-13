"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ArrowLeft, Code, GitBranch, Star, Users } from "lucide-react";

export default function ProjectSlugLoading() {
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
              disabled
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
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
              <Skeleton className="h-6 w-32 mx-auto mb-4 rounded-full" />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Skeleton className="h-16 md:h-20 lg:h-24 w-96 mx-auto mb-6" />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Skeleton className="h-6 md:h-8 w-full max-w-4xl mx-auto" />
            </motion.div>

            {/* Project Links */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <Skeleton className="h-12 w-32 rounded-lg" />
              <Skeleton className="h-12 w-32 rounded-lg" />
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
              <div className="aspect-[16/10] max-w-4xl mx-auto relative overflow-hidden rounded-xl">
                <Skeleton className="w-full h-full" />
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
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
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
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Skeleton key={i} className="h-8 w-20 rounded-full" />
                    ))}
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
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
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
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <Skeleton className="h-4 w-20" />
                  </div>

                  {/* Category */}
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Code className="w-4 h-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>

                  {/* Associated With */}
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-10 w-full rounded" />
                  <Skeleton className="h-10 w-full rounded" />
                </CardContent>
              </Card>

              {/* Featured Projects */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>More Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-12 h-12 rounded-lg" />
                          <div className="min-w-0 flex-1">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-full mb-2" />
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-5 w-16 rounded-full" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
