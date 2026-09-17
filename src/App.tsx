import { motion, AnimatePresence } from "motion/react";
import { 
  Check, 
  ChevronRight, 
  Menu, 
  X, 
  Zap, 
  Brain, 
  Bot, 
  BarChart3, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Star,
  Plus,
  Minus,
  Mail,
  Github,
  Twitter,
  ArrowRight,
  Send,
  Loader2,
  RotateCw,
  LayoutGrid,
  Calendar,
  FileText,
  Award,
  Activity,
  User,
  Bell,
  Sparkles,
  Clock,
  TrendingUp,
  Trash2,
  Mic,
  MicOff,
  Download,
  Volume2,
  Sliders
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useFirebase } from "./context/FirebaseContext";
import { DashboardView } from "./components/DashboardView";
import { PrivacyPolicyView } from "./components/PrivacyPolicyView";
import { TermsOfServiceView } from "./components/TermsOfServiceView";
import { SubjectChatbotsView } from "./components/SubjectChatbotsView";
import { ExamKitView } from "./components/ExamKitView";
import { AboutView } from "./components/AboutView";
import { EduSwathiPreloader } from "./components/EduSwathiPreloader";
import { EduSwathiLogo, EduSwathiIcon } from "./components/EduSwathiLogo";
import { SimpleVoiceWelcome } from "./components/SimpleVoiceWelcome";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { PwaInstallPrompt } from "./components/PwaInstallPrompt";
import { getStoredStudentName, speakText } from "./services/voiceAgentService";

// --- Components ---

interface ChatbotProps {
  isOpenProp?: boolean;
  setIsOpenProp?: (open: boolean) => void;
}

