import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini model with a larger model for better context handling
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_URL || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: Request) {
  try {
    const { messages, pdfText, enhancedMode } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // Validate PDF text
    if (!pdfText || typeof pdfText !== 'string' || pdfText.trim().length === 0) {
      return NextResponse.json({ 
        response: "I don't have any research paper content to analyze. Please upload a research paper PDF first." 
      });
    }

    // Truncate PDF text to avoid hitting token limits
    const truncatedPdfText = pdfText.slice(0, 25000);
    
    // Build an enhanced system prompt that enables broader knowledge
    const systemPrompt = `You are an advanced academic and research assistant with broad knowledge across multiple domains. You have access to a research paper, but you can also draw on your general knowledge to help users with their questions.

Current research paper content: "${truncatedPdfText}"

YOUR CAPABILITIES:
1. RESEARCH PAPER ANALYSIS:
   - Explain concepts from the paper in clear, accessible language
   - Identify key findings, methods, and limitations
   - Relate the paper to broader academic contexts
   - Compare methodologies with alternatives not mentioned in the paper

2. GENERAL KNOWLEDGE:
   - Provide information on topics not covered in the paper
   - Answer questions about related technologies, frameworks, and platforms (e.g., Meta Quest, Unity ML, game engines)
   - Explain how concepts from the paper could be implemented using specific tools
   - Suggest methodologies for applying paper concepts in different contexts

3. TECHNICAL GUIDANCE:
   - Recommend implementation approaches for concepts mentioned in the paper
   - Suggest tools, frameworks, and platforms for practical applications
   - Provide high-level guidance on development methodologies

GUIDELINES:
- When answering questions about the paper, clearly indicate what information comes from the paper versus your general knowledge
- Don't claim the paper mentions something it doesn't - be transparent about the source of your information
- When asked about topics not in the paper (like Meta Quest or Unity ML), freely draw on your general knowledge
- Format responses with markdown for readability
- If asked how to implement concepts from the paper using specific tools/platforms not mentioned in the paper, provide helpful guidance
- When discussing AR/VR technologies, provide practical implementation details when requested`;

    // Format history for Gemini - filter out empty messages and limit history length
    const filteredMessages = messages.filter(msg => 
      msg.content && msg.content.trim().length > 0
    );
    
    const history = filteredMessages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Get the last message (current prompt)
    const lastMessage = filteredMessages[filteredMessages.length - 1];
    
    try {
      // Create a chat session with system prompt at the beginning
      const chat = model.startChat({
        history: [{
          role: 'model',
          parts: [{ text: systemPrompt }]
        }, 
        ...history],
      });

      // Generate content with timeout handling
      const result = await Promise.race([
        chat.sendMessage(lastMessage.content),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 30000)
        )
      ]) as any;
      
      const response = result.response;
      const text = response.text();

      return NextResponse.json({ 
        response: text || 'I apologize, but I couldn\'t generate a response. Please try rephrasing your question.'
      });
    } catch (chatError) {
      console.error('Chat generation error:', chatError);
      
      // Attempt a simpler direct generation as fallback with broader scope
      try {
        // Determine if question likely requires general knowledge
        const userQuestion = lastMessage.content.toLowerCase();
        const generalKnowledgeIndicators = [
          'meta quest', 'unity', 'game engine', 'how would', 'how to implement', 
          'can you guide', 'methodology', 'what if', 'beyond the paper', 
          'outside of this research', 'what is', 'how can i', 'guide me'
        ];
        
        const isLikelyGeneralQuestion = generalKnowledgeIndicators.some(indicator => 
          userQuestion.includes(indicator.toLowerCase())
        );
        
        // Create appropriate fallback prompt based on question type
        let fallbackPrompt;
        
        if (isLikelyGeneralQuestion) {
          fallbackPrompt = `You are a knowledgeable research and technology assistant. Answer this question using your general knowledge and the context of the research paper.

Context from research paper (for reference):
"${truncatedPdfText.slice(0, 10000)}"

User's question:
"${lastMessage.content}"

Provide a helpful, informative response that addresses the question directly. If the question is about implementing concepts using specific technologies not mentioned in the paper, provide practical guidance.`;
        } else {
          fallbackPrompt = `Based on this research paper:
"${truncatedPdfText.slice(0, 15000)}"

Please answer the following question:
"${lastMessage.content}"

Provide a concise, informative response based primarily on the paper content, but you may also include relevant information from your general knowledge when appropriate.`;
        }

        const fallbackResult = await model.generateContent(fallbackPrompt);
        const fallbackText = fallbackResult.response.text();
        
        return NextResponse.json({ 
          response: fallbackText || 'I apologize, but I couldn\'t process your question. Please try a different approach.'
        });
      } catch (fallbackError) {
        console.error('Fallback generation error:', fallbackError);
        throw new Error('Both primary and fallback methods failed');
      }
    }
  } catch (error) {
    console.error('Chat Research API error:', error);
    return NextResponse.json({ 
      response: 'I\'m having difficulty processing your request at the moment. Please try a simpler question or try again later.' 
    });
  }
} 