"use client";

import ProjectCard from "@/components/Dashboard/Project/ProjectCard";
import ProjectForm from "@/components/Dashboard/Project/ProjectForm";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Certification } from "@/interfaces/Certification";
import { Company } from "@/interfaces/Company";
import { Education } from "@/interfaces/Education";
import { Project, ProjectStatus, ProjectCategory } from "@/interfaces/Project";
import { Client } from "@/interfaces/Client";

interface ProjectSubmitData {
  title: string;
  brief: string;
  overview: string;
  slug: string;
  repository?: string;
  live?: string;
  associatedWith?: string;
  status: string;
  startDate: Date | null;
  endDate?: Date | null;
  stack: string[];
  features: string[];
  category: string[];
  featured: boolean;
  hasCaseStudy: boolean;
  thumbnail?: string;
  thumbnailFile?: File;
  carousel?: File[];
  carouselFiles?: File[];
  thumbnailToDelete?: string;
  imagesToDelete?: string[];
  imagesToKeep?: string[];
  clientInfo?: Client;
}
import { format } from "date-fns";
import {
  CheckCircle,
  ChevronDown,
  Filter,
  PauseCircle,
  Plus,
  Power,
  PowerOff,
  Search,
  StepForward,
  X
} from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProjectsLoading from "./loading";

const statuses = [
  { value: "Completed" as ProjectStatus, label: "Completed" },
  { value: "InProgress" as ProjectStatus, label: "In Progress" },
  { value: "OnHold" as ProjectStatus, label: "On Hold" },
];

