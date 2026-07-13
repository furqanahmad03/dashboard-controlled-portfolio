"use client";

import ProfileForm from "@/components/Dashboard/Profile/ProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User as UserType } from "@/interfaces/User";
import {
  Award,
  Briefcase,
  Building2,
  Calendar as CalendarIcon,
  Edit,
  Eye,
  EyeOff,
  Github,
  Globe,
  GraduationCap,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Star,
  Target,
  Twitter,
  User,
  Youtube
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import ProfileLoading from "./loading";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stats, setStats] = useState({
    skillsCount: 0,
    projectsCount: 0,
    certificationsCount: 0,
    companiesCount: 0,
    experiencesCount: 0,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    youtube: "",
    stackoverflow: "",
    joinDate: null as Date | null,
    experience: "",
    skills: [] as string[],
    role: "",
    achievements: [] as string[],
    phone: "",
    whatsapp: "",
    profession: "",
    industry: "",
    company: "",
    designation: "",
    education: "",
    university: "",
    graduationYear: "",
    dateOfBirth: null as Date | null,
    nationality: "",
    languages: [] as string[],
    behance: "",
    dribbble: "",
    medium: "",
    devto: "",
    hashnode: "",
    substack: "",
    portfolio: "",
    blog: "",
    resume: "",
    facebook: "",
    availability: "",
    remoteWork: false,
    relocation: false,
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/profile", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const result = await response.json();

      if (result.success && result.data) {
        const profileData = result.data;
        setProfile(profileData);

        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          image: profileData.image || "",
          bio: profileData.bio || "",
          location: profileData.location || "",
          website: profileData.website || "",
          github: profileData.github || "",
          linkedin: profileData.linkedin || "",
          twitter: profileData.twitter || "",
          instagram: profileData.instagram || "",
          youtube: profileData.youtube || "",
          stackoverflow: profileData.stackoverflow || "",
          joinDate: profileData.joinDate
            ? new Date(profileData.joinDate)
            : null,
          experience: profileData.experience || "",
          skills: profileData.skills || [],
          role: profileData.role || "",
          achievements: profileData.achievements || [],
          phone: profileData.phone || "",
          whatsapp: profileData.whatsapp || "",
          profession: profileData.profession || "",
          industry: profileData.industry || "",
          company: profileData.company || "",
          designation: profileData.designation || "",
          education: profileData.education || "",
          university: profileData.university || "",
          graduationYear: profileData.graduationYear || "",
          dateOfBirth: profileData.dateOfBirth
            ? new Date(profileData.dateOfBirth)
            : null,
          nationality: profileData.nationality || "",
          languages: profileData.languages || [],
          behance: profileData.behance || "",
          dribbble: profileData.dribbble || "",
          medium: profileData.medium || "",
          devto: profileData.devto || "",
          hashnode: profileData.hashnode || "",
          substack: profileData.substack || "",
          portfolio: profileData.portfolio || "",
          blog: profileData.blog || "",
          resume: profileData.resume || "",
          facebook: profileData.facebook || "",
          availability: profileData.availability || "",
          remoteWork: profileData.remoteWork || false,
          relocation: profileData.relocation || false,
        });

        loadStats(profileData);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile. Please try again.");
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (profileImageFile) {
      const url = URL.createObjectURL(profileImageFile);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [profileImageFile]);

  useEffect(() => {
    if (formData.skills) {
      setStats((prevStats) => ({
        ...prevStats,
        skillsCount: formData.skills.length,
      }));
    }
  }, [formData.skills]);

  const loadStats = async (profileData?: UserType) => {
    try {
      const currentProfile = profileData || profile;

      const [
        projectsResponse,
        certificationsResponse,
        companiesResponse,
        experiencesResponse,
      ] = await Promise.all([
        fetch("/api/projects", { credentials: "include" }),
        fetch("/api/certifications", { credentials: "include" }),
        fetch("/api/companies", { credentials: "include" }),
        fetch("/api/experience", { credentials: "include" }),
      ]);

      const [projectsData, certificationsData, companiesData, experiencesData] =
        await Promise.all([
          projectsResponse.ok
            ? projectsResponse.json()
            : Promise.resolve({ data: [] }),
          certificationsResponse.ok
            ? certificationsResponse.json()
            : Promise.resolve({ data: [] }),
          companiesResponse.ok
            ? companiesResponse.json()
            : Promise.resolve({ data: [] }),
          experiencesResponse.ok
            ? experiencesResponse.json()
            : Promise.resolve({ data: [] }),
        ]);

      setStats({
        skillsCount: currentProfile?.skills?.length || 0,
        projectsCount: projectsData.data?.length || 0,
        certificationsCount: certificationsData.data?.length || 0,
        companiesCount: companiesData.data?.length || 0,
        experiencesCount: experiencesData.data?.length || 0,
      });
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("website", formData.website);

      formDataToSend.append("github", formData.github);
      formDataToSend.append("linkedin", formData.linkedin);
      formDataToSend.append("twitter", formData.twitter);
      formDataToSend.append("instagram", formData.instagram);
      formDataToSend.append("youtube", formData.youtube);
      formDataToSend.append("facebook", formData.facebook);
      formDataToSend.append("stackoverflow", formData.stackoverflow);

      formDataToSend.append(
        "joinDate",
        formData.joinDate ? formData.joinDate.toISOString() : ""
      );
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("skills", JSON.stringify(formData.skills));
      formDataToSend.append("role", formData.role);
      formDataToSend.append(
        "achievements",
        JSON.stringify(formData.achievements)
      );

      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("whatsapp", formData.whatsapp);

      formDataToSend.append("profession", formData.profession);
      formDataToSend.append("industry", formData.industry);
      formDataToSend.append("company", formData.company);
      formDataToSend.append("designation", formData.designation);

      formDataToSend.append("education", formData.education);
      formDataToSend.append("university", formData.university);
      formDataToSend.append("graduationYear", formData.graduationYear);

      formDataToSend.append(
        "dateOfBirth",
        formData.dateOfBirth ? formData.dateOfBirth.toISOString() : ""
      );
      formDataToSend.append("nationality", formData.nationality);
      formDataToSend.append("languages", JSON.stringify(formData.languages));

      formDataToSend.append("behance", formData.behance);
      formDataToSend.append("dribbble", formData.dribbble);
      formDataToSend.append("medium", formData.medium);
      formDataToSend.append("devto", formData.devto);
      formDataToSend.append("hashnode", formData.hashnode);
      formDataToSend.append("substack", formData.substack);

      formDataToSend.append("portfolio", formData.portfolio);
      formDataToSend.append("blog", formData.blog);
      formDataToSend.append("resume", formData.resume);

      formDataToSend.append("availability", formData.availability);
      formDataToSend.append("remoteWork", formData.remoteWork.toString());
      formDataToSend.append("relocation", formData.relocation.toString());

      if (profileImageFile) {
        formDataToSend.append("profileImage", profileImageFile);
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        body: formDataToSend,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update profile");
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Profile updated successfully!");
        setIsSheetOpen(false);
        loadProfile();
        if (profile) {
          loadStats(profile);
        }
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const allRequirementsMet = Object.values(passwordValidation).every(Boolean);

    if (!allRequirementsMet) {
      toast.error("Please ensure all password requirements are met!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Password updated successfully!");
        setIsPasswordDialogOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswords({ current: false, new: false, confirm: false });
        setPasswordValidation({
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
          match: false,
        });
      } else {
        throw new Error(result.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return (name || "")
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const validatePassword = (password: string, confirmPassword: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
      match: password === confirmPassword && password.length > 0,
    });
  };

  const handleLanguageChange = (index: number, value: string) => {
    const newLanguages = [...formData.languages];
    newLanguages[index] = value;
    setFormData({ ...formData, languages: newLanguages });
  };

  const addLanguage = () => {
    setFormData({ ...formData, languages: [...formData.languages, ""] });
  };

  const removeLanguage = (index: number) => {
    const newLanguages = formData.languages.filter((_, i) => i !== index);
    setFormData({ ...formData, languages: newLanguages });
  };

  const handleSkillInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newSkill = e.currentTarget.value.trim();
      if (!formData.skills.includes(newSkill)) {
        setFormData({ ...formData, skills: [...formData.skills, newSkill] });
        e.currentTarget.value = "";
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleAchievementInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newAchievement = e.currentTarget.value.trim();
      if (!formData.achievements.includes(newAchievement)) {
        setFormData({
          ...formData,
          achievements: [...formData.achievements, newAchievement],
        });
        e.currentTarget.value = "";
      }
    }
  };

  const removeAchievement = (achievementToRemove: string) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter(
        (achievement) => achievement !== achievementToRemove
      ),
    });
  };

  const resetForm = () => {
    setProfileImageFile(null);
    setPreviewUrl(null);
    setFormData({
      name: "",
      email: "",
      image: "",
      bio: "",
      location: "",
      website: "",
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
      youtube: "",
      stackoverflow: "",
      joinDate: null as Date | null,
      experience: "",
      skills: [],
      role: "",
      achievements: [],
      phone: "",
      whatsapp: "",
      profession: "",
      industry: "",
      company: "",
      designation: "",
      education: "",
      university: "",
      graduationYear: "",
      dateOfBirth: null as Date | null,
      nationality: "",
      languages: [],
      behance: "",
      dribbble: "",
      medium: "",
      devto: "",
      hashnode: "",
      substack: "",
      portfolio: "",
      blog: "",
      resume: "",
      facebook: "",
      availability: "",
      remoteWork: false,
      relocation: false,
    });
  };

  if (!profile) {
    return <ProfileLoading />;
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight dark:text-white text-gray-900">
            Profile
          </h2>
          <p className="dark:text-gray-300 text-gray-900 text-lg">
            Manage your personal information and digital identity
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsPasswordDialogOpen(true)}
            variant="outline"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 h-12 px-6"
          >
            <Lock className="mr-2 h-5 w-5" />
            Change Password
          </Button>
          <Sheet
            open={isSheetOpen}
            onOpenChange={(open) => {
              if (!open) {
                resetForm();
              }
              setIsSheetOpen(open);
            }}
          >
            <SheetTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();

                  if (profile) {
                    setProfileImageFile(null);
                    setFormData({
                      name: profile.name || "",
                      email: profile.email || "",
                      image: profile.image || "",
                      bio: profile.bio || "",
                      location: profile.location || "",
                      website: profile.website || "",
                      github: profile.github || "",
                      linkedin: profile.linkedin || "",
                      twitter: profile.twitter || "",
                      instagram: profile.instagram || "",
                      youtube: profile.youtube || "",
                      stackoverflow: profile.stackoverflow || "",
                      joinDate: profile.joinDate
                        ? new Date(profile.joinDate)
                        : null,
                      experience: profile.experience || "",
                      skills: profile.skills || [],
                      role: profile.role || "",
                      achievements: profile.achievements || [],
                      phone: profile.phone || "",
                      whatsapp: profile.whatsapp || "",
                      profession: profile.profession || "",
                      industry: profile.industry || "",
                      company: profile.company || "",
                      designation: profile.designation || "",
                      education: profile.education || "",
                      university: profile.university || "",
                      graduationYear: profile.graduationYear || "",
                      dateOfBirth: profile.dateOfBirth
                        ? new Date(profile.dateOfBirth)
                        : null,
                      nationality: profile.nationality || "",
                      languages: profile.languages || [],
                      behance: profile.behance || "",
                      dribbble: profile.dribbble || "",
                      medium: profile.medium || "",
                      devto: profile.devto || "",
                      hashnode: profile.hashnode || "",
                      substack: profile.substack || "",
                      portfolio: profile.portfolio || "",
                      blog: profile.blog || "",
                      resume: profile.resume || "",
                      facebook: profile.facebook || "",
                      availability: profile.availability || "",
                      remoteWork: profile.remoteWork || false,
                      relocation: profile.relocation || false,
                    });
                  }
                  loadStats();
                  setIsSheetOpen(true);
                }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 transform hover:scale-105 h-12 px-6"
              >
                <Edit className="mr-2 h-5 w-5" />
                Edit Profile
              </Button>
            </SheetTrigger>

            <SheetContent className="w-full max-w-7xl md:max-w-5xl lg:max-w-4xl py-4 px-6 overflow-y-auto bg-background border-border">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-foreground">
                  Edit Profile
                </SheetTitle>
                <SheetDescription className="text-base text-muted-foreground">
                  Update your personal information and social media links.
                </SheetDescription>
              </SheetHeader>
              <ProfileForm
                profile={profile}
                formData={formData}
                setFormData={setFormData}
                profileImageFile={profileImageFile}
                setProfileImageFile={setProfileImageFile}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                isSubmitting={isSubmitting}
                setIsSheetOpen={setIsSheetOpen}
                handleSubmit={handleSubmit}
                handleSkillInput={handleSkillInput}
                removeSkill={removeSkill}
                handleAchievementInput={handleAchievementInput}
                removeAchievement={removeAchievement}
                handleLanguageChange={handleLanguageChange}
                addLanguage={addLanguage}
                removeLanguage={removeLanguage}
                getInitials={getInitials}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink
              href="/dashboard"
              className="dark:text-gray-300 text-gray-900 hover:dark:text-white hover:text-gray-700"
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block text-gray-600" />
          <BreadcrumbItem>
            <BreadcrumbPage className="dark:text-white text-gray-900">
              Profile
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Profile Section */}
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 bg-white dark:bg-[#0A0B0B] shadow-md hover:shadow-2xl hover:border-l-blue-400">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row w-full items-center">
            {/* Profile Avatar Section */}
            <div className="md:w-32 flex items-center justify-center rounded-full">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={previewUrl || profile?.image}
                  alt={profile?.name || ""}
                />
                <AvatarFallback className="text-2xl font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {getInitials(profile?.name || "")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Details */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {profile.name || "My Name"}
                  </h3>
                  {profile.role && (
                    <p className="text-base text-blue-600 dark:text-blue-400 font-semibold line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                      {profile.role}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    {profile.bio ||
                      "Tell us about yourself, your passion, and what drives you..."}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-3">
                    {profile.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.joinDate && (
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                          Joined{" "}
                          {new Date(profile.joinDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                    {profile.experience && (
                      <div className="flex items-center space-x-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{profile.experience} experience</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500 bg-white dark:bg-[#0A0B0B] shadow-md hover:shadow-2xl hover:border-l-green-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.skillsCount}
                </p>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Skills
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 bg-white dark:bg-[#0A0B0B] shadow-md hover:shadow-2xl hover:border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.projectsCount}
                </p>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Projects
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500 bg-white dark:bg-[#0A0B0B] shadow-md hover:shadow-2xl hover:border-l-purple-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.certificationsCount}
                </p>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Certifications
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500 bg-white dark:bg-[#0A0B0B] shadow-md hover:shadow-2xl hover:border-l-orange-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.companiesCount}
                </p>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Companies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500 bg-white dark:bg-[#0A0B0B] shadow-md hover:shadow-2xl hover:border-l-red-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Briefcase className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.experiencesCount}
                </p>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Experiences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Personal Information Card */}
        <Card className="md:col-span-2 group hover:shadow-xl transition-all duration-300 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0A0B0B] shadow-md hover:shadow-2xl hover:border-l-indigo-400">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              Personal Information
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
              Your professional details and expertise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Email Address
                </Label>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 p-4 rounded-sm border border-border"
                >
                  <div className="p-2 bg-muted/80 rounded-lg border border-border">
                    <Mail className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {profile.email || "myemail@example.com"}
                  </span>
                </a>
              </div>

              {(profile.website || formData.website) && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Personal Website
                  </Label>
                  <div className="flex items-center gap-3 p-4 rounded-sm border border-border">
                    <div className="p-2 bg-muted/80 rounded-lg border border-border">
                      <Globe className="h-4 w-4 text-foreground" />
                    </div>
                    <a
                      href={profile.website || formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors duration-200"
                    >
                      {profile.website || formData.website}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {(profile.skills && profile.skills.length > 0) ||
            (formData.skills && formData.skills.length > 0) ? (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Skills & Technologies
                </Label>
                <div className="flex flex-wrap gap-3">
                  {(formData.skills.length > 0
                    ? formData.skills
                    : profile.skills || []
                  ).map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-base flex items-center gap-1 group bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 rounded-sm px-3 py-1.5"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Skills & Technologies
                </Label>
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    No skills added yet.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Add your skills and technologies
                  </p>
                </div>
              </div>
            )}

            {(profile.achievements && profile.achievements.length > 0) ||
            (formData.achievements && formData.achievements.length > 0) ? (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Achievements & Recognition
                </Label>
                <div className="space-y-3">
                  {(formData.achievements.length > 0
                    ? formData.achievements
                    : profile.achievements || []
                  ).map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-background rounded-sm border border-border"
                    >
                      <div className="p-2 bg-muted/80 rounded-lg border border-border">
                        <Star className="h-4 w-4 text-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {achievement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Achievements & Recognition
                </Label>
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    No achievements added yet.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Add your achievements and recognition
                  </p>
                </div>
              </div>
            )}

            {/* Additional Professional Information */}
            {profile.profession ||
            profile.industry ||
            profile.company ||
            profile.designation ||
            formData.profession ||
            formData.industry ||
            formData.company ||
            formData.designation ? (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Professional Details
                </Label>
                <div className="grid gap-4 md:grid-cols-2">
                  {(profile.profession || formData.profession) && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-muted-foreground">
                        Profession
                      </Label>
                      <div className="p-3 bg-background rounded-sm border border-border">
                        <span className="text-sm font-medium text-foreground">
                          {formData.profession || profile.profession}
                        </span>
                      </div>
                    </div>
                  )}
                  {(profile.industry || formData.industry) && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-muted-foreground">
                        Industry
                      </Label>
                      <div className="p-3 bg-background rounded-sm border border-border">
                        <span className="text-sm font-medium text-foreground">
                          {formData.industry || profile.industry}
                        </span>
                      </div>
                    </div>
                  )}
                  {(profile.company || formData.company) && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-muted-foreground">
                        Company
                      </Label>
                      <div className="p-3 bg-background rounded-sm border border-border">
                        <span className="text-sm font-medium text-foreground">
                          {formData.company || profile.company}
                        </span>
                      </div>
                    </div>
                  )}
                  {(profile.designation || formData.designation) && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-muted-foreground">
                        Designation
                      </Label>
                      <div className="p-3 bg-background rounded-sm border border-border">
                        <span className="text-sm font-medium text-foreground">
                          {formData.designation || profile.designation}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Professional Details
                </Label>
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    No professional details added yet.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Add your profession, industry, company, and designation
                  </p>
                </div>
              </div>
            )}

            {/* Education Information */}
            {profile.education ||
            profile.university ||
            profile.graduationYear ||
            formData.education ||
            formData.university ||
            formData.graduationYear ? (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Education
                </Label>
                <div className="grid gap-4 md:grid-cols-2">
                  {(profile.education || formData.education) && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-muted-foreground">
                        Education Level
                      </Label>
                      <div className="p-3 bg-background rounded-sm border border-border">
                        <span className="text-sm font-medium text-foreground">
                          {formData.education || profile.education}
                        </span>
                      </div>
                    </div>
                  )}
                  {(profile.university || formData.university) && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-muted-foreground">
                        University/Institution
                      </Label>
                      <div className="p-3 bg-background rounded-sm border border-border">
                        <span className="text-sm font-medium text-foreground">
                          {formData.university || profile.university}
                        </span>
                      </div>
                    </div>
                  )}
                  {(profile.graduationYear || formData.graduationYear) && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-muted-foreground">
                        Graduation Year
                      </Label>
                      <div className="p-3 bg-background rounded-sm border border-border">
                        <span className="text-sm font-medium text-foreground">
                          {formData.graduationYear || profile.graduationYear}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Education
                </Label>
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    No education details added yet.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Add your education level, university, and graduation year
                  </p>
                </div>
              </div>
            )}

            {/* Personal Details */}
            {profile.dateOfBirth ||
            profile.nationality ||
            formData.dateOfBirth ||
            formData.nationality ? (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Personal Details
                </Label>
                <div className="grid gap-4 md:grid-cols-2">
                  {(profile.dateOfBirth || formData.dateOfBirth) && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-muted-foreground">
                        Date of Birth
                      </Label>
                      <div className="p-3 bg-background rounded-sm border border-border">
                        <span className="text-sm font-medium text-foreground">
                          {(() => {
                            const date =
                              formData.dateOfBirth || profile.dateOfBirth;
                            if (date instanceof Date) {
                              return date.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              });
                            }
                            return date || "Not specified";
                          })()}
                        </span>
                      </div>
                    </div>
                  )}
                  {(profile.nationality || formData.nationality) && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-muted-foreground">
                        Nationality
                      </Label>
                      <div className="p-3 bg-background rounded-sm border border-border">
                        <span className="text-sm font-medium text-foreground">
                          {formData.nationality || profile.nationality}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Personal Details
                </Label>
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    No personal details added yet.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Add your date of birth and nationality
                  </p>
                </div>
              </div>
            )}

            {/* Languages */}
            {(profile.languages && profile.languages.length > 0) ||
            (formData.languages && formData.languages.length > 0) ? (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Languages
                </Label>
                <div className="flex flex-wrap gap-2">
                  {(formData.languages.length > 0
                    ? formData.languages
                    : profile.languages || []
                  ).map((language, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-base flex items-center gap-1 group bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 rounded-sm px-3 py-1.5"
                    >
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Languages
                </Label>
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    No languages added yet.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Add the languages you speak
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Media Card */}
        <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500 bg-white dark:bg-[#0A0B0B] shadow-md hover:shadow-2xl hover:border-l-green-400">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              Social Media
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
              Connect with me across platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Github className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub
                </span>
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Linkedin className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  LinkedIn
                </span>
              </a>
            )}

            {profile.twitter && (
              <a
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Twitter className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Twitter
                </span>
              </a>
            )}

            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Instagram className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Instagram
                </span>
              </a>
            )}

            {profile.youtube && (
              <a
                href={profile.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Youtube className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  YouTube
                </span>
              </a>
            )}

            {profile.facebook && (
              <a
                href={profile.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="h-4 w-4 text-gray-700 dark:text-gray-300 font-bold text-center leading-4">
                    f
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Facebook
                </span>
              </a>
            )}

            {profile.behance && (
              <a
                href={profile.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="h-4 w-4 text-gray-700 dark:text-gray-300 font-bold text-center leading-4">
                    B
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Behance
                </span>
              </a>
            )}

            {profile.dribbble && (
              <a
                href={profile.dribbble}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="h-4 w-4 text-gray-700 dark:text-gray-300 font-bold text-center leading-4">
                    D
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dribbble
                </span>
              </a>
            )}

            {profile.medium && (
              <a
                href={profile.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="h-4 w-4 text-gray-700 dark:text-gray-300 font-bold text-center leading-4">
                    M
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Medium
                </span>
              </a>
            )}

            {profile.devto && (
              <a
                href={profile.devto}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="h-4 w-4 text-gray-700 dark:text-gray-300 font-bold text-center leading-4">
                    D
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dev.to
                </span>
              </a>
            )}

            {profile.hashnode && (
              <a
                href={profile.hashnode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="h-4 w-4 text-gray-700 dark:text-gray-300 font-bold text-center leading-4">
                    H
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hashnode
                </span>
              </a>
            )}

            {profile.substack && (
              <a
                href={profile.substack}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="h-4 w-4 text-gray-700 dark:text-gray-300 font-bold text-center leading-4">
                    S
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Substack
                </span>
              </a>
            )}

            {profile.portfolio && (
              <a
                href={profile.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="h-4 w-4 text-gray-700 dark:text-gray-300 font-bold text-center leading-4">
                    P
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Portfolio
                </span>
              </a>
            )}

            {profile.blog && (
              <a
                href={profile.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="h-4 w-4 text-gray-700 dark:text-gray-300 font-bold text-center leading-4">
                    B
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Blog
                </span>
              </a>
            )}

            {profile.resume && (
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="h-4 w-4 text-gray-700 dark:text-gray-300 font-bold text-center leading-4">
                    R
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Resume
                </span>
              </a>
            )}

            {profile.stackoverflow && (
              <a
                href={profile.stackoverflow}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="h-4 w-4 text-gray-700 dark:text-gray-300 font-bold text-center leading-4">
                    S
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stack Overflow
                </span>
              </a>
            )}

            {!profile.github &&
              !profile.linkedin &&
              !profile.twitter &&
              !profile.instagram &&
              !profile.youtube &&
              !profile.facebook &&
              !profile.stackoverflow &&
              !profile.behance &&
              !profile.dribbble &&
              !profile.medium &&
              !profile.devto &&
              !profile.hashnode &&
              !profile.substack &&
              !profile.portfolio &&
              !profile.blog &&
              !profile.resume && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    No social media links added yet.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Add your profiles to connect with others
                  </p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Password Change Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Lock className="h-6 w-6" />
              Change Password
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base">
              Update your account password securely.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePasswordChange} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-sm font-semibold text-foreground"
              >
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                  className="pr-10 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-semibold text-foreground"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    });
                    validatePassword(
                      e.target.value,
                      passwordData.confirmPassword
                    );
                  }}
                  required
                  className="pr-10 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-foreground"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    });
                    validatePassword(passwordData.newPassword, e.target.value);
                  }}
                  required
                  className="pr-10 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <div className="text-xs space-y-2">
                <p className="font-semibold text-foreground mb-2">
                  Password Requirements:
                </p>
                <div className="space-y-1">
                  <div
                    className={`flex items-center gap-2 ${
                      passwordValidation.length
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        passwordValidation.length
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    ></div>
                    <span>At least 8 characters long</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      passwordValidation.uppercase
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        passwordValidation.uppercase
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    ></div>
                    <span>Include uppercase letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      passwordValidation.lowercase
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        passwordValidation.lowercase
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    ></div>
                    <span>Include lowercase letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      passwordValidation.number
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        passwordValidation.number
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    ></div>
                    <span>Include number</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      passwordValidation.special
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        passwordValidation.special
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    ></div>
                    <span>Include special character (@$!%*?&)</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      passwordValidation.match
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        passwordValidation.match
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    ></div>
                    <span>Passwords match</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsPasswordDialogOpen(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setShowPasswords({
                    current: false,
                    new: false,
                    confirm: false,
                  });
                  setPasswordValidation({
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    number: false,
                    special: false,
                    match: false,
                  });
                }}
                className="h-12 px-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !Object.values(passwordValidation).every(Boolean)
                }
                className="h-12 px-6 bg-foreground hover:bg-foreground/90 text-background border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
