from pydantic import BaseModel


class StoryResponse(BaseModel):
    page: int
    story_text: str
    image_url: str
    
class StoryRequest(BaseModel):
    short_description: str
    pages: int
    age: str
    topic: str
    language: str
    illustration_style: str
    
class CharacterDescription(BaseModel):
    character_name: str
    character_description: str
    character_image_path: str = ""

class StoryBookEachPage(BaseModel):
    page: int
    story_text: str
    illustration_description: str
    characters: list[CharacterDescription]
    illustration_path: str = ""
    illustration_base64: str = ""
    
    
class StoryBook(BaseModel):
    story_title: str
    story_description: str
    illustration_style: str
    story_characters: list[CharacterDescription]
    story_book: list[StoryBookEachPage]