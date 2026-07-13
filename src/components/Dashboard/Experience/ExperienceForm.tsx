import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DialogFooter } from "@/components/ui/dialog";
import { ChevronDownIcon } from "lucide-react";
import { Company } from "@/interfaces/Company";
import { Position } from "@/interfaces/Position";

interface ExperienceFormData {
  position: string;
  companyId: string;
  jobType: string;
  joiningDate: string;
  endingDate: string;
  locationType: string;
  description: string;
  skills: string[];
}

interface ExperienceFormProps {
  mode: "create" | "edit";
  experience?: Position | null;
  companies: Company[];
  onSubmit: (formData: ExperienceFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  mode,
  experience,
  companies,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    position: experience?.position || "",
    companyId: experience?.company.id || "",
    jobType: experience?.jobType || "full-time",
    joiningDate: experience?.joiningDate ? new Date(experience.joiningDate) : new Date(),
    endingDate: experience?.endingDate ? new Date(experience.endingDate) : undefined as Date | undefined,
    locationType: experience?.locationType || "remote",
    description: experience?.description || "",
    skills: experience?.skills || [] as string[],
  });

  const [skillsInput, setSkillsInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSend: ExperienceFormData = {
      position: formData.position,
      companyId: formData.companyId,
      jobType: formData.jobType,
      joiningDate: formData.joiningDate?.toISOString() || "",
      endingDate: formData.endingDate?.toISOString() || "",
      locationType: formData.locationType,
      description: formData.description,
      skills: formData.skills,
    };

    await onSubmit(dataToSend);
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillsInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillsInput.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, skillsInput.trim()]
        });
      }
      setSkillsInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <div className="space-y-2 md:w-1/2 w-full">
            <Label htmlFor="position">Position Title</Label>
            <Input
              id="position"
              value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
              placeholder="e.g., Senior Software Engineer"
              className="h-12 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
            />
          </div>

          <div className="space-y-2 md:w-1/2 w-full">
            <Label htmlFor="companyId">Company *</Label>
            <Select
              value={formData.companyId}
            onValueChange={(value) => setFormData({ ...formData, companyId: value })}
              required
            >
            <SelectTrigger className="w-full !h-12 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id || ""}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jobType">Job Type</Label>
            <Select
              value={formData.jobType}
              onValueChange={(value) =>
                setFormData({ ...formData, jobType: value })
              }
            >
              <SelectTrigger className="!h-12 w-full bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationType">Location Type</Label>
            <Select
              value={formData.locationType}
              onValueChange={(value) =>
                setFormData({ ...formData, locationType: value })
              }
            >
              <SelectTrigger className="!h-12 w-full bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500">
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="on-site">On Site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="space-y-2 md:w-1/2 w-full">
            <Label htmlFor="joiningDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 w-full justify-between font-normal text-sm bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
                >
                  <span className="truncate">
                    {formData.joiningDate
                      ? formData.joiningDate.toLocaleDateString()
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
                  selected={formData.joiningDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setFormData({
                      ...formData,
                    joiningDate: date || new Date(),
                    });
                  }}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 md:w-1/2 w-full">
            <Label htmlFor="endingDate">End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 w-full justify-between font-normal text-sm bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
                >
                  <span className="truncate">
                    {formData.endingDate
                      ? formData.endingDate.toLocaleDateString()
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
                  selected={formData.endingDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setFormData({ ...formData, endingDate: date || undefined });
                  }}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe your role and responsibilities"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Skills Used</Label>
          <Input
            id="skills"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
          onKeyDown={handleAddSkill}
            placeholder="Type a skill and press Enter (e.g., React.js)"
            className="h-12 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.length > 0 ? (
              formData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                className="text-xs flex items-center gap-1 group bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-800 rounded-full px-2 py-1"
                >
                  {skill}
                  <button
                    type="button"
                  onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No skills added yet
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
        <Button
            type="button"
          variant="outline"
          onClick={onCancel}
          className="h-11 px-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
        </Button>
        <Button
            type="submit"
            disabled={isSubmitting}
          className="h-11 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 transform hover:scale-105"
        >
          {isSubmitting 
            ? (mode === "create" ? "Creating..." : "Updating...") 
            : (mode === "create" ? "Create Position" : "Update Position")
          }
        </Button>
        </DialogFooter>
      </form>
  );
};

export default ExperienceForm;
