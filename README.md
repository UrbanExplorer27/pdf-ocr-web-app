# PDF OCR Tool

A modern web application for extracting text from PDF files and images using Tesseract OCR with advanced image preprocessing.

## Features

- **PDF Processing**: Convert PDF pages to images and extract text
- **Image OCR**: Support for PNG, JPG, JPEG, BMP, TIFF, and GIF files
- **Advanced Image Processing**: Automatic image enhancement for better OCR accuracy
- **Modern UI**: Clean, responsive interface built with React and TypeScript
- **Real-time Processing**: Live progress updates during OCR processing
- **Export Options**: Copy to clipboard or download extracted text
- **Multi-page Support**: Handle PDFs with multiple pages

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Tesseract OCR**: Text extraction engine
- **pdf2image**: PDF to image conversion
- **OpenCV**: Image preprocessing and enhancement
- **Pillow**: Image manipulation

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **React Dropzone**: File upload handling

## Installation

### Prerequisites

1. **Python 3.8+**
2. **Node.js 16+**
3. **Tesseract OCR**

#### Install Tesseract OCR

**macOS:**
```bash
brew install tesseract
```

**Ubuntu/Debian:**
```bash
sudo apt-get install tesseract-ocr
```

**Windows:**
Download from [GitHub releases](https://github.com/UB-Mannheim/tesseract/wiki)

### Backend Setup

1. Navigate to the project directory:
```bash
cd "ocr tool"
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
python backend/main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Drag and drop a PDF file or image, or click to browse
3. Wait for the OCR processing to complete
4. View, copy, or download the extracted text

## API Endpoints

- `GET /` - API status
- `GET /health` - Health check
- `POST /upload-pdf` - Process PDF files
- `POST /upload-image` - Process image files

## Deployment

### Netlify Deployment

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

3. For the backend, deploy to a service like:
   - Railway
   - Heroku
   - AWS Lambda
   - Google Cloud Run

4. Update the `VITE_API_URL` environment variable with your backend URL

## Development

### Running Both Services

```bash
# Terminal 1 - Backend
python backend/main.py

# Terminal 2 - Frontend
npm run dev
```

### Project Structure

```
ocr tool/
├── backend/
│   └── main.py              # FastAPI application
├── src/
│   ├── components/          # React components
│   ├── services/           # API services
│   ├── types.ts           # TypeScript types
│   └── App.tsx            # Main React component
├── requirements.txt        # Python dependencies
├── package.json           # Node.js dependencies
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
