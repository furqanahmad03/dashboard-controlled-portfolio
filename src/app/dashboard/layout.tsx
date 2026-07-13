"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Briefcase,
  Award,
  User,
  Home,
  Mail,
  Github,
  Linkedin,
  Facebook,
  Building2,
  Workflow,
  FileText,
  LogOut,
  Menu,
  X,
  Users,
  MessageSquare,
  Database,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { User as UserType } from "@/interfaces/User";
import LayoutLoading from "./LayoutLoading";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Education",
    href: "/dashboard/education",
    icon: BookOpen,
  },
  {
    title: "Companies",
    href: "/dashboard/companies",
    icon: Building2,
  },
  {
    title: "Experience",
    href: "/dashboard/experience",
    icon: Workflow,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: Briefcase,
  },
  {
    title: "Blogs",
    href: "/dashboard/blog",
    icon: FileText,
  },
  {
    title: "Clients",
    href: "/dashboard/client",
    icon: Users,
  },
  {
    title: "Certifications",
    href: "/dashboard/certifications",
    icon: Award,
  },
  {
    title: "Queries",
    href: "/dashboard/queries",
    icon: MessageSquare,
  },
  {
    title: "Database",
    href: "/dashboard/database",
    icon: Database,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setUserProfile(result.data);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);


  const getUserInitials = (name: string) => {
    return (name || "")
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <AuthProvider>
        <ThemeProvider>
          <LayoutLoading />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="flex h-screen">
          {/* Mobile Toggle Button */}
          <div className="md:hidden fixed top-4 left-4 z-50">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              className="bg-black border-white text-white hover:bg-gray-800"
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeSidebar}
            />
          )}

          {/* Fixed Sidebar */}
          <div
            className={cn(
              "fixed md:relative w-64 flex-shrink-0 border-r bg-background h-screen z-50 transition-transform duration-300 ease-in-out",
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            )}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex h-[60px] items-center border-b px-4 flex-shrink-0">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <Briefcase className="h-6 w-6" />
                  <span className="text-lg">Portfolio</span>
                </Link>
                {/* Close button for mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeSidebar}
                  className="md:hidden ml-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Profile Section */}
              <div className="border-b p-4 bg-gradient-to-br from-background to-muted/20 flex-shrink-0">
                {userProfile ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage
                          src={userProfile.image}
                          alt={userProfile.name}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {getUserInitials(userProfile.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">
                          {userProfile.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {userProfile.role ||
                            userProfile.profession ||
                            "Professional"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {userProfile.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-sm px-2 py-1.5">
                          <Mail className="h-3 w-3" />
                          <span className="truncate font-medium">
                            {userProfile.email}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        {userProfile.github && (
                          <a
                            href={userProfile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105 transition-all duration-200"
                            title="GitHub"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {userProfile.linkedin && (
                          <a
                            href={userProfile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105 transition-all duration-200"
                            title="LinkedIn"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        {userProfile.facebook && (
                          <a
                            href={userProfile.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105 transition-all duration-200"
                            title="Facebook"
                          >
                            <Facebook className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Profile not available
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                <nav className="grid items-start px-3 py-4 text-sm font-medium">
                  {sidebarNavItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/dashboard"
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={closeSidebar}
                        className={cn(
                          "group my-0.5 flex items-center rounded-sm px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] transition-all duration-200",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "transparent"
                        )}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Theme Toggle */}
              <div className="border-t p-2 flex-shrink-0">
                <ThemeToggle />
              </div>

              {/* Sign Out Button */}
              <div className="border-t p-3 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-sm justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen">
            <main className="flex-1 overflow-y-auto bg-background">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}
