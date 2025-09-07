from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image
import cv2
import numpy as np
import io
import os
from typing import List, Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="PDF OCR API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://your-netlify-app.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

def preprocess_image(image: np.ndarray) -> np.ndarray:
    """Enhance image for better OCR results, especially for ID cards and documents"""
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    
    # Apply bilateral filter to reduce noise while preserving edges
    filtered = cv2.bilateralFilter(gray, 9, 75, 75)
    
    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(filtered)
    
    # Apply adaptive thresholding with different methods
    # Method 1: Gaussian adaptive threshold
    thresh1 = cv2.adaptiveThreshold(
        enhanced, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    
    # Method 2: Mean adaptive threshold
    thresh2 = cv2.adaptiveThreshold(
        enhanced, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2
    )
    
    # Method 3: Otsu's thresholding
    _, thresh3 = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Combine different thresholding methods
    combined = cv2.bitwise_and(thresh1, thresh2)
    combined = cv2.bitwise_or(combined, thresh3)
    
    # Morphological operations to clean up the image
    kernel = np.ones((2, 2), np.uint8)
    cleaned = cv2.morphologyEx(combined, cv2.MORPH_CLOSE, kernel)
    
    # Remove small noise
    kernel = np.ones((1, 1), np.uint8)
    cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_OPEN, kernel)
    
    return cleaned

def extract_text_from_image(image: Image.Image) -> str:
    """Extract text from PIL Image using Tesseract with multiple OCR attempts"""
    # Convert PIL Image to numpy array
    img_array = np.array(image)
    
    # Preprocess the image
    processed_img = preprocess_image(img_array)
    
    # Convert back to PIL Image for Tesseract
    processed_pil = Image.fromarray(processed_img)
    
    # Try multiple OCR configurations for better results
    configs = [
        r'--oem 3 --psm 6',  # Default: uniform block of text
        r'--oem 3 --psm 4',  # Single column of text
        r'--oem 3 --psm 3',  # Fully automatic page segmentation
        r'--oem 3 --psm 1',  # Automatic page segmentation with OSD
        r'--oem 3 --psm 8',  # Single word
        r'--oem 3 --psm 13', # Raw line. Treat the image as a single text line
    ]
    
    all_text = []
    
    try:
        # Try each configuration and collect results
        for i, config in enumerate(configs):
            try:
                text = pytesseract.image_to_string(processed_pil, config=config)
                if text.strip():
                    all_text.append(f"Method {i+1}: {text.strip()}")
                    logger.info(f"OCR Method {i+1} extracted: {len(text.strip())} characters")
            except Exception as e:
                logger.warning(f"OCR Method {i+1} failed: {str(e)}")
                continue
        
        # Also try with the original image (no preprocessing)
        try:
            original_text = pytesseract.image_to_string(image, config=r'--oem 3 --psm 6')
            if original_text.strip():
                all_text.append(f"Original: {original_text.strip()}")
                logger.info(f"Original image OCR extracted: {len(original_text.strip())} characters")
        except Exception as e:
            logger.warning(f"Original image OCR failed: {str(e)}")
        
        # Combine all results
        if all_text:
            combined_text = "\n\n".join(all_text)
            logger.info(f"Total OCR results: {len(combined_text)} characters")
            return combined_text
        else:
            logger.warning("No text extracted with any OCR method")
            return "No text could be extracted from this image. Try uploading a clearer image with better contrast."
            
    except Exception as e:
        logger.error(f"OCR Error: {str(e)}")
        return f"Error during OCR processing: {str(e)}"

@app.get("/")
async def root():
    return {"message": "PDF OCR API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "PDF OCR API"}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process PDF file for OCR"""
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Read file content
        file_content = await file.read()
        
        # Convert PDF to images
        logger.info(f"Converting PDF to images: {file.filename}")
        images = convert_from_bytes(file_content, dpi=300)
        
        if not images:
            raise HTTPException(status_code=400, detail="Could not extract images from PDF")
        
        # Process each page
        results = []
        total_pages = len(images)
        
        for i, image in enumerate(images):
            logger.info(f"Processing page {i + 1}/{total_pages}")
            
            # Extract text from the image
            text = extract_text_from_image(image)
            
            results.append({
                "page": i + 1,
                "text": text,
                "word_count": len(text.split()) if text else 0,
                "character_count": len(text) if text else 0
            })
        
        # Calculate total statistics
        total_text = "\n\n".join([result["text"] for result in results])
        total_words = sum([result["word_count"] for result in results])
        total_chars = sum([result["character_count"] for result in results])
        
        return JSONResponse(content={
            "success": True,
            "filename": file.filename,
            "total_pages": total_pages,
            "total_words": total_words,
            "total_characters": total_chars,
            "pages": results,
            "full_text": total_text
        })
        
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload and process single image for OCR"""
    try:
        logger.info(f"Processing image upload: {file.filename}")
        
        # Validate file type
        allowed_types = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif']
        if not any(file.filename.lower().endswith(ext) for ext in allowed_types):
            raise HTTPException(status_code=400, detail="Only image files are allowed")
        
        # Read file content
        file_content = await file.read()
        logger.info(f"File size: {len(file_content)} bytes")
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(file_content))
        logger.info(f"Image size: {image.size}, mode: {image.mode}")
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
            logger.info(f"Converted to RGB mode")
        
        # Extract text
        logger.info("Starting OCR processing...")
        text = extract_text_from_image(image)
        logger.info(f"OCR completed. Extracted {len(text)} characters")
        
        word_count = len(text.split()) if text else 0
        char_count = len(text) if text else 0
        
        logger.info(f"Final results - Words: {word_count}, Characters: {char_count}")
        
        return JSONResponse(content={
            "success": True,
            "filename": file.filename,
            "text": text,
            "word_count": word_count,
            "character_count": char_count
        })
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
