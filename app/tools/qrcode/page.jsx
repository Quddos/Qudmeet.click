'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'



export default function QRCodePage() {
  const [text, setText] = useState('')
  const [qrSize, setQrSize] = useState(256)
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [fgColor, setFgColor] = useState('#000000')

  const downloadQR = () => {
    const svg = document.getElementById('qr-code')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = qrSize
      canvas.height = qrSize
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = 'qrcode.png'
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-center mb-8">
              QR Code Generator
            </h1>

            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter URL or Text
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Customization Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      QR Size
                    </label>
                    <input
                      type="range"
                      min="128"
                      max="512"
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Colors
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-8 h-8 rounded"
                        title="QR Code Color"
                      />
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded"
                        title="Background Color"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Display */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-xl shadow-inner">
                  <QRCodeSVG
                    id="qr-code"
                    value={text || 'https://qudmeet.click'}
                    size={qrSize}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level="H"
                    includeMargin
                  />
                </div>

                <Button
                  onClick={downloadQR}
                  disabled={!text}
                  className="px-6 py-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
} 