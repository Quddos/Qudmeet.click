'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, Building } from 'lucide-react';

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs?featured=true');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data.filter(job => job.isFeatured).slice(0, 6));
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Job Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            Failed to load jobs
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Job Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Link 
              href={`/opportunities/job-board/${job.id}`}
              key={job.id}
              className="block"
            >
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {/* Job Type Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {job.jobType}
                  </span>
                </div>

                {/* Title and Company */}
                <h3 className="font-semibold text-xl mb-2 line-clamp-2">{job.title}</h3>
                <p className="text-gray-600 mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {job.company}
                </p>

                {/* Location and Salary */}
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.jobType}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                </div>

                {/* Skills/Requirements Preview */}
                {job.skills && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link 
            href="/opportunities/job-board"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Jobs
          </Link>
        </div>
      </div>
    </section>
  );
} 