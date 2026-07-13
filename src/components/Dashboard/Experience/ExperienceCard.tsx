import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, CalendarIcon, Edit, Trash2 } from "lucide-react";
import { Position } from "@/interfaces/Position";
import Image from "next/image";

interface ExperienceCardProps {
  position: Position;
  openEditDialog: (position: Position) => void;
  openDeleteDialog: (position: Position) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  position,
  openEditDialog,
  openDeleteDialog,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getDuration = (startDate: Date, endDate?: Date | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (end.getDate() < start.getDate()) {
      months--;
      if (months < 0) {
        years--;
        months += 12;
      }
    }

    if (years > 1) {
      return `${years} years`;
    } else if (years === 1) {
      if (months === 0) {
        return "1 year";
      } else if (months === 1) {
        return "1 year 1 month";
      } else {
        return `1 year ${months} months`;
      }
    } else if (months > 1) {
      return `${months} months`;
    } else if (months === 1) {
      return "1 month";
    } else {
      return "Less than 1 month";
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{position.position}</CardTitle>
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-sm">{position.company.name}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditDialog(position)}
              className="p-2 h-8 w-8 bg-purple-600/10 hover:bg-purple-600/20 text-purple-600"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openDeleteDialog(position)}
              className="p-2 h-8 w-8 bg-red-600/10 hover:bg-red-600/20 text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Duration */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {formatDate(position.joiningDate)} - {position.endingDate ? formatDate(position.endingDate) : 'Present'}
          </span>
        </div>

        {/* Job Type and Location Type Badges */}
        <div className="flex gap-2">
          {position.jobType && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800">
              {position.jobType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          )}
          {position.locationType && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800">
              {position.locationType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          )}
        </div>

        {/* Duration Badge */}
        <Badge variant="secondary" className="text-xs">
          {getDuration(position.joiningDate, position.endingDate)}
        </Badge>

        {/* Description */}
        {position.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {position.description.trim().slice(0, 100)}...
          </p>
        )}

        {/* Skills */}
        {position.skills && position.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {position.skills.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800">
                {skill}
              </Badge>
            ))}
            {position.skills.length > 5 && (
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-300 dark:border-gray-800">
                +{position.skills.length - 5} more
              </Badge>
            )}
          </div>
        )}

        {/* Company Info */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {position.company.logo ? (
                <Image
                  src={position.company.logo}
                  alt={`${position.company.name} logo`}
                  className="w-6 h-6 object-contain"
                  width={16}
                  height={16}
                  unoptimized
                />
              ) : (
                <Building2 className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">{position.company.name}</span>
            </div>

            {position.company.website && (
              <a
                href={position.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg border border-blue-200 dark:border-blue-800 transition-all duration-200 hover:scale-105 hover:shadow-sm group"
              >
                <svg
                  className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span>Visit</span>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;

