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
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [userData, setUserData] = useState({ name: 'I Wayan Gede' }); // Dummy data user
  
  // Data dummy untuk riwayat percakapan (Sidebar)
  const [history] = useState([
    "Desain Halaman Home Glamor Putih",
    "Hubungkan Frontend React dengan B...",
    "Konsep Website Company Profile Kre...",
    "@A: buat wajah pasangan tersebut s..."
  ]);

  const handleGenerate = async () => {
    if (userInput.length < 5) {
      alert("Prompt minimal 5 karakter")
      return
    }

    setLoading(true)
    try {
      const data = await api.post('content/generate', {
        json: {
          prompt: userInput,
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
    <div className="flex h-screen bg-[#f0f4f9] font-sans text-[#1f1f1f]">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-0'} bg-[#f0f4f9] transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 flex flex-col h-full">
          <button className="p-2 hover:bg-gray-200 rounded-full w-fit mb-8">
            <Menu size={20} />
          </button>

          <button className="flex items-center gap-3 bg-[#e6eaf1] hover:bg-[#dde3ea] text-gray-500 py-3 px-4 rounded-full w-fit mb-10 transition-colors">
            <Plus size={20} />
            <span className="text-sm font-medium">Percakapan baru</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            <h3 className="px-4 text-sm font-medium mb-4">Percakapan</h3>
            {history.map((item, index) => (
              <div key={index} className="flex items-center gap-3 px-4 py-2 hover:bg-[#e1e6ed] rounded-full cursor-pointer transition-colors group">
                <MessageSquare size={16} className="text-gray-500" />
                <span className="text-sm truncate w-full">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
            <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#e1e6ed] rounded-full cursor-pointer">
              <Settings size={18} />
              <span className="text-sm">Setelan & bantuan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative bg-white lg:rounded-tl-[30px] shadow-sm">
        
        {/* Header */}
        <header className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-full">
                <Menu size={20} />
              </button>
            )}
            <h2 className="text-xl font-medium text-gray-600">Suksma AI</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 bg-[#d3e3fd] text-[#041e49] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#c2d7f7] transition-colors">
              <Plus size={16} className="text-blue-700" />
              Upgrade ke Pro
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7B68EE] to-[#6A5ACD] flex items-center justify-center text-white font-bold shadow-md">
               {userData.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Chat Body */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto">
          <div className="max-w-3xl w-full">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-medium mb-2 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Halo, {userData.name.split(' ')[0]}
              </h1>
              <p className="text-3xl md:text-5xl font-medium text-gray-300">
                Sebaiknya kita mulai dari mana?
              </p>
            </div>

            {/* Suggestions Chips */}
            <div className="flex flex-wrap gap-3 mb-10">
              <SuggestionChip icon={<ImageIcon size={16} className="text-blue-500" />} label="Buat Gambar" />
              <SuggestionChip icon={<Music size={16} className="text-pink-500" />} label="Buat musik" />
              <SuggestionChip icon={<BookOpen size={16} className="text-orange-500" />} label="Bantu belajar" />
              <SuggestionChip icon={<PenTool size={16} className="text-green-500" />} label="Tulis apa saja" />
            </div>

            {/* Floating Input Box */}
            <div className="bg-[#f0f4f9] rounded-3xl p-4 shadow-sm border border-transparent focus-within:bg-white focus-within:shadow-md focus-within:border-gray-200 transition-all">
              <textarea 
                className="w-full bg-transparent outline-none resize-none text-lg px-2 min-h-[60px]"
                placeholder="Minta Suksma AI..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-1">
                  <IconButton icon={<Plus size={20} />} />
                  <IconButton icon={<Search size={20} />} label="Alat" />
                </div>
                <div className="flex items-center gap-3">
                   <select className="bg-transparent text-sm font-medium text-gray-500 outline-none cursor-pointer">
                      <option>Cepat</option>
                      <option>Akurat</option>
                   </select>
                   <IconButton icon={<Mic size={20} />} />
                   {userInput && (
                     <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                        <Send size={18} />
                     </button>
                   )}
                </div>
              </div>
            </div>
            
            <p className="text-center text-[11px] text-gray-400 mt-6">
              Suksma AI dapat menampilkan info yang tidak akurat, jadi periksa kembali responsnya.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components untuk kerapihan kode
const SuggestionChip = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all shadow-sm">
    {icon}
    <span className="text-sm font-medium text-gray-600">{label}</span>
  </div>
);

const IconButton = ({ icon, label }: { icon: React.ReactNode, label?: string }) => (
  <div className="flex items-center gap-1 p-2 hover:bg-gray-200 rounded-full cursor-pointer transition-colors text-gray-600">
    {icon}
    {label && <span className="text-sm font-medium px-1">{label}</span>}
  </div>
);

export default Dashboard;