"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Building2 } from "lucide-react"
import { toast } from "sonner"
import CompaniesLoading from "./loading"
import { Company } from "@/interfaces/Company"
import CompanyForm from "@/components/Dashboard/Company/CompanyForm"
import CompanyCard from "@/components/Dashboard/Company/CompanyCard"

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)



  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/companies", {
        credentials: 'include'
      })
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          notFound()
          return
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch companies")
      }
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        setCompanies(data.data)
      } else {
        console.error("Invalid response format:", data)
        setCompanies([])
      }
    } catch (error) {
      console.error("Error loading companies:", error)
      notFound()
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (formDataToSend: FormData) => {
    try {
      setIsSubmitting(true)
      if (selectedCompany) {
        const updatedCompany = await updateCompany(selectedCompany.id || "", formDataToSend)
      
        if (updatedCompany.success && updatedCompany.data) {
          setCompanies(prevCompanies => 
            prevCompanies.map(company => 
              company.id === selectedCompany.id ? updatedCompany.data : company
            )
          )
        }
        
        toast.success("Company updated successfully!")
      } else {
        const newCompany = await createCompany(formDataToSend)
        
        if (newCompany.success && newCompany.data) {
          setCompanies(prevCompanies => [newCompany.data, ...prevCompanies])
        }
        
        toast.success("Company created successfully!")
      }

      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      setSelectedCompany(null)
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCompany) return

    try {
      setIsSubmitting(true)
      await deleteCompany(selectedCompany.id || "")
      
      setCompanies(prevCompanies => 
        prevCompanies.filter(company => company.id !== selectedCompany.id)
      )
      
      toast.success("Company deleted successfully!")
      setIsDeleteDialogOpen(false)
      setSelectedCompany(null)
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const createCompany = async (formDataToSend: FormData) => {
    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        if (response.status === 401) {
          notFound()
          return
        }
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || "Failed to create company")
        return null
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating company:", error)
      toast.error("Failed to create company")
      return null
    }
  }

  const updateCompany = async (id: string, formDataToSend: FormData) => {
    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: "PUT",
        body: formDataToSend,
      })

      if (!response.ok) {
        if (response.status === 401) {
          notFound()
          return
        }
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || "Failed to update company")
        return null
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating company:", error)
      toast.error("Failed to update company")
      return null
    }
  }

  const deleteCompany = async (id: string) => {
    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        if (response.status === 401) {
          notFound()
          return
        }
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || "Failed to delete company")
        return null
      }

      return await response.json()
    } catch (error) {
      console.error("Error deleting company:", error)
      toast.error("Failed to delete company")
      return null
    }
  }

  const openEditDialog = (company: Company) => {
    setSelectedCompany(company)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (company: Company) => {
    setSelectedCompany(company)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      {isLoading ? (
        <CompaniesLoading />
      ) : (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">
                Companies
              </h2>
              <p className="text-muted-foreground text-lg">
                Manage the companies you&apos;ve worked with
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <button onClick={() => setSelectedCompany(null)} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 transform hover:scale-105 h-12 px-6">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Company
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground">Add New Company</DialogTitle>
                  <DialogDescription className="text-muted-foreground text-base">
                    Add a new company to showcase your professional experience.
                  </DialogDescription>
                </DialogHeader>
                <CompanyForm
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
                <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-muted-foreground" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground">Companies</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Content Section */}
          {(companies?.length || 0) === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30 shadow-lg">
                  <Building2 className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">No companies yet</h3>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Start building your professional portfolio by adding companies you&apos;ve worked with.
                </p>
                <button onClick={() => setIsAddDialogOpen(true)} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 transform hover:scale-105 h-12 px-6">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Company
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  openEditDialog={openEditDialog}
                  openDeleteDialog={openDeleteDialog}
                />
              ))}
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-background bg-white border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold dark:text-white text-black">Edit Company</DialogTitle>
                <DialogDescription className="dark:text-gray-300 text-gray-900 text-base">
                  Update company information.
                </DialogDescription>
              </DialogHeader>
              <CompanyForm
                mode="edit"
                company={selectedCompany}
                onSubmit={handleSubmit}
                onCancel={() => setIsEditDialogOpen(false)}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="bg-background border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold dark:text-white text-gray-900">Delete Company</DialogTitle>
                <DialogDescription className="dark:text-gray-300 text-gray-900 text-base">
                  Are you sure you want to delete &quot;{selectedCompany?.name}&quot;? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <button onClick={() => setIsDeleteDialogOpen(false)} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-6 border border-gray-600 dark:text-gray-300 text-gray-900 hover:bg-gray-700 hover:text-white bg-transparent">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={isSubmitting} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-6 bg-red-600 hover:bg-red-700 dark:text-white text-gray-900 border-0">
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  )
} 