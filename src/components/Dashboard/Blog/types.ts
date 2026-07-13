import { BlogState } from "@/interfaces/Blog"

export interface BlogFormData {
  title: string
  brief: string
  content: string
  thumbnail: string
  thumbnailPublicId: string
  images: string[]
  imagePublicIds: string[]
  isBlog: boolean
  isCaseStudy: boolean
  state: BlogState
  isEnabled: boolean
  featured: boolean
}

export const defaultProjectBlogFormData: BlogFormData = {
  title: "",
  brief: "",
  content: "",
  thumbnail: "",
  thumbnailPublicId: "",
  images: [],
  imagePublicIds: [],
  isBlog: false,
  isCaseStudy: true,
  state: "DRAFT",
  isEnabled: true,
  featured: false,
}

export const defaultRawBlogFormData: BlogFormData = {
  title: "",
  brief: "",
  content: "",
  thumbnail: "",
  thumbnailPublicId: "",
  images: [],
  imagePublicIds: [],
  isBlog: true,
  isCaseStudy: false,
  state: "DRAFT",
  isEnabled: true,
  featured: false,
}
