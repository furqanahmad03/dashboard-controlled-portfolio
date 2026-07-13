"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  ChevronsUpDown,
  Check,
  ChevronDownIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Education } from "@/interfaces/Education";
import { Company } from "@/interfaces/Company";
import { Certification } from "@/interfaces/Certification";
import { Project, ProjectStatus, ProjectCategory } from "@/interfaces/Project";
import { Client } from "@/interfaces/Client";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface ProjectFormData {
  slug: string;
  title: string;
  brief: string;
  thumbnail: string;
  repository: string;
  live: string;
  overview: string;
  associatedWith: string;
  status: ProjectStatus;
  startDate: Date | null;
  endDate: Date | null;
  stack: string[];
  images: string[];
  category: string[];
  features: string[];
  featured: boolean;
  hasCaseStudy: boolean;
}

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

interface ProjectFormProps {
  project?: Project | null;
  isEdit?: boolean;
  onSubmit: (data: ProjectSubmitData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  educations: Education[];
  companies: Company[];
  certifications: Certification[];
  existingSlugs?: string[];
}

const statuses = [
  { value: "Completed", label: "Completed" },
  { value: "InProgress", label: "In Progress" },
  { value: "OnHold", label: "On Hold" },
];

export default function ProjectForm({
  project,
  isEdit = false,
  onSubmit,
  onCancel,
  isSubmitting,
  educations,
  companies,
  certifications,
  existingSlugs = [],
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    slug: "",
    title: "",
    brief: "",
    thumbnail: "",
    repository: "",
    live: "",
    overview: "",
    associatedWith: "",
    status: "Completed" as ProjectStatus,
    startDate: null as Date | null,
    endDate: null as Date | null,
    stack: [] as string[],
    images: [] as string[],
    category: [] as string[],
    features: [] as string[],
    featured: false,
    hasCaseStudy: false,
  });

