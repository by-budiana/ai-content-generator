import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi login - nanti kita hubungkan ke backend Express kamu
    localStorage.setItem('token', 'dummy-token'); 
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#16171d] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 border border-border backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl">
        <h2 className="text-3xl font-heading font-bold text-text-h mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8 text-sm">Masuk untuk mulai generate konten AI.</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">Email Address</label>
            <input type="email" className="w-full bg-gray-50 dark:bg-gray-800/50 border border-border p-4 rounded-xl outline-none focus:border-accent transition-colors" placeholder="wayangoura@gmail.com" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">Password</label>
            <input type="password" className="w-full bg-gray-50 dark:bg-gray-800/50 border border-border p-4 rounded-xl outline-none focus:border-accent transition-colors" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-accent text-white p-4 rounded-xl font-bold hover:opacity-90 transition-opacity pt-4 shadow-lg shadow-accent/30">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;