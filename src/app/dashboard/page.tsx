"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import {
  BookOpen,
  Briefcase,
  Award,
  TrendingUp,
  User,
  Building,
  Users,
  ArrowRight,
  Activity,
  Target,
  Zap,
  Star,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  Eye,
  EyeOff
} from "lucide-react"
import Link from "next/link"
import DashboardLoading from "./loading"

interface DashboardData {
  overview: {
    education: number
    projects: number
    certifications: number
    companies: number
    positions: number
  }
  projectStatus: Record<string, number>
  activeInactiveProjects: {
    active: number
    inactive: number
  }
  activityCount: number
  recentActivities: Array<{
    id: string
    type: string
    entity: string
    entityName: string
    description: string
    createdAt: string
    user: {
      name: string
      image: string
    }
  }>
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Fetching dashboard data...")
        const response = await fetch("/api/dashboard", {
          credentials: 'include'
        })

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            notFound()
            return
          }
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch dashboard data")
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        notFound()
        return
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return <DashboardLoading />
  }

  if (!dashboardData) {
    return null
  }

  const getActivityIcon = (type: string, entity: string) => {
    switch (entity.toLowerCase()) {
      case "project":
        return <Briefcase className="h-4 w-4 text-blue-400" />
      case "education":
        return <BookOpen className="h-4 w-4 text-green-400" />
      case "certification":
        return <Award className="h-4 w-4 text-yellow-400" />
      case "company":
        return <Building className="h-4 w-4 text-purple-400" />
      case "experience":
        return <TrendingUp className="h-4 w-4 text-orange-400" />
      case "profile":
        return <User className="h-4 w-4 text-pink-400" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "Created":
        return "text-green-400"
      case "Updated":
        return "text-blue-400"
      case "Deleted":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`

    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8 pt-20 md:pt-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold dark:text-white text-black tracking-tight">
                Dashboard
              </h1>
              <p className="dark:text-gray-300 text-gray-700 text-lg">
                Welcome back! Here&apos;s what&apos;s happening with your portfolio.
              </p>
            </div>
          </div>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard" className="dark:text-gray-400 text-gray-700 hover:text-white">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-gray-600" />
              <BreadcrumbItem>
                <BreadcrumbPage className="dark:text-white text-black font-medium">Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold dark:text-white text-black">Education</CardTitle>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white text-black mb-2">
                {dashboardData?.overview.education || 0}
              </div>
              <p className="text-sm dark:text-gray-400 text-gray-700 font-medium">
                Educational institutions
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold dark:text-white text-black">Projects</CardTitle>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white text-black mb-2">
                {dashboardData?.overview.projects || 0}
              </div>
              <p className="text-sm dark:text-gray-400 text-gray-700 font-medium">
                Total projects
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold dark:text-white text-black">Certifications</CardTitle>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white text-black mb-2">
                {dashboardData?.overview.certifications || 0}
              </div>
              <p className="text-sm dark:text-gray-400 text-gray-700 font-medium">
                Professional certifications
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold dark:text-white text-black">Companies</CardTitle>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white text-black mb-2">
                {dashboardData?.overview.companies || 0}
              </div>
              <p className="text-sm dark:text-gray-400 text-gray-700 font-medium">
                Total companies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Project Status Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold dark:text-white text-black">Positions</CardTitle>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white text-black mb-2">
                {dashboardData?.overview.positions || 0}
              </div>
              <p className="text-sm dark:text-gray-400 text-gray-700 font-medium">
                Job positions
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold dark:text-white text-black">Completed</CardTitle>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white text-black mb-2">
                {dashboardData?.projectStatus.Completed || 0}
              </div>
              <p className="text-sm dark:text-gray-400 text-gray-700 font-medium">
                Successfully completed
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold dark:text-white text-black">In Progress</CardTitle>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <PlayCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white text-black mb-2">
                {dashboardData?.projectStatus.InProgress || 0}
              </div>
              <p className="text-sm dark:text-gray-400 text-gray-700 font-medium">
                Currently working on
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold dark:text-white text-black">On Hold</CardTitle>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <PauseCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white text-black mb-2">
                {dashboardData?.projectStatus.OnHold || 0}
              </div>
              <p className="text-sm dark:text-gray-400 text-gray-700 font-medium">
                Temporarily paused
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active/Inactive Projects Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold dark:text-white text-black">Active Projects</CardTitle>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white text-black mb-2">
                {dashboardData?.activeInactiveProjects.active || 0}
              </div>
              <p className="text-sm dark:text-gray-400 text-gray-700 font-medium">
                Currently visible to visitors
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold dark:text-white text-black">Inactive Projects</CardTitle>
              <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <EyeOff className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white text-black mb-2">
                {dashboardData?.activeInactiveProjects.inactive || 0}
              </div>
              <p className="text-sm dark:text-gray-400 text-gray-700 font-medium">
                Hidden from public view
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-7">
          {/* Quick Actions */}
          <Card className="lg:col-span-4 border border-gray-800 bg-background">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold dark:text-white text-black">Quick Actions</CardTitle>
                  <CardDescription className="dark:text-gray-400 text-gray-700 text-base">
                    Manage your portfolio content efficiently
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <Link href="/dashboard/education">
                  <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold dark:text-white text-black flex items-center gap-3 transition-colors">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                          <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        Add Education
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm dark:text-gray-400 text-gray-700 dark:group-hover:text-white group-hover:text-black transition-colors">
                        Add new educational background
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/projects">
                  <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold dark:text-white text-black flex items-center gap-3 transition-colors">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                          <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        Add Project
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm dark:text-gray-400 text-gray-700 dark:group-hover:text-white group-hover:text-black transition-colors">
                        Create new project entry
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/certifications">
                  <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold dark:text-white text-black flex items-center gap-3 transition-colors">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/50 transition-colors">
                          <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        Add Certification
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm dark:text-gray-400 text-gray-700 dark:group-hover:text-white group-hover:text-black transition-colors">
                        Add new certification
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/profile">
                  <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-800 bg-background">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold dark:text-white text-black flex items-center gap-3 transition-colors">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg group-hover:bg-pink-200 dark:group-hover:bg-pink-800/50 transition-colors">
                          <User className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        </div>
                        Edit Profile
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm dark:text-gray-400 text-gray-700 dark:group-hover:text-white group-hover:text-black transition-colors">
                        Update personal information
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-3 gap-0 border border-gray-800 bg-background">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold dark:text-white text-black">Recent Activity</CardTitle>
                  <CardDescription className="dark:text-gray-400 text-gray-700 text-sm">
                    Latest 10 updates
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1 max-h-76 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
                  dashboardData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-900/10 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group">
                      {/* Entity Icon */}
                      <div className="flex-shrink-0 p-1.5 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-md group-hover:bg-gray-700 transition-colors duration-300">
                        {getActivityIcon(activity.type, activity.entity)}
                      </div>

                      {/* Activity Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium dark:text-white text-black truncate">
                            {activity.entityName}
                          </span>
                          <span className={`text-xs font-medium ${getActivityColor(activity.type)}`}>
                            {activity.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatTimeAgo(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="p-2 bg-gray-800 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <Star className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400 font-medium">No recent activity</p>
                    <p className="text-xs text-gray-500">Start building your portfolio!</p>
                  </div>
                )}
              </div>

              {/* Show count indicator if more than 5 activities */}
              {dashboardData.activityCount && dashboardData.activityCount >= 10 && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-500 text-center">
                    Showing 10 of {dashboardData.activityCount} activities
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 