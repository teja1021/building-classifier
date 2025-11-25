"""
Utility functions for file handling, preprocessing, and common tasks.
"""

import os
import shutil
import tempfile
from fastapi import UploadFile
from pathlib import Path
from PIL import Image
import base64
from io import BytesIO
from typing import Optional, Tuple
import hashlib

# ============================================================================
# File Handling Utilities
# ============================================================================

def get_safe_filename(filename: str) -> str:
    """
    Generate a safe filename by removing special characters.
    
    Args:
        filename: Original filename
    
    Returns:
        Safe filename
    """
    # Remove path separators and dangerous characters
    safe_chars = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-")
    safe_name = "".join(c if c in safe_chars else "_" for c in filename)
    return safe_name or "unnamed_file"

async def save_upload_file_temp(file: UploadFile) -> str:
    """
    Save uploaded file to temporary directory.
    
    Args:
        file: UploadFile object from FastAPI
    
    Returns:
        Path to temporary file
    
    Note:
        Caller is responsible for cleanup. Use cleanup_temp_file() to delete.
    """
    try:
        # Create temp file with original extension
        ext = Path(file.filename).suffix
        fd, temp_path = tempfile.mkstemp(suffix=ext)
        
        # Write file contents
        contents = await file.read()
        os.write(fd, contents)
        os.close(fd)
        
        return temp_path
    except Exception as e:
        print(f"Error saving temp file: {e}")
        raise

def cleanup_temp_file(file_path: str):
    """
    Delete temporary file.
    
    Args:
        file_path: Path to file to delete
    """
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Error deleting temp file {file_path}: {e}")

def get_file_hash(file_path: str, algorithm: str = "md5") -> str:
    """
    Compute hash of file.
    
    Args:
        file_path: Path to file
        algorithm: Hash algorithm (md5, sha256, etc.)
    
    Returns:
        Hex digest of file hash
    """
    try:
        hasher = hashlib.new(algorithm)
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hasher.update(chunk)
        return hasher.hexdigest()
    except Exception as e:
        print(f"Error computing file hash: {e}")
        return ""

# ============================================================================
# Image Utilities
# ============================================================================

def load_image_from_file(file_path: str) -> Optional[Image.Image]:
    """
    Load image from file path.
    
    Args:
        file_path: Path to image file
    
    Returns:
        PIL Image or None if failed
    """
    try:
        img = Image.open(file_path).convert("RGB")
        return img
    except Exception as e:
        print(f"Error loading image: {e}")
        return None

def image_to_base64(image: Image.Image, format: str = "PNG") -> str:
    """
    Convert PIL Image to base64 string.
    
    Args:
        image: PIL Image object
        format: Image format (PNG, JPEG, etc.)
    
    Returns:
        Base64-encoded string with data URL prefix
    """
    try:
        buffer = BytesIO()
        image.save(buffer, format=format)
        img_bytes = buffer.getvalue()
        b64 = base64.b64encode(img_bytes).decode()
        mime_type = f"image/{format.lower()}"
        return f"data:{mime_type};base64,{b64}"
    except Exception as e:
        print(f"Error converting image to base64: {e}")
        return ""

def base64_to_image(b64_string: str) -> Optional[Image.Image]:
    """
    Convert base64 string to PIL Image.
    
    Args:
        b64_string: Base64-encoded image (with or without data URL prefix)
    
    Returns:
        PIL Image or None if failed
    """
    try:
        # Remove data URL prefix if present
        if "," in b64_string:
            b64_string = b64_string.split(",", 1)[1]
        
        img_bytes = base64.b64decode(b64_string)
        img = Image.open(BytesIO(img_bytes)).convert("RGB")
        return img
    except Exception as e:
        print(f"Error converting base64 to image: {e}")
        return None

def resize_image(image: Image.Image, size: Tuple[int, int]) -> Image.Image:
    """
    Resize image to target size.
    
    Args:
        image: PIL Image
        size: Target (width, height)
    
    Returns:
        Resized image
    """
    try:
        return image.resize(size, Image.Resampling.LANCZOS)
    except Exception as e:
        print(f"Error resizing image: {e}")
        return image

def get_image_info(image: Image.Image) -> dict:
    """
    Get information about image.
    
    Args:
        image: PIL Image
    
    Returns:
        Dictionary with image info
    """
    return {
        "size": image.size,
        "mode": image.mode,
        "format": image.format or "Unknown"
    }

# ============================================================================
# Base64 & Encoding Utilities
# ============================================================================

def bytes_to_base64(data: bytes) -> str:
    """
    Convert bytes to base64 string.
    
    Args:
        data: Bytes to encode
    
    Returns:
        Base64 string
    """
    return base64.b64encode(data).decode()

def base64_to_bytes(b64_string: str) -> bytes:
    """
    Convert base64 string to bytes.
    
    Args:
        b64_string: Base64 string
    
    Returns:
        Decoded bytes
    """
    return base64.b64decode(b64_string)

