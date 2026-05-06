<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

/**
 * Komponen ProtectedRoute untuk memproteksi halaman Dashboard.
 * Menggunakan React.ReactNode agar lebih kompatibel dengan tipe data React terbaru.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Jika tidak ada token, tendang ke halaman login
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Utama / Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Halaman Login */}
        <Route path="/login" element={<Login />} />

        {/* Halaman Dashboard - Hanya bisa diakses jika sudah login */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback: Arahkan semua path tidak dikenal ke Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
=======
import { useState, useEffect } from 'react'
import './App.css'
import { api } from './lib/api'

function App() {
  const [status, setStatus] = useState<string>('Checking...')

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await api.get("auth/me");
        setStatus("Connected (Logged In) ✅");
      } catch (error: any) {
        if (error.response?.status === 401) {
          setStatus("Backend OK (Auth Required 🔐)");
        } else {
          setStatus("Backend Disconnected ❌");
        }
      }
    };

    checkStatus();
  }, []);

  return (
    <div className="container">
      <h1>AI Content Generator</h1>
      <div className="card">
        <p>Backend Status: <strong>{status}</strong></p>
      </div>
    </div>
  )
>>>>>>> d9c388114ff9f2e236ecbee901dc18d97ec0912e
}

export default App;