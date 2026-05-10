import {
  useEffect,
  useRef,
  useState,
} from "react";

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
  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(
      null
    );

  const {
    conversations,
    selectedChat,

    setConversations,
    setSelectedChat,

    addConversation,
  } = useChatStore();

  const [prompt, setPrompt] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [type, setType] =
    useState<
      "CAPTION" | "DESCRIPTION" | "TAGLINE"
    >("CAPTION");

  const [language, setLanguage] =
    useState<"ID" | "EN">("ID");

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [selectedChat, loading]);

  // AUTO TEXTAREA HEIGHT
  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height =
      "auto";

    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [prompt]);

  // LOAD HISTORY
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data: any =
          await getHistory();

        setConversations(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadHistory();
  }, []);

  // GENERATE AI
  const handleGenerate =
    async () => {
      if (!prompt.trim()) return;

      try {
        setLoading(true);

        // CONTINUE CHAT
        if (selectedChat) {
          const response: any =
            await continueConversation(
              selectedChat.id,
              prompt
            );

          setSelectedChat(response);

          setPrompt("");

          return;
        }

        // NEW CHAT
        const response: any =
          await generateContent({
            prompt,
            type,
            language,
          });

        addConversation(response);

        setSelectedChat(response);

        setPrompt("");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  // DELETE CHAT
  const handleDelete = async (
    id: number
  ) => {
    try {
      await deleteConversation(id);

      const filtered =
        conversations.filter(
          (item) => item.id !== id
        );

      setConversations(filtered);

      if (selectedChat?.id === id) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ENTER SEND
  const handleKeyDown = (
    e: React.KeyboardEvent<
      HTMLTextAreaElement
    >
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleGenerate();
    }
  };

  return (
    <div className="h-screen bg-[#050816] text-white overflow-hidden flex relative">

      {/* BG EFFECT */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/10 blur-[180px] rounded-full" />

      <div className="absolute bottom-[-250px] right-[-250px] w-[500px] h-[500px] bg-cyan-500/10 blur-[180px] rounded-full" />

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:relative z-50
          h-full
          w-[290px]
          bg-[#0A1020]/95
          border-r border-white/10
          backdrop-blur-2xl
          flex flex-col
          transition-all duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* TOP */}
        <div className="p-4 border-b border-white/10">

          <div className="flex items-center justify-between mb-4 lg:hidden">

            <h2 className="font-bold text-lg">
              AI Chats
            </h2>

            <button
              onClick={() =>
                setSidebarOpen(false)
              }
            >
              <X size={22} />
            </button>

          </div>

          <button
            onClick={() => {
              setSelectedChat(null);

              setSidebarOpen(false);
            }}
            className="w-full h-[54px] rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all"
          >
            <Plus size={18} />

            New Chat
          </button>

        </div>

        {/* HISTORY */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">

          {conversations.map((chat) => (

            <div
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat);

                setSidebarOpen(false);
              }}
              className={`
                group
                relative
                rounded-2xl
                border
                p-4
                cursor-pointer
                transition-all
                ${
                  selectedChat?.id ===
                  chat.id
                    ? "bg-blue-500/15 border-blue-500/30"
                    : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
                }
              `}
            >
              <p className="text-sm text-gray-300 line-clamp-2 pr-8 leading-relaxed">
                {chat.inputPrompt}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  handleDelete(chat.id);
                }}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>

            </div>

          ))}

        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col relative">

        {/* HEADER */}
        <header className="h-[72px] border-b border-white/10 bg-black/10 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div>

              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                AI Workspace
              </h1>

              <p className="text-xs text-gray-500">
                Glamour AI Content Studio
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-3">

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as any
                )
              }
              className="h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 outline-none"
            >
              <option value="CAPTION">
                Caption
              </option>

              <option value="DESCRIPTION">
                Description
              </option>

              <option value="TAGLINE">
                Tagline
              </option>

            </select>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value as any
                )
              }
              className="h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 outline-none"
            >
              <option value="ID">
                Indonesia
              </option>

              <option value="EN">
                English
              </option>

            </select>

          </div>

        </header>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto px-4 md:px-10 py-10">

          <div className="max-w-5xl mx-auto">

            {!selectedChat ? (

              <div className="h-full min-h-[70vh] flex flex-col items-center justify-center text-center">

                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-8">

                  <Sparkles size={34} />

                </div>

                <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-6">
                  Create Stunning
                  AI Content
                </h1>

                <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                  Generate captions,
                  descriptions, and
                  taglines with a
                  modern AI experience
                  inspired by Gemini &
                  ChatGPT.
                </p>

              </div>

            ) : (

              <div className="space-y-10 pb-40">

                {/* USER */}
                <div className="flex justify-end">

                  <div className="max-w-[90%] md:max-w-2xl rounded-[28px] px-6 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 shadow-xl shadow-blue-500/20">

                    <p className="whitespace-pre-wrap leading-relaxed">
                      {
                        selectedChat.inputPrompt
                      }
                    </p>

                  </div>

                </div>

                {/* AI */}
                <div className="flex justify-start">

                  <div className="max-w-[90%] md:max-w-4xl rounded-[32px] px-7 py-6 bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl">

                    <div className="prose prose-invert max-w-none prose-p:text-gray-200 prose-headings:text-white prose-strong:text-white">

                      <ReactMarkdown
                        remarkPlugins={[
                          remarkGfm,
                        ]}
                      >
                        {selectedChat.result}
                      </ReactMarkdown>

                    </div>

                  </div>

                </div>

                {/* LOADING */}
                {loading && (

                  <div className="flex justify-start">

                    <div className="rounded-[28px] px-6 py-5 bg-white/[0.03] border border-white/10">

                      <div className="flex gap-2">

                        <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce" />

                        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce delay-100" />

                        <div className="w-3 h-3 rounded-full bg-blue-300 animate-bounce delay-200" />

                      </div>

                    </div>

                  </div>

                )}

                <div ref={messagesEndRef} />

              </div>

            )}

          </div>

        </div>

        {/* INPUT */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-8 pb-6">

          <div className="max-w-4xl mx-auto">

            <div className="rounded-[32px] border border-white/10 bg-[#0B1120]/90 backdrop-blur-2xl shadow-2xl shadow-black/30 p-4">

              {/* MOBILE OPTIONS */}
              <div className="flex md:hidden gap-2 mb-3">

                <select
                  value={type}
                  onChange={(e) =>
                    setType(
                      e.target.value as any
                    )
                  }
                  className="flex-1 h-[42px] rounded-xl bg-white/5 border border-white/10 px-3 text-sm"
                >
                  <option value="CAPTION">
                    Caption
                  </option>

                  <option value="DESCRIPTION">
                    Description
                  </option>

                  <option value="TAGLINE">
                    Tagline
                  </option>

                </select>

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(
                      e.target.value as any
                    )
                  }
                  className="w-[120px] h-[42px] rounded-xl bg-white/5 border border-white/10 px-3 text-sm"
                >
                  <option value="ID">
                    ID
                  </option>

                  <option value="EN">
                    EN
                  </option>

                </select>

              </div>

              {/* INPUT ROW */}
              <div className="flex items-end gap-3">

                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={prompt}
                  onChange={(e) =>
                    setPrompt(
                      e.target.value
                    )
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AI anything..."
                  className="flex-1 bg-transparent outline-none resize-none max-h-[180px] text-white placeholder:text-gray-500 leading-relaxed px-2 py-2"
                />

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="min-w-[54px] h-[54px] rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all"
                >
                  <SendHorizonal size={20} />
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;