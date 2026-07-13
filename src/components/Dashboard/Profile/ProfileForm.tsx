import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Briefcase, Building2, Edit, MapPin, X, ChevronDown } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/interfaces/User";

interface ProfileFormData {
  name: string;
  email: string;
  image: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube: string;
  stackoverflow: string;
  joinDate: Date | null;
  experience: string;
  skills: string[];
  role: string;
  achievements: string[];
  phone: string;
  whatsapp: string;
  profession: string;
  industry: string;
  company: string;
  designation: string;
  education: string;
  university: string;
  graduationYear: string;
  dateOfBirth: Date | null;
  nationality: string;
  languages: string[];
  behance: string;
  dribbble: string;
  medium: string;
  devto: string;
  hashnode: string;
  substack: string;
  portfolio: string;
  blog: string;
  resume: string;
  facebook: string;
  availability: string;
  remoteWork: boolean;
  relocation: boolean;
}

interface ProfileFormProps {
  profile: User;
  formData: ProfileFormData;
  setFormData: (data: ProfileFormData) => void;
  profileImageFile: File | null;
  setProfileImageFile: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  isSubmitting: boolean;
  setIsSheetOpen: (open: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleSkillInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeSkill: (skill: string) => void;
  handleAchievementInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeAchievement: (achievement: string) => void;
  handleLanguageChange: (index: number, value: string) => void;
  addLanguage: () => void;
  removeLanguage: (index: number) => void;
  getInitials: (name: string) => string;
}

const ProfileForm = ({
  profile,
  formData,
  setFormData,
  profileImageFile,
  setProfileImageFile,
  previewUrl,
  setPreviewUrl,
  isSubmitting,
  setIsSheetOpen,
  handleSubmit,
  handleSkillInput,
  removeSkill,
  handleAchievementInput,
  removeAchievement,
  handleLanguageChange,
  addLanguage,
  removeLanguage,
  getInitials
}: ProfileFormProps) => {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Basic Information
          </h3>

          {/* Profile Image Upload */}
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <div className="relative group flex-shrink-0">
              <Avatar className="h-24 w-24 border-4 border-border rounded-full shadow-lg">
                <AvatarImage
                  src={previewUrl || formData.image || profile?.image}
                  alt="Profile"
                />
                <AvatarFallback className="text-2xl font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {getInitials(formData.name || profile?.name || "")}
                </AvatarFallback>
              </Avatar>

              {/* Upload Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    document.getElementById("profileImageFile")?.click()
                  }
                  className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              {/* Remove Image Button */}
              {formData.image && formData.image !== profile?.image && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={() => {
                    setFormData({ ...formData, image: profile?.image || "" });
                    setProfileImageFile(null);
                    setPreviewUrl(null);

                    const fileInput = document.getElementById(
                      "profileImageFile"
                    ) as HTMLInputElement;
                    if (fileInput) {
                      fileInput.value = "";
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Professional Account Info */}
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Professional Account
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">
                      {formData.name || profile.name || "My Name"}
                    </span>
                    {formData.role && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
                      >
                        {formData.role}
                      </Badge>
                    )}
                  </div>
                  {(formData.company || profile.company) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{formData.company || profile.company}</span>
                      {(formData.designation || profile.designation) && (
                        <>
                          <span>•</span>
                          <span>
                            {formData.designation || profile.designation}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  {(formData.location || profile.location) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{formData.location || profile.location}</span>
                    </div>
                  )}
                  {(formData.experience || profile.experience) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>
                        {formData.experience || profile.experience} experience
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            id="profileImageFile"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setProfileImageFile(file);

                const url = URL.createObjectURL(file);
                setPreviewUrl(url);

                const reader = new FileReader();
                reader.onload = (event) => {
                  setFormData({
                    ...formData,
                    image: event.target?.result as string,
                  });
                };
                reader.readAsDataURL(file);
              }
            }}
            key={profileImageFile ? "has-file" : "no-file"}
          />

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {formData.image
                ? "Click the X button to remove the new image"
                : "Hover over the image and click the pencil icon to upload a new profile picture"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-foreground"
              >
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Enter your full name"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-foreground"
              >
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                required
                placeholder="your.email@example.com"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="bio"
              className="text-sm font-semibold text-foreground"
            >
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell us about yourself, your passion, and what drives you..."
              rows={4}
              className="min-h-[48px] border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-semibold text-foreground"
              >
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., Lahore, Pakistan"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="website"
                className="text-sm font-semibold text-foreground"
              >
                Personal Website
              </Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://yourwebsite.com"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Professional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="profession"
                className="text-sm font-semibold text-foreground"
              >
                Profession
              </Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) =>
                  setFormData({ ...formData, profession: e.target.value })
                }
                placeholder="e.g., Software Developer"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="industry"
                className="text-sm font-semibold text-foreground"
              >
                Industry
              </Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                placeholder="e.g., Technology"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="company"
                className="text-sm font-semibold text-foreground"
              >
                Current Company
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="e.g., TechCorp Inc."
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="designation"
                className="text-sm font-semibold text-foreground"
              >
                Current Designation
              </Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                placeholder="e.g., Senior Developer"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="experience"
                className="text-sm font-semibold text-foreground"
              >
                Years of Experience
              </Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                placeholder="e.g., 5+ years"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="text-sm font-semibold text-foreground"
              >
                Professional Role
              </Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="e.g., Senior Full-Stack Developer"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="skills"
              className="text-sm font-semibold text-foreground"
            >
              Skills
            </Label>
            <Input
              id="skills"
              placeholder="Type a skill and press Enter to add"
              onKeyDown={handleSkillInput}
              className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
            />
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="achievements"
              className="text-sm font-semibold text-foreground"
            >
              Achievements
            </Label>
            <Input
              id="achievements"
              placeholder="Type an achievement and press Enter to add"
              onKeyDown={handleAchievementInput}
              className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
            />
            {formData.achievements.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.achievements.map((achievement, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {achievement}
                    <button
                      type="button"
                      onClick={() => removeAchievement(achievement)}
                      className="hover:bg-green-200 dark:hover:bg-green-800/50 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Education Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Education Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="education"
                className="text-sm font-semibold text-foreground"
              >
                Education Level
              </Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) =>
                  setFormData({ ...formData, education: e.target.value })
                }
                placeholder="e.g., Bachelor's Degree"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="university"
                className="text-sm font-semibold text-foreground"
              >
                University/Institution
              </Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) =>
                  setFormData({ ...formData, university: e.target.value })
                }
                placeholder="e.g., University of Technology"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="graduationYear"
                className="text-sm font-semibold text-foreground"
              >
                Graduation Year
              </Label>
              <Input
                id="graduationYear"
                value={formData.graduationYear}
                onChange={(e) =>
                  setFormData({ ...formData, graduationYear: e.target.value })
                }
                placeholder="e.g., 2019"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="joinDate"
                className="text-sm font-semibold text-foreground"
              >
                Platform Join Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-between font-normal text-sm bg-background border-2 border-border text-foreground hover:bg-muted"
                  >
                    <span className="truncate">
                      {formData.joinDate
                        ? formData.joinDate instanceof Date
                          ? formData.joinDate.toLocaleDateString()
                          : new Date(formData.joinDate).toLocaleDateString()
                        : "Select join date"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-background border-border text-foreground"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={
                      formData.joinDate instanceof Date
                        ? formData.joinDate
                        : formData.joinDate
                        ? new Date(formData.joinDate)
                        : undefined
                    }
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setFormData({ ...formData, joinDate: date || null });
                    }}
                    className="bg-background border-border text-foreground"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="dateOfBirth"
                className="text-sm font-semibold text-foreground"
              >
                Date of Birth
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-between font-normal text-sm bg-background border-2 border-border text-foreground hover:bg-muted"
                  >
                    <span className="truncate">
                      {formData.dateOfBirth
                        ? formData.dateOfBirth instanceof Date
                          ? formData.dateOfBirth.toLocaleDateString()
                          : new Date(formData.dateOfBirth).toLocaleDateString()
                        : "Select date of birth"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-background border-border text-foreground"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={
                      formData.dateOfBirth instanceof Date
                        ? formData.dateOfBirth
                        : formData.dateOfBirth
                        ? new Date(formData.dateOfBirth)
                        : undefined
                    }
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setFormData({ ...formData, dateOfBirth: date || null });
                    }}
                    className="bg-background border-border text-foreground"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="nationality"
                className="text-sm font-semibold text-foreground"
              >
                Nationality
              </Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) =>
                  setFormData({ ...formData, nationality: e.target.value })
                }
                placeholder="e.g., Pakistani"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Languages
            </Label>
            <div className="space-y-2">
              {formData.languages.map((language, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={language}
                    onChange={(e) =>
                      handleLanguageChange(index, e.target.value)
                    }
                    placeholder="Language"
                    className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLanguage(index)}
                    className="px-3 h-12 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addLanguage}
                className="w-full h-12 border-dashed border-2 border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              >
                + Add Language
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-semibold text-foreground"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="e.g., +92 300 1234567"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="whatsapp"
                className="text-sm font-semibold text-foreground"
              >
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
                placeholder="e.g., +92 300 1234567"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* Professional Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Professional Preferences
          </h3>

          <div className="space-y-2">
            <Label
              htmlFor="availability"
              className="text-sm font-semibold text-foreground"
            >
              Availability Status
            </Label>
            <Input
              id="availability"
              value={formData.availability}
              onChange={(e) =>
                setFormData({ ...formData, availability: e.target.value })
              }
              placeholder="e.g., Open to opportunities, Not looking"
              className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
            />
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remoteWork"
                checked={formData.remoteWork}
                onChange={(e) =>
                  setFormData({ ...formData, remoteWork: e.target.checked })
                }
                className="rounded border-border focus:ring-foreground"
              />
              <Label
                htmlFor="remoteWork"
                className="text-sm font-medium text-foreground"
              >
                Open to remote work
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="relocation"
                checked={formData.relocation}
                onChange={(e) =>
                  setFormData({ ...formData, relocation: e.target.checked })
                }
                className="rounded border-border focus:ring-foreground"
              />
              <Label
                htmlFor="relocation"
                className="text-sm font-medium text-foreground"
              >
                Open to relocation
              </Label>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Social Media Links
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: "github",
                label: "GitHub",
                placeholder: "https://github.com/username",
              },
              {
                id: "linkedin",
                label: "LinkedIn",
                placeholder: "https://linkedin.com/in/username",
              },
              {
                id: "twitter",
                label: "Twitter",
                placeholder: "https://twitter.com/username",
              },
              {
                id: "instagram",
                label: "Instagram",
                placeholder: "https://instagram.com/username",
              },
              {
                id: "youtube",
                label: "YouTube",
                placeholder: "https://youtube.com/@username",
              },
              {
                id: "facebook",
                label: "Facebook",
                placeholder: "https://facebook.com/username",
              },
              {
                id: "stackoverflow",
                label: "Stack Overflow",
                placeholder: "https://stackoverflow.com/users/username",
              },
              {
                id: "behance",
                label: "Behance",
                placeholder: "https://behance.net/username",
              },
              {
                id: "dribbble",
                label: "Dribbble",
                placeholder: "https://dribbble.com/username",
              },
              {
                id: "medium",
                label: "Medium",
                placeholder: "https://medium.com/@username",
              },
              {
                id: "devto",
                label: "Dev.to",
                placeholder: "https://dev.to/username",
              },
              {
                id: "hashnode",
                label: "Hashnode",
                placeholder: "https://hashnode.dev/@username",
              },
              {
                id: "substack",
                label: "Substack",
                placeholder: "https://username.substack.com",
              },
            ].map((social) => (
              <div key={social.id} className="space-y-2">
                <Label
                  htmlFor={social.id}
                  className="text-sm text-muted-foreground"
                >
                  {social.label}
                </Label>
                <Input
                  id={social.id}
                  type="url"
                  value={
                    (formData[social.id as keyof typeof formData] as string) ||
                    ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, [social.id]: e.target.value })
                  }
                  placeholder={social.placeholder}
                  className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Websites */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Additional Websites
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="portfolio"
                className="text-sm text-muted-foreground"
              >
                Portfolio Website
              </Label>
              <Input
                id="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={(e) =>
                  setFormData({ ...formData, portfolio: e.target.value })
                }
                placeholder="https://portfolio.com"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog" className="text-sm text-muted-foreground">
                Personal Blog
              </Label>
              <Input
                id="blog"
                type="url"
                value={formData.blog}
                onChange={(e) =>
                  setFormData({ ...formData, blog: e.target.value })
                }
                placeholder="https://blog.com"
                className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume" className="text-sm text-muted-foreground">
              Resume/CV Link
            </Label>
            <Input
              id="resume"
              type="url"
              value={formData.resume}
              onChange={(e) =>
                setFormData({ ...formData, resume: e.target.value })
              }
              placeholder="https://example.com/resume.pdf"
              className="h-12 border-2 border-border focus:border-foreground bg-background text-foreground rounded-sm transition-colors duration-200"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsSheetOpen(false)}
            className="flex-1 h-12 rounded-sm border-2 border-border text-foreground font-semibold hover:bg-muted transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-12 bg-foreground hover:bg-foreground/90 text-background font-semibold rounded-sm shadow-lg transition-all duration-200"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
