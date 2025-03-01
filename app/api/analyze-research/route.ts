import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_URL!);

export async function POST(request: Request) {
  try {
    const { pdfText } = await request.json();

    if (!pdfText) {
      return NextResponse.json(
        { message: 'Missing PDF text content' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this research paper and provide a JSON response.
      
      Research Paper:
      ${pdfText}

      Return only a valid JSON object with this exact structure:
      {
        "title": string,
        "journal": string,
        "year": string,
        "contributions": [
          { "point": string, "description": string },
          { "point": string, "description": string },
          { "point": string, "description": string }
        ],
        "limitations": [
          { "point": string, "description": string },
          { "point": string, "description": string },
          { "point": string, "description": string }
        ],
        "areaOfFocus": string,
        "methodology": {
          "approach": string,
          "tools": string[]
        },
        "futureWork": string[]
      }

      Ensure exactly 3 contributions and 3 limitations are provided, each with a brief point and detailed description.
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
        !analysis.title ||
        !analysis.journal ||
        !analysis.year ||
        !Array.isArray(analysis.contributions) ||
        analysis.contributions.length !== 3 ||
        !Array.isArray(analysis.limitations) ||
        analysis.limitations.length !== 3 ||
        !analysis.areaOfFocus ||
        !analysis.methodology ||
        !Array.isArray(analysis.methodology.tools) ||
        !Array.isArray(analysis.futureWork)
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
    console.error('Research analysis error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to analyze research paper',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 