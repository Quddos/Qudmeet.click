"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Briefcase,
  Bot,
  FileText,
  DollarSign,
  ExternalLink,
  Building,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Image from "next/image";

export default function JobDetails({ params }) {
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch job");
        const data = await response.json();
        console.log("Job data:", data); // Debug log
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
        setError(error.message);
        router.push("/opportunities/job-board");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [params.id, router]);

  const handleApplyThroughUs = () => {
    router.push(`/jobs/${params.id}/apply`);
  };

  const handleAIMockInterview = () => {
    router.push("/dashboard");
  };

  const handleResumeAnalysis = () => {
    router.push("/tools/resume-analyzer");
  };

  // Simplified YouTube URL transformer
  const transformYoutubeUrl = (url) => {
    if (!url) return null;

    try {
      const urlObj = new URL(url);
      let videoId = "";

      if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.slice(1);
      } else if (
        urlObj.hostname === "www.youtube.com" ||
        urlObj.hostname === "youtube.com"
      ) {
        videoId = urlObj.searchParams.get("v");
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (error) {
      console.error("Error parsing YouTube URL:", error);
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start gap-6 mb-6">
                {job.companyLogo && (
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={job.companyLogo}
                      alt={job.companyName}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      {job.companyName}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {job.jobType}
                </div>
                <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
                {job.salary && (
                  <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full">
                    {job.salary}
                  </div>
                )}
              </div>

              <a
                href={job.directApplyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Now <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </div>

            {/* Job Details and Requirements */}
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold mb-4">Job Details</h2>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.details }}
              />

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                Requirements
              </h2>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.requirements }}
              />
            </div>

            {/* Application Buttons - with debug info */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={() => router.push(`/jobs/${params.id}/apply`)}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg text-center hover:bg-blue-700 transition-colors"
              >
                Apply Through Us
              </button>
              {job?.directApplyLink && job.directApplyLink.trim() && (
                <a
                  href={job.directApplyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg text-center hover:bg-green-700 transition-colors"
                >
                  Apply Directly
                </a>
              )}
            </div>

            {/* Debug info - only shown in development */}
            {/* {process.env.NODE_ENV === "development" && ( */}
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm">
                <p>
                  Debug Why <b>choose us:</b>
                </p>
                <p className="text-blue-500">
                  &#123;when you apply through us we handle your process and
                  you can only be concerned about receiving your offer letter,
                  we only charge 15% fee from your first Salary&#125;
                </p>
              </div>
            {/* )} */}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-blue-600 text-white rounded-2xl shadow-lg p-6 cursor-pointer hover:bg-blue-700 transition-colors"
              onClick={() => router.push("/dashboard")}
            >
              <div className="flex items-center mb-4">
                <Bot className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold">AI Mock Interview</h3>
              </div>
              <p className="text-blue-100">
                Enhance your chances with our AI-powered mock interview system.
                Practice and prepare for your interview!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-600 text-white rounded-2xl shadow-lg p-6 cursor-pointer hover:bg-green-700 transition-colors"
              onClick={() => router.push("/tools/resume-analyzer")}
            >
              <div className="flex items-center mb-4">
                <FileText className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold">Resume Analysis</h3>
              </div>
              <p className="text-green-100">
                Analyze your resume to see your chances of securing this job.
                Get AI-powered insights and improvements.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
