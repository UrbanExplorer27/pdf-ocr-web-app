export interface OCRResult {
  success: boolean
  filename: string
  total_pages?: number
  total_words: number
  total_characters: number
  pages?: PageResult[]
  full_text: string
}

export interface PageResult {
  page: number
  text: string
  word_count: number
  character_count: number
}

export interface UploadProgress {
  stage: 'uploading' | 'processing' | 'ocr' | 'complete'
  progress: number
  message: string
}
