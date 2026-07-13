"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import EducationLoading from "./loading";
import { Education } from "@/interfaces/Education";
import EducationForm from "@/components/Dashboard/Education/EducationForm";
import EducationsAccordion from "@/components/Dashboard/Education/EducationsAccordion";

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEducations();
  }, []);

  const loadEducations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/education", {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          notFound();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch educations");
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setEducations(data.data);
      } else {
        console.error("Invalid response format:", data);
        setEducations([]);
      }
    } catch (error) {
      console.error("Error loading educations:", error);
      notFound();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formDataToSend: FormData) => {
    try {
      setIsSubmitting(true);

      if (selectedEducation) {
        // Update existing education
        const response = await fetch(`/api/education/${selectedEducation.id}`, {
          method: "PUT",
          body: formDataToSend,
        });

        if (!response.ok) {
          if (response.status === 401) {
            notFound();
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || "Failed to update education");
          return;
        }

        const updatedEducation = await response.json();

        // Optimistically update the local state
        if (updatedEducation.success && updatedEducation.data) {
          setEducations((prevEducations) =>
            prevEducations.map((edu) =>
              edu.id === selectedEducation.id ? updatedEducation.data : edu
            )
          );
        }

        toast.success("Education updated successfully!");
      } else {
        // Create new education
        const response = await fetch("/api/education", {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) {
          if (response.status === 401) {
            notFound();
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || "Failed to create education");
          return;
        }

        const newEducation = await response.json();

        // Optimistically add to the local state
        if (newEducation.success && newEducation.data) {
          setEducations((prevEducations) => [
            newEducation.data,
            ...prevEducations,
          ]);
        }

        toast.success("Education created successfully!");
      }

      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedEducation(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEducation) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/education/${selectedEducation.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          notFound();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || "Failed to delete education");
        return;
      }

      // Optimistically remove from the local state
      setEducations((prevEducations) =>
        prevEducations.filter((edu) => edu.id !== selectedEducation.id)
      );

      toast.success("Education deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedEducation(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (education: Education) => {
    setSelectedEducation(education);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (education: Education) => {
    setSelectedEducation(education);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      {isLoading ? (
        <EducationLoading />
      ) : (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight dark:text-white text-gray-900">
                Education
              </h2>
              <p className="dark:text-gray-300 text-gray-900 text-lg">
                Manage your academic background and qualifications
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setSelectedEducation(null)}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 transform hover:scale-105 h-12 px-6"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Education
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-gray-200 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add New Education
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                    Add a new education entry to your portfolio.
                  </DialogDescription>
                </DialogHeader>
                <EducationForm
                  mode="create"
                  onSubmit={handleSubmit}
                  onCancel={() => setIsAddDialogOpen(false)}
                  isSubmitting={isSubmitting}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="/dashboard"
                  className="dark:text-gray-300 text-gray-900 hover:dark:text-white hover:text-gray-700"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-gray-600" />
              <BreadcrumbItem>
                <BreadcrumbPage className="dark:text-white text-gray-900">
                  Education
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Content Section */}
          {(educations?.length || 0) === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30 shadow-lg">
                  <BookOpen className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  No education entries yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                  Get started by adding your first education entry to showcase
                  your academic background.
                </p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 transform hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Education
                </Button>
              </div>
            </div>
          ) : (
            <EducationsAccordion
              educations={educations}
              openEditDialog={openEditDialog}
              openDeleteDialog={openDeleteDialog}
            />
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Education
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Update education information.
                </DialogDescription>
              </DialogHeader>
              <EducationForm
                mode="edit"
                education={selectedEducation}
                onSubmit={handleSubmit}
                onCancel={() => setIsEditDialogOpen(false)}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent className="bg-background border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete Education
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Are you sure you want to delete &quot;{selectedEducation?.degree}&quot;
                  from &quot;{selectedEducation?.institution}&quot;? This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="h-11 px-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="h-11 px-6"
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}
