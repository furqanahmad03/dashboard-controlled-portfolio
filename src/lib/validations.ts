import { z } from "zod"
import { File } from "buffer"


export const baseValidation = {
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}

export const educationSchema = z.object({
  degree: z.string()
    .min(1, "Degree is required")
    .max(200, "Degree must be less than 200 characters"),
  institution: z.string()
    .min(1, "Institution is required")
    .max(200, "Institution must be less than 200 characters"),
  location: z.string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  startDate: z.date("Start date is required"),
  endDate: z.date("End date must be a valid date").nullable().optional(),
  description: z.string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  gpa: z.string()
    .max(20, "GPA must be less than 20 characters")
    .optional(),
  percentage: z.string()
    .max(20, "Percentage must be less than 20 characters")
    .optional(),
  skills: z.array(z.string().min(1, "Skill cannot be empty"))
    .max(50, "Maximum 50 skills allowed")
    .optional(),
  institutionLogo: z.url("Invalid logo URL").optional(),
})

export const educationUpdateSchema = educationSchema.partial().extend({
  id: z.string().min(1, "Education ID is required"),
})

export const companySchema = z.object({
  name: z.string()
    .min(1, "Company name is required")
    .max(200, "Company name must be less than 200 characters"),
  logo: z.url("Invalid logo URL").optional(),
  website: z.url("Invalid website URL").optional(),
  location: z.string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
})

export const companyUpdateSchema = companySchema.partial()

export const experienceSchema = z.object({
  title: z.string()
    .min(1, "Job title is required")
    .max(200, "Job title must be less than 200 characters"),
  companyId: z.string()
    .min(1, "Company is required"),
  startDate: z.date("Start date is required"),
  endDate: z.date("End date must be a valid date").nullable().optional(),
  description: z.string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  responsibilities: z.array(z.string().min(1, "Responsibility cannot be empty"))
    .max(20, "Maximum 20 responsibilities allowed")
    .optional(),
  skills: z.array(z.string().min(1, "Skill cannot be empty"))
    .max(50, "Maximum 50 skills allowed")
    .optional(),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship", "freelance"])
    .default("full-time"),
  location: z.string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  salary: z.string()
    .max(50, "Salary must be less than 50 characters")
    .optional(),
  achievements: z.array(z.string().min(1, "Achievement cannot be empty"))
    .max(20, "Maximum 20 achievements allowed")
    .optional(),
})

export const experienceUpdateSchema = experienceSchema.partial().extend({
  id: z.string().min(1, "Experience ID is required"),
})

