import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Image, Loader2 } from 'lucide-react'
import { OCRResult } from '../types'
import { processFile } from '../services/ocrService'

interface FileUploadProps {
  onOCRComplete: (result: OCRResult) => void
  onError: (error: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const FileUpload: React.FC<FileUploadProps> = ({
  onOCRComplete,
  onError,
  isLoading,
  setIsLoading
}) => {
  const [dragActive, setDragActive] = useState(false)

  const testAPI = async () => {
    try {
      console.log('Testing API connection...')
      const response = await fetch('/api/health')
      const data = await response.json()
      console.log('API test result:', data)
      alert(`API Test: ${data.status}`)
    } catch (error) {
      console.error('API test failed:', error)
      alert(`API Test Failed: ${error}`)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    console.log('File dropped:', file)
    setIsLoading(true)
    onError('')

    try {
      console.log('Starting OCR processing...')
      const result = await processFile(file)
      console.log('OCR completed successfully:', result)
      onOCRComplete(result)
    } catch (error) {
      console.error('OCR processing failed:', error)
      onError(error instanceof Error ? error.message : 'An error occurred during processing')
    } finally {
      setIsLoading(false)
    }
  }, [onOCRComplete, onError, setIsLoading])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.gif']
    },
    multiple: false,
    disabled: isLoading
  })

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />
    }
    return <Image className="w-8 h-8 text-blue-500" />
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload File</h2>
      
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
          ${isDragActive || dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              <p className="text-sm text-gray-600">Processing your file...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse
                </p>
              </div>
              
              <div className="text-xs text-gray-400">
                <p>Supports: PDF, PNG, JPG, JPEG, BMP, TIFF, GIF</p>
                <p>Max file size: 10MB</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Supported formats:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-red-500" />
            <span>PDF Documents</span>
          </div>
          <div className="flex items-center space-x-2">
            <Image className="w-4 h-4 text-blue-500" />
            <span>Image Files</span>
          </div>
        </div>
        
        <div className="pt-2">
          <button
            onClick={testAPI}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700"
          >
            Test API Connection
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileUpload
