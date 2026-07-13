"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Globe,
  Image as ImageIcon,
  MapPin,
  Star,
  Tag,
  User,
  Building2,
  Award,
  Mail,
  Phone,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  Eye,
} from "lucide-react";
import { Project } from "@/interfaces/Project";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import ProjectDetailLoading from "./loading";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const projectId = params.id as string;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setProject(result.data);
          } else {
            toast.error(result.message || "Failed to fetch project");
            router.push("/dashboard/projects");
          }
        } else if (response.status === 404) {
          toast.error("Project not found");
          router.push("/dashboard/projects");
        } else {
          toast.error("Failed to fetch project");
          router.push("/dashboard/projects");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Error fetching project");
        router.push("/dashboard/projects");
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "InProgress":
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case "OnHold":
        return <PauseCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "InProgress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "OnHold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM yyyy");
  };

  const formatDateRange = (
    startDate: Date | string,
    endDate?: Date | string | null
  ) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : "Present";
    return `${start} - ${end}`;
  };

  if (isLoading) {
    return <ProjectDetailLoading />;
  }

  if (!project) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Project not found</h3>
            <p className="text-muted-foreground mb-4">
              The project you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
            <Button onClick={() => router.push("/dashboard/projects")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {project.title}
            </h1>
            <p className="text-muted-foreground text-justify">{project.brief}</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
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
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink
              href="/dashboard/projects"
              className="text-muted-foreground hover:text-foreground"
            >
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block text-muted-foreground" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground">
              {project.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Thumbnail */}
          <Card className="py-0">
            <CardContent className="p-0">
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  unoptimized
                  className="object-cover rounded-xl"
                />
                {project.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Project Images Carousel */}
          {project.images && project.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Project Images ({project.images.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full" opts={{ loop: true }}>
                  <CarouselContent>
                    {project.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-video overflow-hidden rounded-lg">
                          <Image
                            src={image}
                            alt={`${project.title} - Image ${index + 1}`}
                            fill
                            unoptimized
                            className="object-contain"
                            onClick={() => window.open(image, "_blank")}
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0">
                            <Eye className="h-8 w-8 text-white opacity-0" />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {project.images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </>
                  )}
                </Carousel>
              </CardContent>
            </Card>
          )}

          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-justify">
                {project.overview}
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Tech Stack */}
          {project.stack && project.stack.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tech Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Status & Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1">{project.status}</span>
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Duration</span>
                <span className="text-sm text-muted-foreground">
                  {formatDateRange(project.startDate, project.endDate)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Visibility</span>
                <Badge variant={project.isEnabled ? "default" : "secondary"}>
                  {project.isEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Repository</span>
                </div>
                {project.repository ? (
                  <Link
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {project.repository}
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Not provided
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Live Demo</span>
                </div>
                {project.live ? (
                  <Link
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {project.live}
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Not available
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          {project.category && project.category.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.category.map((cat, index) => (
                    <Badge key={index} variant="outline">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Association */}
          {project.associatedWith && (
            <Card>
              <CardHeader>
                <CardTitle>Associated With</CardTitle>
              </CardHeader>
              <CardContent>
                {project.education && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {project.education.institution}
                      </p>
                      <p className="text-sm text-muted-foreground">Education</p>
                    </div>
                  </div>
                )}

                {project.company && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{project.company.name}</p>
                      <p className="text-sm text-muted-foreground">Company</p>
                    </div>
                  </div>
                )}

                {project.certification && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {project.certification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Certification
                      </p>
                    </div>
                  </div>
                )}

                {project.client && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{project.client.name}</p>
                        <p className="text-sm text-muted-foreground">Client</p>
                      </div>
                    </div>

                    {/* Client Details */}
                    <div className="ml-13 space-y-2 text-sm">
                      {project.client.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {project.client.email}
                          </span>
                        </div>
                      )}
                      {project.client.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {project.client.phone}
                          </span>
                        </div>
                      )}
                      {(project.client.city ||
                        project.client.state ||
                        project.client.country) && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {[
                              project.client.city,
                              project.client.state,
                              project.client.country,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      {project.client.company && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {project.client.company}
                          </span>
                        </div>
                      )}
                      {project.client.industry && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {project.client.industry}
                          </span>
                        </div>
                      )}
                      {project.client.budget && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {project.client.budget}
                          </span>
                        </div>
                      )}
                      {project.client.notes && (
                        <div className="pt-2 border-t">
                          <div className="flex items-start gap-2">
                            <FileText className="h-3 w-3 text-muted-foreground mt-0.5" />
                            <span className="text-muted-foreground text-xs">
                              {project.client.notes}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Project Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.repository && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View Repository
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Link>
                </Button>
              )}

              {project.live && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    View Live Demo
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Link>
                </Button>
              )}

              {project.hasCaseStudy && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/dashboard/projects/${project.id}/blog`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Case Study
                  </Link>
                </Button>
              )}

              {project.hasCaseStudy && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/dashboard/projects/${project.id}/blog/edit`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Edit Case Study
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
                asChild
              >
                <Link href={`/projects/${project.slug}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Public Page
                  <ExternalLink className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
