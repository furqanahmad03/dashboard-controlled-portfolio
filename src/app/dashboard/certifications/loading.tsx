import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CertificationsLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header Section Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-32" /> {/* Title "Certifications" */}
          <Skeleton className="h-6 w-80" /> {/* Description */}
        </div>
        <Skeleton className="h-12 w-40" /> {/* Add Certification Button */}
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-20" /> {/* Dashboard */}
        <Skeleton className="h-4 w-4 rounded" /> {/* Separator */}
        <Skeleton className="h-4 w-24" /> {/* Certifications */}
      </div>

      {/* Content Section Skeleton - Grid of Certification Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="group gap-2 relative bg-white dark:bg-[#0A0B0B] border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start gap-3">
                    {/* Logo/Award Icon Skeleton */}
                    <div className="w-10 h-10 rounded-sm overflow-hidden border-1 p-1 border-gray-200 dark:border-gray-700 shadow-sm">
                      <Skeleton className="w-full h-full rounded-sm" />
                    </div>
                    <div className="flex-1">
                      {/* Certification Title */}
                      <Skeleton className="h-6 w-32 mb-2" />
                    </div>
                  </div>
                  {/* Issuer */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3" /> {/* Building icon */}
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* Status Badge */}
                  <Skeleton className="h-5 w-16 rounded-full" />
                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                    <Skeleton className="h-8 w-8 rounded-md" /> {/* Edit button */}
                    <Skeleton className="h-8 w-8 rounded-md" /> {/* Delete button */}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 relative z-10">
              <div className="space-y-3 text-sm text-muted-foreground">
                {/* Issue Date */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <Skeleton className="h-3.5 w-3.5 rounded" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Credential ID */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                    <Skeleton className="h-3.5 w-3.5 rounded" />
                  </div>
                  <Skeleton className="h-4 w-28" />
                </div>

                {/* Certificate Available */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gray-100 dark:bg-gray-900/30 rounded-md">
                    <Skeleton className="h-3.5 w-3.5 rounded" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Credential URL Available */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                    <Skeleton className="h-3.5 w-3.5 rounded" />
                  </div>
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-24 rounded-lg" /> {/* Visit Website */}
                <Skeleton className="h-8 w-20 rounded-lg" /> {/* Verify */}
                <Skeleton className="h-8 w-28 rounded-lg" /> {/* View Certificate */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
