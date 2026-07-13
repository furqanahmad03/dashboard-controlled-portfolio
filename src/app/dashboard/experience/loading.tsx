import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExperienceLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header Section Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-32" /> {/* Title "Experience" */}
          <Skeleton className="h-6 w-80" /> {/* Description */}
        </div>
        <Skeleton className="h-12 w-40" /> {/* Add Position Button */}
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-20" /> {/* Dashboard */}
        <Skeleton className="h-4 w-4 rounded" /> {/* Separator */}
        <Skeleton className="h-4 w-16" /> {/* Experience */}
      </div>

      {/* Content Section Skeleton - Grid of Experience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Position Title */}
                  <Skeleton className="h-6 w-32 mb-2" />
                  {/* Company Name */}
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-5" /> {/* Building icon */}
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Skeleton className="h-8 w-8 rounded-md" /> {/* Edit button */}
                  <Skeleton className="h-8 w-8 rounded-md" /> {/* Delete button */}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Duration */}
              <div className="flex items-center space-x-2 text-sm">
                <Skeleton className="h-4 w-4" /> {/* Calendar icon */}
                <Skeleton className="h-4 w-32" /> {/* Date range */}
              </div>

              {/* Job Type and Location Type Badges */}
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" /> {/* Job Type badge */}
                <Skeleton className="h-5 w-16 rounded-full" /> {/* Location Type badge */}
              </div>

              {/* Duration Badge */}
              <Skeleton className="h-5 w-16 rounded-full" /> {/* Duration badge */}

              {/* Description - 2.5 lines */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" /> {/* Half line for 2.5 total */}
              </div>

              {/* Skills - 7 skills */}
              <div className="flex flex-wrap gap-2">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-16 rounded-full" />
                ))}
              </div>

              {/* Company Info Section */}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-6 h-6 rounded" /> {/* Company logo */}
                    <Skeleton className="h-4 w-20" /> {/* Company name */}
                  </div>
                  <Skeleton className="h-6 w-16 rounded-lg" /> {/* Visit button */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
