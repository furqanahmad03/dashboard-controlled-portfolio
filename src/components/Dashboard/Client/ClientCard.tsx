"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Globe, 
  DollarSign, 
  Edit, 
  Eye,
  Calendar
} from "lucide-react";
import { Client } from "@/interfaces/Client";

interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onView: () => void;
}

export function ClientCard({ client, onEdit, onView }: ClientCardProps) {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "C";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {getInitials(client.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">
                {client.name || "Unnamed Client"}
              </CardTitle>
              {client.company && (
                <p className="text-sm text-muted-foreground truncate">
                  {client.company}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onView}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Contact Information */}
          <div className="space-y-2">
            {client.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{client.phone}</span>
              </div>
            )}
            {(client.city || client.state || client.country) && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  {[client.city, client.state, client.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Business Information */}
          <div className="space-y-2">
            {client.industry && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{client.industry}</span>
              </div>
            )}
            {client.sourceWebsite && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a
                  href={client.sourceWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  {client.sourceWebsite}
                </a>
              </div>
            )}
            {client.budget && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{client.budget}</span>
              </div>
            )}
          </div>

          {/* Tags and Metadata */}
          <div className="flex flex-wrap gap-1 pt-2">
            {client.sourceName && (
              <Badge variant="secondary" className="text-xs">
                {client.sourceName}
              </Badge>
            )}
            {client.createdAt && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(client.createdAt)}
              </Badge>
            )}
          </div>

          {/* Notes Preview */}
          {client.notes && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {client.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}