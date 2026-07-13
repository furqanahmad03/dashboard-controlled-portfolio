import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
      {/* Header Section Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-32" /> {/* Title "Projects" */}
          </div>
          <Skeleton className="h-6 w-96" /> {/* Description */}
        </div>
        <Skeleton className="h-12 w-32" /> {/* Add Project Button */}
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-20" /> {/* Dashboard */}
        <Skeleton className="h-4 w-4 rounded" /> {/* Separator */}
        <Skeleton className="h-4 w-20" /> {/* Projects */}
      </div>

      {/* Search and Filters Skeleton */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Skeleton className="h-12 w-full rounded-md" />
        </div>

        {/* Filter Button */}
        <Skeleton className="h-12 w-24 rounded-md" />
      </div>

      {/* Projects Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="pt-0 gap-2 overflow-hidden dark:bg-black bg-white border border-gray-200 dark:border-gray-800">
            {/* Thumbnail Section */}
            <div className="h-48 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 relative overflow-hidden">
              <Skeleton className="w-full h-full rounded-none" />
            </div>

            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {/* Project Title */}
                  <Skeleton className="h-6 w-40 mt-2" />
                </div>
                {/* Project Brief */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Project Association - Always show in skeleton */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-16" /> {/* "Association" label */}
                  <Skeleton className="h-5 w-32 rounded-full" /> {/* Association badge */}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-16" /> {/* "Tech Stack" label */}
                  <Skeleton className="h-5 w-20 rounded-full" /> {/* "X techs" badge */}
                </div>
                <div className="flex flex-wrap gap-1">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Skeleton className="h-3 w-32" /> {/* Duration */}
                  <Skeleton className="h-3 w-16" /> {/* Features count */}
                </div>

                {/* Categories - Always show in skeleton */}
                <div className="flex flex-wrap gap-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  {/* Status Badge */}
                  <Skeleton className="h-5 w-20 rounded-full" />
                  {/* Featured Badge */}
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  {/* GitHub Button */}
                  <Skeleton className="h-7 w-7 rounded-md" />
                  {/* Live Demo Button */}
                  <Skeleton className="h-7 w-7 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-md" /> {/* Previous */}
          <Skeleton className="h-10 w-10 rounded-md" /> {/* Page 1 */}
          <Skeleton className="h-10 w-10 rounded-md" /> {/* Page 2 */}
          <Skeleton className="h-10 w-10 rounded-md" /> {/* Page 3 */}
          <Skeleton className="h-10 w-10 rounded-md" /> {/* Next */}
        </div>
      </div>
    </div>
  );
}