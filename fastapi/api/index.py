from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv
import platform
import sys
import time as import_time

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="Ink Over Matter API",
    description="API for Ink Over Matter tattoo studio",
    version="1.0.0"
)

# CORS setup
origins = [
    "https://inkovermatter.vercel.app",
    "http://localhost:3000",
    "https://www.inkovermatter.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def landing_page():
    return {
        "message": "Welcome to the Ink Over Matter API",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": os.environ.get("ENVIRONMENT", "unknown"),
        "python_version": sys.version,
        "platform": platform.platform(),
        "timestamp": import_time.time()
    }

@app.get("/view_full_gallery")
async def view_full_gallery():
    images = [{
        "id": idx,
        "title": f"Premium Tattoo Artwork {idx}",
        "url": f"/images/tattoo{idx}.jpg"
    } for idx in range(1, 15)]
    return images



# Gemini chat setup
api_key = os.environ.get("GOOGLE_API_KEY")
if not api_key:
    print("Warning: Missing GOOGLE_API_KEY. Chat functionality will not work.")
    api_key = "dummy-key-for-development" if os.environ.get("ENVIRONMENT") != "production" else None

if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")

# Load system prompt
try:
    with open(os.path.join(os.path.dirname(__file__), "system_prompt.txt"), "r") as f:
        system_prompt = f.read()
except FileNotFoundError:
    system_prompt = (
        "You are Jimmy, an AI assistant for Ink Over Matter tattoo studio. "
        "You help customers with tattoo-related questions, booking inquiries, "
        "and provide information about the studio's services, artists, and tattoo care."
    )

# Define a request model for chat
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    if not api_key or (api_key == "dummy-key-for-development" and os.environ.get("ENVIRONMENT") == "production"):
        raise HTTPException(status_code=503, detail="Chat service is currently unavailable. Please contact the studio directly.")

    try:
        response = model.generate_content([
            {"role": "user", "parts": [system_prompt]},
            {"role": "model", "parts": ["I'll help answer questions about Ink Over Matter tattoo studio!"]},
            {"role": "user", "parts": [request.message]}
        ])
        return {"response": response.text}
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="I'm having trouble right now. Please try again later or call +91-9731119546.")
