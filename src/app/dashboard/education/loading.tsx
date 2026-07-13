import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EducationLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header Section Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-32" /> {/* Title "Education" */}
          <Skeleton className="h-6 w-80" /> {/* Description */}
        </div>
        <Skeleton className="h-12 w-40" /> {/* Add Education Button */}
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-20" /> {/* Dashboard */}
        <Skeleton className="h-4 w-4 rounded" /> {/* Separator */}
        <Skeleton className="h-4 w-16" /> {/* Education */}
      </div>

      {/* Content Section Skeleton */}
      <div className="space-y-4">
        {/* Education Cards Skeleton - Mimicking the accordion structure */}
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 bg-white dark:bg-[#0A0B0B] shadow-md">
            <div className="flex flex-col md:flex-row w-full items-center">
              {/* Institution Logo Section Skeleton */}
              <div className="md:w-32 md:border-r border-gray-200 dark:border-gray-700/50 p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-lg" />
              </div>

              {/* Education Details Skeleton */}
              <div className="flex-1 p-4">
                <div className="space-y-3">
                  {/* Degree */}
                  <Skeleton className="h-6 w-48" />
                  {/* Institution */}
                  <Skeleton className="h-5 w-64" />
                  {/* Date, Location, and GPA/Percentage */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-3 w-3" /> {/* Calendar icon */}
                      <Skeleton className="h-3 w-24" /> {/* Date range */}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-3 w-3" /> {/* Map pin icon */}
                      <Skeleton className="h-3 w-20" /> {/* Location */}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-3 w-3" /> {/* Graduation cap icon */}
                      <Skeleton className="h-3 w-28" /> {/* GPA/Percentage */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