const Chatbot = ({ isOpenProp, setIsOpenProp }: ChatbotProps) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = isOpenProp !== undefined ? isOpenProp : localIsOpen;
  const setIsOpen = setIsOpenProp !== undefined ? setIsOpenProp : setLocalIsOpen;
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Hello! I'm Edu Swathi. How can I help you with your learning today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const handleSpeakAi = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speakingText === text) {
      window.speechSynthesis.cancel();
      setSpeakingText(null);
      return;
    }
    const clean = text.replace(/[*#`_\[\]]/g, "");
    setSpeakingText(text);
    speakText(clean, {
      onEnd: () => setSpeakingText(null),
      onError: () => setSpeakingText(null)
    });
  };

  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    setRecognitionError(null);
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setRecognitionError("Speech recognition is not supported in this browser. Try Chrome or Safari.");
      return;
    }

    try {
      const rec = new SpeechRecognitionAPI();
      const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      rec.continuous = !isMobile;
      rec.interimResults = true;
      rec.lang = "en-IN";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        let fullTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        setInput(fullTranscript);
      };

      rec.onerror = (e: any) => {
        const err = e?.error;
        if (err === "no-speech" || err === "aborted") {
          setIsListening(false);
          return;
        }
        if (err === "not-allowed" || err === "service-not-allowed") {
          setRecognitionError("Microphone access is restricted in preview frame. Use text input or click 'Insert Sample Query'.");
        } else if (err === "audio-capture") {
          setRecognitionError("No microphone detected on this device.");
        } else if (err === "network") {
          setRecognitionError("Speech recognition network error.");
        } else {
          setRecognitionError(`Voice engine notice: ${err || "Capture stopped"}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      try {
        rec.start();
        recognitionRef.current = rec;
      } catch (startErr: any) {
        setIsListening(false);
        setRecognitionError("Microphone access restricted in preview frame. You can type directly or insert a sample query.");
      }
    } catch (e: any) {
      setIsListening(false);
      setRecognitionError("Voice engine initialized in text fallback mode.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen && isListening) {
      stopListening();
    }
  }, [isOpen, isListening]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (!reader) {
        throw new Error("Response body is not readable");
      }

      // Hide loading state because the stream has started and we are ready to display text
      setIsLoading(false);

      // Append an empty AI message to be filled incrementally
      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      let accumulatedResponse = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0 && updated[updated.length - 1].role === "ai") {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: accumulatedResponse,
            };
          }
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Apologies, I encountered an error communicating with the Edu Swathi neural network. Please try again." },
      ]);
    }
  };

  const downloadConversation = () => {
    try {
      const header = `==================================================\nEDUSWATHI STUDY COGNITIVE CHAT REFERENCE\nGenerated: ${new Date().toLocaleString()}\n==================================================\n\n`;
      const body = messages
        .map(msg => msg.role === "ai" ? `[EDUSWATHI]:\n${msg.content}` : `[YOU]:\n${msg.content}`)
        .join("\n\n--------------------------------------------------\n\n");
      const fullText = header + body;
      
      const blob = new Blob([fullText], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `eduswathi_study_reference_${new Date().toISOString().slice(0, 10)}.txt`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download chat reference:", err);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-start">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-[calc(100vw-3rem)] sm:w-[400px] h-[500px] mb-4 bg-white border-4 border-on-surface shadow-brutalist flex flex-col overflow-hidden rounded-2xl"
        >
          {/* Header */}
          <div className="bg-on-surface text-surface p-3.5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary border-2 border-on-surface rounded-lg flex items-center justify-center p-0.5">
                <EduSwathiIcon size={18} theme="light" />
              </div>
              <div>
                <h4 className="font-bold text-xs leading-none">EduSwathi AI</h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={downloadConversation} 
                className="hover:text-primary transition-colors p-1 rounded hover:bg-white/10 cursor-pointer flex items-center justify-center" 
                title="Download Conversation (.txt)"
              >
                <Download size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors cursor-pointer flex items-center justify-center">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-surface/30">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div 
                  key={`msg-${i}`}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`
                    max-w-[85%] p-4 border-2 border-on-surface shadow-brutalist-sm
                    ${msg.role === "user" 
                      ? "bg-primary text-on-surface rounded-2xl rounded-tr-none" 
                      : "bg-white text-on-surface rounded-2xl rounded-tl-none"}
                  `}>
                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                    {msg.role === "ai" && (
                      <div className="mt-2 pt-1.5 border-t border-on-surface/10 flex items-center justify-between text-xs text-on-surface/60 font-mono">
                        <span className="text-[10px] uppercase font-black text-primary-dark tracking-wider">Edu Swathi</span>
                        <button
                          onClick={() => handleSpeakAi(msg.content)}
                          className="hover:text-on-surface p-1 rounded transition-colors flex items-center gap-1 cursor-pointer bg-surface/50 border border-on-surface/20 hover:bg-primary/20"
                          title={speakingText === msg.content ? "Stop speaking" : "Listen to Edu Swathi speak"}
                        >
                          <Volume2 size={12} className={speakingText === msg.content ? "text-primary-dark animate-pulse" : ""} />
                          <span className="text-[10px] font-black uppercase">{speakingText === msg.content ? "Speaking" : "Listen"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  key="loading-indicator"
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="flex justify-start w-[80%]"
                >
                  <div className="w-full bg-white border-2 border-on-surface p-4 rounded-2xl rounded-tl-none shadow-brutalist-sm flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-primary" />
                      <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-on-surface/65">Edu Swathi is thinking...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3.5 bg-surface-container border border-on-surface/10 rounded w-full animate-pulse" />
                      <div className="h-3.5 bg-surface-container border border-on-surface/10 rounded w-[85%] animate-pulse" />
                      <div className="h-3.5 bg-surface-container border border-on-surface/10 rounded w-[60%] animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hand-free system notifications/listening display */}
          {isListening && (
            <div className="px-4 py-1.5 bg-red-50 border-t-2 border-on-surface text-red-600 animate-pulse text-[10px] font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-ping"></span>
              <span>🎙️ Speech Recognition active... speak now. Click mic again to stop.</span>
            </div>
          )}

          {recognitionError && (
            <div className="px-4 py-2 bg-amber-50 border-t-2 border-on-surface text-amber-900 text-[10px] font-mono flex items-center justify-between gap-2">
              <span className="flex-1 truncate">⚠️ {recognitionError}</span>
              <button 
                onClick={() => {
                  setInput("Explain how active recall improves long-term memory retention");
                  setRecognitionError(null);
                }} 
                className="px-2 py-1 bg-amber-200 border border-on-surface rounded-md font-bold text-[10px] hover:bg-amber-300 cursor-pointer shrink-0"
              >
                Sample Query
              </button>
              <button onClick={() => setRecognitionError(null)} className="font-extrabold hover:text-amber-950 px-1 cursor-pointer text-xs">×</button>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t-2 border-on-surface bg-white">
            <div className="flex gap-2 p-1 border-2 border-on-surface rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isListening ? "Listening..." : "Ask me anything..."} 
                className="flex-1 px-3 py-2 text-sm font-medium focus:outline-none"
              />
              <button 
                onClick={toggleListening}
                className={`p-2 rounded-lg border-2 border-on-surface shadow-brutalist-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer ${
                  isListening 
                    ? "bg-red-400 text-on-surface hover:bg-red-500 animate-pulse" 
                    : "bg-yellow-300 text-on-surface hover:bg-yellow-400"
                }`}
                title={isListening ? "Stop listening" : "Speak hands-free"}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-primary hover:bg-accent disabled:bg-surface-variant p-2 rounded-lg border-2 border-on-surface shadow-brutalist-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toggle Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary border-4 border-on-surface shadow-brutalist flex items-center justify-center rounded-2xl cursor-pointer relative"
      >
        {isOpen ? (
          <X size={28} className="text-on-surface" />
        ) : (
          <EduSwathiIcon size={36} theme="light" />
        )}
        {!isOpen && (
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-on-surface border-2 border-white rounded-full flex items-center justify-center animate-bounce z-10">
            <span className="text-[11px] text-primary font-black">1</span>
          </div>
        )}
      </motion.button>
    </div>
  );
};

// --- Authentication Gateway Portal ---
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useFirebase();

  if (!isOpen) return null;

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        if (!name.trim()) throw new Error("Full display name is required.");
        if (password.length < 6) throw new Error("Passcode must contain at least 6 characters.");
        await signUpWithEmail(email, password, name.trim());
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication process failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      // Check if user was authenticated
      const active = localStorage.getItem("eduswathi_active_user");
      if (active) {
        onClose();
      }
    } catch (err: any) {
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request" ||
        err?.message?.includes("popup-closed-by-user")
      ) {
        return;
      }
      setError(err.message || "Failed to establish Google sign-in. Please use Email login if popups are blocked.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      // Try demo student login or register if not existing
      try {
        await signInWithEmail("scholar.puc2@eduswathi.org", "StudentPass123!");
      } catch {
        await signUpWithEmail("scholar.puc2@eduswathi.org", "StudentPass123!", "PUC II Scholar");
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Demo sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="w-full max-w-md bg-white border-4 border-on-surface p-6 sm:p-8 shadow-brutalist rounded-[24px]"
      >
        {/* Top Header */}
        <div className="flex justify-between items-start border-b-2 border-on-surface/20 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-primary border border-on-surface animate-pulse" />
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-primary-dark">
                FIRESTORE AUTH & DATABASE
              </span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-on-surface">
              {isSignUp ? "Create Student ID" : "Student Sign In"}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-primary transition-colors p-1.5 border-2 border-on-surface bg-white rounded-lg shadow-brutalist-sm cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container border-2 border-on-surface rounded-xl mb-4">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(""); }}
            className={`py-1.5 font-mono text-xs font-black uppercase rounded-lg transition-all ${
              !isSignUp 
                ? "bg-primary text-on-surface border border-on-surface shadow-xs" 
                : "text-on-surface/60 hover:text-on-surface"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(""); }}
            className={`py-1.5 font-mono text-xs font-black uppercase rounded-lg transition-all ${
              isSignUp 
                ? "bg-primary text-on-surface border border-on-surface shadow-xs" 
                : "text-on-surface/60 hover:text-on-surface"
            }`}
          >
            Register Core
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border-2 border-red-500 rounded-xl text-red-800 text-xs font-mono font-bold tracking-tight mb-4">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleAction} className="space-y-3.5">
          {isSignUp && (
            <div className="space-y-1">
              <label className="font-mono text-[10px] font-black uppercase text-on-surface/75">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Swathi Sharma"
                className="w-full px-3.5 py-2 bg-white border-2 border-on-surface font-sans font-bold rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="font-mono text-[10px] font-black uppercase text-on-surface/75">Academic Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@puconline.edu"
              className="w-full px-3.5 py-2 bg-white border-2 border-on-surface font-sans font-bold rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] font-black uppercase text-on-surface/75">Security Passcode</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-white border-2 border-on-surface font-sans font-bold rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full brutalist-button bg-primary hover:bg-accent py-3 font-black uppercase text-xs tracking-wider shadow-brutalist-sm mt-3 flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={14} />}
            {isSignUp ? "Construct Account & Sync" : "Access Console & Sync"}
          </button>
        </form>

        <div className="relative my-4 text-center">
          <hr className="border-on-surface/15" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 bg-white font-mono text-[9px] font-bold text-on-surface/40 uppercase tracking-widest">
            OR OPERATE WITH
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button 
            onClick={handleGoogle}
            disabled={loading}
            type="button"
            className="w-full px-3 py-2.5 border-2 border-on-surface bg-white rounded-xl shadow-brutalist-sm hover:shadow-brutalist transition-all font-mono text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.7 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.9c2.3-2.1 3.6-5.2 3.6-9.1z"/>
              <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3.1c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.2C3.3 21.4 7.4 24 12 24z"/>
              <path fill="#FBBC05" d="M5.3 14.2c-.2-.7-.4-1.5-.4-2.2s.2-1.5.4-2.2V6.6H1.3C.5 8.2 0 10.1 0 12s.5 3.8 1.3 5.4l4-3.2z"/>
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.4 0 3.3 2.6 1.3 6.6l4 3.2c.9-2.9 3.6-5 6.7-5z"/>
            </svg>
            Google
          </button>

          <button 
            onClick={handleDemoSignIn}
            disabled={loading}
            type="button"
            className="w-full px-3 py-2.5 border-2 border-on-surface bg-surface-container rounded-xl shadow-brutalist-sm hover:shadow-brutalist transition-all font-mono text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={13} className="text-primary-dark" />
            1-Click Demo
          </button>
        </div>

        <div className="text-center mt-4 pt-3 border-t border-on-surface/10">
          <button 
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            className="font-mono text-[10px] font-bold text-on-surface/70 uppercase hover:text-primary transition-colors underline cursor-pointer"
          >
            {isSignUp ? "Already registered? Sign In" : "Need student credentials? Register Core"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Navbar Component with Tab state ---
interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  studentName?: string | null;
}

const Navbar = ({ activeTab, setActiveTab, isAuthModalOpen, setIsAuthModalOpen, studentName }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, logout } = useFirebase();
  const menuItems = [
    { label: "Home", id: "home" },
    { label: "Exam Kit", id: "courses" },
    { label: "Subject Bots", id: "subject-bots" },
    { label: "Dashboard", id: "dashboard", live: true },
    { label: "About", id: "about" }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b-3 sm:border-b-4 border-on-surface w-full shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <div className={`${activeTab === "dashboard" ? "max-w-none w-full" : "max-w-7xl mx-auto"} px-3 sm:px-6 h-16 sm:h-20 flex justify-between items-center`}>
        <EduSwathiLogo 
          variant="primary"
          size="md"
          animated={true}
          onClick={() => {
            setActiveTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} 
        />

        {/* Mobile quick actions / greeting */}
        <div className="flex md:hidden items-center gap-2">
          {studentName && !user && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-white border-2 border-on-surface rounded-lg font-mono text-[10px] font-black shadow-brutalist-sm text-on-surface max-w-[120px] truncate">
              <Sparkles size={11} className="text-primary-dark shrink-0" />
              <span className="truncate">{studentName}</span>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/20 border-2 border-on-surface rounded-lg font-mono text-[10px] font-black">
              🔥 {profile?.streak || 1}d
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-2.5 py-1 bg-primary border-2 border-on-surface rounded-lg font-mono text-[10px] font-black uppercase shadow-brutalist-sm"
            >
              Sign In
            </button>
          )}

          <button 
            className="p-2 min-w-[40px] min-h-[40px] border-2 border-on-surface bg-white rounded-lg shadow-brutalist-sm cursor-pointer flex items-center justify-center active:scale-95" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="hidden md:flex gap-4 lg:gap-6 items-center">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }} 
                className={`font-mono text-xs font-black uppercase tracking-widest px-3 py-1.5 transition-all outline-none border-2 border-transparent rounded-lg cursor-pointer
                  ${isActive 
                    ? "bg-primary text-on-surface border-on-surface shadow-brutalist-sm" 
                    : "hover:bg-primary/10 text-on-surface/80"}`}
              >
                <span className="flex items-center gap-1.5">
                  {item.label}
                  {(item as any).live && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  )}
                </span>
              </button>
            );
          })}

          {studentName && !user && (
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-on-surface rounded-xl font-mono text-xs font-bold shadow-brutalist-sm text-on-surface">
              <Sparkles size={13} className="text-primary-dark" />
              <span>Hi, {studentName}</span>
            </div>
          )}
          
          {user ? (
            <div className="flex items-center gap-4 border-l-2 border-on-surface/10 pl-4">
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-mono font-black uppercase text-primary-dark">
                  🔥 {profile?.streak || 1} day streak
                </span>
                <span className="text-[10px] font-bold text-on-surface/60 truncate max-w-[100px]">
                  {profile?.name || studentName || "Scholar"}
                </span>
              </div>
              <button 
                onClick={logout} 
                className="brutalist-button bg-red-400 hover:bg-red-500 px-4 py-2 h-9 text-[10px] font-black uppercase shadow-brutalist-sm"
              >
                Exit
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)} 
              className="brutalist-button bg-primary hover:bg-accent px-6 py-2.5 h-11 text-xs font-black shadow-brutalist-sm hover:shadow-brutalist"
            >
              Log In Console
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t-2 border-on-surface p-6 flex flex-col gap-3 shadow-brutalist"
        >
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }} 
                className={`text-left font-mono text-base uppercase font-black p-3 rounded-xl border-2 transition-all cursor-pointer
                  ${isActive ? "bg-primary text-on-surface border-on-surface shadow-brutalist-sm" : "border-transparent text-on-surface/80 hover:bg-surface"}`}
              >
                <span className="flex items-center justify-between w-full">
                  <span>{item.label}</span>
                  {(item as any).live && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded border border-emerald-500 font-mono">LIVE</span>
                  )}
                </span>
              </button>
            );
          })}
          {user ? (
            <div className="border-t-2 border-on-surface/10 pt-4 flex flex-col gap-2">
              <span className="font-mono text-xs font-black uppercase text-center w-full bg-primary/20 py-2 border-2 border-on-surface rounded-xl">
                🔥 {profile?.streak || 1} Day Streak Active
              </span>
              <button 
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }} 
                className="brutalist-button bg-red-400 py-3 text-center text-xs font-black uppercase w-full"
              >
                Exit Session
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                setIsAuthModalOpen(true);
                setIsOpen(false);
              }} 
              className="brutalist-button brutalist-button-primary w-full py-4 text-center text-sm font-black mt-2"
            >
              Access Console
            </button>
          )}
        </motion.div>
      )}

      {/* Auth Modal Portal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};

interface HeroProps {
  onStartLearning: () => void;
  onExploreCourses: () => void;
}

const Hero = ({ onStartLearning, onExploreCourses }: HeroProps) => {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center gap-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-8 max-w-4xl"
      >
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 border-2 border-on-surface rounded-full shadow-brutalist-sm"
        >
          <span className="w-2 h-2 rounded-full bg-primary-dark animate-pulse" />
          <span className="font-mono text-xs font-black uppercase tracking-wider text-on-surface">AI-Powered Education 2.0</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl md:text-8xl font-black leading-none tracking-tight">
          Your Personal AI <br /> 
          <span className="text-primary italic">Learning</span> Companion
        </motion.h1>
        
        <motion.p variants={itemVariants} className="font-sans text-lg sm:text-xl text-secondary max-w-2xl leading-relaxed">
          Master any subject with a customized curriculum that adapts to your pace, provides instant feedback, and explains complex concepts in a way you actually understand.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <motion.button 
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartLearning}
            className="brutalist-button bg-primary hover:bg-accent px-10 py-5 text-base cursor-pointer shadow-brutalist"
          >
            Start Learning
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExploreCourses}
            className="brutalist-button bg-white hover:bg-surface-container px-10 py-5 text-base shadow-brutalist border-on-surface cursor-pointer"
          >
            Explore Exam Kit →
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: "Students Joined", value: "1M+" },
    { label: "AI Tutors", value: "500+" },
    { label: "Success Rate", value: "98%" },
    { label: "AI Support", value: "24/7" },
  ];

  // Tripling for extra safety in long wide screens
  const tripledStats = [...stats, ...stats, ...stats];

  return (
    <section className="bg-on-surface py-16 w-full overflow-hidden border-y border-on-surface">
      <motion.div 
        animate={{ x: [0, "-33.33%"] }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex items-center min-w-max"
      >
        {tripledStats.map((stat, i) => (
          <div key={i} className="flex items-center gap-10 md:gap-20 px-10 md:px-20 border-r border-surface/10 last:border-0 group">
            <div className="flex flex-col items-center text-center gap-2">
              <span className="font-display text-5xl md:text-7xl text-primary group-hover:scale-105 transition-transform duration-500 inline-block font-black">
                {stat.value}
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-surface/40 group-hover:text-primary transition-colors">
                {stat.label}
              </span>
            </div>
            {/* Visual separator dot */}
            <div className={`w-3 h-3 bg-primary/20 rotate-45 border border-primary/40 ${(i + 1) % stats.length === 0 ? 'opacity-100' : 'opacity-40'}`} />
          </div>
        ))}
      </motion.div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Create Profile",
      desc: "Tell us about your learning goals, current skill level, and preferred learning style. Our AI starts building your persona."
    },
    {
      num: "02",
      title: "Choose Path",
      desc: "Select from thousands of topics or let the AI suggest a curriculum tailored to bridge your specific knowledge gaps."
    },
    {
      num: "03",
      title: "Start Learning",
      desc: "Dive into interactive lessons, get instant feedback, and master subjects faster than ever with your AI companion.",
      highlight: true
    }
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-32 bg-surface">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-24 text-center"
      >
        <h2 className="text-5xl md:text-6xl mb-6">How it works</h2>
        <div className="h-1.5 w-32 bg-primary border border-on-surface" />
      </motion.div>

      <div className="grid md:grid-cols-3 gap-12">
        {steps.map((step, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ y: -12, rotate: i % 2 === 0 ? 1 : -1 }}
            className={`p-12 border border-on-surface relative shadow-brutalist transition-all duration-300 rounded-xl ${step.highlight ? 'bg-primary border-2' : 'bg-white'}`}
          >
            <div className={`absolute -top-12 -left-6 text-9xl font-display font-black leading-none opacity-5 ${step.highlight ? 'text-on-surface' : 'text-primary'}`}>{step.num}</div>
            <h3 className="text-3xl mt-4 mb-6">{step.title}</h3>
            <p className="text-secondary text-lg leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Features = () => {
  const cardVariants: any = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
    })
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-32">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-24 text-center"
      >
        <h2 className="text-5xl md:text-6xl mb-6">Supercharged Features</h2>
        <div className="h-1.5 w-32 bg-primary border border-on-surface" />
      </motion.div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Large Card */}
        <motion.div 
          custom={0}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.01, rotate: -0.5 }} 
          className="md:col-span-8 bg-white border border-on-surface p-12 flex flex-col gap-8 shadow-brutalist rounded-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -translate-y-16 translate-x-16 rounded-full group-hover:scale-150 transition-transform duration-700" />
          <Bot className="text-primary" size={48} />
          <div>
            <h3 className="text-4xl mb-6">Interactive AI Tutor</h3>
            <p className="text-secondary text-xl max-w-2xl leading-relaxed">
              Engage in deep conversations with an AI that understands your learning gaps. It doesn't just give answers; it guides you through the process of discovery.
            </p>
          </div>
          <div className="bg-on-surface p-6 border border-on-surface rounded-xl mt-auto shadow-inner">
            <code className="text-sm font-mono text-primary/80 block">
              <span className="text-surface font-bold opacity-30">// DEBUG_MODE: </span> 
              Learning path optimized for user.sh
            </code>
          </div>
        </motion.div>

        {/* Small Card */}
        <motion.div 
          custom={1}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.01, rotate: 0.5 }} 
          className="md:col-span-4 bg-primary border-2 border-on-surface p-12 flex flex-col gap-8 shadow-brutalist rounded-2xl group"
        >
          <BarChart3 size={48} />
          <h3 className="text-3xl">Live Progress</h3>
          <p className="text-on-surface/80 text-lg font-medium leading-relaxed">
            Watch your skills evolve in real-time with granular analytics and predictive mastery scores.
          </p>
        </motion.div>

        {/* Small Card */}
        <motion.div 
          custom={2}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.01, rotate: -0.5 }} 
          className="md:col-span-4 bg-white border border-on-surface p-12 flex flex-col gap-8 shadow-brutalist rounded-2xl hover:animate-border-flicker"
        >
          <BookOpen className="text-primary" size={48} />
          <h3 className="text-3xl">Smart Resources</h3>
          <p className="text-secondary text-lg leading-relaxed">
            Instant access to a library of millions of textbooks, research papers, and curated videos.
          </p>
        </motion.div>

        {/* Large Card */}
        <motion.div 
          custom={3}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.01, rotate: 0.5 }} 
          className="md:col-span-8 bg-on-surface text-surface p-12 border border-on-surface shadow-brutalist-neon rounded-2xl overflow-hidden relative"
        >
          <div className="flex flex-col md:flex-row gap-12 items-center h-full relative z-10">
            <div className="flex-1">
              <Users className="text-primary mb-8" size={48} />
              <h3 className="text-4xl mb-6 text-primary">Community Peer Review</h3>
              <p className="text-surface/70 text-xl leading-relaxed">
                Collaborate with students globally. Our AI matches you with study groups of similar skill levels for optimal peer-to-peer learning.
              </p>
            </div>
            <div className="w-full md:w-56 flex flex-col gap-3 shrink-0">
              <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ delay: 1, duration: 1 }} className="h-8 bg-primary/20 border border-primary/20" />
              <motion.div initial={{ width: 0 }} whileInView={{ width: "75%" }} transition={{ delay: 1.2, duration: 1 }} className="h-8 bg-primary/40 border border-primary/20" />
              <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ delay: 1.4, duration: 1 }} className="h-8 bg-primary/60 border border-primary/20" />
              <motion.div initial={{ width: 0 }} whileInView={{ width: "50%" }} transition={{ delay: 1.6, duration: 1 }} className="h-8 bg-primary border border-primary" />
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(175,248,51,0.05),transparent_70%)]" />
        </motion.div>
      </div>
    </section>
  );
};



