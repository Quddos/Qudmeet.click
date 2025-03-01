import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_URL);

export async function POST(req) {
  try {
    const { industry, interests, budget } = await req.json();

    const prompt = `Generate a detailed business idea based on the following criteria:
    Industry: ${industry}
    Personal Interests & Skills: ${interests}
    Available Budget: ${budget}

    Please provide a structured response that includes:
    1. Business Concept
    2. Target Market
    3. Initial Setup Requirements
    4. Marketing Strategy
    5. Potential Challenges
    6. Estimated Timeline
    7. Budget Allocation
    8. Growth Opportunities`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ idea: text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to generate business idea' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 