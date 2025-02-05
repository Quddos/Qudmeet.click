'use client';

import { useState } from 'react';
import { Button as ButtonComponent } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Download, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
import { pdfjs } from 'react-pdf';
import type * as React from 'react'
import type { TextareaHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

// Add type definition
interface CustomButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

// Update Button type
const Button = ButtonComponent as React.ForwardRefExoticComponent<CustomButtonProps>;

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function AIHumanizer() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [humanizeScore, setHumanizeScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const processDocx = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('DOCX processing error:', error);
      throw new Error('Failed to process DOCX file');
    }
  };

  const processPdf = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const items = content.items as { str: string }[];
        text += items.map(item => item.str).join(' ') + '\n';
      }
      
      return text;
    } catch (error) {
      console.error('PDF processing error:', error);
      throw new Error('Failed to process PDF file');
    }
  };

  const downloadFile = (content: string, format: string) => {
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `humanized-text.${format}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let text = '';
      const fileType = file.name.split('.').pop()?.toLowerCase();

      switch (fileType) {
        case 'txt':
          text = await file.text();
          break;
        case 'docx':
          text = await processDocx(file);
          break;
        case 'pdf':
          text = await processPdf(file);
          break;
        default:
          toast.error('Unsupported file format');
          return;
      }

      setInputText(text);
      toast.success('File processed successfully');
    } catch (error) {
      toast.error('Error processing file');
      console.error('File processing error:', error);
    }
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to humanize');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) throw new Error('Failed to humanize text');

      const data = await response.json();
      setOutputText(data.humanizedText);
      setHumanizeScore(95); // Example score - adjust based on your logic
      setShowSuccess(true);
      toast.success('Text humanized successfully!', {
        icon: '🎉',
        duration: 4000,
      });
    } catch (error) {
      toast.error('Failed to humanize text');
      console.error('Humanization error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      toast.success('Copied to clipboard');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy text');
    }
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-200px)] py-4">
      <div className="grid grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Input</h2>
            <div className="flex gap-2">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".txt,.docx,.pdf"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Upload File
              </label>
            </div>
          </div>
          <div className="w-full">
            <Textarea
              {...{
                placeholder: "Enter your AI-generated text here...",
                className: "w-full h-auto min-h-[400px] max-h-[calc(100vh-300px)]",
                value: inputText,
                onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setInputText(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                },
                style: { height: 'auto', minHeight: '400px' }
              } as TextareaProps}
            />
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Humanized Output</h2>
            {outputText && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCopy}>
                  Copy
                </Button>
                <Button variant="outline" onClick={() => downloadFile(outputText, 'txt')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>
          <div className="relative w-full">
            <Textarea
              {...{
                value: outputText,
                readOnly: true,
                className: "w-full h-auto min-h-[400px] max-h-[calc(100vh-300px)]",
                style: { height: 'auto', minHeight: '400px' }
              } as TextareaProps}
            />
            {showSuccess && outputText && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 p-6 rounded-xl shadow-lg text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Successfully Humanized!</h3>
                <p className="text-green-600 font-semibold">
                  {humanizeScore}% Human-Like Score
                </p>
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowSuccess(false)}
                >
                  Continue Editing
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Button
          onClick={handleHumanize}
          disabled={isProcessing}
          className="w-40"
        >
          {isProcessing ? 'Processing...' : 'Humanize'}
        </Button>
      </div>
    </div>
  );
} 