import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { replaceFileInCloudinary } from "@/lib/cloudinary"


export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { password, ...userWithoutPassword } = user
    return NextResponse.json({ success: true, data: userWithoutPassword })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let imageUrl = currentUser.image
    const imageFile = formData.get("profileImage") as File | null
    
    if (imageFile && imageFile.size > 0) {
      try {
        const uploadResult = await replaceFileInCloudinary(
          imageFile, 
          currentUser.image || "", 
          { folder: "profile-images" }
        )
        imageUrl = uploadResult.url
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError)
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
      }
    }

    const getFormValue = (key: string): string | undefined => {
      const value = formData.get(key)
      return value === null ? undefined : value as string
    }

    const getRequiredValue = (key: string): string => {
      const value = formData.get(key)
      if (value === null || value === "") {
        throw new Error(`${key} is required`)
      }
      return value as string
    }

    const updateData: Partial<Pick<typeof currentUser, 
      | 'name' | 'bio' | 'location' | 'website' | 'github' | 'linkedin' | 'twitter' 
      | 'instagram' | 'youtube' | 'facebook' | 'stackoverflow' | 'joinDate' 
      | 'experience' | 'skills' | 'role' | 'achievements' | 'phone' | 'whatsapp'
      | 'profession' | 'industry' | 'company' | 'designation' | 'education'
      | 'university' | 'graduationYear' | 'dateOfBirth' | 'nationality' | 'languages'
      | 'behance' | 'dribbble' | 'medium' | 'devto' | 'hashnode' | 'substack'
      | 'portfolio' | 'blog' | 'resume' | 'availability' | 'remoteWork' | 'relocation'
      | 'updatedAt'
    >> & {
      image?: string
    } = {
      name: getRequiredValue("name"),
      bio: getFormValue("bio"),
      location: getFormValue("location"),
      website: getFormValue("website"),
      github: getFormValue("github"),
      linkedin: getFormValue("linkedin"),
      twitter: getFormValue("twitter"),
      instagram: getFormValue("instagram"),
      youtube: getFormValue("youtube"),
      facebook: getFormValue("facebook"),
      stackoverflow: getFormValue("stackoverflow"),
      joinDate: getFormValue("joinDate"),
      experience: getFormValue("experience"),
      skills: JSON.parse(getFormValue("skills") || "[]"),
      role: getFormValue("role"),
      achievements: JSON.parse(getFormValue("achievements") || "[]"),
      phone: getFormValue("phone"),
      whatsapp: getFormValue("whatsapp"),
      profession: getFormValue("profession"),
      industry: getFormValue("industry"),
      company: getFormValue("company"),
      designation: getFormValue("designation"),
      education: getFormValue("education"),
      university: getFormValue("university"),
      graduationYear: getFormValue("graduationYear"),
      dateOfBirth: getFormValue("dateOfBirth"),
      nationality: getFormValue("nationality"),
      languages: JSON.parse(getFormValue("languages") || "[]"),
      behance: getFormValue("behance"),
      dribbble: getFormValue("dribbble"),
      medium: getFormValue("medium"),
      devto: getFormValue("devto"),
      hashnode: getFormValue("hashnode"),
      substack: getFormValue("substack"),
      portfolio: getFormValue("portfolio"),
      blog: getFormValue("blog"),
      resume: getFormValue("resume"),
      availability: getFormValue("availability"),
      remoteWork: getFormValue("remoteWork") === "true",
      relocation: getFormValue("relocation") === "true",
      updatedAt: new Date(),
    }

    if (imageUrl !== currentUser.image) {
      updateData.image = imageUrl || undefined
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData
    })

    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      success: true, 
      message: "Profile updated successfully",
      data: userWithoutPassword 
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 