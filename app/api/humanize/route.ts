import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_URL!);

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Transform this AI-generated text into natural human writing that can bypass AI detection. 
      example:
      AI-generated text:
      "Adaptive VR rehabilitation without EEG/BCI dependency, making therapy more accessible, immersive, and cost-effective."
      
      Humanized text:
      "Breakthroughs with low-cost immersive therapy solutions foster adaptive virtual reality rehabilitation with no dependence on EEG or BCI."
      
      Key transformation rules:
      1. Preserve the original format/structure if present
      2. Make it sound as natural as your example B, which successfully bypassed AI detection. Focus on making it feel authentically human while preserving the key information.
      3. Add a few more sentences to make it more natural and human-like.
      4. Include a few more sentences to make it more natural and human-like.
      5. Vary the sentence length and structure to make it more natural and human-like.
      6. Keep the original meaning but express it like a human would write.
      7. Remove any obvious AI patterns or overly perfect formatting.
      8. Maintain the original meaning and key information.

      Original text:
      ${text}

      Transform this text to sound naturally human-written while keeping its original structure. Return only the humanized text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const humanizedText = response.text();

    return NextResponse.json({ humanizedText });

  } catch (error) {
    console.error('Humanization error:', error);
    return NextResponse.json(
      { message: 'Failed to humanize text' },
      { status: 500 }
    );
  }
} 