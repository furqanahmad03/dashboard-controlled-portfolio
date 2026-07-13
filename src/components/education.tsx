"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface EducationData {
  id: string;
  degree: string;
  institution: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  gpa: string | null;
  percentage: string | null;
  skills: string[];
  institutionLogo: string | null;
  createdAt: string;
  updatedAt: string;
}

export function Education() {
  const [educations, setEducations] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Optimized transform with better performance
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"], {
    clamp: true
  });

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/education');
        const data = await response.json();
        
        if (data.success) {
          setEducations(data.data);
        } else {
          console.error('Error fetching educations:', data.error);
          setEducations([]);
        }
      } catch (error) {
        console.error('Error fetching educations:', error);
        setEducations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEducations();
  }, []);

  return (
    <section className="md:py-20 py-10 rounded-md bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[rgb(15,15,15)] dark:via-[rgb(20,20,20)] dark:to-[rgb(27,27,27)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center md:mb-16 mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold md:mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <GraduationCap className="w-12 h-12 text-purple-600" />
            Education
          </motion.h2>
        </motion.div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative">
          {/* Timeline Line - Hidden on mobile */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-teal-500 to-cyan-500 origin-top"
              style={{ scaleY: lineHeight }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-8">
            {loading ? (
              // Loading skeleton
              [1, 2, 3].map((i) => (
                <div key={i} className="relative flex items-start">
                  <div className="hidden md:block absolute left-6 top-2 w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="md:ml-20 flex-1">
                    <Card className="bg-white py-2 dark:bg-white/5 border-gray-200 dark:border-gray-700">
                      {/* Closed accordion skeleton structure */}
                      <div className="px-6 py-4">
                        <div className="flex items-start gap-3 md:gap-4 w-full">
                          {/* Institution Logo Skeleton */}
                          <Skeleton className="w-10 h-10 md:w-12 md:h-12 mt-2 rounded-sm" />
                          
                          {/* Content Skeleton */}
                          <div className="min-w-0 flex-1 text-left">
                            {/* Degree title */}
                            <Skeleton className="h-6 md:h-7 w-3/4 mb-1" />
                            {/* Institution name */}
                            <Skeleton className="h-5 md:h-6 w-1/2 mb-2" />
                            {/* Metadata section */}
                            <div className="flex flex-col items-start gap-1 mt-2">
                              <Skeleton className="h-3 md:h-4 w-32" />
                              <Skeleton className="h-3 md:h-4 w-24" />
                              <Skeleton className="h-3 md:h-4 w-20" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))
            ) : (
              educations.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  className="relative flex items-start"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.2 }}
                >
                  {/* Timeline Circle - Hidden on mobile */}
                  <div className="hidden md:block absolute left-6 top-2 w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-2 border-teal-500 flex items-center justify-center z-10 shadow-lg">
                    {/* Main circle fill */}
                    <div className="w-2 h-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-teal-500/30 blur-sm" />
                  </div>

                  {/* Content */}
                  <div className="md:ml-20 flex-1">
                    <Card className="bg-white py-2 dark:bg-white/5 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                      <Accordion type="single" collapsible>
                        <AccordionItem value={`edu-${index}`} className="border-none">
                          <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <div className="flex items-start gap-3 md:gap-4 w-full">
                              {/* Institution Logo */}
                              <div className="w-10 h-10 md:w-12 md:h-12 mt-2 bg-white rounded-sm flex items-center justify-center border border-gray-200 flex-shrink-0">
                                {edu.institutionLogo ? (
                                  <Image width={48} height={48} src={edu.institutionLogo} alt={edu.institution} className="w-full p-1 h-full object-contain" />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                    {edu.institution.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1 text-left">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                                  {edu.degree}
                                </h3>
                                <p className="text-base md:text-lg text-purple-600 dark:text-purple-400 font-semibold mt-1">
                                  {edu.institution}
                                </p>
                                <div className="flex flex-col items-start gap-1 text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-2">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                    {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                                  </span>
                                  {edu.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                                      {edu.location}
                                    </span>
                                  )}
                                  {edu.gpa && (
                                    <span className="flex items-center gap-1">
                                      <GraduationCap className="w-3 h-3 md:w-4 md:h-4" />
                                      GPA: {edu.gpa}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <div className="space-y-4">
                              {edu.description && (
                                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {edu.description}
                                </p>
                              )}
                              
                              {edu.skills && edu.skills.length > 0 && (
                                <div>
                                  <h4 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                                    Skills & Courses
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {edu.skills.map((skill, skillIndex) => (
                                      <motion.span
                                        key={skillIndex}
                                        className="px-2 py-1 md:px-3 md:py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs md:text-sm rounded-full font-medium"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: skillIndex * 0.1 }}
                                      >
                                        {skill}
                                      </motion.span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Card>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 