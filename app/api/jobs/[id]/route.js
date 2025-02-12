import { db } from '@/utils/db'
import { jobPost } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const updatedJob = await db
      .update(jobPost)
      .set(body)
      .where(eq(jobPost.id, id))
      .returning()
    return NextResponse.json(updatedJob[0])
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    await db.delete(jobPost).where(eq(jobPost.id, id))
    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request, { params }) {
  try {
    // Fetch all jobs first (you might want to cache this)
    const response = await fetch('https://remotive.com/api/remote-jobs')
    const data = await response.json()
    
    // Find the specific job
    const job = data.jobs.find(j => j.id.toString() === params.id)
    
    if (!job) {
      return Response.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Transform to match your structure
    const normalizedJob = {
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
      requirements: job.description
    }

    return Response.json(normalizedJob)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}