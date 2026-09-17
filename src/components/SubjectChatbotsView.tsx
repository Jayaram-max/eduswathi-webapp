import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TypewriterMessage } from "./TypewriterMessage";
import { speakText } from "../services/voiceAgentService";
import { userTimingManager } from "../services/userTimingService";
import {
  Calculator,
  FlaskConical,
  Dna,
  Code,
  BookOpen,
  Send,
  Loader2,
  Trash2,
  Download,
  Copy,
  Check,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Zap,
  ArrowRight,
  TrendingUp,
  Landmark,
  Compass,
  Layers,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  SlidersHorizontal,
  Sliders
} from "lucide-react";

export interface SubjectConfig {
  id: string;
  name: string;
  shortName: string;
  title: string;
  tagline: string;
  category: string;
  apiEndpoint: string;
  colorBg: string;
  colorBorder: string;
  colorAccent: string;
  badge: string;
  icon: React.ElementType;
  starterPrompts: string[];
  symbolHelpers: string[];
  initialGreeting: string;
  coreConcepts: string[];
  ragKeyName: "MATH_API_KEY" | "PHYSICS_API_KEY" | "CHEMISTRY_API_KEY" | "BIOLOGY_API_KEY" | "CS_API_KEY";
}

export const SUBJECTS: SubjectConfig[] = [
  {
    id: "math",
    name: "Mathematics",
    shortName: "Math",
    title: "Socratic Math & Proofs AI",
    tagline: "Step-by-step calculus, linear algebra, statistics & formal mathematical derivations.",
    category: "STEM Core",
    apiEndpoint: "/api/chat/math",
    ragKeyName: "MATH_API_KEY",
    colorBg: "bg-[#AFF833]",
    colorBorder: "border-[#85D40D]",
    colorAccent: "text-on-surface",
    badge: "MATH // 01",
    icon: Calculator,
    starterPrompts: [
      "Derive the Quadratic Formula step-by-step from ax² + bx + c = 0.",
      "Explain eigenvalues & eigenvectors with a 2D geometric analogy.",
      "How does integration by parts relate to the product rule of derivatives?",
      "Solve this limit: lim(x→0) (sin x)/x and explain why L'Hôpital's applies."
    ],
    symbolHelpers: ["x²", "√x", "∫ f(x)dx", "∑", "lim", "dy/dx", "π", "θ", "±", "≠", "≤", "≥", "∞", "∈"],
    initialGreeting: "Greetings! I'm your dedicated Socratic Mathematics AI Tutor. Share any equation, proof, or problem statement, and we'll break down the underlying mechanics together.",
    coreConcepts: ["Calculus I-III", "Linear Algebra", "Probability & Stats", "Discrete Structures", "Differential Equations"]
  },
  {
    id: "physics",
    name: "Physics",
    shortName: "Physics",
    title: "Quantum & Mechanics AI",
    tagline: "Classical mechanics, quantum states, electromagnetism & conservation laws.",
    category: "Physical Sciences",
    apiEndpoint: "/api/chat/physics",
    ragKeyName: "PHYSICS_API_KEY",
    colorBg: "bg-[#70D6FF]",
    colorBorder: "border-[#38B6FF]",
    colorAccent: "text-on-surface",
    badge: "PHYS // 02",
    icon: Compass,
    starterPrompts: [
      "Why does tension spike when suspension cords approach a horizontal angle?",
      "Explain Heisenberg's Uncertainty Principle using wave packet wave numbers.",
      "How do Maxwell's equations predict that electromagnetic waves travel at speed c?",
      "Break down Carnot cycle thermodynamic efficiency and entropy increase."
    ],
    symbolHelpers: ["Δt", "v = d/t", "F = ma", "E = mc²", "λ", "ω", "ħ", "μ", "ρ", "m/s²", "Joules", "Watts"],
    initialGreeting: "Welcome to the Physics Lab! I'm your dedicated Physics AI Tutor. Whether analyzing free-body diagrams, optics, or quantum fields, let's explore the physical universe.",
    coreConcepts: ["Newtonian Mechanics", "Electromagnetism", "Thermodynamics", "Quantum States", "Special Relativity"]
  },
  {
    id: "chemistry",
    name: "Chemistry",
    shortName: "Chemistry",
    title: "Molecular & Reactions AI",
    tagline: "Reaction mechanisms, stoichiometry, orbital hybridizations & kinetics.",
    category: "Chemical Sciences",
    apiEndpoint: "/api/chat/chemistry",
    ragKeyName: "CHEMISTRY_API_KEY",
    colorBg: "bg-[#FF9F1C]",
    colorBorder: "border-[#E07A00]",
    colorAccent: "text-on-surface",
    badge: "CHEM // 03",
    icon: FlaskConical,
    starterPrompts: [
      "Compare SN1 vs SN2 reaction mechanisms: kinetics, solvent effects & carbocation stability.",
      "How do buffer solutions resist pH changes when strong acids are added?",
      "Explain sp3, sp2, and sp hybridization with orbital overlap diagrams.",
      "Calculate the equilibrium constant Kp given partial pressures at 298K."
    ],
    symbolHelpers: ["⇌", "→", "ΔH°", "pH = -log[H⁺]", "Ka", "sp³", "ΔG = ΔH - TΔS", "mol/L", "atm", "e⁻", "pKa"],
    initialGreeting: "Hello! I'm your dedicated Chemistry AI Assistant. Ready to balance equations, map organic synthesis pathways, or delve into thermodynamics.",
    coreConcepts: ["Organic Mechanisms", "Stoichiometry", "Chemical Equilibrium", "Thermodynamics", "Electrochemistry"]
  },
  {
    id: "biology",
    name: "Biology",
    shortName: "Biology",
    title: "Life Sciences & Genetics AI",
    tagline: "Cellular pathways, DNA replication, neural signaling & ecological loops.",
    category: "Life Sciences",
    apiEndpoint: "/api/chat/biology",
    ragKeyName: "BIOLOGY_API_KEY",
    colorBg: "bg-[#2EC4B6]",
    colorBorder: "border-[#1B9E93]",
    colorAccent: "text-on-surface",
    badge: "BIO // 04",
    icon: Dna,
    starterPrompts: [
      "Explain saltatory conduction and why myelin speeds up neural action potentials.",
      "Trace the electron transport chain and ATP synthesis in the inner mitochondrial membrane.",
      "How does CRISPR-Cas9 locate and cleave target DNA sequences?",
      "Walk through the lac operon gene regulation in E. coli under lactose absence/presence."
    ],
    symbolHelpers: ["DNA → RNA → Protein", "ATP → ADP + Pi", "5' → 3'", "Punnett Square", "CRISPR", "Action Potential", "Krebs Cycle"],
    initialGreeting: "Welcome to Life Sciences! I'm your Biology AI Tutor. Ask me about cell biology, molecular genetics, anatomy, or ecology.",
    coreConcepts: ["Cell Biology", "Molecular Genetics", "Neuroscience", "Immunology", "Evolutionary Biology"]
  },
  {
    id: "cs",
    name: "Computer Science",
    shortName: "CS & Code",
    title: "Algorithms & Systems AI",
    tagline: "Data structures, Big-O complexity, software architecture & bug diagnostics.",
    category: "Computing & Tech",
    apiEndpoint: "/api/chat/cs",
    ragKeyName: "CS_API_KEY",
    colorBg: "bg-[#C77DFF]",
    colorBorder: "border-[#9D4EDD]",
    colorAccent: "text-on-surface",
    badge: "COMP // 05",
    icon: Code,
    starterPrompts: [
      "Implement a clean LRU Cache in TypeScript/Python with O(1) get and put operations.",
      "Explain Dynamic Programming with the Knapsack 0/1 problem and state transitions.",
      "Compare B-Trees vs LSM-Trees in database storage engine architectures.",
      "Debug this recursive tree traversal and optimize space complexity from O(N) to O(H)."
    ],
    symbolHelpers: ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "async/await", "def __init__", "class Node", "null", "undefined"],
    initialGreeting: "System initialized. I'm your Computer Science & Engineering AI Coach. Let's write robust code, analyze time complexities, and master systems design.",
    coreConcepts: ["Data Structures", "Dynamic Programming", "System Design", "Databases & Concurrency", "Graph Algorithms"]
  }
];

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

