import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { api } from "./lib/api"; // Pastikan baseURL di file ini sudah http://ip-vps:60599
import "./App.css";

// Import Halaman
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

/**
 * ProtectedRoute: Menjaga agar user yang belum login
 * tidak bisa "nembak" langsung ke /dashboard lewat URL.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // replace agar user tidak bisa klik 'back' ke halaman terproteksi
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [status, setStatus] = useState<string>("Checking...");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        /**
         * PENTING: Karena di backend kita sudah ubah ke /api/health,
         * pastikan di file ./lib/api.ts baseURL-nya sudah pakai /api di ujungnya.
         * Contoh: http://ip-server:60599/api
         */
        await api.get("/health");
        setStatus("Connected ✅");
      } catch (error: any) {
        // Jika server menolak karena tidak ada token (401), berarti server hidup
        if (error.response?.status === 401) {
          setStatus("Backend Online 🔐");
        } else {
          setStatus("Server Down ❌");
        }
      }
    };

    checkStatus();
  }, []);

  return (
    <>
      {/* Indikator Status (Sangat membantu saat dideploy di Atlantic) */}
      <div className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-white px-3 py-1 rounded-full text-[10px] font-mono border border-white/10">
        Status: {status}
      </div>

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Proteksi Dashboard */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Jika user nyasar, kembalikan ke Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
