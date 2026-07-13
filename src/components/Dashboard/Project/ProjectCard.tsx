import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Certification } from "@/interfaces/Certification";
import { Company } from "@/interfaces/Company";
import { Education } from "@/interfaces/Education";
import { Project } from "@/interfaces/Project";
import {
  CheckCircle,
  Edit,
  ExternalLink,
  Github,
  PauseCircle,
  Power,
  PowerOff,
  StepForward,
  Trash2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface ProjectCardProps {
  project: Project;
  openEditDialog: (project: Project) => void;
  openDeleteDialog: (project: Project) => void;
  onToggleStatus?: (projectId: string, isEnabled: boolean) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  isToggling?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  openEditDialog,
  openDeleteDialog,
  onToggleStatus,
  isCreating = false,
  isUpdating = false,
  isDeleting = false,
  isToggling = false,
}) => {
  const [isEnabled, setIsEnabled] = useState(project.isEnabled);

  const handleToggle = async () => {
    if (!onToggleStatus || isToggling) return;
    
    const newStatus = !isEnabled;
    setIsEnabled(newStatus);
    
    try {
      await onToggleStatus(project.id!, newStatus);
    } catch (error) {
      // Revert on error
      setIsEnabled(!newStatus);
      console.error('Failed to toggle project status:', error);
    }
  };
  return (
    <Card className="pt-0 gap-2 overflow-hidden dark:bg-black bg-white border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <div className="aspect-[16/10] w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden group">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fill
            sizes="(min-width: 1536px) 360px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-2xl font-bold opacity-80">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Toggle Switch - Top Left */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 shadow-lg">
                <Switch
                  checked={isEnabled}
                  onCheckedChange={handleToggle}
                  disabled={isToggling || isCreating || isUpdating || isDeleting}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-400"
                />
                <span className="text-xs text-white flex items-center gap-1 font-medium">
                  {isEnabled ? (
                    <>
                      <Power className="w-3 h-3 text-green-400" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <PowerOff className="w-3 h-3 text-gray-400" />
                      Disabled
                    </>
                  )}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {isEnabled 
                  ? "Click to disable this project from being displayed" 
                  : "Click to enable this project to be displayed"
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Edit/Delete Buttons - Top Right */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditDialog(project)}
            disabled={isCreating || isUpdating || isDeleting}
            className="h-8 w-8 p-0 bg-green-500/80 hover:!bg-green-700 text-white backdrop-blur-sm border border-green-400/50 shadow-lg"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteDialog(project)}
            disabled={isCreating || isUpdating || isDeleting}
            className="h-8 w-8 p-0 bg-red-500/80 hover:!bg-red-600 text-white backdrop-blur-sm border border-red-400/50 shadow-lg"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg text-foreground line-clamp-1">
              <Link href={`/dashboard/projects/${project.id}`}>
                {project.title}
              </Link>
            </CardTitle>
            {project.featured && (
              <Badge
                variant="outline"
                className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700"
              >
                ⭐ Featured
              </Badge>
            )}
          </div>
          <CardDescription className={`${project.associatedWith ? "line-clamp-2" : "line-clamp-3 mb-[18px]"} text-muted-foreground`}>
            {project.brief}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Project Association */}
        {project.associatedWith && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Association
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="text-xs flex items-center gap-1"
                  >
                    {(() => {
                      if (project.education) {
                        const education = project.education as Education;
                        return (
                          <>
                            {education.institutionLogo ? (
                              <Image
                                src={education.institutionLogo}
                                alt={education.institution}
                                className="w-3 h-3 rounded-sm object-cover"
                                width={16}
                                height={16}
                                unoptimized
                              />
                            ) : (
                              <span>🏫</span>
                            )}
                            <span>{education.institution.length > 30 ? education.institution.slice(0, 30) + "..." : education.institution}</span>
                          </>
                        );
                      }
                      if (project.company) {
                        const company = project.company as Company;
                        return (
                          <>
                            {company.logo ? (
                              <Image
                                src={company.logo}
                                alt={company.name}
                                className="h-3 w-3 object-contain"
                                width={16}
                                height={16}
                                unoptimized
                              />
                            ) : (
                              <span>🏢</span>
                            )}
                            <span>{company.name.length > 30 ? company.name.slice(0, 30) + "..." : company.name}</span>
                          </>
                        );
                      }
                      if (project.certification) {
                        const certification =
                          project.certification as Certification;
                        return (
                          <>
                            {certification.logo ? (
                              <Image
                                src={certification.logo}
                                alt={certification.title}
                                className="w-3 h-3 rounded-sm object-cover"
                                width={16}
                                height={16}
                                unoptimized
                              />
                            ) : (
                              <span>📜</span>
                            )}
                            <span>{certification.title.length > 30 ? certification.title.slice(0, 30) + "..." : certification.title}</span>
                          </>
                        );
                      }
                      if (project.client) {
                        return (
                          <>
                            <span>👤</span>
                            <span>Client</span>
                          </>
                        );
                      }
                      return (
                        <>
                          <span>🔗</span>
                          <span>Associated</span>
                        </>
                      );
                    })()}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-center justify">
                  <div className="text-xs">
                    {(() => {
                      if (project.education)
                        return `This project was developed as part of ${project.education.institution} coursework or academic program.`;
                      if (project.company)
                        return `This project was developed for or in collaboration with ${project.company.name}.`;
                      if (project.certification)
                        return `This project was created to fulfill requirements for ${project.certification.title} certification.`;
                      if (project.client)
                        return `This project was developed for a client as a professional service.`;
                      return "This project has external associations or partnerships.";
                    })()}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Tech Stack
            </span>
            <Badge variant="outline" className="text-xs">
              {project.stack?.length || 0} techs
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.stack?.slice(0, 4).map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-muted text-muted-foreground"
              >
                {tech}
              </Badge>
            ))}
            {project.stack && project.stack.length > 4 && (
              <Badge
                variant="secondary"
                className="text-xs bg-muted text-muted-foreground"
              >
                +{project.stack.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Duration: {new Date(project.startDate).toLocaleDateString('en-GB')} - {project.endDate ? new Date(project.endDate).toLocaleDateString('en-GB') : "Ongoing"}
            </span>
            <span>{project.features?.length || 0} features</span>
          </div>

          {/* Categories */}
          {project.category && project.category.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.category.slice(0, 3).map((cat, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                >
                  {cat}
                </Badge>
              ))}
              {project.category.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.category.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Status and Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs border-2 ${
                project.status === "Completed"
                  ? "border-green-500 text-green-700 dark:border-green-400 dark:text-green-300 bg-green-50 dark:bg-green-950/20"
                  : project.status === "InProgress"
                  ? "border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/20"
                  : "border-red-500 text-red-700 dark:border-red-400 dark:text-red-300 bg-red-50 dark:bg-red-950/20"
              }`}
            >
              <div className="flex items-center gap-1">
                {project.status === "Completed" && (
                  <CheckCircle className="w-3 h-3" />
                )}
                {project.status === "InProgress" && (
                  <StepForward className="w-3 h-3" />
                )}
                {project.status === "OnHold" && (
                  <PauseCircle className="w-3 h-3" />
                )}
                {project.status === "InProgress"
                  ? "In Progress"
                  : project.status === "OnHold"
                  ? "On Hold"
                  : project.status}
              </div>
            </Badge>
            {project.featured && (
              <Badge
                variant="outline"
                className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700"
              >
                ⭐ Featured
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {project.repository && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-7 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 hover:scale-105"
              >
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.live && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-7 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 hover:scale-105"
              >
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
