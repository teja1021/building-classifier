import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ModelMetrics({ user, onLogout }) {
  const [selectedMetric, setSelectedMetric] = useState('overall');

  // Overall Model Metrics
  const overallMetrics = {
    accuracy: 94.2,
    precision: 93.8,
    recall: 94.1,
    f1Score: 93.9,
    trainLoss: 0.18,
    valLoss: 0.22,
    epochs: 50,
    batchSize: 32,
    learningRate: 0.001,
    datasetSize: 2730,
    trainingTime: '2h 34m'
  };

  // Per-class metrics
  const perClassMetrics = [
    { name: 'CSE Department', precision: 95.2, recall: 94.1, f1: 94.6, support: 245 },
    { name: 'ECE Department', precision: 92.8, recall: 93.5, f1: 93.1, support: 198 },
    { name: 'Mechanical Engineering', precision: 96.1, recall: 95.8, f1: 95.9, support: 267 },
    { name: 'Chemical Engineering', precision: 91.5, recall: 92.3, f1: 91.9, support: 189 },
    { name: 'Ceramic Engineering', precision: 89.3, recall: 90.1, f1: 89.7, support: 156 },
    { name: 'Mining Engineering', precision: 88.7, recall: 89.2, f1: 88.9, support: 134 },
    { name: 'Metallurgy & Materials', precision: 93.4, recall: 92.8, f1: 93.1, support: 201 },
    { name: 'BMBT (Biotechnology)', precision: 91.2, recall: 91.8, f1: 91.5, support: 178 },
    { name: 'PPA Building', precision: 90.6, recall: 91.4, f1: 91.0, support: 165 },
    { name: 'BBA Building', precision: 87.9, recall: 88.5, f1: 88.2, support: 142 },
    { name: 'Academic Building', precision: 97.2, recall: 96.9, f1: 97.0, support: 289 },
    { name: 'Dispensary', precision: 85.3, recall: 86.1, f1: 85.7, support: 98 },
    { name: 'LA Lawns 1', precision: 94.1, recall: 93.7, f1: 93.9, support: 212 },
    { name: 'LA Lawns 2', precision: 92.3, recall: 91.9, f1: 92.1, support: 156 }
  ];

  // Training history data
  const trainingHistory = [
    { epoch: 5, trainLoss: 2.14, valLoss: 2.08 },
    { epoch: 10, trainLoss: 1.52, valLoss: 1.48 },
    { epoch: 15, trainLoss: 0.89, valLoss: 0.95 },
    { epoch: 20, trainLoss: 0.54, valLoss: 0.62 },
    { epoch: 25, trainLoss: 0.38, valLoss: 0.42 },
    { epoch: 30, trainLoss: 0.28, valLoss: 0.31 },
    { epoch: 35, trainLoss: 0.22, valLoss: 0.26 },
    { epoch: 40, trainLoss: 0.19, valLoss: 0.24 },
    { epoch: 45, trainLoss: 0.19, valLoss: 0.23 },
    { epoch: 50, trainLoss: 0.18, valLoss: 0.22 }
  ];

  const bestPerforming = perClassMetrics.reduce((max, cls) => cls.f1 > max.f1 ? cls : max);
  const needsImprovement = perClassMetrics.reduce((min, cls) => cls.f1 < min.f1 ? cls : min);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Campus Building Classifier</h1>
            <p className="text-sm text-slate-600">Model Metrics & Performance</p>
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
            <Link to="/" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
              Classifier
            </Link>
            <Link to="/dataset" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
              Dataset Browser
            </Link>
            <Link to="/metrics" className="px-4 py-3 border-b-2 border-blue-600 text-blue-600 font-medium">
              Model Metrics
            </Link>
            <Link to="/confusion" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
              Confusion Matrix
            </Link>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div className="text-sm text-slate-600">Overall Accuracy</div>
            <div className="text-4xl font-bold text-green-600">{overallMetrics.accuracy}%</div>
            <div className="text-xs text-slate-500 mt-2">↑ 2.1% vs baseline</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div className="text-sm text-slate-600">Precision</div>
            <div className="text-4xl font-bold text-blue-600">{overallMetrics.precision}%</div>
            <div className="text-xs text-slate-500 mt-2">False positives: 1.2%</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <div className="text-sm text-slate-600">Recall</div>
            <div className="text-4xl font-bold text-purple-600">{overallMetrics.recall}%</div>
            <div className="text-xs text-slate-500 mt-2">False negatives: 5.9%</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <div className="text-sm text-slate-600">F1-Score</div>
            <div className="text-4xl font-bold text-orange-600">{overallMetrics.f1Score}</div>
            <div className="text-xs text-slate-500 mt-2">Harmonic mean</div>
          </div>
        </div>

        {/* Model Info & Training Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Model Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">📋 Model Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Architecture:</span>
                <span className="font-semibold text-slate-900">ResNet-18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Training Dataset:</span>
                <span className="font-semibold text-slate-900">{overallMetrics.datasetSize} images</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Epochs:</span>
                <span className="font-semibold text-slate-900">{overallMetrics.epochs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Batch Size:</span>
                <span className="font-semibold text-slate-900">{overallMetrics.batchSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Learning Rate:</span>
                <span className="font-semibold text-slate-900">{overallMetrics.learningRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Training Time:</span>
                <span className="font-semibold text-slate-900">{overallMetrics.trainingTime}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200">
                <span className="text-slate-600">Framework:</span>
                <span className="font-semibold text-slate-900">PyTorch</span>
              </div>
            </div>
          </div>

          {/* Loss Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">📉 Final Loss Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Training Loss</span>
                  <span className="font-bold text-blue-600">{overallMetrics.trainLoss}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-600" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Validation Loss</span>
                  <span className="font-bold text-orange-600">{overallMetrics.valLoss}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-orange-600" style={{ width: '37%' }}></div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  ✓ Minimal overfitting detected. Val/Train loss ratio: 1.22
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Per-Class Performance */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">🏢 Per-Class Performance</h2>
          
          {/* Best & Worst Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-slate-600">Best Performing Class</p>
              <p className="text-lg font-bold text-green-700">{bestPerforming.name}</p>
              <p className="text-sm text-slate-600 mt-2">F1-Score: {bestPerforming.f1}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-slate-600">Needs Improvement</p>
              <p className="text-lg font-bold text-orange-700">{needsImprovement.name}</p>
              <p className="text-sm text-slate-600 mt-2">F1-Score: {needsImprovement.f1}</p>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Building Class</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-900">Precision</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-900">Recall</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-900">F1-Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-900">Support</th>
                </tr>
              </thead>
              <tbody>
                {perClassMetrics.map((metric, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900 font-medium">{metric.name}</td>
                    <td className="text-center py-3 px-4">
                      <div className="inline-flex items-center justify-center w-12 h-8 bg-blue-100 rounded">
                        <span className="text-blue-700 font-semibold text-sm">{metric.precision}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="inline-flex items-center justify-center w-12 h-8 bg-purple-100 rounded">
                        <span className="text-purple-700 font-semibold text-sm">{metric.recall}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="inline-flex items-center justify-center w-12 h-8 bg-green-100 rounded">
                        <span className={`font-semibold text-sm ${metric.f1 >= 92 ? 'text-green-700' : metric.f1 >= 88 ? 'text-yellow-700' : 'text-orange-700'}`}>
                          {metric.f1}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 text-slate-600">{metric.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Training History Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">📈 Training History (Loss Over Epochs)</h2>
          
          <div className="space-y-4">
            {trainingHistory.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 text-sm font-semibold text-slate-600">Ep {entry.epoch}</div>
                <div className="flex-1">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-blue-600">Train</span>
                        <span className="text-xs font-semibold text-blue-600">{entry.trainLoss.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded h-2">
                        <div 
                          className="h-2 rounded bg-blue-600" 
                          style={{ width: `${Math.min((2.5 - entry.trainLoss) / 2.5 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-orange-600">Val</span>
                        <span className="text-xs font-semibold text-orange-600">{entry.valLoss.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded h-2">
                        <div 
                          className="h-2 rounded bg-orange-600" 
                          style={{ width: `${Math.min((2.5 - entry.valLoss) / 2.5 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Key Observation:</strong> The model shows steady convergence with minimal overfitting. Both training and validation losses decrease consistently throughout training.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ModelMetrics;