const categories = [
  "Web",
  "AI",
  "Mobile",
  "Desktop",
  "API",
  "Database",
  "DevOps",
  "Cloud",
  "Blockchain",
  "IoT",
  "Game",
  "Ecommerce",
  "CMS",
  "Dashboard",
  "Analytics",
  "Security",
  "Testing",
  "Documentation",
  "Scraping",
  "Other",
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">(
    "all"
  );
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [featuredFilter, setFeaturedFilter] = useState<boolean | "all">("all");
  const [enabledFilter, setEnabledFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  // Unified API loading function
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      
      // Define all API endpoints to fetch
      const endpoints = [
        { url: "/api/projects", setter: setProjects, name: "projects" },
        { url: "/api/education", setter: setEducations, name: "educations" },
        { url: "/api/companies", setter: setCompanies, name: "companies" },
        { url: "/api/certifications", setter: setCertifications, name: "certifications" },
      ];

      // Fetch all data concurrently
      const promises = endpoints.map(async ({ url, setter, name }) => {
        try {
          const response = await fetch(url, { credentials: "include" });
          
          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              console.error(`Unauthorized access to ${name}`);
              return { success: false, name, error: "Unauthorized" };
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to fetch ${name}`);
          }
          
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            setter(data.data);
            return { success: true, name, count: data.data.length };
          } else {
            console.error(`Invalid response format for ${name}:`, data);
            setter([]);
            return { success: false, name, error: "Invalid response format" };
          }
        } catch (error) {
          console.error(`Error loading ${name}:`, error);
          setter([]);
          return { 
            success: false, 
            name, 
            error: error instanceof Error ? error.message : "Unknown error" 
          };
        }
      });

      // Wait for all requests to complete
      const results = await Promise.allSettled(promises);
      
      // Process results and show any errors
      const failedRequests = results
        .filter((result): result is PromiseFulfilledResult<{ success: boolean; error: string; name: string }> => 
          result.status === 'fulfilled' && !result.value.success
        )
        .map(result => result.value);

      if (failedRequests.length > 0) {
        console.warn("Some data failed to load:", failedRequests);
        
        // Show toast for failed requests (excluding unauthorized which is handled by notFound)
        const userFacingErrors = failedRequests.filter(req => req.error !== "Unauthorized");
        if (userFacingErrors.length > 0) {
          toast.error(`Failed to load: ${userFacingErrors.map(req => req.name).join(", ")}`);
        }
      }

      // Check if any critical data failed (projects is critical)
      const projectsResult = results.find((result): result is PromiseFulfilledResult<{ success: boolean; error: string; name: string }> => 
        result.status === 'fulfilled' && result.value.name === "projects"
      );
      
      if (projectsResult && !projectsResult.value.success) {
        if (projectsResult.value.error === "Unauthorized") {
          notFound();
          return;
        }
      }

      // Log successful loads
      const successfulLoads = results
        .filter((result): result is PromiseFulfilledResult<{ success: boolean; name: string; count: number }> => 
          result.status === 'fulfilled' && result.value.success
        )
        .map(result => result.value);
      
      if (successfulLoads.length > 0) {
        console.log("✅ Successfully loaded:", successfulLoads.map(req => `${req.name} (${req.count})`).join(", "));
      }

    } catch (error) {
      console.error("Error in loadAllData:", error);
      toast.error("Failed to load data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleCreateProject = async (data: ProjectSubmitData) => {
    try {
      setIsCreating(true);
      const formDataToSend = new FormData();
      formDataToSend.append("title", data.title);
      formDataToSend.append("brief", data.brief);
      formDataToSend.append("overview", data.overview);
      formDataToSend.append("slug", data.slug);
      formDataToSend.append("repository", data.repository || "");
      formDataToSend.append("live", data.live || "");
      formDataToSend.append("associatedWith", data.associatedWith || "");
      formDataToSend.append("status", data.status);
      formDataToSend.append(
        "startDate",
        data.startDate ? (data.startDate instanceof Date ? data.startDate.toISOString() : new Date(data.startDate).toISOString()) : ""
      );
      if (data.endDate) {
        formDataToSend.append(
          "endDate",
          data.endDate instanceof Date ? data.endDate.toISOString() : new Date(data.endDate).toISOString()
        );
      }
      if (data.stack.length > 0) {
        formDataToSend.append("stack", JSON.stringify(data.stack));
      }
      if (data.features.length > 0) {
        formDataToSend.append("features", JSON.stringify(data.features));
      }
      if (data.category.length > 0) {
        formDataToSend.append("category", JSON.stringify(data.category));
      }
      if (data.thumbnailFile) {
        formDataToSend.append("thumbnail", data.thumbnailFile);
      }
      data.carouselFiles?.forEach((file: File) => {
        formDataToSend.append("carousel", file);
      });
      
      // Add featured field
      formDataToSend.append("featured", data.featured ? "true" : "false");
      formDataToSend.append("hasCaseStudy", data.hasCaseStudy ? "true" : "false");
      
      // Add client data if associatedWith is "client"
      if (data.associatedWith === "client" && data.clientInfo) {
        formDataToSend.append("clientInfo", JSON.stringify(data.clientInfo));
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        if (response.status === 401) {
          notFound();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `Failed to create project (${response.status})`;
        if (errorData.details && Array.isArray(errorData.details)) {
          errorData.details.forEach((detail: { path: string[]; message: string }) => {
            if (detail.path && detail.message) {
              toast.error(`${detail.path.join(".")}: ${detail.message}`);
            }
          });
        } else {
          toast.error(errorMessage);
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast.success("Project created successfully!");
      setIsAddDialogOpen(false);
      const newProject = result.data;
      setProjects(prevProjects => [newProject, ...prevProjects]);
    } catch (error: unknown) {
      console.error("Error creating project:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProject = async (data: ProjectSubmitData) => {
    if (!selectedProject) return;

    try {
      setIsUpdating(true);
      const formDataToSend = new FormData();
      formDataToSend.append("title", data.title);
      formDataToSend.append("brief", data.brief);
      formDataToSend.append("overview", data.overview);
      formDataToSend.append("slug", data.slug);
      formDataToSend.append("repository", data.repository || "");
      formDataToSend.append("live", data.live || "");
      formDataToSend.append("associatedWith", data.associatedWith || "");
      formDataToSend.append("status", data.status);
      formDataToSend.append(
        "startDate",
        data.startDate ? (data.startDate instanceof Date ? data.startDate.toISOString() : new Date(data.startDate).toISOString()) : ""
      );
      if (data.endDate) {
        formDataToSend.append(
          "endDate",
          data.endDate instanceof Date ? data.endDate.toISOString() : new Date(data.endDate).toISOString()
        );
      }
      if (data.stack.length > 0) {
        formDataToSend.append("stack", JSON.stringify(data.stack));
      }
      if (data.features.length > 0) {
        formDataToSend.append("features", JSON.stringify(data.features));
      }
      if (data.category.length > 0) {
        formDataToSend.append("category", JSON.stringify(data.category));
      }
      if (data.thumbnailFile) {
        formDataToSend.append("thumbnail", data.thumbnailFile);
      }
      data.carouselFiles?.forEach((file: File) => {
        formDataToSend.append("carousel", file);
      });
      
      // Add featured field
      formDataToSend.append("featured", data.featured ? "true" : "false");
      formDataToSend.append("hasCaseStudy", data.hasCaseStudy ? "true" : "false");
      
      // Add image management data for editing
      if (data.imagesToKeep) {
        formDataToSend.append("imagesToKeep", JSON.stringify(data.imagesToKeep));
      }
      if (data.imagesToDelete) {
        formDataToSend.append("imagesToDelete", JSON.stringify(data.imagesToDelete));
      }
      
      // Add client data if associatedWith is "client"
      if (data.associatedWith === "client" && data.clientInfo) {
        formDataToSend.append("clientInfo", JSON.stringify(data.clientInfo));
      }
      if (data.thumbnailToDelete) {
        formDataToSend.append("thumbnailToDelete", data.thumbnailToDelete);
      }

      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        if (response.status === 401) {
          notFound();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `Failed to update project (${response.status})`;

        // Show validation errors in toast
        if (errorData.details && Array.isArray(errorData.details)) {
          errorData.details.forEach((detail: { path: string[]; message: string }) => {
            if (detail.path && detail.message) {
              toast.error(`${detail.path.join(".")}: ${detail.message}`);
            }
          });
        } else {
          toast.error(errorMessage);
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast.success("Project updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      const updatedProject = result.data;
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === updatedProject.id ? updatedProject : project
        )
      );
    } catch (error: unknown) {
      console.error("Error updating project:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          notFound();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `Failed to delete project (${response.status})`;
        throw new Error(errorMessage);
      }

      toast.success("Project deleted successfully!");
      setProjects(prevProjects => 
        prevProjects.filter(project => project.id !== selectedProject.id)
      );
      
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    } catch (error: unknown) {
      console.error("Error deleting project:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleProjectStatus = async (projectId: string, isEnabled: boolean) => {
    try {
      setIsToggling(true);
      const response = await fetch('/api/projects/toggle-project-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          isEnabled
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          notFound();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `Failed to toggle project status (${response.status})`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Update the project in the local state
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === projectId 
            ? { ...project, isEnabled: isEnabled }
            : project
        )
      );

      toast.success(result.message || `Project ${isEnabled ? 'enabled' : 'disabled'} successfully!`);
    } catch (error: unknown) {
      console.error('Error toggling project status:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to toggle project status";
      toast.error(errorMessage);
      throw error; // Re-throw to trigger revert in ProjectCard
    } finally {
      setIsToggling(false);
    }
  };

  // Get projects to display from DB
  const getDisplayProjects = () => {
    return projects;
  };

  // Filter and search projects
  const filteredProjects = getDisplayProjects().filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.brief.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.overview.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    const matchesCategory =
      categoryFilter.length === 0 ||
      categoryFilter.some((cat) => project.category?.includes(cat as ProjectCategory));

    const matchesFeatured =
      featuredFilter === "all" || project.featured === featuredFilter;

    const matchesEnabled =
      enabledFilter === "all" || 
      (enabledFilter === "enabled" && project.isEnabled) ||
      (enabledFilter === "disabled" && !project.isEnabled);

    const matchesDateRange =
      (!dateRangeFilter.start && !dateRangeFilter.end) ||
      (dateRangeFilter.start &&
        new Date(project.startDate) >= dateRangeFilter.start &&
        (!dateRangeFilter.end ||
          new Date(project.startDate) <= dateRangeFilter.end));

    return (
      matchesSearch && matchesStatus && matchesCategory && matchesFeatured && matchesEnabled && matchesDateRange
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, featuredFilter, enabledFilter, dateRangeFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter([]);
    setFeaturedFilter("all");
    setEnabledFilter("all");
    setDateRangeFilter({ start: null, end: null });
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    categoryFilter.length > 0 ||
    featuredFilter !== "all" ||
    enabledFilter !== "all" ||
    dateRangeFilter.start;

  return (
    <>
      {isLoading ? (
        <ProjectsLoading />
      ) : (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Projects
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            {projects.length > 0
              ? `Manage and showcase your ${projects.length} portfolio projects${
                  projects.filter(p => p.featured).length > 0 
                    ? ` (${projects.filter(p => p.featured).length} featured)`
                    : ""
                }`
              : "No projects yet - Add your first project to get started"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => setIsAddDialogOpen(true)}
                disabled={isCreating || isUpdating || isDeleting}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 transform hover:scale-105 h-12 px-6"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Project
              </button>
            </DialogTrigger>
            <ProjectForm
              onSubmit={handleCreateProject}
              onCancel={() => setIsAddDialogOpen(false)}
              isSubmitting={isCreating}
              educations={educations}
              companies={companies}
              certifications={certifications}
              existingSlugs={projects.map((p) => p.slug)}
            />
          </Dialog>
        </div>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block text-muted-foreground" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground">
              Projects
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search projects by title, brief, or overview..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 h-12 text-base"
          />
        </div>

        {/* Filter Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  {(() => {
                    let count = 0;
                    if (statusFilter !== "all") count++;
                    if (categoryFilter.length > 0) count++;
                    if (featuredFilter !== "all") count++;
                    if (enabledFilter !== "all") count++;
                    if (dateRangeFilter.start) count++;
                    return count;
                  })()}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Filter Projects</DialogTitle>
              <DialogDescription>
                Apply filters to narrow down your project search
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Status Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Project Status</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                    className={`justify-start transition-all duration-200 ${
                      statusFilter === "all"
                        ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800"
                        : "hover:bg-muted"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    All Status
                  </Button>
                  {statuses.map((status) => (
                    <Button
                      key={status.value}
                      variant="outline"
                      size="sm"
                      onClick={() => setStatusFilter(status.value)}
                      className={`justify-start transition-all duration-200 ${
                        statusFilter === status.value
                          ? (() => {
                              switch (status.value) {
                                case "Completed":
                                  return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800";
                                case "InProgress":
                                  return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-300 dark:border-yellow-800";
                                case "OnHold":
                                  return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-300 dark:border-red-800";
                                default:
                                  return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800";
                              }
                            })()
                          : "hover:bg-muted"
                      }`}
                    >
                      {status.value === "Completed" && <CheckCircle className="h-4 w-4 mr-2" />}
                      {status.value === "InProgress" && <StepForward className="h-4 w-4 mr-2" />}
                      {status.value === "OnHold" && <PauseCircle className="h-4 w-4 mr-2" />}
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Categories</Label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={categoryFilter.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCategoryFilter([...categoryFilter, category]);
                          } else {
                            setCategoryFilter(
                              categoryFilter.filter((c) => c !== category)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Featured Projects</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFeaturedFilter("all")}
                    className={`justify-start transition-all duration-200 ${
                      featuredFilter === "all"
                        ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800"
                        : "hover:bg-muted"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    All Projects
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFeaturedFilter(true)}
                    className={`justify-start transition-all duration-200 ${
                      featuredFilter === true
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-300 dark:border-yellow-800"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-yellow-600 mr-2">⭐</span>
                    Featured Only
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFeaturedFilter(false)}
                    className={`justify-start transition-all duration-200 ${
                      featuredFilter === false
                        ? "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-950/20 dark:text-gray-300 dark:border-gray-800"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-gray-600 mr-2">○</span>
                    Non-Featured
                  </Button>
                </div>
              </div>

              {/* Enabled/Disabled Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Project Visibility</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEnabledFilter("all")}
                    className={`justify-start transition-all duration-200 ${
                      enabledFilter === "all"
                        ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800"
                        : "hover:bg-muted"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    All Projects
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEnabledFilter("enabled")}
                    className={`justify-start transition-all duration-200 ${
                      enabledFilter === "enabled"
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Power className="h-4 w-4 mr-2 text-green-600" />
                    Enabled Only
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEnabledFilter("disabled")}
                    className={`justify-start transition-all duration-200 ${
                      enabledFilter === "disabled"
                        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-300 dark:border-red-800"
                        : "hover:bg-muted"
                    }`}
                  >
                    <PowerOff className="h-4 w-4 mr-2 text-red-600" />
                    Disabled Only
                  </Button>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <span className="truncate">
                            {dateRangeFilter.start
                              ? format(dateRangeFilter.start, "MMM yyyy")
                              : "Select start date"}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRangeFilter.start || undefined}
                          onSelect={(date) => {
                            setDateRangeFilter((prev) => ({
                              ...prev,
                              start: date || null,
                            }));
                          }}
                          disabled={(date) =>
                            dateRangeFilter.end ? date > dateRangeFilter.end : false
                          }
                          className="rounded-md border shadow-sm"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">End Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <span className="truncate">
                            {dateRangeFilter.end
                              ? format(dateRangeFilter.end, "MMM yyyy")
                              : "Select end date"}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRangeFilter.end || undefined}
                          onSelect={(date) => {
                            setDateRangeFilter((prev) => ({
                              ...prev,
                              end: date || null,
                            }));
                          }}
                          disabled={(date) =>
                            dateRangeFilter.start
                              ? date < dateRangeFilter.start
                              : false
                          }
                          className="rounded-md border shadow-sm"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {dateRangeFilter.start
                    ? "Leave end date empty to show all projects from start date onwards"
                    : "Select a start date to filter by date range"}
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="w-full sm:w-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg items-center">
          <span className="text-sm text-muted-foreground mr-2">
            Active filters:
          </span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: &quot;{searchQuery}&quot;
              <button
                onClick={() => setSearchQuery("")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {statuses.find((s) => s.value === statusFilter)?.label}
              <button
                onClick={() => setStatusFilter("all")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {categoryFilter.map((cat) => (
            <Badge key={cat} variant="secondary" className="gap-1">
              {cat}
              <button
                onClick={() =>
                  setCategoryFilter(categoryFilter.filter((c) => c !== cat))
                }
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {featuredFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {featuredFilter === true ? "⭐ Featured Only" : "○ Non-Featured"}
              <button
                onClick={() => setFeaturedFilter("all")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {enabledFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {enabledFilter === "enabled" ? (
                <>
                  <Power className="h-3 w-3 text-green-600" />
                  Enabled Only
                </>
              ) : (
                <>
                  <PowerOff className="h-3 w-3 text-red-600" />
                  Disabled Only
                </>
              )}
              <button
                onClick={() => setEnabledFilter("all")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {dateRangeFilter.start && (
            <Badge variant="secondary" className="gap-1">
              {dateRangeFilter.end
                ? `Date Range: ${format(
                    dateRangeFilter.start,
                    "MMM yyyy"
                  )} - ${format(dateRangeFilter.end, "MMM yyyy")}`
                : `From ${format(dateRangeFilter.start, "MMM yyyy")} onwards`}
              <button
                onClick={() => setDateRangeFilter({ start: null, end: null })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground w-6 h-6"
            >
              <X className="h-3 w-3 text-red-500" />
            </Button>
          )}
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              {hasActiveFilters
                ? "No projects match your filters"
                : "No projects found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {hasActiveFilters
                ? "Try adjusting your search criteria or clearing some filters."
                : "Start building your portfolio by adding your first project."}
            </p>
            {hasActiveFilters ? (
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            ) : (
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                disabled={isCreating || isUpdating || isDeleting}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Project
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              openEditDialog={openEditDialog}
              openDeleteDialog={openDeleteDialog}
              onToggleStatus={handleToggleProjectStatus}
              isToggling={isToggling}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <ProjectForm
          project={selectedProject}
          isEdit={true}
          onSubmit={handleUpdateProject}
          onCancel={() => {
            setIsEditDialogOpen(false);
            setSelectedProject(null);
          }}
          isSubmitting={isUpdating}
          educations={educations}
          companies={companies}
          certifications={certifications}
          existingSlugs={projects.map((p) => p.slug)}
        />
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedProject?.title}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
      )}
    </>
  );
}
