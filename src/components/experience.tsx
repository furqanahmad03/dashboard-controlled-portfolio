"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface ExperienceData {
  id: string;
  position: string;
  companyId: string;
  joiningDate: string;
  endingDate: string | null;
  description: string;
  jobType: string;
  locationType: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    logo: string | null;
    website: string | null;
    location: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

interface GroupedExperienceData {
  company: ExperienceData["company"];
  positions: ExperienceData[];
  totalPositions: number;
  latestPosition: ExperienceData;
  earliestStart: Date;
  latestEndDate: Date | null;
  hasCurrentPosition: boolean;
}

const formatMonthYear = (date: string | Date | null) => {
  if (!date) return "Present";
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");

export function Experience() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
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

  const groupedExperiences = useMemo<GroupedExperienceData[]>(() => {
    if (experiences.length === 0) {
      return [];
    }

    const grouped = new Map<string, { company: ExperienceData["company"]; positions: ExperienceData[] }>();

    experiences.forEach((experience) => {
      const companyKey = experience.company?.id || experience.companyId;
      const existingGroup = grouped.get(companyKey);

      if (existingGroup) {
        existingGroup.positions.push(experience);
        return;
      }

      grouped.set(companyKey, {
        company: experience.company,
        positions: [experience],
      });
    });

    const sortPositions = (a: ExperienceData, b: ExperienceData) => {
      if (!a.endingDate && b.endingDate) return -1;
      if (a.endingDate && !b.endingDate) return 1;

      const aDate = a.endingDate
        ? new Date(a.endingDate).getTime()
        : new Date(a.joiningDate).getTime();
      const bDate = b.endingDate
        ? new Date(b.endingDate).getTime()
        : new Date(b.joiningDate).getTime();

      return bDate - aDate;
    };

    return Array.from(grouped.values())
      .map((group) => {
        const positions = [...group.positions].sort(sortPositions);
        const earliestStart = new Date(
          Math.min(...positions.map((position) => new Date(position.joiningDate).getTime()))
        );

        const hasCurrentPosition = positions.some((position) => !position.endingDate);
        const completedEndDates = positions
          .filter((position) => position.endingDate)
          .map((position) => new Date(position.endingDate as string).getTime());

        const latestEndDate = completedEndDates.length
          ? new Date(Math.max(...completedEndDates))
          : null;

        return {
          company: group.company,
          positions,
          totalPositions: positions.length,
          latestPosition: positions[0],
          earliestStart,
          latestEndDate,
          hasCurrentPosition,
        };
      })
      .sort((a, b) => {
        if (a.hasCurrentPosition && !b.hasCurrentPosition) return -1;
        if (!a.hasCurrentPosition && b.hasCurrentPosition) return 1;

        const aDate = a.hasCurrentPosition
          ? new Date(a.latestPosition.joiningDate).getTime()
          : a.latestEndDate?.getTime() || 0;
        const bDate = b.hasCurrentPosition
          ? new Date(b.latestPosition.joiningDate).getTime()
          : b.latestEndDate?.getTime() || 0;

        return bDate - aDate;
      });
  }, [experiences]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/experience');
        const data = await response.json();

        if (data.success) {
          setExperiences(data.data);
        } else {
          console.error('Error fetching experiences:', data.error);
          setExperiences([]);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
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
            <Briefcase className="w-12 h-12 text-purple-600" />
            Experience
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
                          {/* Company Logo Skeleton */}
                          <Skeleton className="w-10 h-10 md:w-12 md:h-12 mt-2 rounded-sm" />

                          {/* Content Skeleton */}
                          <div className="min-w-0 flex-1 text-left">
                            {/* Position title */}
                            <Skeleton className="h-6 md:h-7 w-3/4 mb-1" />
                            {/* Company name and job type */}
                            <Skeleton className="h-5 md:h-6 w-2/3 mb-2" />
                            {/* Metadata section */}
                            <div className="flex flex-col items-start gap-1 mt-2">
                              <Skeleton className="h-3 md:h-4 w-32" />
                              <Skeleton className="h-3 md:h-4 w-24" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))
            ) : (
              groupedExperiences.map((group, index) => (
                <motion.div
                  key={group.company.id}
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
                      <div className="px-6 py-4">
                        <div className="flex items-start gap-3 md:gap-4 w-full">
                          {/* Company Logo */}
                          <div className="w-10 h-10 md:w-12 md:h-12 mt-1 bg-white rounded-sm flex items-center justify-center border border-gray-200 flex-shrink-0">
                            {group.company.logo ? (
                              <Image width={48} height={48} src={group.company.logo} alt={group.company.name} className="w-full p-1 h-full object-contain" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                {group.company.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 text-left">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                              {group.company.name}
                            </h3>

                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {formatMonthYear(group.earliestStart)} - {group.hasCurrentPosition ? "Present" : formatMonthYear(group.latestEndDate)} · {group.totalPositions} {group.totalPositions === 1 ? "position" : "positions"}
                            </p>

                            <Accordion type="single" collapsible className="mt-4">
                              {group.positions.map((position, positionIndex) => (
                                <AccordionItem key={position.id} value={`position-${position.id}`} className="border-none">
                                  <div className="flex items-start gap-3">
                                    <div className="flex flex-col items-center pt-1">
                                      <span className="text-base leading-none text-gray-500 dark:text-gray-400">
                                        •
                                      </span>
                                      {positionIndex < group.positions.length - 1 && (
                                        <span className="h-10 w-px bg-gray-300 dark:bg-gray-700 mt-1" />
                                      )}
                                    </div>

                                    <div className="min-w-0 flex-1 pb-3">
                                      <AccordionTrigger className="py-0 hover:no-underline">
                                        <div className="text-left">
                                          <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                            {position.position}
                                          </p>
                                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                            {formatMonthYear(position.joiningDate)} - {position.endingDate ? formatMonthYear(position.endingDate) : "Present"}
                                          </p>
                                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {formatLabel(position.jobType)} · {formatLabel(position.locationType)}
                                          </p>
                                        </div>
                                      </AccordionTrigger>

                                      <AccordionContent className="pt-3 pb-0">


                                        {position.description && (
                                          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {position.description}
                                          </p>
                                        )}

                                        {position.skills && position.skills.length > 0 && (
                                          <div className="mt-4">
                                            <div className="flex flex-wrap gap-2">
                                              {position.skills.map((skill, skillIndex) => (
                                                <motion.span
                                                  key={`${position.id}-${skill}-${skillIndex}`}
                                                  className="px-2 py-1 md:px-3 md:py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs md:text-sm rounded-full font-medium"
                                                  initial={{ opacity: 0, scale: 0.8 }}
                                                  whileInView={{ opacity: 1, scale: 1 }}
                                                  viewport={{ once: true }}
                                                  transition={{ duration: 0.3, delay: skillIndex * 0.08 }}
                                                >
                                                  {skill}
                                                </motion.span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </AccordionContent>
                                    </div>
                                  </div>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </div>
                        </div>
                      </div>
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