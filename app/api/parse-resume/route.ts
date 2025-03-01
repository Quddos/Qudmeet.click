import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_URL!);

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this resume against the job description and provide a JSON response.
      
      Resume:
      ${resumeText}

      Job Description:
      ${jobDescription}

      Return only a valid JSON object with this exact structure:
      {
        "overallScore": number,
        "skills": {
          "matched": string[],
          "missing": string[]
        },
        "experience": {
          "score": number,
          "feedback": string
        },
        "education": {
          "score": number,
          "feedback": string
        },
        "recommendations": string[]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Remove any markdown formatting that might be present
    const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const analysis = JSON.parse(cleanJson);
      
      // Validate the response structure
      if (
        typeof analysis.overallScore !== 'number' ||
        !Array.isArray(analysis.skills?.matched) ||
        !Array.isArray(analysis.skills?.missing) ||
        typeof analysis.experience?.score !== 'number' ||
        typeof analysis.experience?.feedback !== 'string' ||
        typeof analysis.education?.score !== 'number' ||
        typeof analysis.education?.feedback !== 'string' ||
        !Array.isArray(analysis.recommendations)
      ) {
        throw new Error('Invalid response structure');
      }

      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error('Error parsing AI response:', text);
      return NextResponse.json(
        { 
          message: 'Error parsing analysis results',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Resume analysis error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to analyze resume',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 