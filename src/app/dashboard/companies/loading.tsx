import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompaniesLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header Section Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-32" /> {/* Title "Companies" */}
          <Skeleton className="h-6 w-80" /> {/* Description */}
        </div>
        <Skeleton className="h-12 w-40" /> {/* Add Company Button */}
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-20" /> {/* Dashboard */}
        <Skeleton className="h-4 w-4 rounded" /> {/* Separator */}
        <Skeleton className="h-4 w-16" /> {/* Companies */}
      </div>

      {/* Content Section Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Company Cards Skeleton */}
        {[...Array(4)].map((_, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-0 shadow-xl bg-white dark:bg-[#0A0B0B] border border-gray-200 dark:border-gray-800 backdrop-blur-sm"
          >
            {/* Elegant Background Pattern Skeleton */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 via-transparent to-blue-500/3 opacity-0" />

            {/* Header with Logo and Actions Skeleton */}
            <div className="relative p-5 pb-4">
              <div className="flex items-start justify-between mb-4">
                {/* Company Logo Skeleton */}
                <div className="flex-shrink-0">
                  <Skeleton className="w-14 h-14 rounded-2xl" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-xl" /> {/* Edit button */}
                  <Skeleton className="h-8 w-8 rounded-xl" /> {/* Delete button */}
                </div>
              </div>

              {/* Company Name Skeleton */}
              <Skeleton className="h-6 w-32 mb-3" />
            </div>

            {/* Content Section Skeleton */}
            <div className="px-5 pb-5 space-y-4">
              {/* Website Link Skeleton */}
              <div className="flex items-center space-x-3">
                <Skeleton className="w-7 h-7 rounded-xl" /> {/* Globe icon */}
                <Skeleton className="h-4 w-24" /> {/* Website text */}
              </div>

              {/* Location Skeleton */}
              <div className="flex items-center space-x-3">
                <Skeleton className="w-7 h-7 rounded-xl" /> {/* MapPin icon */}
                <Skeleton className="h-4 w-20" /> {/* Location text */}
              </div>

              {/* Footer with Timestamps Skeleton */}
              <div className="pt-4 border-t border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-2 h-2 rounded-full" /> {/* Green dot */}
                    <Skeleton className="h-3 w-20" /> {/* Added date */}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-2 h-2 rounded-full" /> {/* Blue dot */}
                    <Skeleton className="h-3 w-20" /> {/* Updated date */}
                  </div>
                </div>
              </div>
            </div>

            {/* Elegant Hover Border Effect Skeleton */}
            <div className="absolute inset-0 rounded-lg border-2 border-transparent" />
          </Card>
        ))}
      </div>
    </div>
  );
}
