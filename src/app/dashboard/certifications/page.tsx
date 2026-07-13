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
import { Plus, Award } from "lucide-react";
import { toast } from "sonner";
import CertificationsLoading from "./loading";
import { Certification } from "@/interfaces/Certification";
import CertificationForm from "@/components/Dashboard/Certification/CertificationForm";
import CertificationCard from "@/components/Dashboard/Certification/CertificationCard";

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/certifications", {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          notFound();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || "Failed to fetch certifications");
        setCertifications([]);
        return;
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setCertifications(data.data);
      } else {
        console.error("Invalid response format:", data);
        setCertifications([]);
      }
    } catch (error) {
      console.error("Error loading certifications:", error);
      toast.error("Failed to fetch certifications");
      setCertifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formDataToSend: {
    title: string;
    issuer: string;
    issuerWebsite?: string;
    issueDate: string;
    credentialID?: string;
    credentialURL?: string;
    status: string;
    logoFile?: File;
    certificatePictureFile?: File;
  }) => {
    try {
      setIsSubmitting(true);

      // Convert the object to FormData for file uploads
      const formData = new FormData();
      formData.append('title', formDataToSend.title);
      formData.append('issuer', formDataToSend.issuer);
      formData.append('issuerWebsite', formDataToSend.issuerWebsite || '');
      formData.append('issueDate', formDataToSend.issueDate);
      formData.append('credentialID', formDataToSend.credentialID || '');
      formData.append('credentialURL', formDataToSend.credentialURL || '');
      formData.append('status', formDataToSend.status);

      if (formDataToSend.logoFile) {
        formData.append('logo', formDataToSend.logoFile);
      }
      if (formDataToSend.certificatePictureFile) {
        formData.append('certificate', formDataToSend.certificatePictureFile);
      }

      if (selectedCertification) {
        const response = await fetch(`/api/certifications/${selectedCertification.id}`, {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) {
          if (response.status === 401) {
            notFound();
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || "Failed to update certification");
          return;
        }

        const updatedCertification = await response.json();

        if (updatedCertification.success && updatedCertification.data) {
          setCertifications((prevCertifications) =>
            prevCertifications.map((certification) =>
              certification.id === selectedCertification.id
                ? updatedCertification.data
                : certification
            )
          );
        }

        toast.success("Certification updated successfully!");
      } else {
        const response = await fetch("/api/certifications", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          if (response.status === 401) {
            notFound();
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || "Failed to create certification");
          return;
        }

        const newCertification = await response.json();

        if (newCertification.success && newCertification.data) {
          setCertifications((prevCertifications) => [newCertification.data, ...prevCertifications]);
        }

        toast.success("Certification created successfully!");
      }

      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedCertification(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCertification) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/certifications/${selectedCertification.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          notFound();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || "Failed to delete certification");
        return;
      }

      setCertifications((prevCertifications) =>
        prevCertifications.filter((certification) => certification.id !== selectedCertification.id)
      );

      toast.success("Certification deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedCertification(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (certification: Certification) => {
    setSelectedCertification(certification);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (certification: Certification) => {
    setSelectedCertification(certification);
    setIsDeleteDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
      case "Expired":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      case "Suspended":
      case "Revoked":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      case "Surrendered":
      case "Withdrawn":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || typeof dateString !== 'string') {
      return 'Date not available';
    }

    try {
      if (dateString.match(/^[A-Za-z]+ \d{4}$/)) {
        return dateString;
      }

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const yearMatch = dateString.match(/\d{4}/);
        const monthMatch = dateString.match(/[A-Za-z]+/);

        if (yearMatch && monthMatch) {
          return `${monthMatch[0]} ${yearMatch[0]}`;
        }

        return dateString || 'Date not available';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch (error) {
      console.warn('Error formatting date:', dateString, error);
      return dateString || 'Date not available';
    }
  };

  return (
    <>
                   {isLoading ? (
               <CertificationsLoading />
             ) : (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight dark:text-white text-gray-900">
            Certifications
          </h2>
              <p className="dark:text-gray-300 text-gray-900 text-lg">
            Manage your professional certifications and achievements
          </p>
        </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
                <Button
                  onClick={() => setSelectedCertification(null)}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 transform hover:scale-105 h-12 px-6"
                >
              <Plus className="mr-2 h-5 w-5" />
              Add Certification
            </Button>
          </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-gray-200 dark:border-gray-700">
            <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add New Certification
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                Add a new certification to showcase your professional achievements.
              </DialogDescription>
            </DialogHeader>
                <CertificationForm
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
                  Certifications
                </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Content Section */}
          {(certifications?.length || 0) === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30 shadow-lg">
              <Award className="h-12 w-12 text-purple-400" />
            </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  No certifications yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
              Start building your professional portfolio by adding your certifications and achievements.
            </p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 transform hover:scale-105"
                >
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Certification
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((certification) => (
            <CertificationCard
              key={certification.id}
              certification={certification}
                  openEditDialog={() => openEditDialog(certification)}
                  openDeleteDialog={() => openDeleteDialog(certification)}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-gray-200 dark:border-gray-700">
          <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Certification
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
              Update certification information.
            </DialogDescription>
          </DialogHeader>
              <CertificationForm
                mode="edit"
                certification={selectedCertification}
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
                  Delete Certification
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Are you sure you want to delete &quot;{selectedCertification?.title}&quot;
                  from {selectedCertification?.issuer}? This action cannot be&quot;
                  undone.&quot;
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