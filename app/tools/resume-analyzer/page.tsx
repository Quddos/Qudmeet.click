import Header from '@/components/header'
import ResumeAnalyzer from '@/components/ResumeAnalyzer'
import { Toaster } from 'sonner'

export default function ResumeAnalyzerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b  from-blue-50/50 to-white">
      <Toaster position="top-center" />
      <Header />
      <main className="mt-[80px]">
      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Resume Analyzer
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get instant AI-powered feedback on your resume matched against job descriptions
            </p>
          </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <ResumeAnalyzer />
            </div>

            {/* Features Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                title="Smart Analysis"
                description="AI-powered analysis of your resume against job requirements"
                icon="🎯"
              />
              <FeatureCard 
                title="Skill Matching"
                description="Identify matching and missing skills for the role"
                icon="✨"
              />
              <FeatureCard 
                title="Actionable Feedback"
                description="Get specific recommendations to improve your resume"
                icon="📝"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
} 