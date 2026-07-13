"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Search, Edit, Building2, Mail, Phone, MapPin, Globe, DollarSign, FileText } from "lucide-react";
import { Client } from "@/interfaces/Client";
import { ClientCard } from "@/components/Dashboard/Client/ClientCard";
import { ClientForm } from "@/components/Dashboard/Client/ClientForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import ClientsLoading from "./loading";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch clients
  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients", {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setClients(result.data);
          setFilteredClients(result.data);
        }
      } else {
        toast.error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Error fetching clients");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter((client) =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsViewOpen(true);
  };


  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedClient(null);
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    fetchClients();
    handleFormClose();
    toast.success(isEditing ? "Client updated successfully" : "Client added successfully");
  };

  if (isLoading) {
    return <ClientsLoading />;
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Clients
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            {clients.length > 0
              ? `Manage your ${clients.length} client${clients.length !== 1 ? 's' : ''} and their information`
              : "No clients yet - Add your first client to get started"}
          </p>
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
              Clients
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search and Stats */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search clients by name, email, company, or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 h-12 text-base"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              {searchTerm ? "No clients found" : "No clients yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm
                ? "Try adjusting your search terms or clearing the search."
                : "Start building your client base by adding your first client."}
            </p>
            {searchTerm ? (
              <Button onClick={() => setSearchTerm("")} variant="outline">
                Clear Search
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Use the form in the sidebar to add clients
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={() => handleEditClient(client)}
              onView={() => handleViewClient(client)}
            />
          ))}
        </div>
      )}

      {/* Client Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Client" : "Add New Client"}
            </DialogTitle>
          </DialogHeader>
          <ClientForm
            client={selectedClient}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* Client View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedClient.name}</h3>
                  {selectedClient.company && (
                    <p className="text-muted-foreground">{selectedClient.company}</p>
                  )}
                </div>
                <Button onClick={() => handleEditClient(selectedClient)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedClient.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedClient.email}</span>
                  </div>
                )}
                {selectedClient.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedClient.phone}</span>
                  </div>
                )}
                {(selectedClient.city || selectedClient.state || selectedClient.country) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {[selectedClient.city, selectedClient.state, selectedClient.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
                {selectedClient.sourceWebsite && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={selectedClient.sourceWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {selectedClient.sourceWebsite}
                    </a>
                  </div>
                )}
                {selectedClient.industry && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedClient.industry}</span>
                  </div>
                )}
                {selectedClient.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedClient.budget}</span>
                  </div>
                )}
              </div>

              {selectedClient.notes && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notes
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {selectedClient.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
