import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function LayoutLoading() {
  return (
    <div className="flex h-screen">
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="bg-black border-white text-white hover:bg-gray-800"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Fixed Sidebar */}
      <div className="fixed md:relative hidden md:block w-64 flex-shrink-0 border-r bg-background h-screen z-50">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-[60px] items-center border-b px-4 flex-shrink-0">
            <div className="flex items-center gap-2 font-semibold">
              <Skeleton className="h-6 w-6" /> {/* Briefcase icon */}
              <Skeleton className="h-6 w-20" /> {/* Portfolio text */}
            </div>
          </div>

          {/* Profile Section */}
          <div className="border-b p-4 bg-gradient-to-br from-background to-muted/20 flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              {/* Avatar */}
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-24 mb-1" /> {/* Name */}
                <Skeleton className="h-3 w-20" /> {/* Role/Profession */}
              </div>
            </div>

            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-sm px-2 py-1.5">
                <Skeleton className="h-3 w-3" /> {/* Mail icon */}
                <Skeleton className="h-3 w-32" /> {/* Email text */}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-1">
                <Skeleton className="h-6 w-6 rounded-sm" /> {/* GitHub */}
                <Skeleton className="h-6 w-6 rounded-sm" /> {/* LinkedIn */}
                <Skeleton className="h-6 w-6 rounded-sm" /> {/* Facebook */}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-3 py-4 text-sm font-medium">
              {[...Array(7)].map((_, index) => (
                <div
                  key={index}
                  className="group my-0.5 flex items-center rounded-sm px-3 py-2 text-sm font-medium"
                >
                  <Skeleton className="mr-3 h-4 w-4" /> {/* Icon */}
                  <Skeleton className="h-4 w-24" /> {/* Navigation text */}
                </div>
              ))}
            </nav>
          </div>

          {/* Theme Toggle */}
          <div className="border-t p-2 flex-shrink-0">
            <Skeleton className="h-9 w-full rounded-sm" />
          </div>

          {/* Sign Out Button */}
          <div className="border-t p-3 flex-shrink-0">
            <Skeleton className="h-9 w-full rounded-sm" />
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center h-screen w-screen">
        <div className="spinner-5 relative animate-spin w-4 h-4 rounded-full bg-purple-500">
          <div className="absolute left-[-1.5rem] w-4 h-4 dark:bg-white bg-black rounded-full"></div>
          <div className="absolute right-[-1.5rem] w-4 h-4 dark:bg-white bg-black rounded-full"></div>
        </div>
      </div>
      
    </div>
  );
}
