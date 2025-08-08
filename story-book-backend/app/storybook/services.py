import os
from fastapi import HTTPException
from app.storybook.schemas import *
from langchain_core.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from app.llm_models.llm_model import get_llm_with_api_key  # Updated import
from openai import OpenAI
from app.storybook.illustrator import StoryBookIllustrator, IllustrationConfig
from pathlib import Path


def get_openai_client(api_key: str = None) -> OpenAI:
    """Get OpenAI client with provided API key or from environment."""
    if api_key:
        return OpenAI(api_key=api_key)
    elif os.getenv("OPENAI_API_KEY"):
        return OpenAI()  # Uses env variable
    else:
        return None


def generate_mock_story(input: StoryRequest) -> StoryBook:
    """Generate a mock story when no API key is available."""
    
    # Extract character name from description (simple approach)
    character_name = "Alex"  # Default name
    if input.short_description:
        words = input.short_description.split()
        # Look for potential names (capitalized words)
        for word in words:
            if word[0].isupper() and len(word) > 2:
                character_name = word
                break
    
    # Create mock story structure
    story_characters = [
        CharacterDescription(
            character_name=character_name,
            character_description=input.short_description or f"{character_name} is a brave and curious character.",
            character_image_path=""
        )
    ]
    
    # Generate mock pages
    story_pages = []
    topic_themes = {
        'space': 'cosmic adventure among the stars',
        'underwater': 'magical journey beneath the ocean waves', 
        'jungle': 'exciting exploration through the wild jungle',
        'fairy': 'enchanted quest in a magical fairyland',
        'dragon': 'brave friendship with a gentle dragon',
        'unicorn': 'wonderful adventure with magical unicorns'
    }
    
    theme_description = topic_themes.get(input.topic, 'amazing adventure')
    
    for page_num in range(1, input.pages + 1):
        if page_num == 1:
            story_text = f"Once upon a time, {character_name} discovered a {theme_description}."
            illustration_desc = f"{character_name} stands at the beginning of their adventure, looking excited and ready to explore."
        elif page_num == input.pages:
            story_text = f"And so {character_name} learned that every adventure brings new friends and wonderful memories. The End!"
            illustration_desc = f"{character_name} smiles happily, surrounded by all the friends made during the adventure."
        else:
            story_text = f"{character_name} continued the {theme_description}, discovering amazing things along the way."
            illustration_desc = f"{character_name} explores the {input.topic} world, full of wonder and excitement."
        
        # Translate text if not English
        if input.language != 'English':
            language_examples = {
                'Spanish': f"Había una vez, {character_name} descubrió una {theme_description}.",
                'French': f"Il était une fois, {character_name} découvrit une {theme_description}.",
                'German': f"Es war einmal, {character_name} entdeckte ein {theme_description}.",
                'Italian': f"C'era una volta, {character_name} scoprì una {theme_description}.",
                'Portuguese': f"Era uma vez, {character_name} descobriu uma {theme_description}.",
                'Chinese': f"从前，{character_name}发现了一个{theme_description}。",
                'Japanese': f"昔々、{character_name}は{theme_description}を発見しました。",
                'Korean': f"옛날옛날에, {character_name}는 {theme_description}를 발견했습니다.",
                'Dutch': f"Er was eens, {character_name} ontdekte een {theme_description}."
            }
            if input.language in language_examples and page_num == 1:
                story_text = language_examples[input.language]
        
        page = StoryBookEachPage(
            page=page_num,
            story_text=story_text,
            illustration_description=f"{input.illustration_style}: {illustration_desc}",
            characters=[story_characters[0]],  # Include main character
            illustration_path="",
            illustration_base64=""
        )
        story_pages.append(page)
    
    return StoryBook(
        story_title=f"{character_name}'s {input.topic.title()} Adventure (Sample Story)",
        story_description=f"A sample {input.language} story about {character_name}'s {theme_description} in {input.illustration_style} style. This is a demonstration story.",
        illustration_style=input.illustration_style,
        story_characters=story_characters,
        story_book=story_pages
    )


async def story_text_generator(input: StoryRequest):
    try:
        # Check for API key availability and validate format
        api_key = input.openai_api_key or os.getenv("OPENAI_API_KEY")
        
        if not api_key:
            print("No OpenAI API key provided, generating mock story...")
            return generate_mock_story(input)
        
        # Basic API key validation
        if input.openai_api_key and not input.openai_api_key.startswith('sk-'):
            print("Invalid API key format detected, generating mock story...")
            return generate_mock_story(input)
        
        # Get LLM with appropriate API key
        llm = get_llm_with_api_key(input.openai_api_key)
        
        if not llm:
            print("Failed to initialize LLM, generating mock story...")
            return generate_mock_story(input)
        
        # Load prompt template
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
        
        print("Generating AI story book...")
        
        # Get response with better error handling
        try:
            response = chain.invoke({
                'age': input.age, 
                'topic': input.topic, 
                'short_description': input.short_description, 
                'page': input.pages, 
                'language': input.language, 
                'illustration_style': input.illustration_style
            })
            
            print("AI story book generated successfully.")
            return response
            
        except Exception as llm_error:
            # If LLM call fails, it's likely an API key issue
            print(f"LLM generation failed (likely API key issue): {llm_error}")
            return generate_mock_story(input)
        
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
        print(f"Error generating AI story: {e}")
        print("Falling back to mock story...")
        return generate_mock_story(input)

    
async def create_illustration(illustration_description: str, api_key: str = None):
    try:
        client = get_openai_client(api_key)
        if not client:
            raise HTTPException(status_code=400, detail="OpenAI API key required for image generation")
            
        response = client.images.generate(
                    model="dall-e-3",
                    prompt=illustration_description,
                    n=1,
                    size="1024x1024"
                )
    
        return response.data[0].url
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")