import { Company } from "./Company"

export interface Position {
  id?: string;
  position: string;
  jobType: string; // "full-time", "part-time", "contract", "internship", "freelance"
  company: Company; // Full company object, not just ID
  joiningDate: Date;
  endingDate?: Date | null;
  locationType: string; // "on-site", "hybrid", "remote"
  description?: string | null;
  skills: string[];
  createdAt?: Date;
  updatedAt?: Date;
} 