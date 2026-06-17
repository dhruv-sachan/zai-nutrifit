import { useState, useRef, useEffect } from "react";
import API from "../../api/axiosInstance";
import { Bot, Send, Sparkles, Loader2, User } from "lucide-react";

export default function AICopilotTab({ user }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Greetings, Operator. I am your NutriFit AI Health Companion. Choose a template or ask a custom question below to compute optimized nutrition plans.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt) => {
    const messageText = customPrompt || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = { role: "user", text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const userContext = {
        age: user.age,
        weight: user.weight,
        height: user.height,
        stepGoal: user.stepGoal,
        exerciseType: user.exerciseType,
        dietPreference: user.dietPreference,
      };

      const response = await API.post("/ai/chat", {
        message: messageText,
        userContext,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: response.data.reply },
      ]);
    } catch (err) {
      console.error("AI node response processing fault:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Critical system connection timeout error. Check your server configurations.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl h-140 shadow-xl shadow-slate-200/10 flex flex-col overflow-hidden relative">
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Gemini Flash Inference Core
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
              Context: Active Profile Anchored
            </p>
          </div>
        </div>
        <Sparkles size={16} className="text-teal-500 animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-emerald-50/5">
        {messages.map((msg, idx) => {
          const isAi = msg.role === "assistant";
          return (
            <div
              key={idx}
              className={`flex gap-3 max-w-3xl ${isAi ? "text-left mr-auto" : "flex-row-reverse text-right ml-auto"} animate-fadeIn`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center border shadow-xs ${
                  isAi
                    ? "bg-white border-slate-100 text-emerald-600"
                    : "bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white border-transparent"
                }`}
              >
                {isAi ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div
                className={`p-4 rounded-2xl text-sm font-semibold leading-relaxed shadow-xs border ${
                  isAi
                    ? "bg-white border-slate-100 text-slate-700"
                    : "bg-slate-900 text-slate-100 border-slate-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-3 text-left mr-auto animate-pulse">
            <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-emerald-600 flex items-center justify-center h-10 w-10">
              <Bot size={18} />
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl text-xs font-bold text-slate-400 flex items-center gap-2">
              <Loader2 className="animate-spin text-teal-500" size={14} />{" "}
              Syncing response data nodes...
            </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      <div className="px-6 py-2 bg-slate-50/50 border-t border-slate-100 flex gap-2 overflow-x-auto shrink-0">
        <button
          onClick={() =>
            handleSendMessage(
              "Compile a customized meal plan based on my macros.",
            )
          }
          className="text-[11px] font-bold tracking-wide bg-white border border-slate-200/60 text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
        >
          📋 Compile Meal Plan
        </button>
        <button
          onClick={() =>
            handleSendMessage(
              "Analyze my target workout routine and suggest optimal recovery meals.",
            )
          }
          className="text-[11px] font-bold tracking-wide bg-white border border-slate-200/60 text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
        >
          🏋️ Workout Analysis
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 bg-white border-t border-slate-100 flex gap-3 items-center shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Query AI platform..."
          className="flex-1 bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-800 transition-all"
          required
        />
        <button
          type="submit"
          className="bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 p-3.5 rounded-xl text-white transition-all shadow-md shadow-emerald-500/10 flex justify-center items-center cursor-pointer"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
