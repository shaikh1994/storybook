from fastapi import HTTPException
from app.storybook.schemas import *
from langchain_core.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from app.llm_models.llm_model import llm
from openai import OpenAI
from app.storybook.illustrator import StoryBookIllustrator, IllustrationConfig
from pathlib import Path

client = OpenAI()

async def story_text_generator(input: StoryRequest):
    try:
        with open("app/prompts/story_book_builder.md") as file:
            prompt = file.read()
            
        # Output parser for the LLM
        parser = PydanticOutputParser(pydantic_object=StoryBook)
            
        # Create a prompt template
        prompt_template = PromptTemplate(
            template=prompt,
            input_variables=["age", "topic", "short_description", "page", "language", "illustration_style"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        
        # Create the chain
        chain = prompt_template | llm | parser
        
        print("Generating story book...")
        
        # Get response
        response = chain.invoke({'age': input.age, 'topic': input.topic, 'short_description': input.short_description, 'page': input.pages, 'language': input.language, 'illustration_style': input.illustration_style})
        
        print("Story book generated successfully.")
        
        return response
        
        # # Generate illustrations for the story
        # config = IllustrationConfig(
        #     model="gpt-image-1",
        #     character_size="1024x1024",
        #     page_size="1024x1024",
        #     quality="medium",
        #     output_dir=f"openai/story_illustrations/{response.story_title.replace(' ', '_')}"
        # )
        
        # # Initialize the illustrator with the story book response
        # illustrator = StoryBookIllustrator(response, config)
        
        # # Generate all illustrations (5 workers for parallelism)
        # updated_story = illustrator.generate_all_illustrations(parallel=True, max_workers=3)
            
        # return updated_story
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def create_illustration(illustration_description: str):
    try:
        response = client.images.generate(
                    model="dall-e-3",
                    prompt=illustration_description,
                    n=1,
                    size="1024x1024"
                )
    
        return response.data[0].url
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")