import { db } from "@/utils/db";
import { MockInterview, jobApplication } from "@/utils/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get unique users count
    const uniqueUsers = await db
      .select({
        count: sql<number>`COUNT(DISTINCT "createdBy")`
      })
      .from(MockInterview);

    // Get total interviews count
    const totalInterviews = await db
      .select({
        count: sql<number>`COUNT(*)`
      })
      .from(MockInterview);

    // Get total job applications
    const totalApplications = await db
      .select({
        count: sql<number>`COUNT(*)`
      })
      .from(jobApplication);

    return NextResponse.json({
      totalUsers: uniqueUsers[0].count,
      totalInterviews: totalInterviews[0].count,
      totalApplications: totalApplications[0].count
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json(
      { error: 'Failed to get statistics' },
      { status: 500 }
    );
  }
} 