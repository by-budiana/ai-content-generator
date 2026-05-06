import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {api} from './lib/api'; // Pastikan path import api benar sesuai file kamu
import './App.css';

// Import Halaman
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

/**
 * Komponen ProtectedRoute untuk memproteksi halaman Dashboard.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const [status, setStatus] = useState<string>('Checking...');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Menggunakan endpoint health atau me untuk cek koneksi
        await api.get("/health"); 
        setStatus("Connected ✅");
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
    <>
      {/* Indikator Status Floating (Opsional - Bisa dihapus jika mengganggu) */}
      <div style={{ position: 'fixed', bottom: 10, right: 10, zIndex: 100, fontSize: '10px', opacity: 0.5 }}>
        Backend: {status}
      </div>

      <Router>
        <Routes>
          {/* Halaman Utama / Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Halaman Login */}
          <Route path="/login" element={<Login />} />

          {/* Halaman Dashboard - Terproteksi */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;