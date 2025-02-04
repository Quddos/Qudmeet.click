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
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/header";

export default function JobDetails({ params }) {
  const [job, setJob] = useState(null);
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
        router.push("/opportunities/job-board");
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

  if (!job) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {job.title}
              </h1>
              <div className="mb-6">
                <p className="text-xl text-gray-600">{job.companyName}</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Briefcase className="w-5 h-5 mr-2" />
                    <span>{job.jobType}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center text-gray-500">
                      <DollarSign className="w-5 h-5 mr-2" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Simplified YouTube Video Section */}
              {/* {job?.youtubeLink && transformYoutubeUrl(job.youtubeLink) && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">
                    Application Guide
                  </h2>
                  <div
                    className="relative w-full max-w-2xl mx-auto"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <iframe
                      src={transformYoutubeUrl(job.youtubeLink)}
                      className="absolute top-0 left-0 w-full h-full rounded-xl"
                      title="Application Guide Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )} */}

              {/* Job Details and Requirements */}
              <div className="prose max-w-none mb-8">
                <h2 className="text-2xl font-semibold mb-4">Job Details</h2>
                <p className="whitespace-pre-wrap">{job?.details}</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">
                  Requirements
                </h2>
                <p className="whitespace-pre-wrap">{job?.requirements}</p>
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
