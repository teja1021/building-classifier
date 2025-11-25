import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function DatasetBrowser({ user, onLogout }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // 13 Building Classes
  const buildingClasses = [
    {
      id: 1,
      name: 'CSE Department Building',
      emoji: '💻',
      color: 'from-blue-500 to-blue-600',
      samples: 245,
      description: 'Computer Science & Engineering Department',
      details: 'Main computing labs, classrooms, and research facilities'
    },
    {
      id: 2,
      name: 'ECE Department Building',
      emoji: '⚡',
      color: 'from-yellow-500 to-yellow-600',
      samples: 198,
      description: 'Electronics & Communication Engineering',
      details: 'Signal processing labs, communication systems, microelectronics'
    },
    {
      id: 3,
      name: 'Mechanical Engineering Building',
      emoji: '⚙️',
      color: 'from-orange-500 to-orange-600',
      samples: 267,
      description: 'Mechanical Engineering Department',
      details: 'Thermal labs, design studios, manufacturing facilities'
    },
    {
      id: 4,
      name: 'Chemical Engineering Building',
      emoji: '🧪',
      color: 'from-green-500 to-green-600',
      samples: 189,
      description: 'Chemical Engineering Department',
      details: 'Process labs, reactors, and chemical analysis facilities'
    },
    {
      id: 5,
      name: 'Ceramic Engineering Building',
      emoji: '🏺',
      color: 'from-red-500 to-red-600',
      samples: 156,
      description: 'Ceramic Engineering Department',
      details: 'Kiln facilities, material science labs, testing centers'
    },
    {
      id: 6,
      name: 'Mining Engineering Building',
      emoji: '⛏️',
      color: 'from-gray-600 to-gray-700',
      samples: 134,
      description: 'Mining Engineering Department',
      details: 'Ore processing labs, geological testing, survey equipment'
    },
    {
      id: 7,
      name: 'Metallurgy & Materials Engineering Building',
      emoji: '🔬',
      color: 'from-purple-500 to-purple-600',
      samples: 201,
      description: 'Metallurgy & Materials Department',
      details: 'Material testing labs, furnaces, microscopy facilities'
    },
    {
      id: 8,
      name: 'BMBT (Biotechnology) Building',
      emoji: '🧬',
      color: 'from-pink-500 to-pink-600',
      samples: 178,
      description: 'Biotechnology Department',
      details: 'Biotech labs, PCR facilities, fermentation centers'
    },
    {
      id: 9,
      name: 'PPA Building',
      emoji: '🌟',
      color: 'from-indigo-500 to-indigo-600',
      samples: 165,
      description: 'Physics & Photonics / Applied Physics',
      details: 'Optics labs, experimental physics, laser facilities'
    },
    {
      id: 10,
      name: 'BBA Building',
      emoji: '📊',
      color: 'from-cyan-500 to-cyan-600',
      samples: 142,
      description: 'Business & Business Administration',
      details: 'Management labs, case study rooms, seminar halls'
    },
    {
      id: 11,
      name: 'Academic Building',
      emoji: '📚',
      color: 'from-slate-600 to-slate-700',
      samples: 289,
      description: 'Central Academic Building',
      details: 'Lecture halls, offices, administrative facilities'
    },
    {
      id: 12,
      name: 'Dispensary',
      emoji: '⚕️',
      color: 'from-rose-500 to-rose-600',
      samples: 98,
      description: 'Medical & Health Services',
      details: 'Medical clinics, pharmacy, first aid facilities'
    },
    {
      id: 13,
      name: 'LA Lawns 1',
      emoji: '🌳',
      color: 'from-emerald-500 to-emerald-600',
      samples: 212,
      description: 'Learning Area & Lawns',
      details: 'Outdoor learning spaces, gardens, recreational areas'
    },
    {
      id: 14,
      name: 'LA Lawns 2',
      emoji: '🌿',
      color: 'from-lime-500 to-lime-600',
      samples: 156,
      description: 'Learning Area & Lawns (Secondary)',
      details: 'Additional outdoor learning and recreational spaces'
    }
  ];

  // Calculate statistics
  const totalSamples = buildingClasses.reduce((sum, cls) => sum + cls.samples, 0);
  const averageSamples = Math.round(totalSamples / buildingClasses.length);

  const getClassesByFilter = () => {
    if (filterType === 'all') return buildingClasses;
    if (filterType === 'high') return buildingClasses.filter(cls => cls.samples > averageSamples);
    if (filterType === 'low') return buildingClasses.filter(cls => cls.samples <= averageSamples);
    return buildingClasses;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Campus Building Classifier</h1>
            <p className="text-sm text-slate-600">Dataset Browser</p>
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
            <Link to="/dataset" className="px-4 py-3 border-b-2 border-blue-600 text-blue-600 font-medium">
              Dataset Browser
            </Link>
            <Link to="/metrics" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
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
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div className="text-3xl font-bold text-blue-600">{buildingClasses.length}</div>
            <p className="text-slate-600 text-sm">Building Classes</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div className="text-3xl font-bold text-green-600">{totalSamples.toLocaleString()}</div>
            <p className="text-slate-600 text-sm">Total Samples</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <div className="text-3xl font-bold text-purple-600">{averageSamples}</div>
            <p className="text-slate-600 text-sm">Avg. Per Class</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <div className="text-3xl font-bold text-orange-600">100%</div>
            <p className="text-slate-600 text-sm">Dataset Coverage</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-slate-700 font-medium">Filter:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg transition ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Classes ({buildingClasses.length})
              </button>
              <button
                onClick={() => setFilterType('high')}
                className={`px-4 py-2 rounded-lg transition ${
                  filterType === 'high'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                High Samples ({buildingClasses.filter(cls => cls.samples > averageSamples).length})
              </button>
              <button
                onClick={() => setFilterType('low')}
                className={`px-4 py-2 rounded-lg transition ${
                  filterType === 'low'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Low Samples ({buildingClasses.filter(cls => cls.samples <= averageSamples).length})
              </button>
            </div>
          </div>
        </div>

        {/* Building Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {getClassesByFilter().map(buildingClass => (
            <div
              key={buildingClass.id}
              onClick={() => setSelectedClass(selectedClass?.id === buildingClass.id ? null : buildingClass)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition transform hover:scale-105"
            >
              {/* Color Banner */}
              <div className={`h-24 bg-gradient-to-r ${buildingClass.color} flex items-center justify-center`}>
                <div className="text-6xl">{buildingClass.emoji}</div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{buildingClass.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{buildingClass.description}</p>

                {/* Sample Count Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Samples</span>
                    <span className="text-lg font-bold text-blue-600">{buildingClass.samples}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${buildingClass.color}`}
                      style={{ width: `${(buildingClass.samples / Math.max(...buildingClasses.map(c => c.samples))) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Expand/Collapse */}
                {selectedClass?.id === buildingClass.id && (
                  <div className="pt-4 border-t border-slate-200 mt-4">
                    <p className="text-slate-700 text-sm mb-4">{buildingClass.details}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-slate-50 rounded p-3">
                        <div className="text-2xl font-bold text-blue-600">{Math.round(buildingClass.samples / totalSamples * 100)}%</div>
                        <p className="text-slate-600 text-xs">Of Dataset</p>
                      </div>
                      <div className="bg-slate-50 rounded p-3">
                        <div className="text-2xl font-bold text-green-600">{buildingClass.samples}</div>
                        <p className="text-slate-600 text-xs">Total Images</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dataset Summary */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">📊 Dataset Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Dataset Distribution</h3>
              <div className="space-y-3">
                {buildingClasses.map(cls => (
                  <div key={cls.id} className="flex items-center justify-between">
                    <span className="text-slate-700">{cls.emoji} {cls.name}</span>
                    <span className="font-semibold text-blue-600">{cls.samples}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Statistics</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                  <p className="text-sm text-slate-600">Total Training Samples</p>
                  <p className="text-2xl font-bold text-blue-600">{totalSamples.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                  <p className="text-sm text-slate-600">Average Per Class</p>
                  <p className="text-2xl font-bold text-green-600">{averageSamples}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
                  <p className="text-sm text-slate-600">Largest Class</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {buildingClasses.reduce((max, cls) => cls.samples > max.samples ? cls : max).name.split(' ')[0]}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-600">
                  <p className="text-sm text-slate-600">Smallest Class</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {buildingClasses.reduce((min, cls) => cls.samples < min.samples ? cls : min).name.split(' ')[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DatasetBrowser;
