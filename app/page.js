import Header from "@/components/header";
import Head from "next/head";
import Hero from "@/components/Hero";
import OnboardingProcess from "@/components/OnboardingProcess";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Head>
        <title>
          Qudmeet.click | AI Tools Suite | Resume Analyzer, Mock Interviews, QR Generator |
          Qudmeet
        </title>
        <meta
          name="description"
          content="Access a comprehensive suite of AI-powered tools: Resume analyzer for job matching, AI mock interviews for practice, QR code generator, file converter, and more. Enhance your professional toolkit with Qudmeet's smart solutions."
        />
        <meta
          name="keywords"
          content="AI resume analyzer, AI mock interview, QR code generator, file converter, career tools, job preparation, resume checker, interview practice, digital tools, professional development, AI tools suite, Qudmeet tools"
        />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />

        {/* Open Graph tags for social sharing */}
        <meta
          property="og:title"
          content="Professional AI Tools Suite | Resume Analyzer, Mock Interviews & More"
        />
        <meta
          property="og:description"
          content="All-in-one platform featuring AI resume analysis, mock interviews, QR code generation, and file conversion tools. Streamline your professional workflow with Qudmeet's intelligent solutions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://qudmeet.click" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="AI-Powered Professional Tools | Qudmeet.click"
        />
        <meta
          name="twitter:description"
          content="Discover our comprehensive suite of AI tools: Resume analyzer, mock interviews, QR generator, file converter, and more. Enhance your professional toolkit."
        />
      </Head>
      <Header />
      <Hero />
      <OnboardingProcess />
      <Footer />
    </main>
  );
}
