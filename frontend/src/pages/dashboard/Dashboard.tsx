import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Plus,
  SendHorizonal,
  Sparkles,
  Trash2,
  X,
  MessageSquare,
  ChevronRight,
  User as UserIcon,
  LogOut,
  Copy,
  Check,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  continueConversation,
  deleteConversation,
  generateContent,
  getHistory,
} from "@/api/content";

import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
        copied
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
      }`}
    >
      {copied ? (
        <>
          <Check size={14} />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

function Dashboard() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    conversations,
    selectedChat,
    setConversations,
    setSelectedChat,
    addConversation,
  } = useChatStore();

  const { user, logout, setUser } = useAuthStore();
  const { fetchProfile, profile } = useUserStore();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const [type, setType] = useState<"CAPTION" | "DESCRIPTION" | "TAGLINE">(
    "CAPTION",
  );
  const [language, setLanguage] = useState<"ID" | "EN">("ID");

  // SYNC AUTH STORE WITH LATEST PROFILE DATA ON MOUNT
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
        bio: profile.bio,
      });
    }
  }, [profile, setUser]);

  // SYNC MESSAGES AND UI STATE WITH SELECTED CHAT
  useEffect(() => {
    if (selectedChat) {
      // Sync messages
      if (selectedChat.messages) {
        const formattedMessages: Message[] = selectedChat.messages.map(
          (m, index) => ({
            id: `${selectedChat.id}-${index}-${m.role}`,
            role: m.role,
            content: m.content,
            timestamp: new Date(selectedChat.createdAt),
          }),
        );
        setMessages(formattedMessages);
      }

      // Sync UI Toggles with selected chat settings
      if (selectedChat.type) setType(selectedChat.type as any);
      if (selectedChat.language) setLanguage(selectedChat.language as any);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
  }, [setConversations]);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    const userPrompt = prompt;
    setPrompt("");

    // 1. Add user message to UI immediately
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userPrompt,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      setLoading(true);

      if (selectedChat) {
        const response: any = await continueConversation(
          selectedChat.id,
          userPrompt,
          type,
          language,
        );

        // 2. Sync selectedChat with the response (contains full updated history)
        setSelectedChat(response);
        return;
      }

      const response: any = await generateContent({
        prompt: userPrompt,
        type,
        language,
      });

      // 3. Add to history and select it
      addConversation(response);
      setSelectedChat(response);
    } catch (err) {
      console.log(err);
      // Remove the user message if failed to make it consistent
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      alert("AI failed to respond. Please check your connection.");
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
    <div className="h-screen flex bg-[#020617] text-slate-100 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 transform
          lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              AI Assistant
            </h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              setSelectedChat(null);
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium py-2.5 px-4 rounded-xl border border-slate-700 transition-all"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">
            History
          </p>
          {conversations.length === 0 && (
            <p className="text-xs text-slate-500 px-2 py-4 italic">
              No conversations yet
            </p>
          )}
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                selectedChat?.id === chat.id
                  ? "bg-blue-600/10 text-blue-400"
                  : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={16} className="shrink-0" />
                <p className="text-sm font-medium truncate">
                  {chat.inputPrompt}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shrink-0 overflow-hidden border border-slate-700">
                {user?.avatar ? (
                  <img
                    src={`http://localhost:5000${user.avatar}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0) || <UserIcon size={16} />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-white">
                  {user?.name || "User"}
                </p>
                <Link
                  to="/profile"
                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-0.5 transition-colors"
                >
                  <Settings size={10} />
                  View Profile
                </Link>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="h-[70px] border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-slate-800 text-slate-300 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-100">Workspace</h1>
              <p className="text-[10px] text-slate-500 uppercase font-medium tracking-wider">
                AI Content Gen v1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 gap-4 text-[10px] font-bold text-slate-400">
              <span className="uppercase">{type}</span>
              <span className="w-px h-3 bg-slate-800"></span>
              <span className="uppercase">
                {language === "ID" ? "Bahasa" : "English"}
              </span>
            </div>
          </div>
        </header>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto px-4 py-8 lg:px-0">
          <div className="max-w-3xl mx-auto space-y-6 pb-32">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center mt-20 px-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-8 animate-pulse">
                  <Sparkles size={40} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                  Ready to generate content?
                </h2>
                <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
                  Start a new conversation to generate captions, descriptions,
                  or taglines for your next big idea.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full">
                  {["Instagram Caption", "Product Description"].map((item) => (
                    <button
                      key={item}
                      onClick={() =>
                        setPrompt(`Generate a ${item.toLowerCase()} for...`)
                      }
                      className="p-4 text-left glass-card hover:border-blue-500/50 transition-all group"
                    >
                      <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">
                        Try this
                      </p>
                      <p className="font-semibold text-slate-200 group-hover:text-blue-400 text-sm">
                        {item}...
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center shrink-0 mr-3 mt-1 shadow-lg">
                        <Sparkles size={14} className="text-blue-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "glass-card text-slate-200 rounded-tl-none border-slate-800/50"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div>
                          <div className="prose prose-invert prose-sm max-w-none text-inherit">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>

                          {/* Tombol copy */}
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
                            <CopyButton text={msg.content} />
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center shrink-0 mr-3 mt-1">
                  <Sparkles size={14} className="text-blue-400 animate-spin" />
                </div>
                <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">
                    Thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* INPUT SECTION */}
        <div className="absolute bottom-0 left-0 w-full p-4 lg:p-8 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
                {(["CAPTION", "DESCRIPTION", "TAGLINE"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                      type === t
                        ? "bg-slate-800 text-blue-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl ml-auto">
                {(["ID", "EN"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                      language === l
                        ? "bg-slate-800 text-blue-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {l === "ID" ? "IND" : "ENG"}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative glass-card p-2 flex items-end gap-2 focus-within:border-blue-500/50 transition-all">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none resize-none px-3 py-3 text-[15px] text-slate-100 placeholder:text-slate-600 max-h-[200px]"
                rows={1}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="btn-primary p-3 rounded-xl disabled:opacity-50"
              >
                <SendHorizonal size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
