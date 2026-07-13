export type ProjectCategory = 
  | 'Web'
  | 'AI'
  | 'Mobile'
  | 'Desktop'
  | 'API'
  | 'Database'
  | 'DevOps'
  | 'Cloud'
  | 'Blockchain'
  | 'IoT'
  | 'Game'
  | 'Ecommerce'
  | 'CMS'
  | 'Dashboard'
  | 'Analytics'
  | 'Security'
  | 'Testing'
  | 'Documentation'
  | 'Other';

export type ProjectStatus = 'Completed' | 'InProgress' | 'OnHold';

export interface Project {
  id?: string;
  slug: string;
  title: string;
  brief: string;
  thumbnail: string;
  thumbnailPublicId?: string;
  images: string[];
  imagePublicIds?: string[];
  stack: string[];
  repository?: string | null;
  live?: string | null;
  category: ProjectCategory[];
  associatedWith?: string | null;
  overview: string;
  features: string[];
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date | null;
  featured: boolean;
  hasCaseStudy: boolean;
  isEnabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  education?: { 
    id: string;
    institution: string;
    institutionLogo?: string | null;
  } | null;
  company?: { 
    id: string;
    name: string;
    logo?: string | null;
  } | null;
  certification?: { 
    id: string;
    title: string;
    logo?: string | null;
  } | null;
  client?: { 
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    company?: string | null;
    industry?: string | null;
    budget?: string | null;
    sourceName?: string | null;
    sourceWebsite?: string | null;
    notes?: string | null;
  } | null;
}