  const [stackInput, setStackInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [slugInput, setSlugInput] = useState("");

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [carouselFiles, setCarouselFiles] = useState<File[]>([]);
  
  const [imagesToKeep, setImagesToKeep] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [thumbnailToDelete, setThumbnailToDelete] = useState<string | null>(null);

  const [showClientInfo, setShowClientInfo] = useState(false);
  const [clientInfo, setClientInfo] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    country: "",
    company: "",
    industry: "",
    budget: "",
    sourceName: "",
    sourceWebsite: "",
    notes: "",
  });

  const [institutionOpen, setInstitutionOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  useEffect(() => {
    if (project && isEdit) {
      setFormData({
        slug: project.slug,
        title: project.title,

        brief: project.brief,
        thumbnail: project.thumbnail,
        repository: project.repository || "",
        live: project.live || "",
        overview: project.overview,
        associatedWith: project.associatedWith || "",
        status: project.status,
        startDate: project.startDate || null,
        endDate: project.endDate || null,
        stack: project.stack,
        images: project.images,
        category: project.category,
        features: project.features,
        featured: project.featured || false,
        hasCaseStudy: project.hasCaseStudy || false,
      });
      setThumbnailFile(null);
      setCarouselFiles([]);
      
      // Check if project has a client and pre-populate client info
      if (project.client) {
        setShowClientInfo(true);
        setClientInfo({
          name: project.client.name || "",
          phone: project.client.phone || "",
          email: project.client.email || "",
          city: project.client.city || "",
          state: project.client.state || "",
          country: project.client.country || "",
          company: project.client.company || "",
          industry: project.client.industry || "",
          budget: project.client.budget || "",
          sourceName: project.client.sourceName || "",
          sourceWebsite: project.client.sourceWebsite || "",
          notes: project.client.notes || "",
        });
      } else {
        setShowClientInfo(false);
      }
      
      setImagesToKeep(project.images || []);
      setImagesToDelete([]);
      setThumbnailToDelete(null);
    } else {
      resetForm();
    }
  }, [project, isEdit]);

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      brief: "",
      thumbnail: "",
      repository: "",
      live: "",
      overview: "",
      associatedWith: "",
      status: "Completed" as ProjectStatus,
      startDate: null,
      endDate: null,
      stack: [] as string[],
      images: [] as string[],
      category: [] as string[],
      features: [] as string[],
      featured: false,
      hasCaseStudy: false,
    });
    setThumbnailFile(null);
    setCarouselFiles([]);
    setStackInput("");
    setFeaturesInput("");
    setSlugInput("");
    setShowClientInfo(false);
    
    setImagesToKeep([]);
    setImagesToDelete([]);
    setThumbnailToDelete(null);
    
    // Reset client info
    setClientInfo({
      name: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      country: "",
      company: "",
      industry: "",
      budget: "",
      sourceName: "",
      sourceWebsite: "",
      notes: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.slug || formData.slug.trim() === "") {
      toast.error(
        "Slug is required. Please enter a unique slug for your project."
      );
      return;
    }

    if (isEdit && !thumbnailFile && !formData.thumbnail && !thumbnailToDelete) {
      toast.error(
        "Project thumbnail is required. Please upload a new thumbnail or keep the existing one."
      );
      return;
    }

    const submitData = {
      ...formData,
      thumbnailFile: thumbnailFile || undefined,
      carouselFiles,
      clientInfo: showClientInfo ? clientInfo : undefined,
      imagesToKeep: isEdit ? imagesToKeep : undefined,
      imagesToDelete: isEdit ? imagesToDelete : undefined,
      thumbnailToDelete: isEdit ? (thumbnailToDelete || undefined) : undefined,
    };

    try {
      await onSubmit(submitData);
      // Reset form only after successful submission and only for add form
      if (!isEdit) {
        resetForm();
      }
    } catch (error) {
      // Error handling is done in the parent component
      throw error;
    }
  };

  const handleAddStack = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && stackInput.trim()) {
      e.preventDefault();
      if (!formData.stack.includes(stackInput.trim())) {
        setFormData({
          ...formData,
          stack: [...formData.stack, stackInput.trim()],
        });
      }
      setStackInput("");
    }
  };

  const handleRemoveStack = (itemToRemove: string) => {
    setFormData({
      ...formData,
      stack: formData.stack.filter((item) => item !== itemToRemove),
    });
  };

  const handleAddFeatures = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && featuresInput.trim()) {
      e.preventDefault();
      if (!formData.features.includes(featuresInput.trim())) {
        setFormData({
          ...formData,
          features: [...formData.features, featuresInput.trim()],
        });
      }
      setFeaturesInput("");
    }
  };

  const handleRemoveFeatures = (itemToRemove: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter((item) => item !== itemToRemove),
    });
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    if (isEdit && project) {
      setImagesToKeep(prev => prev.filter(img => img !== imageUrl));
      setImagesToDelete(prev => [...prev, imageUrl]);
    }
  };

  const handleRemoveExistingThumbnail = () => {
    if (isEdit && project?.thumbnail) {
      setThumbnailToDelete(project.thumbnail);
      setFormData(prev => ({ ...prev, thumbnail: "" }));
    }
  };

  const handleRestoreImage = (imageUrl: string) => {
    if (isEdit) {
      setImagesToDelete(prev => prev.filter(img => img !== imageUrl));
      setImagesToKeep(prev => [...prev, imageUrl]);
    }
  };

  const handleRestoreThumbnail = () => {
    if (isEdit && project?.thumbnail) {
      setThumbnailToDelete(null);
      setFormData(prev => ({ ...prev, thumbnail: project.thumbnail }));
    }
  };

  const handleClearAllCarouselImages = () => {
    if (isEdit && project) {
      setImagesToKeep([]);
      setImagesToDelete(project.images || []);
    }
  };

  const handleRestoreAllCarouselImages = () => {
    if (isEdit && project) {
      setImagesToDelete([]);
      setImagesToKeep(project.images || []);
    }
  };

  const handleReplaceAllCarouselImages = () => {
    if (isEdit && project) {
      setImagesToDelete(project.images || []);
      setImagesToKeep([]);
      setCarouselFiles([]);
    }
  };

  const handleRemoveCategory = (itemToRemove: string) => {
    setFormData({
      ...formData,
      category: formData.category.filter((item) => item !== itemToRemove),
    });
  };

  const handleAddSlug = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && slugInput.trim()) {
      e.preventDefault();
      const slug = slugInput
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-");

      const slugExists = existingSlugs.includes(slug) && slug !== project?.slug;

      if (slugExists) {
        toast.error(`Slug "${slug}" already exists. Choose another one.`);
        return;
      }

      setFormData({
        ...formData,
        slug: slug,
      });
      setSlugInput("");
      toast.success(`Slug "${slug}" is available!`);
    }
  };

  return (
    <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Project" : "Add New Project"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update project information."
            : "Create a new project entry for your portfolio."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 overflow-x-hidden">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter the project title..."
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="h-12"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brief">Brief</Label>
          <Textarea
            id="brief"
            placeholder="Briefly describe the project."
            value={formData.brief}
            onChange={(e) =>
              setFormData({ ...formData, brief: e.target.value })
            }
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            onKeyDown={handleAddSlug}
            placeholder="Type a slug and press Enter (e.g., my-project-name)"
            className="h-12"
          />
          {formData.slug && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                {formData.slug}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, slug: "" })}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
              <span className="text-xs text-green-600 dark:text-green-400">
                ✓ Available
              </span>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Press Enter to validate and set the slug. Slug must be unique and is
            required.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="overview">Overview</Label>
          <Textarea
            id="overview"
            value={formData.overview}
            onChange={(e) =>
              setFormData({ ...formData, overview: e.target.value })
            }
            placeholder="Provide an overview of the project..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stack">Stack</Label>
          <Input
            id="stack"
            value={stackInput}
            onChange={(e) => setStackInput(e.target.value)}
            onKeyDown={handleAddStack}
            className="h-12"
            placeholder="Type a technology and press Enter"
          />
          {formData.stack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.stack.map((item, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveStack(item)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="features">Features</Label>
          <Input
            id="features"
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            onKeyDown={handleAddFeatures}
            className="h-12"
            placeholder="Type a feature and press Enter"
          />
          {formData.features.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {formData.features.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeatures(item)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categories</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between h-12"
              >
                <span className="truncate">
                  {formData.category.length === 0
                    ? "Select categories..."
                    : `${formData.category.length} selected`}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-w-[450px] max-h-60 overflow-y-auto">
              <DropdownMenuLabel className="text-sm font-medium">
                Available Categories
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
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
                "Other",
              ].map((category) => {
                const isSelected = formData.category.includes(
                  category as ProjectCategory
                );
                return (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => {
                      if (isSelected) {
                        setFormData({
                          ...formData,
                          category: formData.category.filter(
                            (c) => c !== category
                          ),
                        });
                      } else {
                        setFormData({
                          ...formData,
                          category: [...formData.category, category],
                        });
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between cursor-pointer",
                      isSelected && "bg-accent"
                    )}
                  >
                    <span>{category}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary ml-2" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {formData.category.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.category.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(item)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="repository">Repository URL</Label>
          <Input
            id="repository"
            placeholder="e.g., https://github.com/your-username/your-project"
            type="url"
            value={formData.repository}
            onChange={(e) =>
              setFormData({ ...formData, repository: e.target.value })
            }
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="live">Live URL</Label>
          <Input
            id="live"
            placeholder="e.g., https://my-project.com"
            type="url"
            value={formData.live}
            onChange={(e) => setFormData({ ...formData, live: e.target.value })}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label>Associated With</Label>
          <DropdownMenu
            open={institutionOpen}
            onOpenChange={setInstitutionOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={institutionOpen}
                className="w-full justify-between h-12"
              >
                <div className="flex items-center gap-2">
                  {formData.associatedWith
                    ? (() => {
                        if (formData.associatedWith === "client") {
                          return (
                            <>
                              <span className="text-sm">👤</span>
                              <span>Client</span>
                            </>
                          );
                        }
                        const education = educations.find(
                          (edu) => edu.id === formData.associatedWith
                        );
                        const company = companies.find(
                          (company) => company.id === formData.associatedWith
                        );
                        const certification = certifications.find(
                          (cert) => cert.id === formData.associatedWith
                        );
                        
                        if (education) {
                          return (
                            <>
                              {education.institutionLogo ? (
                                <Image
                                  src={education.institutionLogo}
                                  alt={education.institution}
                                  className="w-4 h-4 object-contain rounded-sm"
                                  width={16}
                                  height={16}
                                  unoptimized
                                />
                              ) : (
                                <span className="text-sm">🏫</span>
                              )}
                              <span>{education.institution}</span>
                            </>
                          );
                        }
                        
                        if (company) {
                          return (
                            <>
                              {company.logo ? (
                                <Image
                                  src={company.logo}
                                  alt={company.name}
                                  className="w-4 h-4 object-contain rounded-sm"
                                  width={16}
                                  height={16}
                                  unoptimized
                                />
                              ) : (
                                <span className="text-sm">🏢</span>
                              )}
                              <span>{company.name}</span>
                            </>
                          );
                        }
                        
                        if (certification) {
                          return (
                            <>
                              {certification.logo ? (
                                <Image
                                  src={certification.logo}
                                  alt={certification.title}
                                  className="w-4 h-4 object-contain rounded-sm"
                                  width={16}
                                  height={16}
                                  unoptimized
                                />
                              ) : (
                                <span className="text-sm">🏆</span>
                              )}
                              <span>{certification.title}</span>
                            </>
                          );
                        }
                        
                        return formData.associatedWith;
                      })()
                    : (
                        <>
                          <span className="text-sm">❌</span>
                          <span>None</span>
                        </>
                      )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-w-[450px] max-h-80 overflow-y-auto">
              {(companies?.length || 0) > 0 && (
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-sm text-gray-500">
                    Companies
                  </DropdownMenuLabel>
                  {(companies || []).map((company) => (
                    <DropdownMenuItem
                      key={company.id}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          associatedWith: company.id || "",
                        });
                        setInstitutionOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between",
                        formData.associatedWith === company.id && "bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {company.logo ? (
                          <Image
                            src={company.logo}
                            alt={company.name}
                            className="w-4 h-4 object-contain rounded-sm"
                            width={16}
                            height={16}
                            unoptimized
                          />
                        ) : (
                          <span className="text-sm">🏢</span>
                        )}
                        <span>{company.name}</span>
                      </div>
                      {formData.associatedWith === company.id && (
                        <Check className="h-4 w-4 text-primary ml-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              )}

              {(educations?.length || 0) > 0 && (
                <DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-sm text-gray-500">
                    Educational Institutions
                  </DropdownMenuLabel>
                  {(educations || []).map((education) => (
                    <DropdownMenuItem
                      key={education.id}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          associatedWith: education.id || "",
                        });
                        setInstitutionOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between",
                        formData.associatedWith === education.id &&
                          "bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {education.institutionLogo ? (
                          <Image
                            src={education.institutionLogo}
                            alt={education.institution}
                            className="w-4 h-4 object-contain rounded-sm"
                            width={16}
                            height={16}
                            unoptimized
                          />
                        ) : (
                          <span className="text-sm">🏫</span>
                        )}
                        <span>{education.institution}</span>
                      </div>
                      {formData.associatedWith === education.id && (
                        <Check className="h-4 w-4 text-primary ml-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              )}

              {(certifications?.length || 0) > 0 && (
                <DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-sm text-gray-500">
                    Certifications
                  </DropdownMenuLabel>
                  {(certifications || []).map((certification) => (
                    <DropdownMenuItem
                      key={certification.id}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          associatedWith: certification.id || "",
                        });
                        setInstitutionOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between",
                        formData.associatedWith === certification.id &&
                          "bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {certification.logo ? (
                          <Image
                            src={certification.logo}
                            alt={certification.title}
                            className="w-4 h-4 object-contain rounded-sm"
                            width={16}
                            height={16}
                            unoptimized
                          />
                        ) : (
                          <span className="text-sm">🏆</span>
                        )}
                        <span>{certification.title}</span>
                      </div>
                      {formData.associatedWith === certification.id && (
                        <Check className="h-4 w-4 text-primary ml-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-sm text-gray-500">
                  Other
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setFormData({
                      ...formData,
                      associatedWith: "",
                    });
                    setInstitutionOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between",
                    !formData.associatedWith && "bg-accent"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">❌</span>
                    <span>None</span>
                  </div>
                  {!formData.associatedWith && (
                    <Check className="h-4 w-4 text-primary ml-2" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setFormData({
                      ...formData,
                      associatedWith: "client",
                    });
                    setInstitutionOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between",
                    formData.associatedWith === "client" && "bg-accent"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">👤</span>
                    <span>Client</span>
                  </div>
                  {formData.associatedWith === "client" && (
                    <Check className="h-4 w-4 text-primary ml-2" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {formData.associatedWith === "client" && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showClientInfo"
              checked={showClientInfo}
              onChange={(e) => setShowClientInfo(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="showClientInfo" className="text-sm">
              Add client information for this project
            </Label>
          </div>
        )}

        {showClientInfo && formData.associatedWith === "client" && (
          <div className="space-y-4 ">
            <Accordion
              type="single"
              collapsible
              className="w-full bg-[#121212] rounded-sm border border-gray-700 px-3"
            >
              <AccordionItem value="client-info">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  Client Information
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Name</Label>
                      <Input
                        id="client-name"
                        placeholder="Client name"
                        value={clientInfo.name || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-phone">Phone</Label>
                      <Input
                        id="client-phone"
                        placeholder="Phone number"
                        value={clientInfo.phone || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email</Label>
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="Email address"
                      value={clientInfo.email || ""}
                      onChange={(e) =>
                        setClientInfo({
                          ...clientInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-city">City</Label>
                      <Input
                        id="client-city"
                        placeholder="City"
                        value={clientInfo.city || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-state">State</Label>
                      <Input
                        id="client-state"
                        placeholder="State"
                        value={clientInfo.state || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            state: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-country">Country</Label>
                      <Input
                        id="client-country"
                        placeholder="Country"
                        value={clientInfo.country || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            country: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-company">Company</Label>
                      <Input
                        id="client-company"
                        placeholder="Company name (if applicable)"
                        value={clientInfo.company || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            company: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-industry">Industry</Label>
                      <Input
                        id="client-industry"
                        placeholder="Industry sector"
                        value={clientInfo.industry || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            industry: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-budget">Budget</Label>
                      <Input
                        id="client-budget"
                        placeholder="Project budget range"
                        value={clientInfo.budget || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            budget: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-source">Source</Label>
                      <Input
                        id="client-source"
                        placeholder="Where did you find this client?"
                        value={clientInfo.sourceName || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            sourceName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-notes">Notes</Label>
                    <Textarea
                      id="client-notes"
                      placeholder="Additional notes about the client"
                      value={clientInfo.notes || ""}
                      onChange={(e) =>
                        setClientInfo({
                          ...clientInfo,
                          notes: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        <div className="space-y-2">
          <Label>Status</Label>
          <DropdownMenu open={statusOpen} onOpenChange={setStatusOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-12">
                {formData.status}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-w-[450px] max-h-80 overflow-y-auto">
              {statuses.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  className={cn(
                    "flex items-center justify-between",
                    formData.status === status.value && "bg-accent"
                  )}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      status: status.value as ProjectStatus,
                    });
                    setStatusOpen(false);
                  }}
                >
                  {status.label}
                  {formData.status === status.value && (
                    <Check className="h-4 w-4 text-primary ml-2" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  featured: checked as boolean,
                })
              }
              className="rounded border-gray-300"
            />
            <Label htmlFor="featured" className="text-sm">
              Mark as Featured Project
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Featured projects will be highlighted in your portfolio and can be filtered in the dashboard.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasCaseStudy"
              checked={formData.hasCaseStudy}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  hasCaseStudy: checked as boolean,
                })
              }
              className="rounded border-gray-300"
            />
            <Label htmlFor="hasCaseStudy" className="text-sm">
              Has Case Study
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Enable this to attach a project-specific blog/case-study from the dashboard.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal h-12"
                >
                  <span className="truncate">
                    {formData.startDate
                      ? formData.startDate instanceof Date
                        ? formData.startDate.toLocaleDateString()
                        : new Date(formData.startDate).toLocaleDateString()
                      : "Select start date"}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    formData.startDate instanceof Date
                      ? formData.startDate
                      : formData.startDate
                      ? new Date(formData.startDate)
                      : undefined
                  }
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setFormData({ ...formData, startDate: date || null });
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal h-12"
                >
                  <span className="truncate">
                    {formData.endDate
                      ? formData.endDate instanceof Date
                        ? formData.endDate.toLocaleDateString()
                        : new Date(formData.endDate).toLocaleDateString()
                      : "Select end date"}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    formData.endDate instanceof Date
                      ? formData.endDate
                      : formData.endDate
                      ? new Date(formData.endDate)
                      : undefined
                  }
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setFormData({ ...formData, endDate: date || null });
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">Project Images</Label>
            <p className="text-sm text-muted-foreground">
              Upload a thumbnail for the project card and multiple images for
              the project carousel.
            </p>
            
            {isEdit && (imagesToDelete.length > 0 || thumbnailToDelete) && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-950/20 dark:border-yellow-800">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Image Changes Summary:
                </p>
                <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                  {thumbnailToDelete && (
                    <li>• Thumbnail will be deleted</li>
                  )}
                  {imagesToDelete.length > 0 && (
                    <li>• {imagesToDelete.length} carousel image(s) will be deleted</li>
                  )}
                  {carouselFiles.length > 0 && (
                    <li>• {carouselFiles.length} new carousel image(s) will be uploaded</li>
                  )}
                  {thumbnailFile && (
                    <li>• New thumbnail will be uploaded</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Project Thumbnail {isEdit && <span className="text-sm text-muted-foreground">(Optional - upload new or keep existing)</span>}</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setThumbnailFile(file);
                  }}
                  className="flex-1 py-2 h-fit dark:bg-background bg-white border-gray-600 dark:text-white text-gray-900 file:bg-purple-600 file:border-0 file:text-white file:px-4 file:rounded file:mr-4"
                />
                {thumbnailFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setThumbnailFile(null)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {thumbnailFile && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative h-16 w-16 border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center group">
                      <Image
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                        fill
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-5 w-5 p-0 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm text-xs font-bold z-50 shadow-lg border border-white"
                        onClick={() => setThumbnailFile(null)}
                      >
                        ×
                      </Button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {thumbnailFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {!thumbnailFile && project?.thumbnail && isEdit && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative h-16 w-16 min-w-16 max-w-32 border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center group">
                      <Image
                        src={project.thumbnail}
                        alt="Current thumbnail"
                        className="w-full h-full object-cover"
                        fill
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-5 w-5 p-0 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm text-xs font-bold z-50 shadow-lg border border-white"
                        onClick={handleRemoveExistingThumbnail}
                      >
                        ×
                      </Button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Current Thumbnail</p>
                      {/* <p className="text-xs text-muted-foreground">
                        {project.thumbnail}
                      </p> */}
                    </div>
                  </div>
                </div>
              )}
              
              {thumbnailToDelete && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative h-16 w-16 min-w-16 max-w-32 border rounded-md overflow-hidden bg-red-100 border-red-300 flex items-center justify-center">
                      <Image
                        src={thumbnailToDelete}
                        alt="Thumbnail to be deleted"
                        className="w-full h-full object-cover opacity-50"
                        fill
                      />
                      <div className="absolute inset-0 bg-red-200 bg-opacity-30 flex items-center justify-center">
                        <span className="text-red-600 text-xs font-medium">Will be deleted</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-600">Thumbnail will be deleted</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRestoreThumbnail}
                        className="mt-1"
                      >
                        Restore
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Carousel Images {isEdit && <span className="text-sm text-muted-foreground">(Upload new or manage existing)</span>}</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setCarouselFiles((prev) => [...prev, ...files]);
                  }}
                  className="flex-1 py-2 h-fit dark:bg-background bg-white border-gray-600 dark:text-white text-gray-900 file:bg-purple-600 file:border-0 file:text-white file:px-4 file:rounded file:mr-4"
                />
                {carouselFiles.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCarouselFiles([])}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              {carouselFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected {carouselFiles.length} image(s):
                  </p>
                  <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                    {carouselFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="h-16 w-auto border rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Carousel ${index + 1}`}
                            className="w-full h-full object-cover"
                            fill
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 h-5 w-5 p-0 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm text-xs font-bold z-50 shadow-lg border border-white"
                          onClick={() =>
                            setCarouselFiles((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {carouselFiles.length === 0 &&
                project?.images &&
                project.images.length > 0 &&
                isEdit && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">
                        Current {project.images.length} image(s):
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleClearAllCarouselImages}
                          className="text-xs"
                        >
                          Remove All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleReplaceAllCarouselImages}
                          className="text-xs"
                        >
                          Replace All
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                      {project.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="h-16 w-auto border rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={image}
                              alt={`Current carousel ${index + 1}`}
                              className="w-full h-full object-cover"
                              fill
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 h-5 w-5 p-0 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm text-xs font-bold z-50 shadow-lg border border-white"
                            onClick={() => handleRemoveExistingImage(image)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {imagesToDelete.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-red-600">
                        {imagesToDelete.length} image(s) will be deleted:
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRestoreAllCarouselImages}
                        className="text-xs"
                      >
                        Restore All
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                      {imagesToDelete.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="h-16 w-16 border rounded-md overflow-hidden bg-red-100 border-red-300">
                            <Image
                              src={image}
                              alt={`Image to be deleted ${index + 1}`}
                              className="w-full h-full object-cover opacity-50"
                              fill
                            />
                            <div className="absolute inset-0 bg-red-200 bg-opacity-30 flex items-center justify-center">
                              <span className="text-red-600 text-xs font-medium">Will be deleted</span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute top-0 right-0 h-5 w-5 p-0 bg-green-500 text-white hover:bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm text-xs font-bold z-50 shadow-lg border border-white"
                            onClick={() => handleRestoreImage(image)}
                          >
                            ↺
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Project"
              : "Create Project"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
