from typing import List
from fastapi import APIRouter, HTTPException
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