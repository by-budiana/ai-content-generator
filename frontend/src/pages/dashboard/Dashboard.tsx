import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Plus,
  SendHorizonal,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  continueConversation,
  deleteConversation,
  generateContent,
  getHistory,
} from "@/api/content";

import { useChatStore } from "@/store/chatStore";

function Dashboard() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    conversations,
    selectedChat,
    setConversations,
    setSelectedChat,
    addConversation,
  } = useChatStore();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [type, setType] = useState<"CAPTION" | "DESCRIPTION" | "TAGLINE">("CAPTION");
  const [language, setLanguage] = useState<"ID" | "EN">("ID");

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat, loading]);

  // AUTO HEIGHT TEXTAREA
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [prompt]);

  // LOAD HISTORY
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data: any = await getHistory();
        setConversations(data);
      } catch (err) {
        console.log(err);
      }
    };

    loadHistory();
  }, []);

  // GENERATE AI
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);

      if (selectedChat) {
        const response: any = await continueConversation(selectedChat.id, prompt);
        setSelectedChat(response);
        setPrompt("");
        return;
      }

      const response: any = await generateContent({
        prompt,
        type,
        language,
      });

      addConversation(response);
      setSelectedChat(response);
      setPrompt("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // DELETE CHAT
  const handleDelete = async (id: number) => {
    try {
      await deleteConversation(id);

      const filtered = conversations.filter((item) => item.id !== id);
      setConversations(filtered);

      if (selectedChat?.id === id) {
        setSelectedChat(null);
      }
    } catch (err) {
      console.log(err);
      alert("AI gagal merespon. Cek backend terminal.");
    }
  };

  // ENTER SEND
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="h-screen flex bg-[#0A0F1C] text-white overflow-hidden">

      {/* SIDEBAR */}
      <aside
        className={`
          w-[300px] bg-[#0B1220] border-r border-white/10
          flex flex-col justify-between
          ${sidebarOpen ? "fixed z-50 h-full" : "hidden lg:flex"}
        `}
      >
        {/* TOP */}
        <div>
          {/* HEADER */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold text-lg">AI Workspace</h2>

            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X size={20} />
            </button>
          </div>

          {/* NEW CHAT */}
          <div className="p-3">
            <button
              onClick={() => setSelectedChat(null)}
              className="w-full flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-xl px-4 py-3"
            >
              <Plus size={18} />
              New Chat
            </button>
          </div>

          {/* HISTORY */}
          <div className="px-3 space-y-2 overflow-y-auto h-[calc(100vh-220px)]">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 rounded-xl cursor-pointer text-sm hover:bg-white/10 relative ${
                  selectedChat?.id === chat.id ? "bg-white/10" : ""
                }`}
              >
                <p className="line-clamp-2 text-gray-300 pr-6">
                  {chat.inputPrompt}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(chat.id);
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* USER SECTION */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
            <div>
              <p className="text-sm font-medium">User Name</p>
              <p className="text-xs text-gray-400">AI Creator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col relative">

        {/* HEADER */}
        <header className="h-[60px] border-b border-white/10 flex items-center justify-between px-4 bg-[#0A0F1C]/80 backdrop-blur">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu size={22} />
          </button>

          <h1 className="font-semibold text-white/80">AI Assistant</h1>

          <div className="hidden lg:flex gap-3 text-sm text-gray-400">
            <span>{type}</span>
            <span>•</span>
            <span>{language}</span>
          </div>
        </header>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-10 py-8">
          <div className="max-w-3xl mx-auto space-y-8">

            {!selectedChat ? (
              <div className="text-center mt-32">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Sparkles />
                </div>

                <h1 className="text-3xl font-bold mb-2">
                  How can I help you today?
                </h1>

                <p className="text-gray-400">
                  Generate captions, descriptions, and ideas instantly.
                </p>
              </div>
            ) : (
              <>
                {/* USER MESSAGE */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 px-4 py-3 rounded-2xl max-w-[80%] whitespace-pre-wrap">
                    {selectedChat.inputPrompt}
                  </div>
                </div>

                {/* AI MESSAGE */}
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl max-w-[80%]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedChat.result}
                    </ReactMarkdown>
                  </div>
                </div>
              </>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 px-4 py-3 rounded-2xl">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT */}
        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-[#111827] border border-white/10 rounded-2xl p-3">

              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AI..."
                className="flex-1 bg-transparent outline-none resize-none max-h-40"
              />

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500"
              >
                <SendHorizonal size={18} />
              </button>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;