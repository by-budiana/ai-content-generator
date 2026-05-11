import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { motion } from "framer-motion";

import { registerUser } from "@/api/auth";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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

  const handleRegister = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    setLoading(true);

    setError("");

    const response =
      await registerUser(form);

    console.log(response);

    navigate("/");
  } catch (err: any) {
    console.log(err);

    try {
      const errorData =
        await err.response.json();

      setError(
        errorData.message ||
          "Register failed"
      );
    } catch {
      setError("Network error");
    }
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
              Create Account
            </h1>
          </div>

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />

            {error && (
              <div className="text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-3 rounded-2xl font-semibold"
            >
              {loading
                ? "Loading..."
                : "Create Account"}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have account?{" "}
            <Link
              to="/"
              className="text-blue-400"
            >
              Login
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default Register;