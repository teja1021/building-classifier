import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ConfusionMatrix({ user, onLogout }) {
  // Sample confusion matrix data for 14 building classes
  const classes = [
    'CSE Department Building',
    'ECE Department Building',
    'Mechanical Engineering Building',
    'Chemical Engineering Building',
    'Ceramic Engineering Building',
    'Mining Engineering Building',
    'Metallurgy & Materials Engineering Building',
    'BMBT (Biotechnology) Building',
    'PPA Building',
    'BBA Building',
    'Academic Building',
    'Dispensary',
    'LA Lawns 1',
    'LA Lawns 2'
  ];

  // Simulated confusion matrix (14x14)
  const confusionData = [
    [95, 2, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [1, 93, 0, 2, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0],
    [0, 0, 96, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 2],
    [0, 1, 0, 94, 0, 1, 2, 0, 0, 1, 1, 0, 0, 0],
    [1, 0, 0, 0, 92, 2, 0, 0, 1, 1, 0, 1, 1, 1],
    [0, 1, 0, 0, 2, 91, 1, 0, 2, 2, 0, 0, 1, 0],
    [1, 0, 0, 1, 0, 1, 93, 1, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 2, 86, 3, 2, 1, 2, 2, 1],
    [1, 0, 0, 0, 0, 1, 2, 2, 92, 0, 1, 0, 1, 0],
    [0, 2, 0, 1, 1, 2, 0, 1, 0, 91, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 93, 2, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 1, 94, 1, 1],
    [0, 1, 0, 0, 1, 1, 1, 2, 1, 1, 0, 0, 91, 1],
    [0, 0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 1, 2, 93]
  ];

  const [selectedClass, setSelectedClass] = useState(null);
  const [zoomLevel, setZoomLevel] = useState('full');

  // Calculate metrics for each class
  const calculateMetrics = (classIdx) => {
    const row = confusionData[classIdx];
    const col = confusionData.map(r => r[classIdx]);
    
    const tp = confusionData[classIdx][classIdx]; // True positives
    const fp = col.reduce((a, b) => a + b, 0) - tp; // False positives
    const fn = row.reduce((a, b) => a + b, 0) - tp; // False negatives
    const tn = confusionData.flat().reduce((a, b) => a + b, 0) - tp - fp - fn; // True negatives
    
    const precision = tp / (tp + fp);
    const recall = tp / (tp + fn);
    const f1 = 2 * (precision * recall) / (precision + recall);
    const accuracy = (tp + tn) / (tp + tn + fp + fn);
    
    return { tp, fp, fn, precision, recall, f1, accuracy };
  };

  // Get color intensity based on value
  const getHeatmapColor = (value, max = 100) => {
    const intensity = value / max;
    if (intensity > 0.8) return 'bg-green-600';
    if (intensity > 0.6) return 'bg-green-400';
    if (intensity > 0.4) return 'bg-yellow-400';
    if (intensity > 0.2) return 'bg-orange-400';
    return 'bg-red-400';
  };

  // Get text color for contrast
  const getTextColor = (value, max = 100) => {
    const intensity = value / max;
    return intensity > 0.5 ? 'text-white' : 'text-slate-900';
  };

  // Summary statistics
  const totalPredictions = confusionData.flat().reduce((a, b) => a + b, 0);
  const correctPredictions = confusionData.reduce((sum, row, idx) => sum + row[idx], 0);
  const overallAccuracy = (correctPredictions / totalPredictions * 100).toFixed(1);
  
  // Find best and worst performing classes
  const classMetrics = classes.map((name, idx) => ({
    name,
    idx,
    ...calculateMetrics(idx)
  }));
  
  const bestClass = classMetrics.reduce((best, curr) => 
    curr.recall > best.recall ? curr : best
  );
  
  const worstClass = classMetrics.reduce((worst, curr) => 
    curr.recall < worst.recall ? curr : worst
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Campus Building Classifier</h1>
            <p className="text-sm text-slate-600">Confusion Matrix Analysis</p>
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
            <Link to="/metrics" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
              Model Metrics
            </Link>
            <Link to="/confusion" className="px-4 py-3 border-b-2 border-blue-600 text-blue-600 font-medium">
              Confusion Matrix
            </Link>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="text-sm text-slate-600 font-medium">Overall Accuracy</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{overallAccuracy}%</div>
            <div className="text-xs text-slate-500 mt-2">{correctPredictions}/{totalPredictions} correct</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-sm text-slate-600 font-medium">Total Predictions</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{totalPredictions}</div>
            <div className="text-xs text-slate-500 mt-2">14 building classes</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="text-sm text-slate-600 font-medium">Best Performing</div>
            <div className="text-lg font-bold text-purple-600 mt-2">{bestClass.name}</div>
            <div className="text-xs text-slate-500 mt-2">Recall: {(bestClass.recall * 100).toFixed(1)}%</div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heatmap */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Confusion Matrix Heatmap</h2>
              <div className="text-xs text-slate-600">14 × 14 Matrix</div>
            </div>

            {/* Heatmap Legend */}
            <div className="mb-4 flex items-center gap-2 text-xs">
              <span>Legend:</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-red-400"></div>
                <span className="text-slate-600">0-20</span>
              </div>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-orange-400"></div>
                <span className="text-slate-600">20-40</span>
              </div>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-yellow-400"></div>
                <span className="text-slate-600">40-60</span>
              </div>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-green-400"></div>
                <span className="text-slate-600">60-80</span>
              </div>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-green-600"></div>
                <span className="text-slate-600">80-100</span>
              </div>
            </div>

            {/* Heatmap Grid - Scrollable */}
            <div className="overflow-x-auto -mx-6 px-6">
              <div className="inline-block min-w-full pb-4">
                {/* Column headers */}
                <div className="flex">
                  <div className="w-48 flex-shrink-0"></div>
                  {classes.map((cls, idx) => (
                    <div key={idx} className="w-10 h-10 text-center flex items-center justify-center">
                      <div className="text-xs text-slate-600 transform -rotate-45 whitespace-nowrap origin-center font-medium" 
                           style={{marginLeft: '-5px', marginTop: '15px'}}>
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Matrix rows */}
                {confusionData.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex">
                    <div className="w-48 flex-shrink-0 text-xs font-medium text-slate-700 px-3 py-2 bg-slate-50 border-r border-slate-200 flex items-center">
                      <div className="truncate">{rowIdx + 1}. {classes[rowIdx]}</div>
                    </div>
                    {row.map((value, colIdx) => (
                      <div
                        key={colIdx}
                        className={`w-10 h-10 flex items-center justify-center text-xs font-semibold cursor-pointer hover:opacity-80 transition ${getHeatmapColor(value)} ${getTextColor(value)}`}
                        onMouseEnter={() => setSelectedClass(rowIdx)}
                        onMouseLeave={() => setSelectedClass(null)}
                        title={`${classes[rowIdx]} → ${classes[colIdx]}: ${value}`}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-600">
              <p className="mb-2"><strong>How to read:</strong> Rows = Actual class, Columns = Predicted class</p>
              <p className="mb-2">Diagonal values show correct predictions (true positives)</p>
              <p>Off-diagonal values show misclassifications</p>
            </div>
          </div>

          {/* Performance Stats Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Analysis</h3>

            {/* Best & Worst */}
            <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
              <div>
                <div className="text-sm font-semibold text-green-600 mb-1">✓ Best Performing</div>
                <div className="text-sm text-slate-900 font-medium">{bestClass.name}</div>
                <div className="text-xs text-slate-600 mt-1">
                  <div>Recall: {(bestClass.recall * 100).toFixed(1)}%</div>
                  <div>Precision: {(bestClass.precision * 100).toFixed(1)}%</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-orange-600 mb-1">⚠ Needs Improvement</div>
                <div className="text-sm text-slate-900 font-medium">{worstClass.name}</div>
                <div className="text-xs text-slate-600 mt-1">
                  <div>Recall: {(worstClass.recall * 100).toFixed(1)}%</div>
                  <div>Precision: {(worstClass.precision * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900">Key Insights</h4>
              
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-xs text-blue-900">
                  <strong>Model Quality:</strong> {overallAccuracy > 90 ? 'Excellent' : overallAccuracy > 80 ? 'Good' : 'Fair'} overall performance with {overallAccuracy}% accuracy
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <p className="text-xs text-slate-700">
                  <strong>Top 3 Classes:</strong>
                </p>
                <ul className="text-xs text-slate-600 mt-2 space-y-1">
                  {classMetrics
                    .sort((a, b) => b.recall - a.recall)
                    .slice(0, 3)
                    .map((cls, idx) => (
                      <li key={idx}>• {cls.name}: {(cls.recall * 100).toFixed(1)}%</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Per-Class Detailed Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Per-Class Performance Breakdown</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Building Class</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-900">TP</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-900">FP</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-900">FN</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-900">Precision</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-900">Recall</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-900">F1-Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {classMetrics.map((cls) => (
                  <tr key={cls.idx} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-600 font-medium">{cls.idx + 1}</td>
                    <td className="px-4 py-3 text-slate-900 font-medium">{cls.name}</td>
                    <td className="px-4 py-3 text-center text-green-700 font-semibold">{cls.tp}</td>
                    <td className="px-4 py-3 text-center text-orange-700 font-semibold">{cls.fp}</td>
                    <td className="px-4 py-3 text-center text-red-700 font-semibold">{cls.fn}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-white text-xs font-bold ${
                        cls.precision > 0.92 ? 'bg-green-600' : 
                        cls.precision > 0.88 ? 'bg-yellow-500' : 
                        'bg-orange-500'
                      }`}>
                        {(cls.precision * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-white text-xs font-bold ${
                        cls.recall > 0.92 ? 'bg-green-600' : 
                        cls.recall > 0.88 ? 'bg-yellow-500' : 
                        'bg-orange-500'
                      }`}>
                        {(cls.recall * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-white text-xs font-bold ${
                        cls.f1 > 0.92 ? 'bg-green-600' : 
                        cls.f1 > 0.88 ? 'bg-yellow-500' : 
                        'bg-orange-500'
                      }`}>
                        {(cls.f1 * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-slate-600">
            <p><strong>TP:</strong> True Positives | <strong>FP:</strong> False Positives | <strong>FN:</strong> False Negatives</p>
            <p className="mt-2"><strong>Precision:</strong> Of predicted positives, how many are correct | <strong>Recall:</strong> Of actual positives, how many we found</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <h2 className="text-xl font-bold text-slate-900 mb-4">🎯 Recommendations for Model Improvement</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Strengths</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>✓ High accuracy across most building types</li>
                <li>✓ Minimal confusion between distinct architectural styles</li>
                <li>✓ Strong performance on high-traffic areas</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Areas for Improvement</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Enhance training data for {worstClass.name}</li>
                <li>• Add more augmented images for low-confidence classes</li>
                <li>• Fine-tune model on hard-to-classify samples</li>
              </ul>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default ConfusionMatrix;
