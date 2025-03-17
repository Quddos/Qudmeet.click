import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { messages, pdfText, enhancedMode = false } = await request.json()

    if (!pdfText) {
      return NextResponse.json(
        { error: 'PDF text is required' },
        { status: 400 }
      )
    }

    // Get the latest user message
    const latestUserMessage = messages[messages.length - 1].content

    // Check if the message is requesting visualization
    const isVisualizationRequest = latestUserMessage.toLowerCase().includes('chart') || 
                                  latestUserMessage.toLowerCase().includes('graph') || 
                                  latestUserMessage.toLowerCase().includes('visual') ||
                                  latestUserMessage.toLowerCase().includes('plot') ||
                                  latestUserMessage.toLowerCase().includes('diagram')

    // Prepare the prompt with context from the PDF
    const prompt = `
    ${enhancedMode ? `
    You are an intelligent assistant that can both answer questions about the provided document AND extend beyond it with your knowledge.
    
    When responding to questions:
    1. First, check if the document contains relevant information to answer the question.
    2. If the document contains information, use it as your primary source and clearly indicate what comes from the document.
    3. If the document doesn't fully answer the question or if the user asks for more information beyond what's in the document:
       - Clearly indicate when you're providing information beyond what's in the document
       - Use your knowledge to expand on the topic, provide examples, comparisons, or additional context
       - Be helpful, accurate, and comprehensive in your responses
    
    For example, if the document mentions "I am a man" and the user asks "What gender are you?", you should respond with information from the document.
    But if they ask "What are the differences between a man and other genders?", you should first reference any relevant information from the document,
    then expand with your knowledge about gender differences, characteristics, etc.
    
    Always maintain a helpful, informative tone and provide well-structured responses.
    ` : `
    You are a helpful assistant that answers questions about the following document. 
    Use only the information from the document to answer questions. 
    If you don't know the answer based on the document, say so clearly and suggest what information might be needed.
    `}
    
    If the document content is limited or unclear, help the user understand what might be missing and suggest alternative questions.
    
    Format your responses in a clear, readable way. Use bullet points for lists and keep paragraphs concise.
    
    ${isVisualizationRequest ? `
    If the user is asking for a chart or visualization:
    1. Analyze the document for relevant numerical data
    2. Create appropriate chart data in JSON format
    3. Format your response with the chart data in a code block using this format:
       \`\`\`chart [type] 
       {
         "labels": ["Label1", "Label2", ...],
         "datasets": [
           {
             "label": "Dataset Label",
             "data": [value1, value2, ...],
             "backgroundColor": ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)", ...],
             "borderColor": ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", ...],
             "borderWidth": 1
           }
         ],
         "title": "Chart Title"
       }
       \`\`\`
    
    Where [type] is one of: pie, bar, or line. Choose the most appropriate chart type for the data.
    For pie charts: use when comparing parts of a whole
    For bar charts: use when comparing categories
    For line charts: use when showing trends over time or sequences
    
    Include a brief explanation of what the chart shows before the chart code block.
    ` : ''}
    
    Document content:
    ${pdfText.slice(0, 30000)}
    
    User question: ${latestUserMessage}
    `

    // Get the API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY_URL

    if (!apiKey) {
      throw new Error('Gemini API key is not configured')
    }

    // Get the API URL from environment variables or use the default
    const apiBaseUrl = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1'
    
    // Extract the model name and version from the URL or use default
    let modelName = 'gemini-pro'
    
    // If the URL contains a specific model, extract it
    if (process.env.GEMINI_API_URL) {
      const urlParts = process.env.GEMINI_API_URL.split('/')
      const modelPart = urlParts.find(part => part.includes('gemini-'))
      if (modelPart) {
        modelName = modelPart.split(':')[0]
      }
    }

    // For enhanced mode, prefer more capable models
    if (enhancedMode) {
      // Prefer more capable models for enhanced mode
      modelName = process.env.ENHANCED_MODEL || 'gemini-1.5-pro'
    }

    try {
      console.log(`Trying with model: ${modelName}`)
      
      // Call Gemini API with the model from environment variables
      const response = await fetch(`${apiBaseUrl}/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: enhancedMode ? 0.8 : 0.7, // Slightly higher temperature for enhanced mode
            maxOutputTokens: enhancedMode ? 1500 : 1000, // More tokens for enhanced mode
          }
        }),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Gemini API error:', errorData)
        
        // Try fallback model if first attempt fails
        return await callFallbackModel(apiKey, prompt, isVisualizationRequest, enhancedMode)
      }

      const data = await response.json()
      
      // Handle potential errors in the response structure
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error('Invalid response format from Gemini API')
      }
      
      const generatedText = data.candidates[0].content.parts[0].text

      return NextResponse.json({ response: generatedText })
    } catch (error) {
      console.error('Error with primary model:', error)
      // Try fallback model if first attempt fails with an error
      return await callFallbackModel(apiKey, prompt, isVisualizationRequest, enhancedMode)
    }
  } catch (error) {
    console.error('Error in chat-pdf API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    )
  }
}

// Fallback function to try alternative Gemini models
async function callFallbackModel(apiKey: string, prompt: string, isVisualizationRequest: boolean = false, enhancedMode: boolean = false) {
  // List of models to try in order
  let fallbackModels: string[] = []
  
  if (enhancedMode) {
    // For enhanced mode, prioritize more capable models
    fallbackModels = [
      'gemini-1.5-pro', 
      'gemini-1.5-flash', 
      'gemini-pro', 
      'gemini-1.0-pro'
    ]
  } else if (isVisualizationRequest) {
    // For visualization requests
    fallbackModels = [
      'gemini-1.5-pro', 
      'gemini-1.5-flash', 
      'gemini-pro', 
      'gemini-1.0-pro'
    ]
  } else {
    // Standard mode
    fallbackModels = [
      'gemini-pro', 
      'gemini-1.0-pro', 
      'gemini-1.5-pro', 
      'gemini-1.5-flash'
    ]
  }
  
  let lastError: Error | null = null
  
  // Try each model in sequence
  for (const model of fallbackModels) {
    try {
      console.log(`Trying fallback model: ${model}`)
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: enhancedMode ? 0.8 : 0.7,
            maxOutputTokens: enhancedMode ? 1500 : (isVisualizationRequest ? 1500 : 1000),
          }
        }),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error(`Fallback model ${model} error:`, errorData)
        lastError = new Error(`Gemini API error with model ${model}: ${response.status}`)
        continue // Try next model
      }

      const data = await response.json()
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        lastError = new Error(`Invalid response format from Gemini API with model ${model}`)
        continue // Try next model
      }
      
      const generatedText = data.candidates[0].content.parts[0].text
      return NextResponse.json({ response: generatedText })
    } catch (error) {
      console.error(`Error with fallback model ${model}:`, error)
      lastError = error instanceof Error ? error : new Error(String(error))
      // Continue to next model
    }
  }
  
  // If all models failed, throw the last error
  throw lastError || new Error('All Gemini API models failed')
} 