# Campus Building Classifier

A production-ready PyTorch-based image classification system for identifying campus buildings. Features a modern React + Vite frontend with drag-and-drop image upload, and a FastAPI backend with mock inference fallback.

## 🎯 Project Overview

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI with PyTorch inference
- **Model**: ResNet18 (or custom model) with ImageNet preprocessing
- **Inference**: Real ML model or deterministic mock fallback
- **Deployment**: Docker & Docker Compose support

## 📋 Features

- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Drag-and-drop image upload with preview
- ✅ Top-5 prediction display with confidence scores
- ✅ Mock inference (works without model files)
- ✅ Real PyTorch model support
- ✅ Grad-CAM visualization support (extensible)
- ✅ Protected pages (login required)
- ✅ Dataset browser, metrics, and confusion matrix pages (placeholders)
- ✅ Docker containerization
- ✅ CORS-enabled for frontend development
- ✅ Comprehensive error handling

## 🏗️ Project Structure

```
project-root/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application
│   │   ├── inference.py            # PyTorch model & inference logic
│   │   ├── utils.py                # File handling utilities
│   │   ├── models/
│   │   │   ├── README.txt          # Model documentation
│   │   │   ├── resnet18_best.pt    # (Optional) Your trained model
│   │   │   └── ensemble.pt         # (Optional) Ensemble model
│   │   └── labels.json             # Building labels (from PDFs)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore (optional)
│
├── frontend/
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Main.jsx
│   │   │   ├── DatasetBrowser.jsx
│   │   │   ├── ModelMetrics.jsx
│   │   │   └── ConfusionMatrix.jsx
│   │   └── components/
│   │       └── UploadDropzone.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.cjs
│
├── notebooks/
│   └── demo_inference.ipynb        # Example notebook
│
├── README.md
├── docker-compose.yml
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 16+
- (Optional) Docker & Docker Compose

### Local Development

#### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

#### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

**Demo Login:**
- Username: any non-empty value (e.g., `demo`)
- Password: any non-empty value (e.g., `password`)

### Using Docker Compose

```bash
# Build and run both services
docker-compose up --build

# Or detached mode
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend  # if frontend container is enabled

# Stop services
docker-compose down
```

Backend: `http://localhost:8000`
Frontend: `http://localhost:5173` (if frontend container is enabled)

## 📚 API Documentation

### Endpoints

#### `GET /ping`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2023-11-25T12:34:56.789Z",
  "message": "Campus Building Classifier API is running"
}
```

#### `GET /labels`
Get list of all building labels.

**Response:**
```json
{
  "labels": [
    "CSE Building",
    "ECE Building",
    "Mechanical Building",
    ...
  ],
  "count": 17
}
```

#### `POST /predict`
Predict building class from uploaded image.

**Request:**
```
Content-Type: multipart/form-data
Field: file (image file)
```

**Response:**
```json
{
  "pred": "CSE Building",
  "confidence": 0.89,
  "probs": [
    {
      "class_name": "CSE Building",
      "confidence": 0.89
    },
    {
      "class_name": "ECE Building",
      "confidence": 0.07
    },
    ...
  ],
  "notes": "Real inference on cuda",
  "gradcam_base64": null
}
```

## 🤖 Model Integration

### Using Your Own Model

1. **Save your trained model:**
   ```python
   import torch
   torch.save(model, "backend/app/models/resnet18_best.pt")
   ```

2. **Ensure proper preprocessing:**
   - Input size: 224×224
   - Normalization: ImageNet (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
   - Output: Logits tensor matching label count

3. **Class ordering must match `labels.json`**

4. **Restart backend** - model loads automatically on startup

### Label Extraction

The `labels.json` file contains building classifications extracted from research PDFs:

```json
[
  "CSE Building",
  "ECE Building",
  "Mechanical Building",
  "Civil Engineering Building",
  "LA Lawns 1",
  "LA Lawns 2",
  "BMBT Building",
  "Dispensary",
  "Administrative Building",
  "Library",
  "Student Center",
  "Auditorium",
  "Sports Complex",
  "Laboratory Block",
  "Hostel Building",
  "Cafeteria",
  "Medical Center"
]
```

See `backend/app/labels_extraction_notes.txt` for extraction details.

### Mock Inference (No Model Required)

If no model files are present, the system automatically falls back to **deterministic mock inference**:
- Uses MD5 hash of image bytes for reproducibility
- Returns realistic probability distributions
- Perfect for UI testing and development

## 🛠️ Configuration

### Backend Settings

Edit `backend/app/inference.py`:

```python
# Input image preprocessing
INPUT_SIZE = 224  # Change for different model input size
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