interface SubjectChatbotsViewProps {
  initialSubjectId?: string;
  onNavigateConsole?: () => void;
}

export const SubjectChatbotsView: React.FC<SubjectChatbotsViewProps> = ({
  initialSubjectId = "math",
  onNavigateConsole
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const activeSubject = SUBJECTS.find((s) => s.id === selectedSubjectId) || SUBJECTS[0];

  // Subject chats state indexed by subject ID
  const [subjectChats, setSubjectChats] = useState<Record<string, ChatMessage[]>>(() => {
    const initial: Record<string, ChatMessage[]> = {};
    SUBJECTS.forEach((subj) => {
      try {
        const saved = localStorage.getItem(`edu_subj_chat_${subj.id}`);
        if (saved) {
          initial[subj.id] = JSON.parse(saved);
        } else {
          initial[subj.id] = [
            {
              id: `init-${subj.id}`,
              role: "ai",
              content: subj.initialGreeting,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
        }
      } catch {
        initial[subj.id] = [
          {
            id: `init-${subj.id}`,
            role: "ai",
            content: subj.initialGreeting,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      }
    });
    return initial;
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socraticMode, setSocraticMode] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [latestAiId, setLatestAiId] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [ragStatus, setRagStatus] = useState<Record<string, { keyName: string; configured: boolean; ragDocs: number }> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  const currentMessages = subjectChats[activeSubject.id] || [];

  // Fetch subject RAG status to check dedicated subject API keys
  useEffect(() => {
    fetch("/api/rag/status")
      .then((res) => res.json())
      .then((data) => {
        if (data?.subjects) {
          setRagStatus(data.subjects);
        }
      })
      .catch((err) => console.warn("Could not fetch RAG status:", err));
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(`edu_subj_chat_${activeSubject.id}`, JSON.stringify(currentMessages));
    } catch (e) {
      console.error("Failed to save subject chat to localStorage", e);
    }
  }, [currentMessages, activeSubject.id]);

  // Scroll to bottom on message updates
  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  }, [currentMessages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...currentMessages, userMessage];
    setSubjectChats((prev) => ({
      ...prev,
      [activeSubject.id]: updatedHistory
    }));

    setInputMessage("");
    setIsLoading(true);

    try {
      userTimingManager.setActiveSubject(activeSubject.name);
      userTimingManager.logAdditionalStudy(45, activeSubject.name);
    } catch {
      // Non-blocking
    }

    const aiMessageId = `ai-${Date.now()}`;
    setLatestAiId(aiMessageId);
    const aiPlaceholder: ChatMessage = {
      id: aiMessageId,
      role: "ai",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSubjectChats((prev) => ({
      ...prev,
      [activeSubject.id]: [...updatedHistory, aiPlaceholder]
    }));

    try {
      // Call dedicated Subject API endpoint
      const response = await fetch(activeSubject.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          subject: activeSubject.id,
          socraticMode: socraticMode,
          messages: updatedHistory.map((m) => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        // Fallback to /api/chat with subject payload
        const fallbackResp = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: textToSend,
            subject: activeSubject.id,
            socraticMode: socraticMode
          })
        });

        if (!fallbackResp.ok) {
          throw new Error("Subject AI service is currently unavailable.");
        }

        const reader = fallbackResp.body?.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            accumulated += decoder.decode(value, { stream: true });
            const currentText = accumulated;
            setSubjectChats((prev) => {
              const msgs = prev[activeSubject.id] || [];
              return {
                ...prev,
                [activeSubject.id]: msgs.map((m) =>
                  m.id === aiMessageId ? { ...m, content: currentText } : m
                )
              };
            });
          }
        }
        return;
      }

      // Stream the response directly from the dedicated subject endpoint
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const currentText = accumulated;
          setSubjectChats((prev) => {
            const msgs = prev[activeSubject.id] || [];
            return {
              ...prev,
              [activeSubject.id]: msgs.map((m) =>
                m.id === aiMessageId ? { ...m, content: currentText } : m
              )
            };
          });
        }
      } else {
        const text = await response.text();
        setSubjectChats((prev) => {
          const msgs = prev[activeSubject.id] || [];
          return {
            ...prev,
            [activeSubject.id]: msgs.map((m) =>
              m.id === aiMessageId ? { ...m, content: text || "Understood. Let me walk you through this concept." } : m
            )
          };
        });
      }
    } catch (err: any) {
      console.error("Subject chat error:", err);
      setSubjectChats((prev) => {
        const msgs = prev[activeSubject.id] || [];
        return {
          ...prev,
          [activeSubject.id]: msgs.map((m) =>
            m.id === aiMessageId
              ? {
                  ...m,
                  content:
                    "⚠️ Notice: The dedicated subject neural node could not be reached directly. Please verify that your API key is configured or retry your inquiry."
                }
              : m
          )
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const resetMsgs: ChatMessage[] = [
      {
        id: `init-${activeSubject.id}-${Date.now()}`,
        role: "ai",
        content: activeSubject.initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setSubjectChats((prev) => ({
      ...prev,
      [activeSubject.id]: resetMsgs
    }));
    try {
      localStorage.setItem(`edu_subj_chat_${activeSubject.id}`, JSON.stringify(resetMsgs));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadTranscript = () => {
    const formatted = currentMessages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.role === "user" ? "STUDENT" : `${activeSubject.name.toUpperCase()} AI TUTOR`}:\n${m.content}\n`
      )
      .join("\n" + "-".repeat(50) + "\n\n");

    const header = `=====================================================\nEDUSWATHI SUBJECT TUTOR TRANSCRIPT: ${activeSubject.name.toUpperCase()}\nExported: ${new Date().toLocaleString()}\nSubject API: ${activeSubject.apiEndpoint}\n=====================================================\n\n`;

    const blob = new Blob([header + formatted], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Eduswathi_${activeSubject.id}_Chat_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakMessage = (id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    const cleanText = text.replace(/[*#`_\[\]]/g, "");
    setSpeakingId(id);
    speakText(cleanText, {
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null)
    });
  };

  const insertSymbol = (sym: string) => {
    setInputMessage((prev) => prev + (prev && !prev.endsWith(" ") ? " " : "") + sym + " ");
  };

  const ActiveIcon = activeSubject.icon;

  return (
    <div className="h-full w-full flex flex-col bg-surface overflow-hidden p-2 sm:p-3 md:p-4 gap-2 sm:gap-3" id="subject-bots-page-container">
      {/* Top Header & Subject Switcher Strip */}
      <header className="bg-white border-2 sm:border-3 border-on-surface rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-brutalist flex flex-col md:flex-row md:items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 sm:py-1 bg-primary border-2 border-on-surface rounded-md shadow-brutalist-sm inline-flex items-center gap-1">
              <Sparkles size={12} /> SUBJECT AI TUTORS
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] font-black px-2 py-0.5 bg-surface border border-on-surface rounded text-secondary uppercase">
              5 STEM APIS
            </span>
          </div>

          {/* Socratic Mode Toggle on Mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setSocraticMode(!socraticMode)}
              className={`px-2 py-1 rounded-md border border-on-surface font-mono text-[9px] font-black uppercase flex items-center gap-1 cursor-pointer ${
                socraticMode ? "bg-amber-200 text-amber-950" : "bg-surface text-secondary"
              }`}
            >
              <Zap size={11} /> {socraticMode ? "Socratic" : "Direct"}
            </button>
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="px-2 py-1 bg-primary border border-on-surface rounded-md font-mono text-[9px] font-black uppercase flex items-center gap-1"
            >
              <SlidersHorizontal size={11} /> {showMobileSidebar ? "Chat" : "Tools"}
            </button>
          </div>
        </div>

        {/* 5 Subject Selector Buttons in a Compact Horizontal Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {SUBJECTS.map((subject) => {
            const isSelected = subject.id === activeSubject.id;
            const IconComp = subject.icon;
            return (
              <button
                key={subject.id}
                onClick={() => {
                  setSelectedSubjectId(subject.id);
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setSpeakingId(null);
                }}
                className={`px-2.5 py-1 sm:py-1.5 rounded-lg border-2 border-on-surface font-mono text-[11px] sm:text-xs font-black uppercase transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSelected
                    ? `${subject.colorBg} shadow-brutalist-sm -translate-y-0.5 text-on-surface`
                    : "bg-surface hover:bg-white text-secondary"
                }`}
              >
                <IconComp size={13} strokeWidth={2.5} />
                <span>{subject.shortName}</span>
                {isSelected && <CheckCircle2 size={12} className="stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Desktop Controls: RAG status, Socratic toggle, Transcript download, Clear */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="px-2 py-1 bg-surface border border-on-surface rounded-md font-mono text-[10px] font-black uppercase flex items-center gap-1.5 text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-on-surface">{activeSubject.ragKeyName}</span>
          </div>

          <button
            onClick={() => setSocraticMode(!socraticMode)}
            className={`px-2.5 py-1 rounded-lg border-2 border-on-surface font-mono text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer transition-all shadow-brutalist-sm hover:shadow-brutalist ${
              socraticMode ? "bg-amber-200 text-amber-950" : "bg-surface text-secondary"
            }`}
            title="Toggle between Socratic step-by-step guidance and direct solution derivations"
          >
            <Zap size={12} className={socraticMode ? "text-amber-700" : ""} />
            <span>{socraticMode ? "Socratic Mode" : "Direct Mode"}</span>
          </button>

          <button
            onClick={handleDownloadTranscript}
            className="p-1.5 bg-surface hover:bg-white border-2 border-on-surface rounded-lg font-mono text-[10px] font-black text-on-surface shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer"
            title="Export Subject Transcript (.txt)"
          >
            <Download size={13} />
          </button>

          <button
            onClick={handleClearHistory}
            className="p-1.5 bg-surface hover:bg-rose-100 border-2 border-on-surface rounded-lg font-mono text-[10px] font-black text-on-surface shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer"
            title="Reset Chat History"
          >
            <Trash2 size={13} />
          </button>

          {onNavigateConsole && (
            <button
              onClick={onNavigateConsole}
              className="px-2.5 py-1 bg-surface hover:bg-surface-container border-2 border-on-surface rounded-lg font-mono text-[10px] font-black uppercase shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer flex items-center gap-1"
            >
              Console <ChevronRight size={12} />
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Split (Fits inside page without page scrollbar) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 overflow-hidden">
        
        {/* Left Sidebar: Subject Info, Symbols Toolbar & High-Yield Prompts (4 cols) */}
        <div className={`lg:col-span-4 h-full flex flex-col min-h-0 overflow-y-auto pr-1 space-y-2.5 ${
          showMobileSidebar ? "block" : "hidden lg:flex"
        }`}>
          
          {/* Active Subject Badge & Details Card */}
          <div className={`p-3.5 sm:p-4 rounded-xl border-2 sm:border-3 border-on-surface ${activeSubject.colorBg} shadow-brutalist-sm space-y-2.5 shrink-0`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white border-2 border-on-surface rounded-lg shadow-brutalist-sm flex items-center justify-center text-on-surface">
                  <ActiveIcon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-on-surface leading-none">
                    {activeSubject.title}
                  </h2>
                  <span className="font-mono text-[9px] font-bold text-on-surface/70 uppercase">
                    {activeSubject.category}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[9px] font-black px-2 py-0.5 bg-white border border-on-surface rounded shadow-brutalist-sm">
                {activeSubject.badge}
              </span>
            </div>

            <p className="font-sans text-[11px] text-on-surface/90 font-medium leading-snug">
              {activeSubject.tagline}
            </p>

            {/* RAG Verification Status */}
            <div className="p-2 bg-white/95 border border-on-surface rounded-lg text-[10px] font-mono flex items-center justify-between">
              <span className="font-bold flex items-center gap-1 text-on-surface">
                <Sparkles size={12} className="text-amber-500" /> RAG Grounding
              </span>
              <span className="text-emerald-800 font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {activeSubject.ragKeyName}
              </span>
            </div>

            {/* Core Subject Modules */}
            <div className="space-y-1">
              <span className="font-mono text-[9px] font-black uppercase text-on-surface/80 block">
                // TOPIC DOMAINS (CLICK TO ASK)
              </span>
              <div className="flex flex-wrap gap-1">
                {activeSubject.coreConcepts.map((concept, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(`Teach me key exam concepts and formulas for ${concept}`)}
                    disabled={isLoading}
                    className="px-2 py-0.5 bg-white hover:bg-primary/30 border border-on-surface rounded font-mono text-[9px] font-bold uppercase text-on-surface shadow-brutalist-sm transition-all cursor-pointer"
                  >
                    {concept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Formula & Symbol Keypad */}
          <div className="bg-white border-2 sm:border-3 border-on-surface rounded-xl p-3 shadow-brutalist-sm space-y-2 shrink-0">
            <span className="font-mono text-[9px] font-black uppercase tracking-wider text-secondary block">
              // QUICK SYMBOLS TOOLBAR (CLICK TO INSERT)
            </span>
            <div className="flex flex-wrap gap-1">
              {activeSubject.symbolHelpers.map((sym, idx) => (
                <button
                  key={idx}
                  onClick={() => insertSymbol(sym)}
                  className="px-2 py-1 bg-surface hover:bg-primary border border-on-surface rounded-md font-mono text-[11px] font-black text-on-surface transition-all active:translate-x-0.5 cursor-pointer"
                  title={`Insert ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Starter Prompts */}
          <div className="bg-white border-2 sm:border-3 border-on-surface rounded-xl p-3 shadow-brutalist-sm space-y-2 flex-1">
            <span className="font-mono text-[9px] font-black uppercase tracking-wider text-secondary block">
              // HIGH-YIELD PROMPTS
            </span>
            <div className="space-y-1.5">
              {activeSubject.starterPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="w-full text-left p-2 bg-surface hover:bg-surface-container border border-on-surface rounded-lg font-sans text-[11px] font-semibold text-on-surface leading-tight transition-all hover:shadow-brutalist-sm cursor-pointer flex items-start justify-between gap-1 group disabled:opacity-50"
                >
                  <span className="line-clamp-2">"{prompt}"</span>
                  <ArrowRight size={12} className="shrink-0 mt-0.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Chat Column: Full-Height Chat Console (8 cols) */}
        <div className={`lg:col-span-8 h-full flex flex-col min-h-0 bg-white border-2 sm:border-3 border-on-surface rounded-xl sm:rounded-2xl shadow-brutalist overflow-hidden ${
          showMobileSidebar ? "hidden lg:flex" : "flex"
        }`}>
          
          {/* Chat Console Sub-Header */}
          <div className="bg-on-surface text-surface p-2.5 sm:p-3 flex items-center justify-between border-b-2 sm:border-b-3 border-on-surface shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 ${activeSubject.colorBg} border-2 border-on-surface rounded-lg flex items-center justify-center text-on-surface shadow-brutalist-sm shrink-0`}>
                <ActiveIcon size={14} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-black text-xs sm:text-sm uppercase leading-none truncate">
                    {activeSubject.name} Socratic Tutor
                  </h3>
                  <span className="font-mono text-[8px] font-black px-1.5 py-0.2 rounded border border-surface/30 bg-white/15 text-primary shrink-0">
                    {activeSubject.ragKeyName}
                  </span>
                </div>
                <span className="font-mono text-[8px] sm:text-[9px] text-surface/70 uppercase block truncate">
                  {activeSubject.apiEndpoint} • Socratic STEM Engine
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="hidden sm:inline-flex font-mono text-[9px] text-emerald-300 items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
              <button
                onClick={handleDownloadTranscript}
                className="p-1.5 hover:bg-white/10 text-surface hover:text-primary rounded transition-colors cursor-pointer"
                title="Export Transcript"
              >
                <Download size={13} />
              </button>
              <button
                onClick={handleClearHistory}
                className="p-1.5 hover:bg-white/10 text-surface hover:text-rose-400 rounded transition-colors cursor-pointer"
                title="Clear Chat"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Messages Scroll View */}
          <div
            ref={chatScrollContainerRef}
            className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-surface/30"
          >
            <AnimatePresence initial={false}>
              {currentMessages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`flex gap-2.5 sm:gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 border-on-surface shrink-0 flex items-center justify-center shadow-brutalist-sm ${
                        isUser
                          ? "bg-white text-on-surface"
                          : `${activeSubject.colorBg} text-on-surface`
                      }`}
                    >
                      {isUser ? (
                        <span className="font-mono text-[10px] font-black">YOU</span>
                      ) : (
                        <ActiveIcon size={15} strokeWidth={2.5} />
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[86%] sm:max-w-[82%] space-y-1 ${isUser ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-1.5 px-1">
                        <span className="font-mono text-[9px] font-black uppercase text-secondary">
                          {isUser ? "Student" : `${activeSubject.shortName} AI Tutor`}
                        </span>
                        <span className="font-mono text-[8px] text-secondary/60">
                          {msg.timestamp}
                        </span>
                      </div>

                      <div
                        className={`p-3 sm:p-4 rounded-xl border-2 border-on-surface font-sans text-xs sm:text-sm leading-relaxed break-words shadow-brutalist-sm whitespace-pre-wrap ${
                          isUser
                            ? "bg-on-surface text-surface font-medium"
                            : "bg-white text-on-surface"
                        }`}
                      >
                        {isUser ? (
                          msg.content
                        ) : msg.content ? (
                          <TypewriterMessage
                            content={msg.content}
                            isStreaming={isLoading && latestAiId === msg.id}
                            animate={latestAiId === msg.id}
                            speedMs={8}
                            onComplete={() => {
                              if (chatScrollContainerRef.current) {
                                chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
                              }
                            }}
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-secondary font-mono text-xs py-0.5">
                            <Loader2 size={13} className="animate-spin text-primary" />
                            <span>Synthesizing Socratic step...</span>
                          </div>
                        )}
                      </div>

                      {/* AI Action toolbar */}
                      {!isUser && msg.content && (
                        <div className="flex items-center gap-2 px-1.5 font-mono text-[9px]">
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="text-secondary hover:text-on-surface transition-colors cursor-pointer flex items-center gap-1 py-0.5 px-1 rounded hover:bg-surface"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check size={10} className="text-emerald-600" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy size={10} /> Copy
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleSpeakMessage(msg.id, msg.content)}
                            className="text-secondary hover:text-on-surface transition-colors cursor-pointer flex items-center gap-1 py-0.5 px-1 rounded hover:bg-surface"
                          >
                            {speakingId === msg.id ? (
                              <>
                                <VolumeX size={10} className="text-rose-500" /> Stop Audio
                              </>
                            ) : (
                              <>
                                <Volume2 size={10} /> Read Aloud
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Prompts Horizontal Pill Strip (Above Input) */}
          <div className="shrink-0 p-1.5 bg-surface/80 border-t-2 border-on-surface/20 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            <span className="font-mono text-[8px] font-black uppercase text-secondary shrink-0 pl-1">
              Suggestions:
            </span>
            {activeSubject.starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="px-2 py-1 bg-white hover:bg-primary/30 border border-on-surface rounded-md font-sans text-[10px] font-medium text-on-surface whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-2xs hover:shadow-brutalist-sm disabled:opacity-50"
              >
                {prompt.length > 38 ? prompt.substring(0, 36) + "..." : prompt}
              </button>
            ))}
          </div>

          {/* Sticky Input Bar at Bottom */}
          <div className="shrink-0 p-2 sm:p-2.5 bg-white border-t-2 sm:border-t-3 border-on-surface">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask ${activeSubject.name} tutor (e.g. proof, formula, concept)...`}
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-surface border-2 border-on-surface rounded-xl font-sans text-xs sm:text-sm font-semibold text-on-surface focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary shadow-inner min-h-[40px]"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className={`px-3.5 sm:px-5 py-2 min-h-[40px] ${activeSubject.colorBg} hover:opacity-90 border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase text-on-surface shadow-brutalist-sm hover:shadow-brutalist active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1.5`}
                aria-label="Send Query"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Send size={14} /> <span className="hidden sm:inline">Ask</span>
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-between text-[9px] font-mono text-secondary px-1 pt-1">
              <span className="truncate">⚡ Grounded via {activeSubject.ragKeyName} • Gemini 2.5 Flash</span>
              <span className="hidden sm:inline">Press Enter to Ask</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
