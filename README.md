# PDF OCR Web App

A modern, full-stack web application for extracting text from PDF files and images using advanced OCR technology. Built with FastAPI, React, and Tesseract with intelligent image preprocessing for maximum accuracy.

![PDF OCR Web App](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔍 **Advanced OCR Processing**
- **Multi-method OCR**: Uses 6+ different Tesseract configurations for maximum accuracy
- **Intelligent Image Preprocessing**: Bilateral filtering, CLAHE, adaptive thresholding
- **Complex Document Support**: Handles ID cards, receipts, scanned documents
- **Multiple Format Support**: PDF, PNG, JPG, JPEG, BMP, TIFF, GIF

### 🎨 **Modern User Interface**
- **Drag & Drop Upload**: Intuitive file upload with visual feedback
- **Real-time Processing**: Live progress indicators and status updates
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Export Options**: Copy to clipboard or download as text file
- **Page-by-page Results**: Detailed breakdown for multi-page PDFs

### ⚡ **High Performance**
- **Fast Processing**: Optimized image processing pipeline
- **Concurrent Processing**: Handles multiple OCR methods simultaneously
- **Error Handling**: Comprehensive error handling and user feedback
- **Production Ready**: Built for scalability and reliability

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **Tesseract OCR**
- **Poppler** (for PDF processing)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/UrbanExplorer27/pdf-ocr-web-app.git
cd pdf-ocr-web-app
```

2. **Install system dependencies:**
```bash
# macOS
brew install tesseract poppler

# Ubuntu/Debian
sudo apt-get install tesseract-ocr poppler-utils

# Windows
# Download Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki
# Download Poppler from: https://blog.alivate.com.au/poppler-windows/
```

3. **Set up the backend:**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python backend/main.py
```

4. **Set up the frontend:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

5. **Open your browser:**
Navigate to `http://localhost:3000`

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Tesseract OCR**: Industry-standard OCR engine
- **OpenCV**: Advanced image processing and computer vision
- **pdf2image**: PDF to image conversion with Poppler
- **Pillow**: Python Imaging Library for image manipulation
- **Uvicorn**: ASGI server for production deployment

### Frontend
- **React 18**: Modern UI library with hooks and concurrent features
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Axios**: Promise-based HTTP client for API communication
- **React Dropzone**: File upload with drag and drop support

## 📁 Project Structure

```
pdf-ocr-web-app/
├── backend/
│   └── main.py              # FastAPI application with OCR endpoints
├── src/
│   ├── components/          # React components
│   │   ├── FileUpload.tsx   # File upload with drag & drop
│   │   ├── ResultsDisplay.tsx # OCR results display
│   │   └── Header.tsx       # Application header
│   ├── services/
│   │   └── ocrService.ts    # API service layer
│   ├── types.ts            # TypeScript type definitions
│   ├── App.tsx             # Main React component
│   └── main.tsx            # React entry point
├── requirements.txt         # Python dependencies
├── package.json            # Node.js dependencies
├── netlify.toml            # Netlify deployment configuration
└── README.md               # This file
```

## 🔧 API Endpoints

### Health Check
- `GET /` - API status and welcome message
- `GET /health` - Detailed health check

### OCR Processing
- `POST /upload-pdf` - Process PDF files and extract text
- `POST /upload-image` - Process image files and extract text

### Response Format
```json
{
  "success": true,
  "filename": "document.pdf",
  "total_pages": 3,
  "total_words": 150,
  "total_characters": 1200,
  "pages": [
    {
      "page": 1,
      "text": "Extracted text content...",
      "word_count": 50,
      "character_count": 400
    }
  ],
  "full_text": "Complete extracted text..."
}
```

## 🚀 Deployment

### Frontend (Netlify)
1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

3. Set environment variables:
   - `VITE_API_URL`: Your backend API URL

### Backend (Railway/Heroku/AWS)
1. Deploy to your preferred platform
2. Install system dependencies (Tesseract, Poppler)
3. Set up environment variables
4. Configure CORS for your frontend domain

### Docker Deployment
```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
RUN apt-get update && apt-get install -y tesseract-ocr poppler-utils
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "backend/main.py"]
```

## 🧪 Testing

### Backend Testing
```bash
# Test API endpoints
curl -X POST -F "file=@test.pdf" http://localhost:8000/upload-pdf
curl -X POST -F "file=@test.png" http://localhost:8000/upload-image
```

### Frontend Testing
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔍 OCR Configuration

The application uses multiple OCR methods for maximum accuracy:

1. **Method 1**: Uniform block of text (PSM 6)
2. **Method 2**: Single column of text (PSM 4)
3. **Method 3**: Fully automatic page segmentation (PSM 3)
4. **Method 4**: Automatic page segmentation with OSD (PSM 1)
5. **Method 5**: Single word (PSM 8)
6. **Method 6**: Raw line (PSM 13)
7. **Original**: Unprocessed image for comparison

## 🎯 Use Cases

- **Document Digitization**: Convert paper documents to searchable text
- **Receipt Processing**: Extract data from receipts and invoices
- **ID Card Processing**: Extract information from identification documents
- **Academic Research**: Process research papers and documents
- **Business Automation**: Automate data entry from scanned documents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) for text recognition
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend framework
- [OpenCV](https://opencv.org/) for image processing
- [pdf2image](https://github.com/Belval/pdf2image) for PDF processing

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/UrbanExplorer27/pdf-ocr-web-app/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Made with ❤️ for the open source community**
