import Header from '@/components/header';
import AIHumanizer from '@/components/AIHumanizer';
import { Toaster } from 'sonner';

export default function AIHumanizerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <Toaster position="top-center" />
      <Header />
      <main className="mt-[80px]">
        <div className="pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AI Text Humanizer
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Transform AI-generated content into natural, human-like text while maintaining the original meaning
              </p>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <AIHumanizer />
            </div>

            {/* Features Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                title="Natural Flow"
                description="Restructure content to sound more conversational and human-like"
                icon="✍️"
              />
              <FeatureCard 
                title="Multiple Formats"
                description="Process text, PDF, or Word documents with ease"
                icon="📄"
              />
              <FeatureCard 
                title="Export Options"
                description="Copy text or download in your preferred format"
                icon="💾"
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