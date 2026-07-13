import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CalendarIcon,
  MapPin,
  GraduationCap,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Education } from "@/interfaces/Education";
import Image from "next/image";


const EducationsAccordion = ({
  educations,
  openEditDialog,
  openDeleteDialog,
}: {
  educations: Education[];
  openEditDialog: (education: Education) => void;
  openDeleteDialog: (education: Education) => void;
}) => {
  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="space-y-4"
        aria-label="Education entries"
      >
        {educations.map((education) => (
          <AccordionItem
            key={education.id}
            value={education.id || ""}
            className="border-0"
          >
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 bg-white dark:bg-[#0A0B0B] shadow-md hover:shadow-2xl hover:border-l-blue-400">
              <AccordionTrigger
                className="p-0 hover:no-underline group px-4"
                aria-label={`Expand ${education.degree} at ${education.institution}`}
              >
                <div className="flex flex-col md:flex-row w-full items-center">
                  {/* Institution Logo Section */}
                  <div className="md:w-32 md:border-r border-gray-200 dark:border-gray-700/50 p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors duration-200">
                    {education.institutionLogo ? (
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm flex items-center justify-center group-hover:shadow-md transition-all duration-200">
                        <Image
                          src={education.institutionLogo}
                          alt={`${education.institution} logo`}
                          className="w-full h-full object-contain"
                          width={16}
                          height={16}
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-purple-500/20 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 dark:group-hover:from-blue-600/30 dark:group-hover:to-purple-600/30 transition-all duration-200">
                        <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200" />
                      </div>
                    )}
                  </div>

                  {/* Compact Education Details */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {education.degree}
                        </h3>
                        <p className="text-base text-blue-600 dark:text-blue-400 font-semibold line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                          {education.institution}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>
                              {format(
                                new Date(education.startDate),
                                "MMM yyyy"
                              )}{" "}
                              -
                              {education.endDate
                                ? format(
                                    new Date(education.endDate),
                                    " MMM yyyy"
                                  )
                                : " Present"}
                            </span>
                          </div>
                          {education.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{education.location}</span>
                            </div>
                          )}
                          {(education.gpa || education.percentage) && (
                            <div className="flex items-center space-x-1">
                              <GraduationCap className="h-3 w-3" />
                              <span>
                                {education.gpa && `GPA: ${education.gpa}`}
                                {education.gpa && education.percentage && " • "}
                                {education.percentage &&
                                  `${education.percentage}%`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              {/* Expanded Content */}
              <AccordionContent>
                <div className="border-t border-gray-200 dark:border-gray-700/50 p-6">
                  {/* Action Buttons - Moved to expanded content */}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(education)}
                      className="hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                      aria-label={`Edit ${education.degree} at ${education.institution}`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(education)}
                      className="hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
                      aria-label={`Delete ${education.degree} at ${education.institution}`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>

                  {/* Description */}
                  {education.description && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3 text-blue-600 dark:text-blue-400">
                        Description
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                        {education.description}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {education.skills &&
                    Array.isArray(education.skills) &&
                    education.skills.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide text-blue-600 dark:text-blue-400">
                          Skills & Courses
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(education.skills || []).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs flex items-center gap-1 group bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 rounded-md px-2.5 py-1"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default EducationsAccordion;