const MobilePreview = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-24 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col gap-10 order-2 lg:order-1 items-center justify-center relative"
      >
         <div className="absolute -z-10 w-full aspect-square bg-primary/5 rounded-full blur-3xl" />
        <div className="relative w-80 h-[640px] bg-on-surface rounded-[50px] border-[12px] border-on-surface shadow-brutalist-lg overflow-hidden ring-4 ring-primary/20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-on-surface rounded-b-2xl z-30" />
          <div className="h-full bg-surface p-8 pt-16 flex flex-col gap-10">
            <div className="flex justify-between items-center">
              <Menu size={24} />
              <div className="w-10 h-10 bg-primary rounded-full border-2 border-on-surface shadow-sm" />
            </div>
            
            <div className="space-y-6">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="h-44 w-full bg-white rounded-3xl border border-on-surface p-5 flex flex-col gap-3 shadow-brutalist scale-95 origin-center"
              >
                <div className="h-5 w-2/3 bg-primary" />
                <div className="h-2 w-full bg-on-surface/10" />
                <div className="h-2 w-full bg-on-surface/10" />
                <div className="h-2 w-3/4 bg-on-surface/10" />
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="h-48 w-full bg-on-surface rounded-3xl p-6 flex flex-col gap-4 shadow-brutalist scale-105 origin-center"
              >
                <div className="h-5 w-1/2 bg-primary" />
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-surface/20" />
                  <div className="h-1.5 w-full bg-surface/20" />
                  <div className="h-1.5 w-3/4 bg-surface/20" />
                </div>
                <div className="mt-auto h-1 w-full bg-surface/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "66%" }}
                    transition={{ delay: 1, duration: 1 }}
                    className="h-full bg-primary" 
                  />
                </div>
              </motion.div>
            </div>
            
            <div className="mt-auto flex justify-around p-4 rounded-full border border-on-surface bg-white">
               <BookOpen size={20} />
               <Users size={20} className="text-secondary" />
               <BarChart3 size={20} className="text-secondary" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-10 order-1 lg:order-2">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl leading-[0.9]"
        >
          Learn anywhere, <br />
          <span className="text-primary italic">Anytime.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-secondary max-w-lg leading-relaxed italic"
        >
          Our mobile companion brings the power of AI tutoring to your pocket. Sync your progress across all devices and learn on the go.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, rotate: 1 }} 
          className="brutalist-card p-8 bg-white flex items-center gap-10 max-w-md border-2 border-on-surface shadow-brutalist"
        >
          <div className="w-32 h-32 bg-on-surface flex items-center justify-center shrink-0">
             <div className="w-24 h-24 bg-white grid grid-cols-8 grid-rows-8 gap-px p-1">
                {[...Array(64)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: Math.random() > 0.6 ? 1 : 0 }}
                    transition={{ repeat: Infinity, duration: 2, delay: Math.random() * 2 }}
                    className="w-full h-full bg-on-surface" 
                  />
                ))}
             </div>
          </div>
          <div>
            <span className="font-mono text-xs font-bold uppercase block mb-2 tracking-[0.2em] text-primary-dark">Early Access</span>
            <p className="text-sm text-secondary font-medium leading-relaxed">Join 50,000+ students on the beta waitlist. Scan QR to download.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};



