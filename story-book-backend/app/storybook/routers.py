from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import PyPDF2
import fitz  
import os
import base64
import json
from pathlib import Path
from PIL import Image
import io
from app.storybook.schemas import *
from app.storybook.services import *

router = APIRouter(
    prefix="/storybook",
    tags=["Storybook"],
)

@router.post("/get_stories")
async def get_stories(request: StoryRequest) -> StoryBook:
    """
    Get stories based on the request parameters.
    """
    try:
        stories = await story_text_generator(request)
        return stories
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

@router.get("/sample/pdf-data")
async def get_sample_pdf_data():
    """
    Get sample PDF data from the backend sample folder.
    This endpoint processes the PDF and extracts both text and images.
    """
    try:
        # Path to your sample PDF (adjust as needed)
        sample_pdf_path = Path("sample/sample_storybook.pdf")
        
        if not sample_pdf_path.exists():
            # Return mock data if PDF doesn't exist
            return get_mock_pdf_data()
        
        # Extract PDF content
        pdf_data = extract_pdf_content(sample_pdf_path)
        return pdf_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload and process a new PDF file.
    """
    try:
        # Save uploaded PDF
        upload_dir = Path("uploads")
        upload_dir.mkdir(exist_ok=True)
        
        file_path = upload_dir / file.filename
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Process the uploaded PDF
        pdf_data = extract_pdf_content(file_path)
        return pdf_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading PDF: {str(e)}")

def extract_pdf_content(pdf_path: Path) -> Dict[str, Any]:
    """
    Extract text and images from PDF file.
    """
    try:
        # Open PDF with PyMuPDF for better image extraction
        doc = fitz.open(str(pdf_path))
        pages_data = []
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # Extract text
            text = page.get_text().strip()
            
            # Extract images
            image_list = page.get_images()
            page_images = []
            
            for img_index, img in enumerate(image_list):
                try:
                    # Get image data
                    xref = img[0]
                    pix = fitz.Pixmap(doc, xref)
                    
                    # Convert to PIL Image
                    if pix.n - pix.alpha < 4:  # GRAY or RGB
                        img_data = pix.tobytes("png")
                        pil_image = Image.open(io.BytesIO(img_data))
                        
                        # Convert to base64 for frontend
                        buffered = io.BytesIO()
                        pil_image.save(buffered, format="PNG")
                        img_base64 = base64.b64encode(buffered.getvalue()).decode()
                        
                        page_images.append({
                            "index": img_index,
                            "base64": f"data:image/png;base64,{img_base64}",
                            "width": pil_image.width,
                            "height": pil_image.height
                        })
                    
                    pix = None  # Clean up
                    
                except Exception as e:
                    print(f"Error extracting image {img_index} from page {page_num}: {e}")
                    continue
            
            # Create page data
            page_data = {
                "id": page_num + 1,
                "type": "mixed" if text and page_images else ("text" if text else "image"),
                "content": {
                    "text": text or "No text content on this page.",
                    "images": page_images,
                    "layout": determine_layout(text, page_images)
                }
            }
            
            pages_data.append(page_data)
        
        doc.close()
        
        return {
            "title": pdf_path.stem.replace("_", " ").title(),
            "description": f"PDF document with {len(pages_data)} pages containing text and images",
            "totalPages": len(pages_data),
            "pages": pages_data
        }
        
    except Exception as e:
        print(f"Error extracting PDF content: {e}")
        return get_mock_pdf_data()

def determine_layout(text: str, images: List[Dict]) -> str:
    """
    Determine the best layout based on content.
    """
    if not images:
        return "text-only"
    if not text or len(text) < 50:
        return "image-only"
    
    # Simple heuristic based on content
    layouts = ["image-left", "image-right", "image-top", "image-bottom"]
    return layouts[len(text) % len(layouts)]

def get_mock_pdf_data() -> Dict[str, Any]:
    """
    Return mock PDF data when actual PDF is not available.
    """
    return {
        "title": "Sample Story Book",
        "description": "A beautiful story with images and text on each page",
        "totalPages": 8,
        "pages": [
            {
                "id": 1,
                "type": "mixed",
                "content": {
                    "text": "Once upon a time, in a magical forest far away, there lived a little rabbit named Luna who loved to explore.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&h=400&fit=crop",
                        "width": 600,
                        "height": 400
                    }],
                    "layout": "image-left"
                }
            },
            {
                "id": 2,
                "type": "mixed",
                "content": {
                    "text": "Luna discovered a sparkling stream where colorful fish danced in the crystal-clear water. She had never seen anything so beautiful.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
                        "width": 600,
                        "height": 400
                    }],
                    "layout": "image-right"
                }
            },
            # Add more pages as needed...
        ]
    }

