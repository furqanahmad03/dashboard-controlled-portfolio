import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [
      educationCount,
      projectCount,
      certificationCount,
      companyCount,
      positionCount,
      activeProjectCount,
      inactiveProjectCount,
      activityCount,
      recentActivities,
    ] = await Promise.all([
      prisma.education.count(),
      prisma.project.count(),
      prisma.certification.count(),
      prisma.company.count(),
      prisma.position.count(),
      prisma.project.count({ where: { isEnabled: true } }),
      prisma.project.count({ where: { isEnabled: false } }),
      prisma.activity.count({
        where: { userId: user.id },
      }),
      prisma.activity.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      }),
    ]);

    const projectStatusBreakdown = await prisma.project.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const dashboardData = {
      overview: {
        education: educationCount,
        projects: projectCount,
        certifications: certificationCount,
        companies: companyCount,
        positions: positionCount,
      },
      projectStatus: projectStatusBreakdown.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
      activeInactiveProjects: {
        active: activeProjectCount,
        inactive: inactiveProjectCount,
      },
      activityCount,
      recentActivities: recentActivities.map((activity) => ({
        id: activity.id,
        type: activity.type,
        entity: activity.entity,
        entityName: activity.entityName,
        description: activity.description,
        createdAt: activity.createdAt,
        user: activity.user,
      })),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
