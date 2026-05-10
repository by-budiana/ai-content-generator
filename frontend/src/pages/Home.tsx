import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row items-center font-sans overflow-hidden">
      
      {/* Sisi Kiri: Hero Content */}
      <div className="w-full lg:w-1/2 px-12 md:px-24 py-10 z-10">
        <div className="space-y-6 animate-in slide-in-from-left duration-1000">
          {/* Logo / Brand Name */}
          <div className="text-xl font-bold tracking-tighter text-[#1A1A1A] mb-16">
            SUKSMA<span className="text-[#7B68EE]">AI.</span>
          </div>
          
          {/* Headline sesuai gambar referensi */}
          <h1 className="text-5xl md:text-7xl font-semibold text-[#2D2D2D] leading-[1.1] tracking-tight">
            Innovative <br /> 
            solutions for <br /> 
            your business
          </h1>
          
          {/* Deskripsi AI Content Generator */}
          <p className="text-gray-400 max-w-sm text-sm leading-relaxed tracking-wide">
            Ciptakan konten profil perusahaan yang mewah dan profesional secara instan dengan teknologi kecerdasan buatan terbaru.
          </p>

          {/* Button Login / Get Started sesuai image_8500f7.png */}
          <div className="pt-6">
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-4 px-10 py-4 bg-[#7B68EE] text-white rounded-full font-medium transition-all hover:bg-[#6A5ACD] hover:shadow-xl hover:shadow-[#7B68EE]/40 group"
            >
              {/* Ikon panah kecil di dalam button */}
              <div className="flex items-center justify-center w-5 h-5 bg-white/20 rounded-full group-hover:bg-white/40 transition-colors">
                <span className="text-[10px]">→</span>
              </div>
              <span className="tracking-wide">Get Started</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Visual Graphic Layout */}
      <div className="w-full lg:w-1/2 h-screen relative flex items-end justify-center lg:justify-end">
        
        {/* Background Shape Biru (#7B68EE) */}
        <div className="absolute top-0 right-0 w-[85%] h-full bg-[#7B68EE] rounded-l-[150px] lg:rounded-l-[250px] -z-10 overflow-hidden shadow-[-20px_0_50px_rgba(123,104,238,0.1)]">
          {/* Pola Dot Grid Dekoratif */}
          <div className="absolute top-1/4 left-16 grid grid-cols-5 gap-6 opacity-30">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
            ))}
          </div>
          
          {/* Lingkaran abstrak transparan */}
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-white/10 rounded-full"></div>
        </div>

        {/* Citra Profesional / AI Representative */}
        <div className="relative h-[90%] w-full flex justify-center lg:justify-end lg:pr-10">
          <img 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop" 
            alt="AI Representative"
            className="h-full object-contain filter drop-shadow-[-20px_20px_50px_rgba(0,0,0,0.2)] grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>
      </div>

    </div>
  );
};

export default Home;