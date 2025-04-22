import { NextResponse } from 'next/server'
import { GoogleGenerativeAI, Part, GenerativeModel } from '@google/generative-ai'

// Initialize the Gemini model
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_URL || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Define interface for message structure
interface ChatMessage {
  role: string;
  content: string;
}

// Define Gemini API message format
interface GeminiMessage {
  role: 'user' | 'model';
  parts: Part[];
}

export async function POST(request: Request) {
  try {
    const { messages, pdfText, enhancedMode = false } = await request.json()

    if (!messages || !Array.isArray(messages) || !pdfText) {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 })
    }

    // Truncate PDF text if too long
    const truncatedPdfText = pdfText.slice(0, 30000)

    // Create system prompt with context from the PDF
    const systemPrompt = `You are a knowledgeable research assistant analyzing the following document content.

Document content:
${truncatedPdfText}

YOUR CAPABILITIES:
1. DOCUMENT ANALYSIS:
   - Answer questions about the specific content in the document
   - Explain concepts from the document in clear, accessible language
   - Identify key findings, methods, and conclusions

2. GENERAL KNOWLEDGE:
   - Provide information on topics related to but not covered in the document
   - Help users understand broader context beyond what's explicitly stated
   - Suggest related resources or approaches that might be helpful

3. USER ASSISTANCE:
   - Respond directly to the user's needs and questions
   - Adapt your responses based on the conversation context
   - Offer practical advice and actionable insights

GUIDELINES:
- When answering questions about the document, clearly indicate what information comes from the document versus your general knowledge
- Always prioritize being helpful to the user rather than being strictly limited to the document
- Format your responses with HTML instead of markdown for better readability:
  - For important points, use phrases like "Important:" or "Note:" at the beginning of sentences
  - Avoid using ** for bold text, as the system will automatically format key terms appropriately
  - Use clear section headings when organizing information
- Be concise yet thorough in your explanations
- Don't hesitate to provide additional context or information that might be useful even if not directly asked

Respond in a helpful, conversational manner while being accurate about the document's content.`

    // Format history for Gemini
    // Add system prompt to the first user message
    const firstUserMessageIndex = messages.findIndex((msg: ChatMessage) => msg.role === 'user');
    
    let formattedHistory: GeminiMessage[] = [];
    if (firstUserMessageIndex !== -1) {
      formattedHistory = messages.map((msg: ChatMessage, index: number) => {
        if (index === firstUserMessageIndex) {
          return {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${msg.content}` }]
          };
        } else {
          return {
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          };
        }
      });
    } else {
      // If no user message found, just convert messages
      formattedHistory = messages.map((msg: ChatMessage) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
    }

    // Create a chat session with history
    const chat = model.startChat({
      history: formattedHistory.length > 1 ? formattedHistory.slice(0, -1) : [],
    });

    // Get the last message
    const lastMessage = formattedHistory[formattedHistory.length - 1];
    
    // Send the message and get response
    const result = await chat.sendMessage(lastMessage.parts[0].text || '');
    const response = result.response;
    const text = response.text();

    // Return response
    return NextResponse.json({ 
      response: text || 'No response generated'
    })
  } catch (error) {
    console.error('Chat PDF API error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}