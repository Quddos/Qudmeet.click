import Header from "@/components/header";
import Hero from "@/components/Hero";
import OnboardingProcess from "@/components/OnboardingProcess";
import Footer from "@/components/footer";
import FeaturedJobs from "@/components/FeaturedJobs";
import CareerResources from "@/components/CareerResources";
// import SuccessStories from "@/components/SuccessStories";
// import BlogSection from "@/components/BlogSection";

export const metadata = {
  title: 'AI Tools Suite | Resume Analyzer, Mock Interviews, QR Generator',
  description: 'Access a comprehensive suite of AI-powered tools: Resume analyzer for job matching, AI mock interviews for practice, QR code generator, file converter, and more. Enhance your professional toolkit with Qudmeet\'s smart solutions.',
  keywords: [
    'AI resume analyzer',
    'AI mock interview',
    'QR code generator',
    'file converter',
    'career tools',
    'job preparation'
  ],
  openGraph: {
    title: 'Professional AI Tools Suite | Resume Analyzer, Mock Interviews & More',
    description: 'All-in-one platform featuring AI resume analysis, mock interviews, QR code generation, and file conversion tools.'
  }
};

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <OnboardingProcess />
      <FeaturedJobs />
      <CareerResources />
      {/* <SuccessStories /> */}
      {/* <BlogSection /> */}
      <Footer />
    </main>
  );
}
