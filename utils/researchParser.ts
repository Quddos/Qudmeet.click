import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_URL!);

interface ResearchAnalysis {
  title: string;
  journal: string;
  year: string;
  contribution: string;
  limitation: string;
  areaOfFocus: string;
  methodology: {
    approach: string;
    tools: string[];
  };
  citations: number;
  futureWork: string[];
}

export async function parseAndAnalyzeResearch(
  pdfText: string
): Promise<ResearchAnalysis> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this research paper and provide a detailed analysis.
    Return a JSON response with the following structure:
    {
      "title": "paper title",
      "journal": "journal or conference name",
      "year": "publication year",
      "contribution": "main contributions of the paper",
      "limitation": "research limitations",
      "areaOfFocus": "research domain/area",
      "methodology": {
        "approach": "research methodology used",
        "tools": ["list of tools/technologies used"]
      },
      "citations": number of citations (if available, else 0),
      "futureWork": ["list of future work suggestions"]
    }

    Research Paper Text:
    ${pdfText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing research paper:", error);
    throw new Error("Failed to analyze research paper");
  }
} 