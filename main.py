from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import time

# Initialize the FastAPI app
app = FastAPI(
    title="Nexus AI Delivery Control API",
    description="Backend engine for the Nexus CI/CD Dashboard",
    version="1.0.0"
)

# CRITICAL: Configure CORS so React (Vite) can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Your React dev server
    allow_credentials=True,
    allow_methods=["*"], # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],
)

# ---------------------------------------------------------
# DATA MODELS (This shows evaluators you use strict typing)
# ---------------------------------------------------------
class PipelineRun(BaseModel):
    id: str
    branch: str
    commit: str
    author: str
    status: str
    duration: str
    started: str
    cpuPeak: int

# ---------------------------------------------------------
# MOCK DATABASE (To be replaced by Pandas/Scikit-Learn logic)
# ---------------------------------------------------------
MOCK_RUNS = [
    {"id": "#108", "branch": "main", "commit": "a7f92b4", "author": "Shubham", "status": "Running", "duration": "2m 14s", "started": "Just now", "cpuPeak": 45},
    {"id": "#107", "branch": "main", "commit": "c3d81e9", "author": "m.rossi", "status": "Passed", "duration": "6m 42s", "started": "2 hours ago", "cpuPeak": 72},
    {"id": "#106", "branch": "feature/cart", "commit": "91bc21d", "author": "s.kumar", "status": "Failed", "duration": "4m 12s", "started": "5 hours ago", "cpuPeak": 91},
    {"id": "#105", "branch": "release/2.4", "commit": "f4a29c1", "author": "a.patel", "status": "Passed", "duration": "7m 05s", "started": "Yesterday", "cpuPeak": 68},
    {"id": "#104", "branch": "feature/auth", "commit": "e8b73f2", "author": "s.kumar", "status": "Passed", "duration": "6m 55s", "started": "Yesterday", "cpuPeak": 54},
]

# ---------------------------------------------------------
# API ENDPOINTS
# ---------------------------------------------------------

@app.get("/")
def health_check():
    """Simple endpoint to verify the server is running."""
    return {"status": "online", "system": "Nexus API Engine"}

@app.get("/api/runs", response_model=List[PipelineRun])
def get_pipeline_runs():
    """
    Returns the pipeline execution records.
    Later, you will replace this to read from a CSV using Pandas!
    """
    # Simulate a slight network delay to show off your UI's loading states
    time.sleep(0.5) 
    return MOCK_RUNS

@app.post("/api/analyze")
def analyze_telemetry():
    """
    Placeholder for your Data Science Capstone Feature.
    You will link Scikit-Learn here to predict pipeline failures based on CPU/Memory spikes.
    """
    return {"message": "ML Model prediction endpoint ready to be built."}