import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

import { loginUser } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import Input from "@/components/Input";
import Button from "@/components/Button";

function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response: any = await loginUser(form);

      setAuth(response.user, response.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-white">
      {/* LEFT SIDE: BRANDING/ILLUSTRATION */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blue-600">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900" />

        {/* DECORATIVE ELEMENTS */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-400/20 blur-[120px] rounded-full" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
            <Sparkles size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Generate Content <br />
            <span className="text-blue-200">with Intelligence.</span>
          </h1>
          <p className="text-xl text-blue-100/80 max-w-md leading-relaxed">
            Create professional captions, descriptions, and taglines instantly
            with our advanced AI engine.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-2xl font-bold">10k+</p>
              <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">
                Users
              </p>
            </div>
            <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-2xl font-bold">1M+</p>
              <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">
                Generated
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {/* MOBILE LOGO */}
          <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles size={22} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold">AI Content</h2>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 mt-2">
              Log in to your account to continue
            </p>
          </div>

          <div className="glass-card p-8 sm:p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                icon={<Mail size={18} />}
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={<Lock size={18} />}
                />
                <div className="flex justify-end">
                  <Link
                    to="#"
                    className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 px-4 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-4"
                icon={<ArrowRight size={18} />}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-10 text-center border-t border-slate-800 pt-8">
              <p className="text-slate-500 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-500 font-semibold hover:text-blue-400 transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-600 mt-12 font-medium uppercase tracking-[0.2em]">
            &copy; 2026 AI Content Gen &bull; Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
