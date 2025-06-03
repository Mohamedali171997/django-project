# list_gemini_models.py
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables (to get your GEMINI_API_KEY)
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("GEMINI_API_KEY not found in .env file. Please ensure it's set.")
else:
    try:
        genai.configure(api_key=API_KEY)
        print("Configured Gemini API. Listing models...\n")

        for m in genai.list_models():
            # Filter for models that support text generation
            if 'generateContent' in m.supported_generation_methods:
                print(f"Name: {m.name}")
                print(f"Description: {m.description}")
                print(f"Supported methods: {m.supported_generation_methods}\n")

    except Exception as e:
        print(f"An error occurred: {e}")