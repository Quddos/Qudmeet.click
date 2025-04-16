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
    const systemPrompt = `You are a helpful assistant analyzing the following document content. Use this content to answer the user's questions.
      
Document content:
${truncatedPdfText}

${enhancedMode ? 'If you cannot find the answer in the document, you can use your general knowledge to provide a helpful response.' : 'Only answer based on the document content provided. If the information is not in the document, say so.'}

Respond in a concise, helpful manner. Format your responses with markdown when appropriate.`

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