export const certificationSchema = z.object({
  title: z.string()
    .min(1, "Certification title is required")
    .max(200, "Certification title must be less than 200 characters"),
  issuer: z.string()
    .min(1, "Issuer is required")
    .max(200, "Issuer must be less than 200 characters"),
  logo: z.url("Invalid logo URL").optional(),
  issuerWebsite: z.url("Invalid website URL").optional().or(z.literal("")),
  issueDate: z.string()
    .min(1, "Issue date is required")
    .max(50, "Issue date must be less than 50 characters"),
  credentialID: z.string()
    .max(100, "Credential ID must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  credentialURL: z.url("Invalid credential URL").optional().or(z.literal("")),
  certificate: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Pending", "Surrendered", "Withdrawn", "Suspended", "Revoked", "Expired"])
    .default("Active"),
})

export const certificationUpdateSchema = certificationSchema.partial().extend({
  id: z.string().min(1, "Certification ID is required"),
})

export const projectSchema = z.object({
  slug: z.string()
    .min(1, "Project slug is required")
    .max(200, "Project slug must be less than 200 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  title: z.string()
    .min(1, "Project title is required")
    .max(200, "Project title must be less than 200 characters"),
  brief: z.string()
    .min(1, "Project brief is required")
    .max(300, "Project brief must be less than 300 characters"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  thumbnailPublicId: z.string().optional(),
  images: z.array(z.string()).default([]),
  imagePublicIds: z.array(z.string()).default([]),
  stack: z.array(z.string().min(1, "Technology cannot be empty"))
    .min(1, "At least one technology is required")
    .max(50, "Maximum 50 technologies allowed"),
  repository: z.string().optional().or(z.literal("")),
  live: z.string().optional().or(z.literal("")),
  category: z.array(z.enum([
    "Web", "AI", "Mobile", "Desktop", "API", "Database", "DevOps", 
    "Cloud", "Blockchain", "IoT", "Game", "Ecommerce", "CMS", 
    "Dashboard", "Analytics", "Security", "Testing", "Documentation", "Scraping", "Other"
  ])).min(1, "At least one category is required"),
  associatedWith: z.string().optional().or(z.literal("")),
  overview: z.string()
    .min(1, "Overview is required")
    .max(2000, "Overview must be less than 2000 characters"),
  features: z.array(z.string().min(1, "Feature cannot be empty"))
    .min(1, "At least one feature is required")
    .max(20, "Maximum 20 features allowed"),
  status: z.enum(["Completed", "InProgress", "OnHold"])
    .default("Completed"),
  startDate: z.string()
    .regex(/^\d{4}-\d{2}$/, "Start date must be in YYYY-MM format"),
  endDate: z.string()
    .regex(/^\d{4}-\d{2}$/, "End date must be in YYYY-MM format")
    .optional()
    .or(z.literal("")),
  featured: z.boolean().default(false),
  hasCaseStudy: z.boolean().default(false),
})

export const projectUpdateSchema = projectSchema.partial().extend({
  id: z.string().min(1, "Project ID is required"),
})

export const clientSchema = z.object({
  name: z.string()
    .max(200, "Name must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  phone: z.string()
    .max(20, "Phone must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  city: z.string()
    .max(100, "City must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  state: z.string()
    .max(100, "State must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  country: z.string()
    .max(100, "Country must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  sourceName: z.string()
    .max(200, "Source name must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  sourceWebsite: z.url("Invalid source website URL")
    .optional()
    .or(z.literal("")),
  company: z.string()
    .max(200, "Company must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  industry: z.string()
    .max(100, "Industry must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  budget: z.string()
    .max(100, "Budget must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  notes: z.string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
})

export const clientUpdateSchema = clientSchema.partial().extend({
  id: z.string().min(1, "Client ID is required"),
})


export const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
})

export const errorResponseSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  details: z.any().optional(),
})

export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.type),
      "Only image files are allowed"
    ),
})

export const searchSchema = z.object({
  query: z.string().max(200, "Search query must be less than 200 characters").optional(),
  page: z.number().min(1, "Page must be at least 1").default(1),
  limit: z.number().min(1, "Limit must be at least 1").max(100, "Limit must be less than 100").default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const projectFormDataSchema = z.object({
  slug: z.string().min(1, "Project slug is required"),
  title: z.string().min(1, "Project title is required"),
  brief: z.string().min(1, "Project brief is required"),
  overview: z.string().min(1, "Project overview is required"),
  stack: z.string().min(1, "Project stack is required"),
  features: z.string().min(1, "Project features are required"),
  category: z.string().min(1, "Project category is required"),
  status: z.enum(["Completed", "InProgress", "OnHold"]),
  startDate: z.date("Start date is required"),
  endDate: z.date("End date is required").optional(),
  repository: z.string().optional(),
  live: z.string().optional(),
  associatedWith: z.string().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  hasCaseStudy: z.boolean().default(false),
})

export const projectUpdateFormDataSchema = projectFormDataSchema.extend({
  id: z.string().min(1, "Project ID is required"),
})

const blogBaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  brief: z.string().max(1000, "Brief must be less than 1000 characters").optional().or(z.literal("")),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.string().optional().or(z.literal("")),
  thumbnailPublicId: z.string().optional().or(z.literal("")),
  images: z.array(z.string()).default([]),
  imagePublicIds: z.array(z.string()).default([]),
  isBlog: z.boolean().default(false),
  isCaseStudy: z.boolean().default(true),
  state: z.enum(["DRAFT", "ACTIVE"]),
  isEnabled: z.boolean().default(true),
  featured: z.boolean().default(false),
})

export const blogSchema = blogBaseSchema
  .extend({
    projectId: z.string().min(1, "Project ID is required"),
  })
  .refine((data) => data.isCaseStudy, {
    message: "Project-linked blogs must keep case study enabled",
    path: ["isCaseStudy"],
  })
  .refine((data) => data.isBlog || data.isCaseStudy, {
    message: "At least one of isBlog or isCaseStudy must be true",
    path: ["isBlog"],
  })

export const rawBlogSchema = blogBaseSchema
  .extend({
    projectId: z.undefined().optional(),
  })
  .refine((data) => data.isBlog, {
    message: "Raw blogs must be visible in /blogs",
    path: ["isBlog"],
  })
  .refine((data) => !data.isCaseStudy, {
    message: "Raw blogs cannot be marked as case studies",
    path: ["isCaseStudy"],
  })

export const contactQuerySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name must be less than 120 characters"),
  email: z.string().trim().email("Please provide a valid email address").max(255, "Email must be less than 255 characters"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message must be less than 5000 characters"),
})

export const contactQueryReplySchema = z.object({
  subject: z.string().trim().min(1, "Reply subject is required").max(200, "Reply subject must be less than 200 characters"),
  message: z.string().trim().min(1, "Reply message is required").max(5000, "Reply message must be less than 5000 characters"),
})


export type EducationInput = z.infer<typeof educationSchema>
export type EducationUpdateInput = z.infer<typeof educationUpdateSchema>
export type CompanyInput = z.infer<typeof companySchema>
export type CompanyUpdateInput = z.infer<typeof companyUpdateSchema>
export type ExperienceInput = z.infer<typeof experienceSchema>
export type ExperienceUpdateInput = z.infer<typeof experienceUpdateSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>
export type BlogInput = z.infer<typeof blogSchema>
export type RawBlogInput = z.infer<typeof rawBlogSchema>
export type ContactQueryInput = z.infer<typeof contactQuerySchema>
export type ContactQueryReplyInput = z.infer<typeof contactQueryReplySchema>
export type ClientInput = z.infer<typeof clientSchema>
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>
export type CertificationInput = z.infer<typeof certificationSchema>
export type CertificationUpdateInput = z.infer<typeof certificationUpdateSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type ProjectFormData = z.infer<typeof projectFormDataSchema>
export type ProjectUpdateFormData = z.infer<typeof projectUpdateFormDataSchema> 