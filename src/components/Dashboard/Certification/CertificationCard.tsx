import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Award, Globe, ExternalLink, CalendarIcon, Building2, Star, ShieldCheck } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Certification } from "@/interfaces/Certification";
import Image from "next/image";

interface CertificationCardProps {
  certification: Certification;
  openEditDialog: () => void;
  openDeleteDialog: () => void;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
}

const CertificationCard = ({ certification, openEditDialog, openDeleteDialog, formatDate, getStatusColor }: CertificationCardProps) => {
    
  return (
    <Card
      key={certification.id}
      className="group gap-2 relative bg-white dark:bg-[#0A0B0B] border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-start gap-3">
              {certification.logo ? (
                <div className="w-10 h-10 rounded-sm overflow-hidden border-1 p-1 border-purple-200 dark:border-purple-700 shadow-sm">
                  <Image
                    src={certification.logo}
                    alt={`${certification.title} logo`}
                    className="w-full h-full object-cover"
                    width={16}
                    height={16}
                    unoptimized
                  />
                </div>
              ) : (
                <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg group-hover:from-purple-200 group-hover:to-blue-200 dark:group-hover:from-purple-800/40 dark:group-hover:to-blue-800/40 transition-all duration-200">
                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              )}
              <div className="flex-1">
                <CardTitle className="text-lg md:min-h-20 md:max-h-fit min-h-fit leading-tight font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                  {certification.title}
                </CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              <CardDescription className="text-sm font-medium text-muted-foreground">
                {certification.issuer}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              className={`px-2 py-1 text-xs font-medium border ${getStatusColor(
                certification.status
              )}`}
            >
              {certification.status}
            </Badge>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={openEditDialog}
                className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={openDeleteDialog}
                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors duration-200">
              <CalendarIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <span
              className="font-medium truncate max-w-[120px]"
              title={certification.issueDate ? formatDate(certification.issueDate) : "Date not available"}
            >
              {certification.issueDate ? formatDate(certification.issueDate) : "Date not available"}
            </span>
          </div>
          {certification.credentialID && (
            <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors duration-200">
                 <Star className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
               </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                                         <span
                       className="font-medium truncate max-w-[120px]"
                       title={certification.credentialID || ""}
                     >
                       {certification.credentialID && certification.credentialID.trim().length > 25
                         ? certification.credentialID.trim().slice(0, 25) +
                           "..."
                         : certification.credentialID || ""}
                     </span>
                  </TooltipTrigger>
                                     <TooltipContent>
                     <p>{certification.credentialID || "No credential ID"}</p>
                   </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {certification.certificate && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors duration-200">
                <Award className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-medium">Certificate Available</span>
            </div>
          )}
          {certification.credentialURL && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors duration-200">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium">Credential URL Available</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {certification.issuerWebsite && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-3 text-xs hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              <a
                href={certification.issuerWebsite}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="h-3.5 w-3.5 mr-1.5" />
                Visit Website
              </a>
            </Button>
          )}
          {certification.credentialURL && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-3 text-xs hover:bg-green-100 dark:hover:bg-green-900/30"
            >
              <a
                href={certification.credentialURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Verify
              </a>
            </Button>
          )}
          {certification.certificate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 px-3 text-xs hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  >
                    <a
                      href={certification.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Award className="h-3.5 w-3.5 mr-1.5" />
                      View Certificate
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View certificate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationCard;
