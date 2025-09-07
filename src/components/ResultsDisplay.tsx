import React, { useState } from 'react'
import { Copy, Download, RotateCcw, Eye, EyeOff, FileText, BarChart3 } from 'lucide-react'
import { OCRResult } from '../types'

interface ResultsDisplayProps {
  result: OCRResult
  onReset: () => void
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  const [showFullText, setShowFullText] = useState(false)
  const [copied, setCopied] = useState(false)

  // Safety check for result data
  if (!result || !result.success) {
    return (
      <div className="card">
        <div className="text-center text-gray-500">
          <p>No results to display</p>
        </div>
      </div>
    )
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const downloadText = () => {
    const text = result.full_text || ''
    const filename = result.filename || 'extracted_text'
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename.replace(/\.[^/.]+$/, '')}_extracted_text.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Extraction Results</h2>
        <button
          onClick={onReset}
          className="btn-secondary flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Upload</span>
        </button>
      </div>

      {/* File Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <FileText className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">{result.filename || 'Unknown file'}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {result.total_pages ? `${result.total_pages} pages` : '1 page'}
            </span>
          </div>
          <div className="text-gray-600">
            {(result.total_words || 0).toLocaleString()} words
          </div>
          <div className="text-gray-600">
            {(result.total_characters || 0).toLocaleString()} characters
          </div>
          <div className="text-gray-600">
            {formatFileSize(result.total_characters || 0)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => copyToClipboard(result.full_text || '')}
          className="btn-primary flex items-center space-x-2"
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? 'Copied!' : 'Copy Text'}</span>
        </button>
        
        <button
          onClick={downloadText}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        
        <button
          onClick={() => setShowFullText(!showFullText)}
          className="btn-secondary flex items-center space-x-2"
        >
          {showFullText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showFullText ? 'Hide' : 'Show'} Full Text</span>
        </button>
      </div>

      {/* Text Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Extracted Text</h3>
        
        {result.pages && result.pages.length > 1 && (
          <div className="space-y-3">
            {result.pages.map((page) => (
              <div key={page.page} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Page {page.page}</h4>
                  <span className="text-sm text-gray-500">
                    {page.word_count || 0} words, {page.character_count || 0} chars
                  </span>
                </div>
                <div className="text-sm text-gray-700 bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                  {page.text || 'No text detected on this page.'}
                </div>
              </div>
            ))}
          </div>
        )}

        {showFullText && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Complete Text</h4>
            <div className="text-sm text-gray-700 bg-gray-50 rounded p-3 max-h-96 overflow-y-auto whitespace-pre-wrap">
              {result.full_text || 'No text extracted.'}
            </div>
          </div>
        )}

        {!showFullText && result.full_text && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-700 bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
              {(result.full_text || '').length > 500 
                ? `${(result.full_text || '').substring(0, 500)}...` 
                : (result.full_text || '')
              }
            </div>
            {(result.full_text || '').length > 500 && (
              <p className="text-xs text-gray-500 mt-2">
                Showing first 500 characters. Click "Show Full Text" to see complete content.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsDisplay
