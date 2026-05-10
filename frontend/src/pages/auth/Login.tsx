import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { loginUser } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

function Login() {
  const navigate = useNavigate();

  const setAuth =
    useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response: any =
        await loginUser(form);

      setAuth(
        response.user,
        response.token
      );

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] text-white flex items-center justify-center px-6">

      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />

      <div className="absolute w-[400px] h-[400px] bg-cyan-400/10 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              AI Content Generator
            </h1>

            <p className="text-gray-400 mt-2">
              Welcome back
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            <div>
              <label className="text-sm text-gray-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full mt-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full mt-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 transition-all py-3 rounded-2xl font-semibold"
            >
              {loading
                ? "Loading..."
                : "Sign In"}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have account?{" "}
            <Link
              to="/register"
              className="text-blue-400"
            >
              Register
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default Login;