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
import { Plus, Briefcase } from "lucide-react";
import { toast } from "sonner";
import ExperienceLoading from "./loading";
import { Company } from "@/interfaces/Company";
import { Position } from "@/interfaces/Position";
import ExperienceForm from "@/components/Dashboard/Experience/ExperienceForm";
import ExperienceCard from "@/components/Dashboard/Experience/ExperienceCard";

export default function ExperiencePage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [companiesResponse, positionsResponse] = await Promise.all([
        fetch("/api/companies", { credentials: "include" }),
        fetch("/api/experience", { credentials: "include" })
      ]);

      if (companiesResponse.ok) {
        const companiesData = await companiesResponse.json();
        if (companiesData.success && Array.isArray(companiesData.data)) {
          setCompanies(companiesData.data);
        } else {
          setCompanies([]);
        }
      } else {
        if (companiesResponse.status === 401 || companiesResponse.status === 403) {
          notFound();
          return;
        }
        setCompanies([]);
      }

      if (positionsResponse.ok) {
        const positionsData = await positionsResponse.json();
        if (positionsData.success && Array.isArray(positionsData.data)) {
          setPositions(positionsData.data);
        } else {
          setPositions([]);
        }
      } else {
        if (positionsResponse.status === 401 || positionsResponse.status === 403) {
          notFound();
          return;
        }
        toast.error("Failed to fetch positions");
        setPositions([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setCompanies([]);
      setPositions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formDataToSend: {
    position: string;
    jobType: string;
    companyId: string;
    joiningDate: string;
    endingDate?: string;
    locationType: string;
    description?: string;
    skills: string[];
  }) => {
    try {
      setIsSubmitting(true);

      if (selectedPosition) {
        const response = await fetch(`/api/experience/${selectedPosition.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSend),
        });

        if (!response.ok) {
          if (response.status === 401) {
            notFound();
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || "Failed to update position");
          return;
        }

        const updatedPosition = await response.json();

        if (updatedPosition.success && updatedPosition.data) {
          setPositions((prevPositions) =>
            prevPositions.map((position) =>
              position.id === selectedPosition.id
                ? updatedPosition.data
                : position
            )
          );
        }

        toast.success("Position updated successfully!");
      } else {
      const response = await fetch("/api/experience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify(formDataToSend),
        });

      if (!response.ok) {
        if (response.status === 401) {
            notFound();
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || "Failed to create position");
          return;
        }

        const newPosition = await response.json();

        if (newPosition.success && newPosition.data) {
          setPositions((prevPositions) => [newPosition.data, ...prevPositions]);
        }

        toast.success("Position created successfully!");
      }

      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedPosition(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPosition) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/experience/${selectedPosition.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          notFound();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || "Failed to delete position");
        return;
      }

      setPositions((prevPositions) =>
        prevPositions.filter((position) => position.id !== selectedPosition.id)
      );

      toast.success("Position deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedPosition(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (position: Position) => {
    setSelectedPosition(position);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (position: Position) => {
    setSelectedPosition(position);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      {isLoading ? (
        <ExperienceLoading />
      ) : (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight dark:text-white text-gray-900">
            Experience
          </h2>
              <p className="dark:text-gray-300 text-gray-900 text-lg">
            Manage your professional work experience and positions
          </p>
        </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
                <Button
                  onClick={() => setSelectedPosition(null)}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 transform hover:scale-105 h-12 px-6"
                >
              <Plus className="mr-2 h-5 w-5" />
              Add Position
                </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-gray-200 dark:border-gray-700">
            <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add New Position
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                Add a new position to showcase your professional experience.
              </DialogDescription>
            </DialogHeader>
                <ExperienceForm
                  mode="create"
                  companies={companies}
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
                  Experience
                </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Content Section */}
          {(positions?.length || 0) === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30 shadow-lg">
              <Briefcase className="h-12 w-12 text-purple-400" />
            </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  No experience yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                  Start building your professional portfolio by adding your work
                  experience.
                </p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 transform hover:scale-105"
                >
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Position
                </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {positions.map((position) => (
                <ExperienceCard
                  key={position.id}
                  position={position}
                  openEditDialog={openEditDialog}
                  openDeleteDialog={openDeleteDialog}
                />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-gray-200 dark:border-gray-700">
          <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Position
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
              Update position information.
            </DialogDescription>
          </DialogHeader>
              <ExperienceForm
                mode="edit"
                experience={selectedPosition}
                companies={companies}
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
                  Delete Position
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Are you sure you want to delete &quot;{selectedPosition?.position}&quot;
                  at {selectedPosition?.company.name}? This action cannot be
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
