# story-book-backend/app/storybook/routers.py
# Complete corrected version with all missing functions

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


# NEW: Multiple PDF support endpoints
@router.get("/sample/pdf-list")
async def get_sample_pdf_list():
    """
    Get list of all sample PDFs from the sample folder.
    Returns metadata for each PDF without processing content.
    """
    try:
        sample_dir = Path("sample")
        
        if not sample_dir.exists():
            return {"pdfs": []}
        
        pdf_files = list(sample_dir.glob("*.pdf"))
        pdf_list = []
        
        for pdf_file in pdf_files:
            # Generate basic metadata without processing full content
            pdf_info = {
                "id": pdf_file.stem,  # filename without extension
                "filename": pdf_file.name,
                "title": get_custom_title_for_file(pdf_file.stem),
                "description": f"Sample storybook: {pdf_file.stem.replace('_', ' ').title()}",
                "file_path": str(pdf_file),
                "download_url": f"/static/sample/{pdf_file.name}"
            }
            pdf_list.append(pdf_info)
        
        return {"pdfs": pdf_list}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading sample PDFs: {str(e)}")


@router.get("/sample/pdf-data/{pdf_id}")
async def get_sample_pdf_data(pdf_id: str):
    """
    Get processed data for a specific sample PDF.
    """
    try:
        sample_dir = Path("sample")
        pdf_path = sample_dir / f"{pdf_id}.pdf"
        
        if not pdf_path.exists():
            # Return mock data if specific PDF doesn't exist
            return get_mock_pdf_data_for_id(pdf_id)
        
        # Extract PDF content
        pdf_data = extract_pdf_content(pdf_path)
        return pdf_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF {pdf_id}: {str(e)}")


# LEGACY: Keep this for backward compatibility
@router.get("/sample/pdf-data")
async def get_sample_pdf_data_legacy():
    """
    Get sample PDF data from the backend sample folder.
    This endpoint processes the PDF and extracts both text and images.
    LEGACY VERSION - for backward compatibility.
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


def get_custom_title_for_file(filename: str) -> str:
    """
    Get custom title for a specific PDF file.
    Add your custom mappings here.
    """
    custom_titles = {
        "sample_storybook": "Luna's Magical Adventure",
        "space_adventure": "Maya's Space Journey", 
        "ocean_story": "The Underwater Kingdom",
        "fairy_tale": "Enchanted Forest Tales",
        "dragon_story": "Friendship with Dragons",
        "princess_adventure": "The Brave Princess"
    }
    
    return custom_titles.get(filename, filename.replace("_", " ").title())


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


def extract_pdf_content(pdf_path: Path) -> Dict[str, Any]:
    """
    Extract text and images from PDF file with PDF ID support.
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
        
        # Get custom title
        filename_base = pdf_path.stem
        custom_title = get_custom_title_for_file(filename_base)
        
        return {
            "id": filename_base,
            "title": custom_title,
            "description": f"Beautiful storybook with {len(pages_data)} pages of adventure and wonder",
            "totalPages": len(pages_data),
            "pages": pages_data
        }
        
    except Exception as e:
        print(f"Error extracting PDF content: {e}")
        return get_mock_pdf_data_for_id(pdf_path.stem)


