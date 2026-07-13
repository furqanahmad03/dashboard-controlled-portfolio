"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Export skeleton components for use in other files
export function CertificationsStatsSkeleton() {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="bg-white dark:bg-white/5 rounded-xl p-6 text-center shadow-lg"
        variants={itemVariants}
      >
        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
          <Skeleton className="h-8 w-12 mx-auto" />
        </div>
        <div className="text-gray-600 dark:text-gray-300">Total Certifications</div>
      </motion.div>
      <motion.div 
        className="bg-white dark:bg-white/5 rounded-xl p-6 text-center shadow-lg"
        variants={itemVariants}
      >
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          <Skeleton className="h-8 w-12 mx-auto" />
        </div>
        <div className="text-gray-600 dark:text-gray-300">Verified Credentials</div>
      </motion.div>
      <motion.div 
        className="bg-white dark:bg-white/5 rounded-xl p-6 text-center shadow-lg"
        variants={itemVariants}
      >
        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
          <Skeleton className="h-8 w-12 mx-auto" />
        </div>
        <div className="text-gray-600 dark:text-gray-300">Different Issuers</div>
      </motion.div>
    </motion.div>
  );
}

export function CertificationsGridSkeleton() {
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="group relative hover:scale-[1.01] transition-all duration-300"
          variants={cardVariants}
        >
          {/* Main Card */}
          <div className="relative bg-white dark:bg-white/5 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700">
            
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0 md:w-16 md:h-16 h-12 w-12 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-700">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-6 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Action Button */}
            <Button 
              variant="outline"
              className="w-full"
              disabled
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Certificate
            </Button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function CertificationsLoading() {
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
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <Award className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            Certifications
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            Professional certifications and achievements that validate my expertise and continuous learning journey.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <CertificationsStatsSkeleton />

        {/* Certifications Grid */}
        <CertificationsGridSkeleton />

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
        >
          <motion.div 
            className="bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 text-gray-900 dark:text-white shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Work Together?</h3>
            <p className="text-gray-600 dark:text-purple-100 mb-6 max-w-2xl mx-auto">
              These certifications demonstrate my commitment to continuous learning and professional development. 
              Let&apos;s discuss how my expertise can benefit your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                asChild
              >
                <Link href="/contact">
                  Get In Touch
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-purple-600"
                asChild
              >
                <Link href="/projects">
                  View My Projects
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
