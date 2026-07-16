import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Now import and run uvicorn
import uvicorn
from app.main import app

if __name__ == "__main__":
    print("Starting Eunoia AI Backend...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
