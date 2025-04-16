import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini model
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_URL || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // Format history for Gemini
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Get the last message (current prompt)
    const lastMessage = messages[messages.length - 1];
    
    // Create a chat session
    const chat = model.startChat({
      history: history.length > 0 ? history : undefined,
    });

    // Generate content
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    const text = response.text();

    // Return response
    return NextResponse.json({ 
      response: text || 'No response generated'
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
} 