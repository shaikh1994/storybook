from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

# Conditional OpenAI integration - uncomment when API key is available
"""
import openai
from openai import AsyncOpenAI

async def generate_story_with_openai(story_request):
    client = AsyncOpenAI(api_key=story_request.openai_api_key)
    
    # Generate story text
    story_prompt = f'''
    Create a {story_request.page_count}-page children's story for a {story_request.age}-year-old child.
    
    Details:
    - Character name: {story_request.character_name}
    - Character traits: {story_request.character_traits}
    - Theme: {story_request.theme}
    - Moral lesson: {story_request.moral_lesson}
    
    Format the response as a JSON with:
    - title: story title
    - pages: array of {page_number, text} objects
    
    Keep language appropriate for age {story_request.age}.
    '''
    
    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": story_prompt}],
            temperature=0.7
        )
        
        # Generate illustrations for each page
        story_data = response.choices[0].message.content
        # Parse story_data and generate images with DALL-E 3
        
        return story_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

async def generate_illustration_with_dalle(prompt, openai_api_key):
    client = AsyncOpenAI(api_key=openai_api_key)
    
    try:
        response = await client.images.generate(
            model="dall-e-3",
            prompt=f"Children's book illustration: {prompt}. Whimsical, colorful, child-friendly art style.",
            size="1024x1024",
            quality="standard",
            n=1
        )
        
        return response.data[0].url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DALL-E API error: {str(e)}")
"""

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class StoryPage(BaseModel):
    page_number: int
    text: str
    image_url: Optional[str] = None

class Story(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    pages: List[StoryPage]
    cover_image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    character_name: str
    theme: str
    age: int

class StoryRequest(BaseModel):
    age: int
    theme: str
    character_name: str
    character_traits: Optional[str] = ""
    page_count: int = 5
    moral_lesson: Optional[str] = ""
    openai_api_key: Optional[str] = ""  # User provides API key

class StoryResponse(BaseModel):
    story: Story
    message: str

# Existing routes
@api_router.get("/")
async def root():
    return {"message": "StoryBook Creator API is running!"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Story generation endpoints
@api_router.post("/generate-story", response_model=StoryResponse)
async def generate_story(story_request: StoryRequest):
    """
    Generate a personalized children's story with AI illustrations
    """
    try:
        # Mock story generation for now - replace with OpenAI integration when API key is available
        if story_request.openai_api_key and story_request.openai_api_key.strip():
            # TODO: Implement OpenAI integration
            # story_data = await generate_story_with_openai(story_request)
            pass
        
        # Generate mock story for development
        themes_map = {
            'space': '🚀 Space Adventure',
            'underwater': '🌊 Underwater Quest', 
            'jungle': '🌴 Jungle Explorer',
            'fairy': '✨ Fairy Tale Magic',
            'dragon': '🐉 Dragon Friend',
            'unicorn': '🦄 Unicorn Dreams'
        }
        
        theme_title = themes_map.get(story_request.theme, story_request.theme.title())
        story_title = f"{story_request.character_name} and the {theme_title}"
        
        # Generate story pages
        pages = []
        for i in range(story_request.page_count):
            page_text = f"On page {i + 1}, {story_request.character_name} discovered something wonderful in the magical world of {theme_title}. With {story_request.character_traits} courage, our hero faced new adventures and learned valuable lessons about friendship and kindness."
            
            # Mock image URL - replace with DALL-E generated images
            image_url = "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxzdG9yeWJvb2t8ZW58MHx8fHwxNzU0NTQyOTMzfDA&ixlib=rb-4.1.0&q=85&w=400&h=300"
            
            pages.append(StoryPage(
                page_number=i + 1,
                text=page_text,
                image_url=image_url
            ))
        
        # Create story object
        story = Story(
            title=story_title,
            pages=pages,
            cover_image_url="https://images.unsplash.com/photo-1533561304446-88a43deb6229?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJvb2t8ZW58MHx8fHwxNzU0NTQyOTM4fDA&ixlib=rb-4.1.0&q=85&w=600&h=400",
            character_name=story_request.character_name,
            theme=story_request.theme,
            age=story_request.age
        )
        
        # Save story to database
        await db.stories.insert_one(story.dict())
        
        return StoryResponse(
            story=story,
            message="Story generated successfully!"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating story: {str(e)}")

@api_router.get("/stories", response_model=List[Story])
async def get_stories():
    """Get all saved stories"""
    try:
        stories = await db.stories.find().to_list(1000)
        return [Story(**story) for story in stories]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stories: {str(e)}")

@api_router.get("/stories/{story_id}", response_model=Story)
async def get_story(story_id: str):
    """Get a specific story by ID"""
    try:
        story = await db.stories.find_one({"id": story_id})
        if not story:
            raise HTTPException(status_code=404, detail="Story not found")
        return Story(**story)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching story: {str(e)}")

@api_router.delete("/stories/{story_id}")
async def delete_story(story_id: str):
    """Delete a story"""
    try:
        result = await db.stories.delete_one({"id": story_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Story not found")
        return {"message": "Story deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting story: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()