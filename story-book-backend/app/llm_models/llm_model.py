import os
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

# Default LLM instance using environment variable
llm = ChatOpenAI(model="gpt-4o", temperature=0.7)


def get_llm_with_api_key(api_key: Optional[str] = None) -> Optional[ChatOpenAI]:
    """
    Get LLM instance with provided API key or from environment.
    
    Args:
        api_key: Optional OpenAI API key from frontend
        
    Returns:
        ChatOpenAI instance or None if no valid API key
    """
    try:
        if api_key:
            # Use provided API key
            return ChatOpenAI(
                model="gpt-4o",
                temperature=0.7,
                openai_api_key=api_key
            )
        elif os.getenv("OPENAI_API_KEY"):
            # Use environment variable
            return ChatOpenAI(
                model="gpt-4o", 
                temperature=0.7
            )
        else:
            # No API key available
            return None
    except Exception as e:
        print(f"Failed to initialize LLM: {e}")
        return None