const Testimonials = () => {
  const voices = [
    { 
      name: "James D.", 
      initials: "JD", 
      role: "Physics Undergrad", 
      text: "The AI Tutor explained Quantum Physics to me like I was five, then gradually scaled up to university level. I've never felt more confident." 
    },
    { 
      name: "Sarah A.", 
      initials: "SA", 
      role: "Self-taught Developer", 
      text: "Finally, a learning platform that doesn't feel like a chore. The adaptive feedback keeps me in the 'flow' state for hours." 
    },
    { 
      name: "Mark L.", 
      initials: "ML", 
      role: "Medical Resident", 
      text: "The resource integration is seamless. I can pull in any paper and the AI summarizes it instantly while I take notes." 
    },
  ];

  return (
    <section className="bg-white py-32 border-b border-on-surface">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-5xl text-center mb-24 italic"
        >
          Student Voices
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-12">
          {voices.map((v, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-surface p-12 border border-on-surface rounded-2xl flex flex-col gap-10 shadow-brutalist relative"
            >
               <div className="absolute -top-6 left-12 w-12 h-12 bg-primary border-2 border-on-surface rounded-full flex items-center justify-center font-display text-2xl">
                 "
               </div>
              <div className="flex gap-1 text-primary">
                {[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
              </div>
              <p className="text-xl italic font-sans leading-relaxed flex-grow text-on-surface/80">
                {v.text}
              </p>
              <div className="flex items-center gap-6 pt-6 border-t border-on-surface/10">
                <div className="w-16 h-16 bg-on-surface border-2 border-on-surface rounded-full flex items-center justify-center font-bold text-primary shadow-brutalist text-xl">
                  {v.initials}
                </div>
                <div>
                  <h4 className="text-lg font-bold m-0 normal-case mb-1 tracking-tight">{v.name}</h4>
                  <p className="text-xs text-secondary font-mono m-0 uppercase font-black tracking-widest">{v.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const tiers = [
    {
      name: "Free Tier",
      price: "0",
      features: ["Standard AI Tutor", "Full 2nd PUC Exam Kit Access", "Community Forum"],
      cta: "Get Started",
      style: "secondary"
    },
    {
      name: "Pro Plan",
      price: "499",
      features: ["Unlimited AI Tutoring", "All Exam Kits & Revision Tools", "Advanced Analytics", "Priority AI Response"],
      cta: "Upgrade to Pro",
      style: "primary",
      recommended: true
    },
    {
      name: "Institutional",
      price: "2,999",
      features: ["10 Member Accounts", "Admin Dashboard", "Custom AI Training"],
      cta: "Contact Sales",
      style: "secondary"
    }
  ];

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-32">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl md:text-7xl text-center mb-24 font-black"
      >
        Choose Your Path
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-10 items-stretch">
        {tiers.map((tier, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -15, rotate: i === 1 ? 1 : i === 0 ? -1 : 1 }}
            className={`p-12 border-2 border-on-surface rounded-[40px] flex flex-col gap-10 transition-all relative
              ${tier.recommended ? 'bg-primary shadow-brutalist-neon border-4 py-20' : 'bg-white hover:bg-surface-container shadow-brutalist'}`}
          >
            {tier.recommended && (
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-on-surface text-primary text-[11px] uppercase font-mono font-black tracking-[0.3em] px-6 py-2 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-brutalist border-2 border-on-surface"
              >
                Recommended
              </motion.div>
            )}
            <div>
              <span className="font-mono text-xs font-black uppercase tracking-[0.2em] opacity-40">{tier.name}</span>
              <div className="flex items-baseline gap-2 mt-4">
                <span className={`text-6xl md:text-7xl font-display font-black leading-none ${tier.recommended ? 'text-on-surface' : 'text-on-surface'}`}>₹{tier.price}</span>
                <span className="font-mono text-xs font-bold opacity-40">INR / MONTH</span>
              </div>
            </div>
            
            <div className={`h-px w-full ${tier.recommended ? 'bg-on-surface/20' : 'bg-on-surface/10'}`} />

            <ul className="flex flex-col gap-5 flex-grow">
              {tier.features.map((f, j) => (
                <motion.li 
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + (j * 0.1) }}
                  viewport={{ once: true }}
                  key={j} 
                  className="flex gap-4 text-sm font-bold items-center uppercase tracking-tight"
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border border-on-surface shadow-sm
                    ${tier.style === 'primary' ? 'bg-white text-on-surface' : 'bg-primary text-on-surface'}`}>
                    <Check size={14} strokeWidth={4} />
                  </div>
                  {f}
                </motion.li>
              ))}
            </ul>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`brutalist-button w-full h-16 text-sm ${tier.style === 'primary' ? 'bg-on-surface text-surface' : 'bg-white text-on-surface'}`}
            >
              {tier.cta}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const FAQ = () => {
  const questions = [
    { q: "How accurate is the AI tutor?", a: "Our models achieve a 98.7% accuracy rate across standardized testing subjects. All answers are verified against our massive academic database in real-time." },
    { q: "Can I use it for group projects?", a: "Yes! You can invite peers to collaborative sessions where the AI acts as a facilitator and neutral reviewer for your group's output." },
    { q: "What happens to my learning data?", a: "We prioritize privacy. Your data is encrypted and used only to improve your personalized learning experience. We never sell student data." },
    { q: "Is there a student discount?", a: "We offer special institutional rates and individual scholarships. Contact our support team with your .edu email for more information." }
  ];

  return (
    <section className="bg-surface py-32 border-y border-on-surface">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-5xl text-center mb-20 italic"
        >
          Frequently Asked
        </motion.h2>
        <div className="flex flex-col gap-6">
          {questions.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <details className="group border-2 border-on-surface rounded-2xl bg-white overflow-hidden shadow-brutalist">
                <summary className="flex justify-between items-center cursor-pointer list-none list-inside uppercase font-display text-xl tracking-tight p-8 hover:bg-primary transition-colors">
                  <span>{item.q}</span>
                  <div className="group-open:rotate-180 transition-transform bg-on-surface text-primary p-1 rounded-md">
                    <Plus size={20} className="group-open:hidden" />
                    <Minus size={20} className="hidden group-open:block" />
                  </div>
                </summary>
                <div className="p-8 pt-0 text-secondary text-xl leading-relaxed font-sans border-t-2 border-on-surface italic mt-4">
                  {item.a}
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Landing Page Legal & Terms Trust Section ---
interface LegalTrustSectionProps {
  setActiveTab: (tab: string) => void;
}

const LegalTrustSection = ({ setActiveTab }: LegalTrustSectionProps) => {
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-24 border-b-4 border-on-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent border-2 border-on-surface rounded-md font-mono text-[10px] font-black uppercase tracking-widest shadow-brutalist-sm">
            <Sparkles size={12} /> STUDENT TRUST & TRANSPARENCY
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Terms of Service & Privacy
          </h2>
          <p className="font-sans text-lg text-on-surface/80 leading-relaxed">
            We are committed to full academic integrity, student data ownership, and transparent usage terms. Review our binding policies before diving into the learning console.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Terms of Service */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-8 bg-surface border-3 border-on-surface rounded-2xl shadow-brutalist flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent border-2 border-on-surface rounded-xl shadow-brutalist-sm flex items-center justify-center text-on-surface font-black">
                <FileText size={24} />
              </div>
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary-dark block">
                AGREEMENT & CONDUCT
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight">Terms of Service</h3>
              <p className="text-sm font-sans text-on-surface/80 leading-relaxed">
                Covers acceptable academic conduct, account safety requirements, 100% student ownership over uploaded study notes, platform subscription tiers, and AI study disclaimers.
              </p>
              <ul className="space-y-2 text-xs font-mono font-bold text-on-surface/90 pt-2">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" /> You retain 100% rights to your uploaded notes & documents
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" /> Fair academic use & anti-scraping guidelines
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" /> Socratic AI study assistance disclaimers
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleNavigate("terms")}
              className="w-full py-3.5 bg-white hover:bg-accent border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase tracking-wider shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Read Full Terms of Service <ArrowRight size={14} />
            </button>
          </motion.div>

          {/* Card 2: Privacy Policy */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-8 bg-surface border-3 border-on-surface rounded-2xl shadow-brutalist flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary border-2 border-on-surface rounded-xl shadow-brutalist-sm flex items-center justify-center text-on-surface font-black">
                <BookOpen size={24} />
              </div>
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary-dark block">
                DATA PROTECTION & PRIVACY
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight">Privacy Policy</h3>
              <p className="text-sm font-sans text-on-surface/80 leading-relaxed">
                Details how Edu Swathi collects, encrypts, and handles student data. We guarantee zero data sales, strict COPPA/FERPA compliance, and local storage controls.
              </p>
              <ul className="space-y-2 text-xs font-mono font-bold text-on-surface/90 pt-2">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" /> Zero sale of student data or email lists
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" /> AES-256 encrypted Firestore storage
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" /> Full right to delete or export account data
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleNavigate("privacy")}
              className="w-full py-3.5 bg-white hover:bg-primary border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase tracking-wider shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Read Privacy Policy <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- EXAM KIT View (2nd PUC Science Special) ---
const CoursesView = () => {
  return <ExamKitView />;
};



interface FooterProps {
  setActiveTab?: (tab: string) => void;
}

const Footer = ({ setActiveTab }: FooterProps) => {
  const handleTabClick = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-on-surface text-surface pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-20 pb-20 border-b border-surface/10">
          <div className="md:col-span-6 flex flex-col gap-8">
            <EduSwathiLogo 
              variant="primary" 
              size="lg" 
              theme="dark" 
              showTagline={true} 
              onClick={() => handleTabClick("home")} 
            />
            <p className="text-surface/50 text-xl leading-relaxed max-w-sm">
              Building the future of personalized education with ethical AI and human-centric design.
            </p>
            <div className="flex gap-6">
              {[Twitter, Github, Mail].map((Icon, i) => (
                <div key={i} className="w-12 h-12 border-2 border-surface/20 flex items-center justify-center hover:bg-primary hover:text-on-surface hover:border-primary transition-all cursor-pointer group rounded-lg">
                  <Icon size={20} className="group-hover:scale-110" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-black uppercase mb-10 tracking-[0.3em] text-primary">Product</h4>
            <ul className="flex flex-col gap-6 font-sans text-lg text-surface/60">
              <li><button onClick={() => handleTabClick("home")} className="hover:text-primary transition-colors cursor-pointer text-left">Features</button></li>
              <li><button onClick={() => handleTabClick("home")} className="hover:text-primary transition-colors cursor-pointer text-left">Pricing</button></li>
              <li><button onClick={() => handleTabClick("courses")} className="hover:text-primary transition-colors cursor-pointer text-left">Exam Kit</button></li>
              <li><button onClick={() => handleTabClick("subject-bots")} className="hover:text-primary transition-colors cursor-pointer text-left">Subject AI Bots</button></li>
              <li><button onClick={() => handleTabClick("dashboard")} className="hover:text-primary transition-colors cursor-pointer text-left">Console</button></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-black uppercase mb-10 tracking-[0.3em] text-primary">Company & Legal</h4>
            <ul className="flex flex-col gap-6 font-sans text-lg text-surface/60">
              <li><button onClick={() => handleTabClick("about")} className="hover:text-primary transition-colors cursor-pointer text-left">About Us</button></li>
              <li><button onClick={() => handleTabClick("privacy")} className="hover:text-primary transition-colors cursor-pointer text-left">Privacy Policy</button></li>
              <li><button onClick={() => handleTabClick("terms")} className="hover:text-primary transition-colors cursor-pointer text-left">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-xs font-mono text-surface/30 font-bold uppercase tracking-widest">
            © 2026 Edu Swathi AI. <span className="hidden sm:inline">Built for the future.</span>
          </p>
          <div className="flex gap-12 font-mono text-[11px] font-black uppercase tracking-[0.2em] text-surface/40">
            <button 
              onClick={() => handleTabClick("privacy")} 
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => handleTabClick("terms")} 
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- App ---

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [studentSessionName, setStudentSessionName] = useState<string | null>(() => getStoredStudentName());
  const { user } = useFirebase();

  useEffect(() => {
    const handleNameSync = (e: any) => {
      setStudentSessionName(e.detail?.name ?? getStoredStudentName());
    };
    window.addEventListener("eduswathi_student_name_updated", handleNameSync);
    return () => window.removeEventListener("eduswathi_student_name_updated", handleNameSync);
  }, []);

  return (
    <div className="min-h-screen selection:bg-primary selection:text-on-surface">
      <EduSwathiPreloader />
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        studentName={studentSessionName}
      />
      <main className={`${activeTab === "subject-bots" ? "w-full p-0 h-[calc(100dvh-4.5rem)] overflow-hidden flex flex-col" : activeTab === "dashboard" ? "w-full p-0 min-h-[calc(100vh-4.5rem)] overflow-x-hidden flex flex-col" : "py-4 sm:py-6 overflow-x-hidden min-h-[calc(100vh-140px)]"} pb-20 md:pb-0`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1]
            }}
            className={activeTab === "subject-bots" ? "w-full h-full flex flex-col min-h-0" : "w-full flex-1 flex flex-col"}
          >
            {activeTab === "home" && (
              <>
                <Hero 
                  onStartLearning={() => {
                    if (user) {
                      setActiveTab("dashboard");
                    } else {
                      setIsAuthModalOpen(true);
                    }
                  }}
                  onExploreCourses={() => {
                    setActiveTab("courses");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
                <Stats />
                <Features />
                <Pricing />
                <FAQ />
              </>
            )}
            {activeTab === "about" && <AboutView setActiveTab={setActiveTab} />}
            {activeTab === "courses" && <CoursesView />}
            {activeTab === "subject-bots" && (
              <SubjectChatbotsView 
                onNavigateConsole={() => {
                  setActiveTab("dashboard");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }} 
              />
            )}
            {activeTab === "dashboard" && (
              <DashboardView 
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onNavigateTab={setActiveTab}
              />
            )}
            {activeTab === "privacy" && (
              <PrivacyPolicyView 
                onNavigateHome={() => {
                  setActiveTab("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onNavigateToTerms={() => {
                  setActiveTab("terms");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
            {activeTab === "terms" && (
              <TermsOfServiceView 
                onNavigateHome={() => {
                  setActiveTab("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onNavigateToPrivacy={() => {
                  setActiveTab("privacy");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      {activeTab !== "dashboard" && activeTab !== "subject-bots" && <Footer setActiveTab={setActiveTab} />}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <PwaInstallPrompt />
      <SimpleVoiceWelcome onNameIdentified={(name) => setStudentSessionName(name)} />
    </div>
  );
}
