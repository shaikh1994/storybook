import os
import base64
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import concurrent.futures
from concurrent.futures import ThreadPoolExecutor

from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from PIL import Image
import io
from app.storybook.schemas import StoryBook


@dataclass
class IllustrationConfig:
    """Configuration for illustration generation."""
    model: str = "gpt-image-1"
    character_size: str = "1024x1024"
    page_size: str = "1024x1024"
    quality: str = "low"
    output_dir: str = "story_illustrations_openai"


class StoryBookIllustrator:
    """A class to generate and manage illustrations for a storybook."""
    
    def __init__(self, story_book: StoryBook, config: Optional[IllustrationConfig] = None):
        """
        Initialize the story book illustrator.
        
        Args:
            story_book: StoryBook object containing characters and pages
            config: Configuration for the illustration generation
        """
        self.story_book = story_book
        self.config = config or IllustrationConfig()
        
        # Setup directories
        self.setup_directories()
        
        # Initialize OpenAI client
        try:
            self.client = OpenAI()
        except Exception as e:
            print(f"Failed to initialize OpenAI client: {e}")
            raise
    
    def setup_directories(self) -> None:
        """Create necessary directories for saving illustrations."""
        # Create main output directory
        self.output_base = Path(self.config.output_dir)
        self.output_base.mkdir(exist_ok=True, parents=True)
        
        # Create characters directory
        self.characters_dir = self.output_base / "characters"
        self.characters_dir.mkdir(exist_ok=True)
        
        # Create pages directory
        self.pages_dir = self.output_base / "pages"
        self.pages_dir.mkdir(exist_ok=True)
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((ConnectionError, TimeoutError))
    )
    def generate_image(self, prompt: str, size: str, characters: List[Path] = None) -> Dict:
        """
        Generate an image using OpenAI's API.
        
        Args:
            prompt: Description for the image generation
            size: Size of the image to generate
            characters: Optional list of character image paths to include
        
        Returns:
            API response containing the generated image
        """
        try:
            prompt = f"""
            Illustration Style: {self.story_book.illustration_style}
            Illustration Description: {prompt}
            """
            if characters:
                # Open all character images
                image_files = [open(str(char_path), "rb") for char_path in characters]
                result = self.client.images.edit(
                    model=self.config.model,
                    prompt=prompt,
                    size=size,
                    image=image_files,
                    quality=self.config.quality,
                )
                # Close all opened files
                for file in image_files:
                    file.close()
            else:
                result = self.client.images.generate(
                    model=self.config.model,
                    prompt=prompt,
                    size=size,
                    quality=self.config.quality,
                )
            return result
        except Exception as e:
            print(f"Image generation failed: {e}")
            raise
    
    def save_image(self, image_base64: str, output_path: Path) -> None:
        """
        Save an image from API response to a file.
        
        Args:
            result: API response containing the image data
            output_path: Path where the image should be saved
        """
        try:
            image_bytes = base64.b64decode(image_base64)
            
            # Process image with PIL before saving
            image = Image.open(io.BytesIO(image_bytes))
            
            # Save the image
            image.save(output_path)
            print(f"Image saved to {output_path}")
        except Exception as e:
            print(f"Failed to save image: {e}")
            raise
    
    def generate_character_illustrations(self) -> Dict[str, Path]:
        """
        Generate illustrations for all characters in the story in parallel.
        
        Returns:
            Dictionary mapping character names to their image paths
        """
        print("Generating character illustrations in parallel...")
        character_paths = {}
        
        def process_character(character):
            name = character.character_name
            description = character.character_description
            
            if not name or not description:
                print(f"Skipping character with missing data: {character}")
                return name, None
                
            print(f"Generating illustration for character: {name}")
            
            # Generate safe filename
            safe_name = "".join(c if c.isalnum() else "_" for c in name)
            filename = f"{safe_name}.png"
            output_path = self.characters_dir / filename
            
            # Skip if image already exists
            if output_path.exists():
                print(f"Using existing illustration for {name}")
                character.character_image_path = str(output_path)
                return name, output_path
                
            # Generate and save character illustration
            try:
                result = self.generate_image(
                    prompt=description,
                    size=self.config.character_size
                )
                # Get base64 data from response
                image_base64 = result.data[0].b64_json
                # Save the image
                self.save_image(image_base64, output_path)
                
                # Update character data with image path
                character.character_image_path = str(output_path)
                return name, output_path
            except Exception as e:
                print(f"Failed to generate illustration for {name}: {e}")
                return name, None
        
        # Process characters in parallel
        with ThreadPoolExecutor(max_workers=5) as executor:
            # Submit all tasks
            future_to_character = {
                executor.submit(process_character, character): character
                for character in self.story_book.story_characters
            }
            
            # Collect results as they complete
            for future in concurrent.futures.as_completed(future_to_character):
                name, path = future.result()
                if name and path:
                    character_paths[name] = path
        
        print("All character illustrations completed")
        return character_paths
    
    def process_page_illustration(self, page, page_index: int, character_paths: Dict[str, Path]):
        """
        Process a single page illustration.
        
        Args:
            page: The page data object
            page_index: Index of the page in the storybook
            character_paths: Dictionary mapping character names to their image paths
            
        Returns:
            Updated page with illustration path
        """
        page_num = page.page
        description = page.illustration_description
        
        if not description:
            print(f"Skipping page {page_num} with missing description")
            return page
            
        print(f"Generating illustration for page {page_num}")
        
        # Generate filename for the page
        filename = f"page_{page_num:03d}.png"
        output_path = self.pages_dir / filename
        
        # Skip if image already exists
        if output_path.exists():
            print(f"Using existing illustration for page {page_num}")
            page.illustration_path = str(output_path)
            return page
        
        # Get characters mentioned in this page specifically
        mentioned_characters = []
        if hasattr(page, 'characters'):
            for character in page.characters:
                char_name = character.character_name
                if char_name and char_name in character_paths:
                    mentioned_characters.append(character_paths[char_name])
        
        # Generate and save page illustration
        try:
            # If there are mentioned characters, use them in the image edit
            if mentioned_characters:
                result = self.generate_image(
                    prompt=description,
                    size=self.config.page_size,
                    characters=mentioned_characters[:5]  # API might limit number of images
                )
            else:
                # Otherwise generate a new image
                result = self.generate_image(
                    prompt=description,
                    size=self.config.page_size
                )
            
            # Get base64 data from response
            image_base64 = result.data[0].b64_json
            # Save the image
            # self.save_image(image_base64, output_path)
            
            # Update page data with image path
            page.illustration_path = str(output_path)
            page.illustration_base64 = image_base64
        except Exception as e:
            print(f"Failed to generate illustration for page {page_num}: {e}")
            
        return page
    
    def generate_page_illustrations_parallel(self, character_paths: Dict[str, Path], max_workers: int = 5) -> None:
        """
        Generate illustrations for all pages in the story in parallel.
        
        Args:
            character_paths: Dictionary mapping character names to their image paths
            max_workers: Maximum number of parallel workers
        """
        print(f"Generating page illustrations in parallel with {max_workers} workers...")
        
        story_pages = self.story_book.story_book
        total_pages = len(story_pages)
        
        print(f"Total pages to process: {total_pages}")
        
        # Process pages in parallel
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks
            futures = []
            for i, page in enumerate(story_pages):
                future = executor.submit(
                    self.process_page_illustration,
                    page,
                    i,
                    character_paths
                )
                futures.append(future)
            
            # Collect results as they complete
            for future in concurrent.futures.as_completed(futures):
                try:
                    future.result()
                except Exception as e:
                    print(f"Error processing page: {e}")
        
        print("All page illustrations completed")
    
    def generate_all_illustrations(self, parallel: bool = True, max_workers: int = 5) -> StoryBook:
        """
        Generate all illustrations for the storybook.
        
        Args:
            parallel: Whether to generate page illustrations in parallel
            max_workers: Maximum number of parallel workers
            
        Returns:
            Updated story book with all illustration paths
        """
        try:
            # Generate character illustrations first (this is sequential)
            character_paths = self.generate_character_illustrations()
            
            # Then generate page illustrations using character illustrations
            if parallel:
                self.generate_page_illustrations_parallel(character_paths, max_workers)
            else:
                self.generate_page_illustrations(character_paths)
            
            print("All illustrations generated successfully")
            return self.story_book
            
        except Exception as e:
            print(f"Illustration generation failed: {e}")
            raise
    
    def generate_page_illustrations(self, character_paths: Dict[str, Path]) -> None:
        """
        Generate illustrations for all pages in the story sequentially.
        
        Args:
            character_paths: Dictionary mapping character names to their image paths
        """
        print("Generating page illustrations sequentially...")
        
        story_pages = self.story_book.story_book
        
        for i, page in enumerate(story_pages):
            self.process_page_illustration(page, i, character_paths)
        
        print("Sequential page illustrations completed")