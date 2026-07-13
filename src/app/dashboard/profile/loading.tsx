import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header Section Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-80" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Hero Profile Section Skeleton */}
      <Card className="group overflow-hidden border-l-4 border-l-blue-500 bg-white dark:bg-[#0A0B0B] shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row w-full items-center">
            {/* Profile Avatar Section Skeleton */}
            <div className="md:w-32 flex items-center justify-center rounded-full">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>

            {/* Profile Details Skeleton */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-5 w-32 mb-3" />
                  <Skeleton className="h-4 w-96 mb-4" />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="group overflow-hidden border-l-4 border-l-gray-300 bg-white dark:bg-[#0A0B0B] shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-lg" />
                <div>
                  <Skeleton className="h-8 w-8 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Personal Information Card Skeleton */}
        <Card className="md:col-span-2 group border-l-4 border-l-indigo-500 bg-white dark:bg-[#0A0B0B] shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email and Website */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-3 p-4 rounded-sm border border-border">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center gap-3 p-4 rounded-sm border border-border">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
            
            {/* Skills Section */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <div className="flex flex-wrap gap-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-sm" />
                ))}
              </div>
            </div>

            {/* Achievements Section */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-40" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-sm border border-border">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Details Section */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-36" />
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <div className="p-3 bg-background rounded-sm border border-border">
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <div className="p-3 bg-background rounded-sm border border-border">
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-28" />
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <div className="p-3 bg-background rounded-sm border border-border">
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages Section */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-20" />
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-sm" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Card Skeleton */}
        <Card className="group border-l-4 border-l-green-500 bg-white dark:bg-[#0A0B0B] shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
