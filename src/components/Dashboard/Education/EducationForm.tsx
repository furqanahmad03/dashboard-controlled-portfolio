import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";
import { Education } from "@/interfaces/Education";
import Image from "next/image";

interface EducationFormProps {
  education?: Education | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<Education>>({
    degree: education?.degree || "",
    institution: education?.institution || "",
    location: education?.location || "",
    startDate: education?.startDate ? new Date(education.startDate) : new Date(),
    endDate: education?.endDate ? new Date(education.endDate) : undefined,
    description: education?.description || "",
    gpa: education?.gpa || "",
    percentage: education?.percentage || "",
    skills: education?.skills || [],
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [skillInput, setSkillInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append("degree", formData.degree || "");
    formDataToSend.append("institution", formData.institution || "");
    if (formData.location) {
      formDataToSend.append("location", formData.location);
    }
    formDataToSend.append("startDate", formData.startDate?.toISOString() || "");
    if (formData.endDate) {
      formDataToSend.append("endDate", formData.endDate.toISOString());
    }
    if (formData.description) {
      formDataToSend.append("description", formData.description);
    }
    if (formData.gpa) {
      formDataToSend.append("gpa", formData.gpa);
    }
    if (formData.percentage) {
      formDataToSend.append("percentage", formData.percentage);
    }
    if (formData.skills && formData.skills.length > 0) {
      formDataToSend.append("skills", JSON.stringify(formData.skills));
    }

    if (logoFile) {
      formDataToSend.append("logo", logoFile);
    }

    await onSubmit(formDataToSend);
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills?.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          skills: [...(formData.skills || []), skillInput.trim()]
        });
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter(skill => skill !== skillToRemove) || []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="degree"
            className="text-base font-semibold text-gray-900 dark:text-white"
          >
            Degree
          </Label>
          <Input
            id="degree"
            value={formData.degree}
            onChange={(e) =>
              setFormData({ ...formData, degree: e.target.value })
            }
            required
            className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="institution"
            className="text-base font-semibold text-gray-900 dark:text-white"
          >
            Institution
          </Label>
          <Input
            id="institution"
            value={formData.institution}
            onChange={(e) =>
              setFormData({ ...formData, institution: e.target.value })
            }
            required
            className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-900 dark:text-white">
            Start Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-12 w-full justify-between font-normal text-sm bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
              >
                <span className="truncate">
                  {formData.startDate
                    ? formData.startDate.toLocaleDateString()
                    : "Select start date"}
                </span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
              align="start"
            >
              <Calendar
                mode="single"
                selected={formData.startDate || undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setFormData({ ...formData, startDate: date || new Date() });
                }}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-900 dark:text-white">
            End Date (Optional)
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-12 w-full justify-between font-normal text-sm bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
              >
                <span className="truncate">
                  {formData.endDate
                    ? formData.endDate.toLocaleDateString()
                    : "Select end date"}
                </span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
              align="start"
            >
              <Calendar
                mode="single"
                selected={formData.endDate || undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setFormData({ ...formData, endDate: date || undefined });
                }}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-base font-semibold text-gray-900 dark:text-white"
        >
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe your education experience..."
          className="min-h-[100px] text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="location"
          className="text-base font-semibold text-gray-900 dark:text-white"
        >
          Location
        </Label>
        <Input
          id="location"
          value={formData.location || ""}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="City, Country"
          className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="gpa"
            className="text-base font-semibold text-gray-900 dark:text-white"
          >
            GPA (Optional)
          </Label>
                      <Input
              id="gpa"
              value={formData.gpa || ""}
              onChange={(e) =>
                setFormData({ ...formData, gpa: e.target.value })
              }
              placeholder="e.g., 3.8/4.0"
              className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
            />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="percentage"
            className="text-base font-semibold text-gray-900 dark:text-white"
          >
            Percentage (Optional)
          </Label>
                      <Input
              id="percentage"
              value={formData.percentage || ""}
              onChange={(e) =>
                setFormData({ ...formData, percentage: e.target.value })
              }
              placeholder="e.g., 85%"
              className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
            />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="skills"
          className="text-base font-semibold text-gray-900 dark:text-white"
        >
          Skills
        </Label>
        <Input
          id="skills"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleAddSkill}
          placeholder="Type a skill and press Enter"
          className="h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
        />
        {formData.skills && formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs flex items-center gap-1 group bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 rounded-full px-2 py-1"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold text-gray-900 dark:text-white">
          Institution Logo
        </Label>

        {/* Show existing logo if available */}
        {education?.institutionLogo && !logoFile && (
          <div className="mb-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-background">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Logo:
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 border rounded-md overflow-hidden bg-white dark:bg-gray-700 flex items-center justify-center">
                <Image
                  src={education.institutionLogo}
                  alt="Current institution logo"
                  className="w-full h-full object-cover"
                  width={16}
                  height={16}
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload a new image to replace this logo
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setLogoFile(file);
            }}
            className="flex-1 py-2 h-fit dark:bg-background bg-white border-gray-600 dark:text-white text-gray-900 file:bg-purple-600 file:border-0 file:text-white file:px-4 file:rounded file:mr-4"
          />
          {logoFile && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLogoFile(null)}
              className="h-12 px-4 overflow-hidden border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Remove
            </Button>
          )}
        </div>
        {logoFile && (
          <div className="mt-3 p-4 border-2 border-dashed border-purple-500 rounded-lg bg-gray-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 border-2 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center shadow-sm">
                <Image
                  src={URL.createObjectURL(logoFile)}
                  alt="Logo preview"
                  className="w-full h-full object-cover"
                  width={16}
                  height={16}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium dark:text-white text-gray-900">
                  {logoFile.name}
                </p>
                <p className="text-xs text-gray-400">
                  {(logoFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-12 px-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white border-0"
        >
          {isSubmitting 
            ? (mode === 'create' ? "Creating..." : "Updating...") 
            : (mode === 'create' ? "Create Education" : "Update Education")
          }
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EducationForm;
