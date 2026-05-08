import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api"; // Import ini sekarang akan terpakai

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // GANTI FETCH DENGAN KODE DI BAWAH INI
      const data = await api
        .post("auth/login", {
          json: { email, password },
        })
        .json<any>();

      // Simpan data ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login Error:", err);
      try {
        const errorData = await err.response.json();
        console.error("Server Error Data:", errorData);
        // Jika ada error validasi dari Zod (array errors), ambil pesan pertama
        if (errorData.errors && Array.isArray(errorData.errors)) {
          setError(
            `${errorData.errors[0].path[0]}: ${errorData.errors[0].message}`,
          );
        } else {
          setError(errorData.message || "Invalid credentials.");
        }
      } catch {
        setError("Network error: Gagal terhubung ke server Atlantic.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#16171d] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 border border-border backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl">
        <h2 className="text-3xl font-heading font-bold text-text-h mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 mb-8 text-sm">
          Masuk untuk mulai generate konten AI.
        </p>

        {/* Tampilkan error jika ada */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-xl mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-border p-4 rounded-xl outline-none focus:border-accent transition-colors text-text-h"
              placeholder="wayangoura@gmail.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-border p-4 rounded-xl outline-none focus:border-accent transition-colors text-text-h"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-accent text-white p-4 rounded-xl font-bold transition-opacity pt-4 shadow-lg shadow-accent/30 ${loading ? "opacity-50" : "hover:opacity-90"}`}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