# Model search path (in order)
PREFERRED_MODELS = [
    "models/resnet18_best.pt",
    "models/ensemble.pt",
    "models/model.pt",
]
```

### Frontend Settings

Edit `frontend/src/api.js`:

```javascript
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';
```

Or set environment variable:
```bash
export REACT_APP_API_BASE=http://your-api-server:8000
npm run dev
```

## 📊 Building Labels

The system includes 17 building categories extracted from research PDFs:

| Index | Label | Type |
|-------|-------|------|
| 0 | CSE Building | Engineering |
| 1 | ECE Building | Engineering |
| 2 | Mechanical Building | Engineering |
| 3 | Civil Engineering Building | Engineering |
| 4 | LA Lawns 1 | Outdoor |
| 5 | LA Lawns 2 | Outdoor |
| 6 | BMBT Building | Biomedical |
| 7 | Dispensary | Medical |
| 8 | Administrative Building | Administrative |
| 9 | Library | Academic |
| 10 | Student Center | Student |
| 11 | Auditorium | Event |
| 12 | Sports Complex | Sports |
| 13 | Laboratory Block | Research |
| 14 | Hostel Building | Residential |
| 15 | Cafeteria | Food Service |
| 16 | Medical Center | Medical |

See `backend/app/labels_extraction_notes.txt` for details.

## 📓 Jupyter Notebook

A demo notebook is available at `notebooks/demo_inference.ipynb` showing:
- How to call the `/predict` endpoint
- Processing prediction results
- Visualization examples

## 🐳 Docker Commands

```bash
# Build backend image
docker build -t campus-classifier:latest ./backend

# Run backend
docker run -p 8000:8000 campus-classifier:latest

# Build and run with Compose
docker-compose up --build

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

## 🔐 Security Notes

**Development:**
- CORS is open (`allow_origins=["*"]`)
- Authentication is mock (any credentials accepted)
- No HTTPS

**Production:**
- Restrict CORS origins
- Implement proper authentication (JWT with python-jose)
- Use HTTPS
- Add rate limiting
- Validate file uploads
- Use environment variables for secrets

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check if port 8000 is in use
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process using port
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Frontend can't reach backend
- Ensure backend is running: `curl http://localhost:8000/ping`
- Check browser console for CORS errors
- Update `API_BASE` in `frontend/src/api.js`

### Model not loading
- Check file exists: `backend/app/models/resnet18_best.pt`
- Verify PyTorch compatibility
- Check backend logs for error messages
- Confirm class count matches `labels.json`

### Slow predictions
- Use GPU if available (`torch.cuda.is_available()`)
- Try smaller model (MobileNet, EfficientNet)
- Consider ONNX export for faster inference

## 📦 Dependencies

**Backend:**
- fastapi>=0.104.0
- torch>=2.0.0
- torchvision>=0.15.0
- pillow>=10.0.0
- numpy>=1.26.0
- uvicorn[standard]>=0.24.0
- python-multipart
- pydantic>=2.5.0

**Frontend:**
- react>=18.2.0
- react-dom>=18.2.0
- react-router-dom>=6.20.0
- axios>=1.6.0
- tailwindcss>=3.4.0
- vite>=5.0.0

## 📝 License

This project is provided as-is for educational and research purposes.

## 📧 Support

For issues, questions, or contributions:
1. Check the troubleshooting section
2. Review API documentation in `main.py`
3. Check model documentation in `backend/app/models/README.txt`
4. Review frontend code for UI integration examples

---

**Last Updated:** November 25, 2024
**Version:** 1.0.0
#   N I T - R o u r k e l a - c a m p u s - b u i l d i n g - c l a s s i f i e r  
 