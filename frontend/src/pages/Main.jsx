import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UploadDropzone from '../components/UploadDropzone';
import { getLabels } from '../api';

function Main({ user, onLogout, apiHealthy }) {
  const [labels, setLabels] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  // Load labels on mount
  useEffect(() => {
    const loadLabels = async () => {
      try {
        const labelsData = await getLabels();
        setLabels(labelsData);
      } catch (err) {
        console.error('Error loading labels:', err);
        setError('Failed to load labels');
      }
    };

    if (apiHealthy) {
      loadLabels();
    }
  }, [apiHealthy]);

  const handlePrediction = (result) => {
    setPrediction(result);
    setError('');
  };

  const handleError = (err) => {
    setError(err);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Campus Building Classifier</h1>
            <p className="text-sm text-slate-600">Predict building classes from images</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-700">Welcome, <strong>{user.username}</strong></span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
            <Link to="/" className="px-4 py-3 border-b-2 border-blue-600 text-blue-600 font-medium">
              Classifier
            </Link>
            <Link to="/dataset" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
              Dataset Browser
            </Link>
            <Link to="/metrics" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
              Model Metrics
            </Link>
            <Link to="/confusion" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
              Confusion Matrix
            </Link>
            <Link to="/profile" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
              Profile
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!apiHealthy && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
            ⚠️ Backend API not reachable. Predictions will not work. Make sure the backend is running on port 8000.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Upload Image</h2>
            <UploadDropzone
              onPrediction={handlePrediction}
              onError={handleError}
              disabled={false}
            />
          </div>

          {/* Right: Results */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Prediction Results</h2>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg mb-4">
                {error}
              </div>
            )}

            {prediction ? (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-6 fade-in">
                {/* Top Prediction */}
                <div className="border-b border-slate-200 pb-4">
                  <p className="text-sm text-slate-600 mb-2">Top Prediction</p>
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">{prediction.pred}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${(prediction.confidence * 100).toFixed(1)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Top 5 Predictions */}
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Top 5 Predictions</p>
                  <ul className="space-y-2">
                    {prediction.probs?.map((p, idx) => (
                      <li key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span className="text-slate-700">{p.class_name || p.class}</span>
                        <span className="text-sm font-medium text-slate-600">
                          {(p.confidence * 100).toFixed(2)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Grad-CAM */}
                {prediction.gradcam_base64 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Grad-CAM Visualization</p>
                    <img
                      src={prediction.gradcam_base64}
                      alt="Grad-CAM"
                      className="w-full rounded-lg border border-slate-200"
                    />
                  </div>
                )}

                {/* Notes */}
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
                  <strong>Info:</strong> {prediction.notes}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg p-8 text-center border-2 border-dashed border-slate-300">
                <p className="text-slate-600">Upload an image to see predictions here</p>
              </div>
            )}
          </div>
        </div>

        {/* Available Labels */}
        {labels.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Available Labels ({labels.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {labels.map((label, idx) => (
                <div key={idx} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm text-center border border-blue-200">
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Main;
