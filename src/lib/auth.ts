import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { isPortfolioAdminEmail } from "@/lib/security"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        const hasAdminAccess = await isPortfolioAdminEmail(user.email)

        if (!hasAdminAccess) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      const tokenEmail =
        typeof token.email === "string"
          ? token.email
          : typeof user?.email === "string"
            ? user.email
            : null

      const hasAdminAccess = await isPortfolioAdminEmail(tokenEmail)
      token.isAdmin = hasAdminAccess

      if (!hasAdminAccess) {
        delete token.id
        delete token.email
        delete token.name
        delete token.picture
      }

      return token
    },
    async session({ session, token }) {
      if (!token.isAdmin) {
        if (session.user) {
          session.user.id = ""
          session.user.email = null
        }
        return session
      }

      if (session?.user && token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
} 