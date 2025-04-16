import Header from '@/components/header';

import ResearchAnalyzer from '@/components/ResearchAnalyzer'
import { Toaster } from 'sonner'

export default function ResearchAnalyzerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <Toaster position="top-center" />
      <Header />
      <main className="mt-[80px]">
        <div className="pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-6 sm:mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Research Paper Analyzer
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get instant AI-powered analysis of research papers, extracting key information and insights
              </p>
              <div className="mt-4 bg-blue-50 p-3 rounded-lg inline-block">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">New!</span> You can now chat with your PDF after uploading it.
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <ResearchAnalyzer />
            </div>

            {/* Features Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                title="Paper Details"
                description="Extract title, journal name, publication year, and key metadata"
                icon="📄"
              />
              <FeatureCard 
                title="Research Analysis"
                description="Identify main contributions and area of focus"
                icon="🔍"
              />
              <FeatureCard 
                title="Chat with PDF"
                description="Ask questions and get insights from your research paper"
                icon="💡"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ title, description, icon }: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
} 