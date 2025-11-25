import React, { useState, useRef } from 'react';
import { predictImage } from '../api';

function UploadDropzone({ onPrediction, onError, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFiles = async (files) => {
    setIsDragging(false);

    if (!files || files.length === 0) {
      onError('No files selected');
      return;
    }

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Send to API
    await predictFile(file);
  };

  const predictFile = async (file) => {
    setLoading(true);
    try {
      const result = await predictImage(file);
      onPrediction(result);
      onError('');
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to mock prediction if API fails
      const mockResult = generateMockPrediction(file);
      onPrediction(mockResult);
      onError('');
    } finally {
      setLoading(false);
    }
  };

  const generateMockPrediction = (file) => {
    // Generate deterministic mock predictions based on filename
    const buildings = [
      'CSE Building', 'ECE Building', 'Mechanical Building', 'Civil Engineering Building',
      'LA Lawns 1', 'LA Lawns 2', 'BMBT Building', 'Dispensary', 'Administrative Building',
      'Library', 'Student Center', 'Auditorium', 'Sports Complex', 'Laboratory Block',
      'Hostel Building', 'Cafeteria', 'Medical Center'
    ];

    // Use filename to generate consistent but varied predictions
    const seed = file.name.charCodeAt(0) + file.size % 17;
    const predIndex = seed % buildings.length;
    const pred = buildings[predIndex];

    // Generate confidence scores
    const probs = buildings
      .map((building, idx) => ({
        class: building,
        class_name: building,
        confidence: idx === predIndex ? 0.85 + Math.random() * 0.14 : Math.random() * 0.15
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    const confidence = probs[0].confidence;

    return {
      pred: pred,
      confidence: confidence,
      probs: probs,
      notes: '🤖 Mock prediction (backend not running). Real predictions will work when backend is active.',
      gradcam_base64: null
    };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    handleFiles(e.target.files);
  };

  const handleReset = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && !loading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          disabled
            ? 'bg-slate-50 border-slate-300 text-slate-500 cursor-not-allowed'
            : isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || loading}
        />

        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="spinner"></div>
            <p className="text-slate-600">Processing image...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📷</div>
            <div>
              <p className="font-semibold text-slate-900">Drag and drop an image here</p>
              <p className="text-sm text-slate-600">or click to select from your computer</p>
            </div>
            <p className="text-xs text-slate-500">Supported formats: JPG, PNG, GIF, BMP, WebP</p>
          </div>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
          <img src={preview} alt="Preview" className="w-full rounded-lg max-h-96 object-cover" />
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition"
              disabled={loading}
            >
              Clear
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              disabled={loading}
            >
              Choose Another
            </button>
          </div>
        </div>
      )}

      {/* Webcam Placeholder */}
      <button
        disabled
        className="w-full px-4 py-2 bg-slate-100 text-slate-500 rounded-lg border border-slate-300 cursor-not-allowed opacity-50"
        title="Webcam support coming soon"
      >
        📹 Capture from Webcam (Coming Soon)
      </button>
    </div>
  );
}

export default UploadDropzone;
