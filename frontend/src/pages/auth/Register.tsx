import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react";

import { registerUser } from "@/api/auth";
import Input from "@/components/Input";
import Button from "@/components/Button";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await registerUser(form);
      navigate("/login");
    } catch (err: any) {
      console.log(err);
      setError("Registration failed. Please try again with a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-white">
      
      {/* LEFT SIDE: BRANDING/ILLUSTRATION */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-600">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-900" />
        
        {/* DECORATIVE ELEMENTS */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-400/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/20 blur-[120px] rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
            <Sparkles size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Join the Future <br />
            <span className="text-indigo-200">of Content.</span>
          </h1>
          <p className="text-xl text-indigo-100/80 max-w-md leading-relaxed">
            Unleash your creativity with AI-powered tools designed for modern creators.
          </p>
          
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="avatar" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-indigo-100">
              Joined by <span className="font-bold text-white">5,000+</span> creators this week
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: REGISTER FORM */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {/* MOBILE LOGO */}
          <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles size={22} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold">AI Content</h2>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="text-slate-500 mt-2">Get started for free today</p>
          </div>

          <div className="glass-card p-8 sm:p-10">
            <form onSubmit={handleRegister} className="space-y-6">
              <Input
                label="Full Name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                icon={<User size={18} />}
              />

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
                Create Account
              </Button>
            </form>

            <div className="mt-10 text-center border-t border-slate-800 pt-8">
              <p className="text-slate-500 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
          
          <p className="text-center text-[11px] text-slate-600 mt-12 font-medium uppercase tracking-[0.2em]">
            &copy; 2026 AI Content Gen &bull; Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
