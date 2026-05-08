import { useState } from 'react'
import { api } from '../lib/api'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'

interface GeneratedContent {
  id: number;
  result: string;
  type: string;
}

const Dashboard = () => {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<GeneratedContent | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (prompt.length < 5) {
      alert("Prompt minimal 5 karakter")
      return
    }

    setLoading(true)
    try {
      const data = await api.post('content/generate', {
        json: {
          prompt: prompt,
          type: 'CAPTION',
          language: 'ID'
        }
      }).json<GeneratedContent>()
      
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
      alert("Gagal terhubung ke backend.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#121212] flex flex-col items-center w-full transition-colors duration-500">
      
      {/* Top Navigation / Header Mockup */}
      <nav className="w-full py-6 px-10 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="text-xl font-heading font-bold tracking-widest text-[#B89470]">SUKSMA</div>
        <div className="flex gap-4">
          <img src={viteLogo} className="w-5 h-5 opacity-50" alt="Vite" />
          <img src={reactLogo} className="w-5 h-5 opacity-50 animate-spin-slow" alt="React" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl px-6 flex flex-col items-center">
        
        {/* Elegant Hero Section */}
        <section className="pt-16 pb-12 text-center">
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-[#B89470] opacity-10 blur-3xl rounded-full scale-150"></div>
            <img 
              src={heroImg} 
              className="relative w-32 h-32 md:w-40 md:h-40 object-cover rounded-full mx-auto border-4 border-white shadow-[0_20px_50px_rgba(184,148,112,0.3)]" 
              alt="Hero" 
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-light text-[#2D2D2D] dark:text-white tracking-tight mb-4">
            Atelier <span className="font-bold italic text-[#B89470]">Content</span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 uppercase tracking-[0.3em] font-sans">
            Crafting Digital Excellence
          </p>
        </section>

        {/* Minimalist Input Group */}
        <section className="w-full max-w-2xl bg-white dark:bg-[#1A1A1A] p-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 flex items-center transition-all focus-within:shadow-[0_10px_50px_rgba(184,148,112,0.15)]">
          <input 
            type="text"
            className="flex-1 bg-transparent px-8 py-4 outline-none text-gray-700 dark:text-gray-200 font-sans text-sm md:text-base"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your vision..."
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-[#2D2D2D] dark:bg-[#B89470] hover:scale-105 text-white px-8 py-3 rounded-full font-heading text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Create'}
          </button>
        </section>

        {/* Result Card (Classic Glamour) */}
        {result && (
          <section className="w-full max-w-3xl mt-16 mb-20 animate-in fade-in zoom-in duration-700">
            <div className="relative group">
              {/* Decorative Frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#B89470] to-[#E5D1B8] rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative bg-white dark:bg-[#1A1A1A] p-10 md:p-16 rounded-[2rem] shadow-sm border border-gray-50 dark:border-gray-800 text-center">
                <div className="w-10 h-[1px] bg-[#B89470] mx-auto mb-8"></div>
                <p className="text-lg md:text-2xl text-[#4A4A4A] dark:text-gray-300 leading-[1.8] font-heading font-light italic">
                  "{result.result}"
                </p>
                <div className="w-10 h-[1px] bg-[#B89470] mx-auto mt-8"></div>
                
                <div className="mt-10 flex justify-center gap-4">
                   <button className="text-[10px] uppercase tracking-widest text-[#B89470] font-bold border border-[#B89470]/30 px-4 py-2 rounded-full hover:bg-[#B89470] hover:text-white transition-all">
                     Copy Content
                   </button>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Footer Minimalist */}
      <footer className="w-full py-12 flex flex-col items-center border-t border-gray-50 dark:border-gray-900">
          <p className="text-[10px] uppercase tracking-[0.5em] text-gray-300 dark:text-gray-600 mb-4">
            Wayangoura Signature
          </p>
          <div className="flex gap-4 opacity-30">
            <span className="w-1.5 h-1.5 bg-[#B89470] rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-[#B89470] rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-[#B89470] rounded-full"></span>
          </div>
      </footer>
    </div>
  )
}

export default Dashboard