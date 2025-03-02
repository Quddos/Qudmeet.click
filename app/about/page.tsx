'use client'

import { motion } from "framer-motion"
import { CodeBlock } from "@/components/ui/code-block"


// import  ScrollArea  from "@/components/ui/scroll-area"
import { ScrollArea } from "@/components/ui/scroll-area"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
            <Header />
            <main className="mt-[80px] bg-blue-200">
                {/* Hero Section */}
                <section className="pt-20 pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <h1 className="text-5xl font-bold text-gray-900 mb-6">
                                Empowering Professionals with AI Tools
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                                Qudmeet is your all-in-one platform for professional growth and productivity enhancement
                            </p>
                           
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-white/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-12"
                        >
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Our Suite of Tools</h2>
                                <div className="h-[400px] rounded-md border p-6">
                                   {/* <ScrollArea/> */}
                                   <CodeBlock
                                            language="javascript"
                                            filename="tools.js"
                                            code={`// AI-Powered Resume Analysis
analyzeResume({
  matching: "Job description alignment",
  skills: "Gap analysis",
  feedback: "Actionable recommendation"
});

// Professional Mock Interviews
conductMockInterview({
  AI: "Natural conversation flow",
  feedback: "Real-time performance analysis",
  preparation: "Industry-specific questions"
});

// Quick QR Code Generation
generateQR({
  types: ["URL", "Text", "vCard"],
  customization: "Colors and styles",
  download: "Multiple formats"
});

// File Format Conversion
convertFiles({
  formats: ["PDF", "DOCX", "Images"],
  batch: "Multiple files",
  quality: "Lossless conversion"
});`}
                                        />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-semibold">Why Choose Qudmeet?</h3>
                                <ul className="space-y-4">
                                    <FeatureItem
                                        title="AI-Powered Intelligence"
                                        description="Leverage cutting-edge AI technology for smarter career development"
                                    />
                                    <FeatureItem
                                        title="All-in-One Platform"
                                        description="Access multiple professional tools in a single, unified interface"
                                    />
                                    <FeatureItem
                                        title="User-Centric Design"
                                        description="Intuitive experience with focus on productivity and efficiency"
                                    />
                                    <FeatureItem
                                        title="Continuous Innovation"
                                        description="Regular updates and new features based on user feedback"
                                    />
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-600">
                                To democratize access to professional development tools and empower individuals
                                to achieve their career goals through innovative AI-powered solutions.
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

function FeatureItem({ title, description }) {
    return (
        <motion.li
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-sm"
        >
            <h4 className="font-semibold mb-2">{title}</h4>
            <p className="text-gray-600">{description}</p>
        </motion.li>
    );
} 