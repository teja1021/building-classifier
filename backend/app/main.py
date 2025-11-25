"""
FastAPI application for campus building classifier.
Endpoints: /ping, /labels, /predict
Production-ready with Grad-CAM support and mock inference fallback.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime
import json
import os

from inference import initialize, predict_image_bytes, load_labels, LABELS

# ============================================================================
# FastAPI App Setup
# ============================================================================

app = FastAPI(
    title="Campus Building Classifier API",
    description="PyTorch-based building classification with mock fallback",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Pydantic Models
# ============================================================================

class PredictionProbability(BaseModel):
    """Single prediction probability entry."""
    class_name: str
    confidence: float

class PredictionResponse(BaseModel):
    """Response schema for /predict endpoint."""
    pred: str                                # Top predicted building
    confidence: float                        # Confidence of top prediction
    probs: List[PredictionProbability]      # Top-5 predictions
    notes: str                               # Info about inference (real/mock)
    gradcam_base64: Optional[str] = None    # Grad-CAM visualization (if available)

class LabelsResponse(BaseModel):
    """Response schema for /labels endpoint."""
    labels: List[str]
    count: int

# ============================================================================
# Lifecycle Events
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """
    Initialize inference system on app startup.
    Loads labels and attempts to load model.
    """
    print("\n" + "="*70)
    print("APPLICATION STARTUP")
    print("="*70)
    initialize()
    print("="*70 + "\n")

# ============================================================================
# Endpoints
# ============================================================================

@app.get("/ping")
async def ping():
    """
    Health check endpoint.
    """
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "message": "Campus Building Classifier API is running"
    }

@app.get("/labels", response_model=LabelsResponse)
async def get_labels():
    """
    Get all available building/location labels.
    
    Returns:
        List of label strings and count
    """
    try:
        labels = load_labels()
        return LabelsResponse(labels=labels, count=len(labels))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching labels: {str(e)}"
        )

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """
    Predict building class from uploaded image.
    
    - Accepts JPEG, PNG, GIF, BMP, WebP formats
    - Returns top-5 predictions with confidence scores
    - Falls back to mock inference if model not available
    - Optionally includes Grad-CAM visualization
    
    Args:
        file: Image file (multipart/form-data)
    
    Returns:
        PredictionResponse with predictions and optional Grad-CAM
    
    Example:
        curl -X POST "http://localhost:8000/predict" \\
            -H "accept: application/json" \\
            -F "file=@building.jpg"
    """
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file uploaded"
        )
    
    # Validate file type
    allowed_types = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {file_ext}. Allowed: {allowed_types}"
        )
    
    try:
        # Read image bytes
        image_bytes = await file.read()
        
        if not image_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty file"
            )
        
        # Run inference
        result = predict_image_bytes(image_bytes)
        
        # Convert to response format
        probs_list = [
            PredictionProbability(
                class_name=p["class"],
                confidence=p["confidence"]
            )
            for p in result.get("probs", [])
        ]
        
        return PredictionResponse(
            pred=result["pred"],
            confidence=result["confidence"],
            probs=probs_list,
            notes=result.get("notes", ""),
            gradcam_base64=result.get("gradcam_base64", None)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Prediction failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )

# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    """Generic exception handler."""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

# ============================================================================
# Main
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

