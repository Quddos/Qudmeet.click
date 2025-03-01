import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_URL!);

interface ResumeScore {
  overallScore: number;
  skills: {
    matched: string[];
    missing: string[];
  };
  experience: {
    score: number;
    feedback: string;
  };
  education: {
    score: number;
    feedback: string;
  };
  recommendations: string[];
}

export async function parseAndScoreResume(
  resumeText: string,
  jobDescription: string
): Promise<ResumeScore> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = `
    Analyze this resume against the job description provided. 
    Return a JSON response with the following structure:
    {
      "overallScore": (0-100),
      "skills": {
        "matched": ["list of matching skills"],
        "missing": ["list of missing but required skills"]
      },
      "experience": {
        "score": (0-100),
        "feedback": "detailed feedback"
      },
      "education": {
        "score": (0-100),
        "feedback": "detailed feedback"
      },
      "recommendations": ["list of specific improvements"]
    }

    Resume:
    ${resumeText}

    Job Description:
    ${jobDescription}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw new Error("Failed to analyze resume");
  }
} 