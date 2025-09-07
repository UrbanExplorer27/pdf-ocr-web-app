import axios from 'axios'
import { OCRResult } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for large files
})

export const processFile = async (file: File): Promise<OCRResult> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const endpoint = file.type === 'application/pdf' ? '/upload-pdf' : '/upload-image'
    console.log('Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size)
    console.log('API Base URL:', API_BASE_URL)
    console.log('Endpoint:', endpoint)
    
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Response received:', response.data)
    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)
    
    // Validate response structure
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format from server')
    }
    
    if (!response.data.success) {
      throw new Error(response.data.detail || 'OCR processing failed')
    }
    
    return response.data
  } catch (error) {
    console.error('OCR processing error:', error)
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message
      console.error('Error details:', error.response?.data)
      throw new Error(`OCR processing failed: ${message}`)
    }
    throw new Error('An unexpected error occurred during OCR processing')
  }
}

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health')
    return response.data.status === 'healthy'
  } catch {
    return false
  }
}
