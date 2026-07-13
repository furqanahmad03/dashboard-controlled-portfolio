export type BlogState = "DRAFT" | "ACTIVE";

export interface Blog {
  id?: string;
  title: string;
  brief?: string | null;
  content: string;
  thumbnail?: string | null;
  thumbnailPublicId?: string | null;
  images: string[];
  imagePublicIds: string[];
  isBlog: boolean;
  isCaseStudy: boolean;
  state: BlogState;
  projectId?: string | null;
  isEnabled: boolean;
  featured: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  project?: {
    id: string;
    slug: string;
    title: string;
    hasCaseStudy: boolean;
  } | null;
}
