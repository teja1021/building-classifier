"""
Model loading and inference utilities.
Supports both mock predictions and real model inference.
Production-ready PyTorch inference pipeline for campus building classification.
"""

import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
from typing import Dict, List, Optional, Tuple
import random
import json
import os
from io import BytesIO
import base64
import hashlib

# ============================================================================
# CONFIGURATION: Modify these constants for different models/preprocessing
# ============================================================================

# ImageNet standard normalization (widely used for pretrained models)
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

# Input image size (must match model training setup)
INPUT_SIZE = 224

# Model names to attempt loading (in order of preference)
PREFERRED_MODELS = [
    "models/resnet18_best.pt",
    "models/ensemble.pt",
    "models/model.pt",
]

# Device configuration
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[Inference] Using device: {DEVICE}")

# Global state
LABELS = []
MODEL = None

# Image preprocessing pipeline
TRANSFORM = transforms.Compose([
    transforms.Resize((INPUT_SIZE, INPUT_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=IMAGENET_MEAN,
        std=IMAGENET_STD
    )
])

def load_labels() -> List[str]:
    """
    Load building/location labels from labels.json.
    
    Returns:
        List of label strings
    """
    global LABELS
    try:
        json_path = os.path.join(os.path.dirname(__file__), "labels.json")
        with open(json_path, "r") as f:
            LABELS = json.load(f)
        print(f"✓ Loaded {len(LABELS)} labels from labels.json")
        return LABELS
    except Exception as e:
        print(f"✗ Error loading labels: {e}")
        LABELS = []
        return LABELS

def load_model(force_mock: bool = False) -> Optional[torch.nn.Module]:
    """
    Attempt to load a pretrained model from disk.
    
    Strategy:
    1. Try loading preferred model files (resnet18_best.pt, ensemble.pt, model.pt)
    2. If no file found or load fails, return None to trigger mock inference
    
    Args:
        force_mock: If True, skip loading and return None
    
    Returns:
        Loaded model on CPU/GPU, or None to use mock inference
    """
    global MODEL
    
    if force_mock:
        print("[Inference] Mock mode forced (force_mock=True)")
        return None
    
    try:
        # Search for model files in preferred order
        app_dir = os.path.dirname(__file__)
        for model_path_rel in PREFERRED_MODELS:
            model_path = os.path.join(app_dir, model_path_rel)
            if os.path.exists(model_path):
                print(f"[Inference] Found model at: {model_path}")
                try:
                    model = torch.load(model_path, map_location=DEVICE)
                    model.to(DEVICE)
                    model.eval()
                    print(f"✓ Model loaded successfully from {model_path}")
                    print(f"  Device: {DEVICE} | Num labels: {len(LABELS)}")
                    MODEL = model
                    return model
                except Exception as e:
                    print(f"✗ Failed to load model from {model_path}: {e}")
                    continue
        
        print("[Inference] No model files found. Will use mock inference.")
        print(f"  Expected model files at:")
        for mp in PREFERRED_MODELS:
            print(f"    - app/{mp}")
        return None
    
    except Exception as e:
        print(f"✗ Unexpected error in load_model: {e}")
        return None

def preprocess_pil_image(pil_image: Image.Image) -> torch.Tensor:
    """
    Preprocess PIL Image for model inference.
    
    - Resize to INPUT_SIZE x INPUT_SIZE
    - Convert to tensor
    - Normalize with ImageNet mean/std
    - Returns batch tensor on CPU
    
    Args:
        pil_image: PIL Image object
    
    Returns:
        Preprocessed image tensor of shape (1, 3, 224, 224) on CPU
    """
    try:
        # Ensure RGB
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")
        
        # Apply transforms
        image_tensor = TRANSFORM(pil_image).unsqueeze(0)  # Add batch dimension
        return image_tensor.to(DEVICE)
    
    except Exception as e:
        print(f"✗ Error preprocessing image: {e}")
        return None

def predict_image_bytes(image_bytes: bytes) -> Dict:
    """
    Main inference function: accepts image bytes and returns prediction.
    
    Schema:
    {
        "pred": "CSE Building",          # Top prediction
        "confidence": 0.89,               # Confidence of top prediction
        "probs": [                        # Top-5 predictions
            {"class": "CSE Building", "confidence": 0.89},
            {"class": "ECE Building", "confidence": 0.07},
            ...
        ],
        "notes": "Using mock inference",  # Notes on model/inference
        "gradcam_base64": "data:image/png;base64,iVBORw0K..." or null
    }
    
    Args:
        image_bytes: Raw image bytes
    
    Returns:
        Prediction dictionary
    """
    try:
        # Convert bytes to PIL Image
        pil_img = Image.open(BytesIO(image_bytes)).convert("RGB")
        
        # Preprocess
        img_tensor = preprocess_pil_image(pil_img)
        if img_tensor is None:
            return _mock_predict(notes="Error preprocessing image")
        
        # Use real or mock inference
        if MODEL is None:
            return _mock_predict(image_bytes=image_bytes)
        
        # Real inference
        with torch.no_grad():
            outputs = MODEL(img_tensor)
            probs = torch.nn.functional.softmax(outputs, dim=1)
            
            # Get top-5
            top5_prob, top5_idx = torch.topk(probs, min(5, len(LABELS)), dim=1)
            
            # Build results
            top_preds = []
            for idx, prob in zip(top5_idx[0], top5_prob[0]):
                class_idx = idx.item()
                class_name = LABELS[class_idx] if class_idx < len(LABELS) else f"Unknown_{class_idx}"
                top_preds.append({
                    "class": class_name,
                    "confidence": round(float(prob.item()), 4)
                })
            
            result = {
                "pred": top_preds[0]["class"],
                "confidence": top_preds[0]["confidence"],
                "probs": top_preds,
                "notes": f"Real inference on {DEVICE}",
                "gradcam_base64": None  # TODO: Add Grad-CAM if needed
            }
            
            return result
    
    except Exception as e:
        print(f"✗ Error in predict_image_bytes: {e}")
        return _mock_predict(notes=f"Error: {str(e)}")

def _mock_predict(image_bytes: Optional[bytes] = None, notes: str = "Using mock inference") -> Dict:
    """
    Generate deterministic mock prediction based on image or random seed.
    
    Args:
        image_bytes: Optional image bytes for deterministic hashing
        notes: Optional custom note
    
    Returns:
        Mock prediction dictionary matching real schema
    """
    if not LABELS:
        labels_to_use = [
            "CSE Building", "ECE Building", "Mechanical Building",
            "Civil Engineering", "LA Lawns 1", "LA Lawns 2", "BMBT Building"
        ]
    else:
        labels_to_use = LABELS
    
    # Deterministic randomness based on image if available
    if image_bytes:
        seed = int(hashlib.md5(image_bytes).hexdigest(), 16) % 10000
        random.seed(seed)
    
    # Pick 5 random classes
    num_classes = min(5, len(labels_to_use))
    selected = random.sample(labels_to_use, num_classes)
    
    # Generate probabilities
    raw_scores = np.random.dirichlet(np.ones(num_classes))
    probs = sorted([(c, p) for c, p in zip(selected, raw_scores)], key=lambda x: x[1], reverse=True)
    
    top_preds = [{"class": c, "confidence": round(float(p), 4)} for c, p in probs]
    
    return {
        "pred": top_preds[0]["class"],
        "confidence": top_preds[0]["confidence"],
        "probs": top_preds,
        "notes": notes,
        "gradcam_base64": None
    }

def compute_gradcam(model: torch.nn.Module, image_tensor: torch.Tensor, 
                    target_layer: Optional[str] = None) -> Optional[str]:
    """
    Compute Grad-CAM visualization and return as base64 PNG.
    
    Args:
        model: Model to use for gradient computation
        image_tensor: Preprocessed image tensor
        target_layer: Layer name to target (e.g., 'layer4' for ResNet)
    
    Returns:
        Base64-encoded PNG string or None if unavailable
    """
    # TODO: Implement Grad-CAM computation
    # For now, return None (can be added later)
    return None

# ============================================================================
# Initialization: Called on app startup
# ============================================================================

def initialize():
    """
    Initialize inference system: load labels and attempt to load model.
    Call this on application startup.
    """
    global LABELS, MODEL
    print("\n" + "="*70)
    print("INFERENCE SYSTEM INITIALIZATION")
    print("="*70)
    
    # Load labels
    LABELS = load_labels()
    
    # Attempt model load (can be None if no files present)
    MODEL = load_model()
    
    print("="*70 + "\n")
    return LABELS, MODEL
