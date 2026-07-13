export interface Education {
  id?: string;
  degree: string;
  institution: string;
  institutionLogo?: string | null;
  institutionLogoPublicId?: string | null;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  description?: string | null;
  gpa?: string | null;
  percentage?: string | null;
  skills: string[];
  createdAt?: Date;
  updatedAt?: Date;
} 