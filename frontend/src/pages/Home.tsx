import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#16171d] flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
        <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter text-text-h">
          Suksma <span className="text-accent italic">Creative.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
          Platform AI tercanggih untuk membuat profil perusahaan dan konten digital secara instan.
        </p>
        
        <div className="pt-10">
          <button 
            onClick={() => navigate('/login')}
            className="group relative px-12 py-4 bg-accent text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20"
          >
            <span className="relative z-10">Get Started →</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
      
      {/* Dekorasi Background */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-accent/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px]"></div>
    </div>
  );
};

export default Home;