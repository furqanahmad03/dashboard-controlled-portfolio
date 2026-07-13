import { prisma } from "@/lib/prisma"
import type { ContactQueryInput } from "@/lib/validations"

export const createContactQuery = async (data: ContactQueryInput) => {
  return prisma.contactQuery.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    },
  })
}
