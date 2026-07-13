import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8 pt-20 md:pt-6">
        {/* Header Section Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div>
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-6 w-80" />
            </div>
          </div>

          {/* Breadcrumb Skeleton */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Stats Overview Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="group border border-gray-800 bg-background">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-11 w-11 rounded-xl" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Status Overview Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="group border border-gray-800 bg-background">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-11 w-11 rounded-xl" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active/Inactive Projects Overview Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="group border border-gray-800 bg-background">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-11 w-11 rounded-xl" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-16 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid gap-8 lg:grid-cols-7">
          {/* Quick Actions Skeleton */}
          <Card className="lg:col-span-4 border border-gray-800 bg-background">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div>
                  <Skeleton className="h-7 w-32 mb-2" />
                  <Skeleton className="h-5 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="group border border-gray-800 bg-background">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-4 ml-auto" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Skeleton */}
          <Card className="lg:col-span-3 gap-0 border border-gray-800 bg-background">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1 max-h-76">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-md">
                    {/* Entity Icon Skeleton */}
                    <Skeleton className="h-8 w-8 rounded-md" />
                    
                    {/* Activity Info Skeleton */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 