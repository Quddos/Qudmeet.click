'use client'

import { useState } from 'react'
import ChatPDFButton from '@/components/ChatPDFButton'
import Header from '@/components/header'
import { Toaster, toast } from 'sonner'
import { BarChart, PieChart, LineChart } from 'lucide-react'

export default function TestChatPDF() {
  const [pdfText, setPdfText] = useState<string>('')
  const [pdfName, setPdfName] = useState<string>('')

  // Sample PDF text for testing with numerical data for charts
  const sampleText = `
  # Sample Document for Testing ChatPDF with Data Visualization

  ## Introduction
  This is a sample document to test the ChatPDF functionality. It contains various sections with information that can be queried, including numerical data for chart generation.

  ## Key Concepts
  1. **Machine Learning**: A subset of artificial intelligence that enables systems to learn and improve from experience.
  2. **Neural Networks**: Computing systems inspired by biological neural networks that form the basis of deep learning.
  3. **Natural Language Processing**: The ability of computers to understand and process human language.

  ## Methodology
  The research methodology involved collecting data from various sources, preprocessing it to remove noise, and then applying machine learning algorithms to extract insights.

  ## Results
  The results showed a 25% improvement in accuracy compared to previous methods. The model achieved 92% precision and 89% recall on the test dataset.

  ### Performance Metrics by Model Type
  | Model Type | Accuracy | Precision | Recall | F1 Score |
  |------------|----------|-----------|--------|----------|
  | CNN        | 88%      | 92%       | 89%    | 90.5%    |
  | RNN        | 85%      | 88%       | 86%    | 87%      |
  | Transformer| 94%      | 95%       | 93%    | 94%      |
  | LSTM       | 87%      | 89%       | 88%    | 88.5%    |

  ### Training Time Comparison
  | Model Type | Training Time (hours) |
  |------------|----------------------|
  | CNN        | 4.5                  |
  | RNN        | 6.2                  |
  | Transformer| 8.7                  |
  | LSTM       | 5.8                  |

  ### User Satisfaction Survey Results
  | Feature           | Satisfaction Score (1-10) |
  |-------------------|---------------------------|
  | UI Design         | 8.5                       |
  | Response Time     | 7.2                       |
  | Accuracy          | 9.1                       |
  | Ease of Use       | 8.7                       |
  | Documentation     | 6.9                       |

  ### Monthly Active Users (Last 6 Months)
  | Month     | Users    |
  |-----------|----------|
  | January   | 12,450   |
  | February  | 13,820   |
  | March     | 15,640   |
  | April     | 18,230   |
  | May       | 21,050   |
  | June      | 24,680   |

  ## Conclusion
  This research demonstrates the effectiveness of the proposed approach and opens up new avenues for future work in this domain. The Transformer model outperformed all other models in terms of accuracy and F1 score, though it required the longest training time.
  `

  // Example chart questions
  const chartQuestions = [
    "Create a bar chart of model accuracy",
    "Show a pie chart of user satisfaction scores",
    "Generate a line chart of monthly active users",
    "Visualize the training time comparison",
    "Compare precision and recall in a chart"
  ]

  const handleLoadSample = () => {
    setPdfText(sampleText)
    setPdfName('sample_document_with_data.pdf')
  }

  const handleClearSample = () => {
    setPdfText('')
    setPdfName('')
  }

  const handleChartQuestionClick = (question: string) => {
    // Find the chat button and simulate a click to open the chat
    const chatPdfButton = document.getElementById('primary-chat-pdf-button')
    if (chatPdfButton) {
      // First ensure the sample document is loaded
      if (!pdfText) {
        // Load the sample document first
        setPdfText(sampleText)
        setPdfName('sample_document_with_data.pdf')
      }
      
      // Then click the chat button
      (chatPdfButton as HTMLElement).click()
      
      // You could also add logic here to pre-populate the chat with the question
      // This would require modifying the ChatPDF component to accept an initial message
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <Toaster position="top-center" />
      <Header />
      <main className="mt-[80px] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ChatPDF Test Page
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This page is for testing the ChatPDF functionality with data visualization
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex space-x-4">
                <button
                  onClick={handleLoadSample}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Load Sample Document
                </button>
                <button
                  onClick={handleClearSample}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>

              {pdfText ? (
                <div className="w-full">
                  <div className="p-4 bg-gray-100 rounded-lg mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Document: {pdfName}</h3>
                    <pre className="whitespace-pre-wrap text-xs text-gray-600 max-h-60 overflow-y-auto">
                      {pdfText}
                    </pre>
                  </div>
                  
                  {/* Chart Examples Section */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-700 mb-3 flex items-center">
                      <BarChart className="h-5 w-5 mr-2" />
                      Try these chart examples:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {chartQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleChartQuestionClick(question)}
                          className="text-sm bg-white border border-blue-200 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
                        >
                          {index % 3 === 0 && <BarChart className="h-4 w-4 mr-2 text-blue-500" />}
                          {index % 3 === 1 && <PieChart className="h-4 w-4 mr-2 text-blue-500" />}
                          {index % 3 === 2 && <LineChart className="h-4 w-4 mr-2 text-blue-500" />}
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <div id="primary-chat-pdf-button">
                      <ChatPDFButton 
                        pdfText={pdfText} 
                        pdfName={pdfName} 
                        variant="primary"
                      />
                    </div>
                    <ChatPDFButton 
                      pdfText={pdfText} 
                      pdfName={pdfName} 
                      variant="secondary"
                    />
                  </div>
                  
                  <div className="mt-8">
                    <p className="text-sm text-gray-500 text-center">
                      A floating chat button should appear at the bottom right on mobile view
                    </p>
                    <div className="sm:hidden mt-4">
                      <ChatPDFButton 
                        pdfText={pdfText} 
                        pdfName={pdfName}
                        variant="floating"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">
                    Click "Load Sample Document" to test the ChatPDF functionality
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 