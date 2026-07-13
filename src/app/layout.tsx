import { LayoutWrapper } from "@/components/layout-wrapper";
import AuthProvider from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: {
    default: 'Portfolio | Furqan A.',
    template: '%s | Portfolio | Furqan A.'
  },
  description: 'Professional portfolio showcasing full-stack development projects, technical skills, and software engineering expertise. Specializing in React, Node.js, TypeScript, and modern web technologies.',
  keywords: ['full stack developer', 'software engineer', 'web developer', 'React developer', 'Node.js developer', 'TypeScript', 'portfolio', 'projects', 'certifications', 'educations', 'companies', 'clients', 'projects', 'skills', 'experience', 'about', 'contact', 'hire me', 'hire'],
  authors: [{ name: 'Furqan Ahmad' }],
  creator: 'Furqan Ahmad',
  publisher: 'Furqan Ahmad',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.furqanahmad.me',
    title: 'Furqan Ahmad - Full Stack Developer Portfolio',
    description: 'Explore my portfolio of web applications, mobile apps, and software projects. View my technical skills, experience, and latest work in full-stack development.',
    siteName: 'Furqan Ahmad Portfolio',
    images: [
      {
        url: 'https://www.furqanahmad.me/my-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Furqan Ahmad - Full Stack Developer Portfolio'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Furqan Ahmad - Full Stack Developer',
    description: 'Professional portfolio featuring web development projects, technical skills, and software engineering work.',
    images: ['https://www.furqanahmad.me/my-image.jpg']
  },
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  //   yahoo: 'your-yahoo-verification-code'
  // }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme || theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js" async></script>
      </head>
      <body
        className={`antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <SmoothScroll>
              <LayoutWrapper>
              {children}
              </LayoutWrapper>
              <Toaster />
            </SmoothScroll>
          </ThemeProvider>
        </AuthProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
