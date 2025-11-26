import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAPIReachable } from './api';
import Login from './pages/Login';
import Main from './pages/Main';
import DatasetBrowser from './pages/DatasetBrowser';
import ModelMetrics from './pages/ModelMetrics';
import ConfusionMatrix from './pages/ConfusionMatrix';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [apiHealthy, setApiHealthy] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check API health on mount
  useEffect(() => {
    const checkAPI = async () => {
      try {
        // Set a timeout so API check doesn't block page rendering
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API check timeout')), 3000)
        );
        const healthy = await Promise.race([isAPIReachable(), timeoutPromise]);
        setApiHealthy(healthy);
        if (!healthy) {
          console.warn('Backend API is not reachable');
        }
      } catch (error) {
        console.warn('API health check failed or timed out:', error.message);
        setApiHealthy(false);
      } finally {
        setLoading(false);
      }
    };

    checkAPI();
  }, []);

  // Restore user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
      }
    }
  }, []);

  const handleLogin = (username, userData = {}) => {
    const userObject = { 
      username, 
      ...userData,
      loginTime: new Date().toISOString(),
      joinDate: userData.joinDate || new Date().toLocaleDateString(),
      memberSince: userData.memberSince || 'Recently'
    };
    setUser(userObject);
    localStorage.setItem('user', JSON.stringify(userObject));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-slate-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login onLogin={handleLogin} apiHealthy={apiHealthy} /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <Main user={user} onLogout={handleLogout} apiHealthy={apiHealthy} /> : <Navigate to="/login" />}
        />
        <Route
          path="/dataset"
          element={user ? <DatasetBrowser user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/metrics"
          element={user ? <ModelMetrics user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/confusion"
          element={user ? <ConfusionMatrix user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
