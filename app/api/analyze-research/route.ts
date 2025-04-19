import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini model with a more capable model
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_URL || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: Request) {
  try {
    const { pdfText } = await request.json();

    if (!pdfText || typeof pdfText !== 'string' || pdfText.trim().length === 0) {
      return NextResponse.json({ error: "No PDF text provided" }, { status: 400 });
    }

    // Truncate PDF text to avoid hitting token limits
    const truncatedPdfText = pdfText.slice(0, 25000);

    // Create a more detailed prompt with specific schema instructions
    const prompt = `Analyze this research paper and provide a comprehensive analysis.
    
IMPORTANT: Your response MUST adhere to this EXACT JSON structure:
{
  "title": "Research Paper Title",
  "journal": "Publication Source (Journal/Conference)",
  "year": "Publication Year",
  
  "contributions": [
    {
      "point": "Short 1-5 word key contribution heading",
      "description": "Detailed 1-2 sentence explanation"
    },
    // 2-3 more contributions
  ],
  "limitations": [
    {
      "point": "Short limitation heading",
      "description": "Detailed 1-2 sentence explanation"
    },
    // 2-3 more limitations
  ],
  "areaOfFocus": "Research domain with specific focus",
  "methodology": {
    "approach": "General description of the research approach",
    "tools": ["Tool/Technology 1", "Tool/Technology 2", "Tool/Technology 3"]
  },
  "futureWork": [
    "Future research direction 1",
    "Future research direction 2",
    "Future research direction 3"
  ],
  
}

Ensure exactly 3 contributions and 3 limitations are provided, each with a brief point and detailed description.

Research Paper Text:
${truncatedPdfText}

Remember to format your ENTIRE response as valid JSON according to the schema above. Include exactly 3 contributions, 3 limitations, and 3 future work directions specified in the schema. Do not include any explanations, headers, or text outside the JSON structure.`

    // Set up generation config with larger output tokens and stricter temperature
    const generationConfig = {
      temperature: 0.2,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json'
    };

    // Process with error handling and timeout
    try {
      const result = await Promise.race([
        model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Analysis request timed out')), 35000)
        )
      ]) as any;
      
      const response = result.response;
      const text = response.text();
      
      try {
        // Attempt to parse the response as JSON
        const jsonObj = JSON.parse(text);
        
        // Validate required fields
        const requiredFields = ['title', 'journal', 'year',  'contributions', 'limitations', 'areaOfFocus', 'methodology', 'futureWork'];
        const missingFields = requiredFields.filter(field => !jsonObj[field]);
        
        if (missingFields.length > 0) {
          console.error('Missing fields in response:', missingFields);
          throw new Error(`Response missing required fields: ${missingFields.join(', ')}`);
        }
        
        return NextResponse.json(jsonObj);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Failed to parse API response');
      }
    } catch (generationError) {
      console.error('Generation error:', generationError);
      
      // Fallback to a simpler prompt
      const fallbackPrompt = `Analyze this research paper and provide a simplified analysis as JSON. 
      Format must be valid JSON with these fields: title, journal, year, areaOfFocus, contributions (array of 3 objects with point and description), 
      limitations (array of 3 objects with point and description), methodology (object with approach and tools array), futureWork (array of 3 strings).
      
      Paper: ${truncatedPdfText.slice(0, 15000)}`;
      
      const fallbackResult = await model.generateContent(fallbackPrompt);
      const fallbackText = fallbackResult.response.text();
      
      try {
        return NextResponse.json(JSON.parse(fallbackText));
      } catch (fallbackParseError) {
        // Last resort: construct a minimal valid response
        return NextResponse.json({
          title: "Could not determine paper title",
          journal: "Unknown source",
          year: "Unknown",
         
          contributions: [
            { point: "Main finding", description: "The paper appears to discuss research findings but details could not be extracted." }
          ],
          limitations: [
            { point: "Analysis limitation", description: "The analysis system encountered difficulties processing this paper." }
          ],
          areaOfFocus: "Research paper analysis",
          methodology: {
            approach: "Could not determine methodology",
            tools: ["Unknown"]
          },
          futureWork: ["Further analysis recommended"]
          
        });
      }
    }
  } catch (error) {
    console.error('Error analyzing research paper:', error);
    return NextResponse.json({ error: "Failed to analyze research paper" }, { status: 500 });
  }
}