import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.storybook.routers import router as storybook_router
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles

load_dotenv()

app = FastAPI(
    title="Child Story Book API",
    description="API for Child Story Book",
    version="0.1.0",
)

# Allow CORS for all origins
origins = [
    os.getenv("FRONTEND_URL")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.get("/")(lambda: {"message": "Child Story Book API is running!"})

app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/static/sample", StaticFiles(directory="sample"), name="sample")

app.include_router(storybook_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)
