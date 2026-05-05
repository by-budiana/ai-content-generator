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
}

export default App
