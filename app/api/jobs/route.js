import { db } from '@/utils/db'
import { jobPost, notifications } from '@/utils/schema'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { createNotification } from '@/lib/notifications'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    
    // Fetch jobs from multiple categories if no specific category is selected
    const categories = category === 'all' 
      ? ['software-dev', 'design', 'marketing', 'sales', 'customer-support']
      : [category]
    
    const jobPromises = categories.map(cat => 
      fetch(`https://remotive.com/api/remote-jobs?category=${cat}`)
        .then(res => res.json())
    )
    
    const results = await Promise.all(jobPromises)
    const allJobs = results.flatMap(result => result.jobs)
    
    // Transform the Remotive API data
    const jobs = allJobs.map(job => ({
      id: job.id.toString(),
      title: job.title,
      company: job.company_name,
      companyLogo: job.company_logo_url,
      location: job.candidate_required_location || 'Remote',
      jobType: job.job_type || 'Full-time',
      category: job.category || 'Other',
      postedDate: new Date(job.publication_date).toLocaleDateString(),
      salary: job.salary || 'Competitive',
      description: job.description,
      directApplyLink: job.url,
      tags: job.tags || [],
      requirements: job.description // You might want to parse this better
    }));

    return Response.json(jobs);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Create the job post with proper date handling
    const [newJob] = await db.insert(jobPost).values({
      title: body.title,
      companyName: body.companyName,
      details: body.details,
      location: body.location,
      jobType: body.jobType,
      salary: body.salary,
      requirements: body.requirements,
      directApplyLink: body.directApplyLink?.trim() || null,
      youtubeLink: body.youtubeLink?.trim() || null,
      status: body.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()

    // Create notification with proper date handling
    if (newJob) {
      await db.insert(notifications).values({
        type: 'NEW_JOB',
        title: 'New Job Posted',
        message: `New job opportunity: ${body.title} at ${body.companyName}`,
        link: `/jobs/${newJob.id}`,
        isGlobal: true,
        createdAt: new Date(),
        isRead: false
      })
    }

    return NextResponse.json(newJob)
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      body: body // Log the request body for debugging
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to create job', 
        details: error.message
      },
      { status: 500 }
    )
  }
} 