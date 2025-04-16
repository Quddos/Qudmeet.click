import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import ClientLayout from "@/components/ClientLayout";
import CookieConsent from '@/components/CookieConsent'
import { Analytics } from "@vercel/analytics/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://qudmeet.click"),
  title: {
    default: "Qudmeet.click",
    template: "%s | Qudmeet.click",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  description:
    "Qudmeet click is SaaS AI-Hub automation and Career Acing Firm, establish to help you build, earn, and enhance neccessary technologies required to land your dreama and aspiration. We provide varies of Tools and Features such as AI Demo interview, Job Opportunity, File Conversion and tools etc.",
  keywords: [
    "AI interview practice",
    "job opportunities",
    "file conversion",
    "career development",
    "SaaS",
    "AI tools",
  ],
  authors: [{ name: "Qudmeet" }],
  creator: "Qudmeet",
  canonical: "https://qudmeet.click",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://qudmeet.click",
    siteName: "Qudmeet click",
    title: "Qudmeet click - AI-Powered Hub Platform",
    description:
      "AI-powered platform for AI-Hub Support and career development, featuring interview practice, job opportunities, and file conversion tools.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Qudmeet.click Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qudmeet click - AI Career Platform",
    description: "AI-powered career development tools and opportunities",
    images: ["/twitter-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
        <meta name="description" content="Qudmeet click is SaaS AI-Hub automation and Career Acing Firm, helping you build, earn, and enhance technologies required to land your dream and aspiration." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8184615979985575"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          ></script>
        </head>
        <body className={inter.className}>
          <Toaster />
          <ClientLayout>{children}</ClientLayout>
          <CookieConsent />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