def get_mock_pdf_data_for_id(pdf_id: str) -> Dict[str, Any]:
    """
    Return mock PDF data for specific IDs when actual PDF doesn't exist.
    """
    
    # Different mock stories based on the PDF ID
    mock_stories = {
        "sample_storybook": {
            "title": "Luna's Magical Adventure",
            "character": "Luna",
            "theme": "magical forest",
            "setting": "enchanted woodland"
        },
        "space_adventure": {
            "title": "Maya's Space Journey",
            "character": "Maya",
            "theme": "space exploration",
            "setting": "distant galaxy"
        },
        "ocean_story": {
            "title": "The Underwater Kingdom",
            "character": "Aria",
            "theme": "ocean adventure",
            "setting": "coral reef kingdom"
        }
    }
    
    # Get story config or default
    story_config = mock_stories.get(pdf_id, {
        "title": f"{pdf_id.replace('_', ' ').title()}",
        "character": "Alex",
        "theme": "adventure",
        "setting": "magical world"
    })
    
    character = story_config["character"]
    theme = story_config["theme"]
    setting = story_config["setting"]
    
    return {
        "id": pdf_id,
        "title": story_config["title"],
        "description": f"A wonderful {theme} story featuring {character}",
        "totalPages": 6,
        "pages": [
            {
                "id": 1,
                "type": "mixed",
                "content": {
                    "text": f"Once upon a time, in a {setting}, there lived a brave young explorer named {character} who loved {theme} more than anything.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&h=600&fit=crop&crop=center",
                        "width": 800,
                        "height": 600
                    }],
                    "layout": "image-left"
                }
            },
            {
                "id": 2,
                "type": "mixed",
                "content": {
                    "text": f"{character} discovered amazing wonders that filled their heart with joy and excitement beyond imagination.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center",
                        "width": 800,
                        "height": 600
                    }],
                    "layout": "image-right"
                }
            },
            {
                "id": 3,
                "type": "mixed",
                "content": {
                    "text": f"During the journey, {character} met wonderful friends who shared in the magical adventure.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center",
                        "width": 800,
                        "height": 600
                    }],
                    "layout": "image-left"
                }
            },
            {
                "id": 4,
                "type": "mixed",
                "content": {
                    "text": f"Together, {character} and friends explored the most beautiful places in the {setting}.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center",
                        "width": 800,
                        "height": 600
                    }],
                    "layout": "image-right"
                }
            },
            {
                "id": 5,
                "type": "mixed",
                "content": {
                    "text": f"At the heart of their adventure, {character} discovered that friendship and kindness were the greatest treasures of all.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center",
                        "width": 800,
                        "height": 600
                    }],
                    "layout": "image-left"
                }
            },
            {
                "id": 6,
                "type": "mixed",
                "content": {
                    "text": f"{character} returned home with a heart full of wonderful memories and exciting stories to share with everyone.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center",
                        "width": 800,
                        "height": 600
                    }],
                    "layout": "image-right"
                }
            }
        ]
    }


def get_mock_pdf_data() -> Dict[str, Any]:
    """
    Return mock PDF data when actual PDF is not available.
    This is the fallback function for backward compatibility.
    """
    return {
        "id": "sample_storybook",
        "title": "Luna's Magical Adventure",
        "description": "A beautiful sample story showing how your generated stories will look",
        "totalPages": 6,
        "pages": [
            {
                "id": 1,
                "type": "mixed",
                "content": {
                    "text": "Once upon a time, in a magical forest far away, there lived a little rabbit named Luna who loved to explore and discover new wonders every day.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&h=600&fit=crop&crop=center",
                        "width": 800,
                        "height": 600
                    }],
                    "layout": "image-left"
                }
            },
            {
                "id": 2,
                "type": "mixed", 
                "content": {
                    "text": "Luna discovered a sparkling stream where colorful fish danced in the crystal-clear water. The sight was so beautiful that it took her breath away.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center",
                        "width": 800,
                        "height": 600
                    }],
                    "layout": "image-right"
                }
            },
            {
                "id": 3,
                "type": "mixed",
                "content": {
                    "text": "As Luna followed the stream, she met a wise old owl who told her about a hidden treasure deep in the heart of the forest.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center",
                        "width": 800,
                        "height": 600
                    }],
                    "layout": "image-left"
                }
            },
            {
                "id": 4,
                "type": "mixed",
                "content": {
                    "text": "Following the owl's directions, Luna ventured deeper into the forest, where she found a clearing filled with the most beautiful flowers she had ever seen.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center",
                        "width": 800,
                        "height": 600
                    }],
                    "layout": "image-right"
                }
            },
            {
                "id": 5,
                "type": "mixed",
                "content": {
                    "text": "In the center of the flower clearing, Luna found the treasure - not gold or jewels, but a mirror that showed her all the wonderful friends she would make.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center",
                        "width": 800,
                        "height": 600
                    }],
                    "layout": "image-left"
                }
            },
            {
                "id": 6,
                "type": "mixed",
                "content": {
                    "text": "Luna returned home with a heart full of joy, knowing that the real treasure was the adventure itself and all the beautiful memories she had made along the way.",
                    "images": [{
                        "index": 0,
                        "base64": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center",
                        "width": 800,
                        "height": 600
                    }],
                    "layout": "image-right"
                }
            }
        ]
    }