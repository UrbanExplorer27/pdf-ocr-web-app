import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import ResultsDisplay from './components/ResultsDisplay'
import Header from './components/Header'
import { OCRResult } from './types'

function App() {
  const [result, setResult] = useState<OCRResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOCRComplete = (data: OCRResult) => {
    setResult(data)
    setError(null)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setResult(null)
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              PDF OCR Tool
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload PDF files or images to extract text using advanced OCR technology. 
              Get accurate text extraction with our enhanced image processing pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <FileUpload
                onOCRComplete={handleOCRComplete}
                onError={handleError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
              
              {error && (
                <div className="card bg-red-50 border-red-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              {result && (
                <ResultsDisplay 
                  result={result} 
                  onReset={handleReset}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
