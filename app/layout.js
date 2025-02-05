import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Qudmeet.click",
  description:
    "Qudmeet is SaaS AI automation and Career Acing application, establish to help you build, earn, and enhance neccessary technologies required to land your dreama and aspiration. We provide varies of Tools and Features such as AI Demo interview, Job Opportunity, File Conversion and tools etc.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}

            crossOrigin="anonymous"
          />
          <meta name="robots" content="index,follow" />
          <meta name="googlebot" content="index,follow" />
          <link rel="canonical" href="https://qudmeet.click" />
        </head>
        <body className={inter.className}>
          <Toaster />
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
