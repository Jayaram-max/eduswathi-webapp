import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle, 
  Brain, 
  Target, 
  FileText, 
  TrendingUp, 
  Zap, 
  Layers, 
  MessageSquare,
  Search,
  Award,
  Check
} from "lucide-react";
import { EduSwathiIcon } from "./EduSwathiLogo";

/**
 * 3D Isometric Stacked Textbooks & NCERT Syllabus Companion Visual
 */
const BOOK_DETAILS: Record<string, {
  subject: string;
  badge: string;
  weightage: string;
  keyTopic: string;
  formula: string;
  color: string;
  dialogue: {
    question: string;
    chapter: string;
    answer: string;
  };
}> = {
  PHYSICS: {
    subject: "Physics Vol II",
    badge: "9 MARKS",
    weightage: "Ch 6: Electromagnetic Induction",
    keyTopic: "Faraday & Lenz's Laws",
    formula: "ε = -dΦB/dt",
    color: "bg-primary",
    dialogue: {
      question: "Why does Faraday's law have a negative sign in Ch 6?",
      chapter: "Lenz's Law • NCERT Physics Page 208",
      answer: "Nature opposes the change! The negative sign means the induced current fights whatever motion created it — just like regenerative braking on an electric vehicle."
    }
  },
  CHEMISTRY: {
    subject: "Chemistry Part I",
    badge: "8 MARKS",
    weightage: "Ch 2: Electrochemistry",
    keyTopic: "Nernst Equation & EMF",
    formula: "Ecell = E° - (0.0591/n) log Q",
    color: "bg-[#DDD6FE]",
    dialogue: {
      question: "Why is molarity temperature-dependent while molality is not?",
      chapter: "Solutions & Thermodynamics • NCERT Chem Page 39",
      answer: "Volume expands and contracts with temperature, changing molarity. Mass in molality remains strictly temperature-invariant!"
    }
  },
  MATHEMATICS: {
    subject: "Mathematics II",
    badge: "11 MARKS",
    weightage: "Ch 7: Integrals & Calculus",
    keyTopic: "Definite Integral Substitution",
    formula: "∫ u·v dx = u∫v - ∫(u'∫v)dx",
    color: "bg-[#BAE6FD]",
    dialogue: {
      question: "How do I choose u and v in integration by parts?",
      chapter: "ILATE Rule • NCERT Mathematics Page 331",
      answer: "Follow ILATE: Inverse, Logarithmic, Algebraic, Trigonometric, Exponential. Pick whichever appears first in this hierarchy as u!"
    }
  },
  BIOLOGY: {
    subject: "Biology NCERT",
    badge: "9 MARKS",
    weightage: "Ch 6: Molecular Inheritance",
    keyTopic: "DNA Replication & Semiconservative Model",
    formula: "5' ➔ 3' Directional Synthesis",
    color: "bg-[#BBF7D0]",
    dialogue: {
      question: "Why does the lagging strand synthesize in Okazaki fragments?",
      chapter: "Replication Fork • NCERT Biology Page 106",
      answer: "DNA polymerase synthesizes only from 5' to 3'. Because parent DNA is antiparallel, the lagging template must replicate in short discontinuous fragments!"
    }
  }
};

const Hero3DScene: React.FC = () => {
  const [activeBook, setActiveBook] = useState<string>("PHYSICS");
  const activeDetails = BOOK_DETAILS[activeBook] || BOOK_DETAILS.PHYSICS;

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Ambient lime glow backdrop */}
      <div className="absolute -inset-4 bg-primary/25 rounded-3xl blur-2xl pointer-events-none" />

      {/* Main 3D Card Stage */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white border-3 border-on-surface rounded-3xl p-6 sm:p-8 shadow-brutalist-lg overflow-hidden"
      >
        {/* Subtle grid texture */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(26, 28, 28, 0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(26, 28, 28, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px"
          }}
        />

        {/* Top Status Header */}
        <div className="relative flex items-center justify-between pb-4 mb-6 border-b-2 border-on-surface/10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary border border-on-surface animate-pulse" />
            <span className="font-mono text-xs font-black uppercase text-on-surface">
              PUC II TEXTBOOK ENGINE
            </span>
          </div>
          <span className="px-2.5 py-0.5 bg-surface-container font-mono text-[10px] font-bold border border-on-surface/20 rounded-full">
            LIVE NCERT SYLLABUS LINK
          </span>
        </div>

        {/* 3D Composition Area */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* LEFT: 3D Stacked Textbooks with isometric perspective */}
          <div className="relative z-10 w-full sm:w-52 flex flex-col justify-end space-y-[-10px] pt-2">
            
            {/* 1. TOP BOOK: PHYSICS (Bright Lime, Active) */}
            <motion.div
              whileHover={{ x: 6, scale: 1.02 }}
              onClick={() => setActiveBook("PHYSICS")}
              className={`cursor-pointer transition-all duration-200 transform -rotate-2 ${
                activeBook === "PHYSICS" ? "ring-2 ring-on-surface z-40" : "z-30 opacity-90"
              }`}
            >
              <div className="relative bg-primary border-2 border-on-surface rounded-lg p-3 shadow-brutalist-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black tracking-widest text-on-surface uppercase">
                    PHYSICS
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.2 rounded border border-on-surface">
                    VOL II
                  </span>
                </div>
                <div className="h-1 bg-on-surface/20 rounded mt-1.5 w-3/4" />
                <div className="absolute right-0 top-1 bottom-1 w-2 bg-amber-50 border-l border-on-surface/30 rounded-r" />
              </div>
            </motion.div>

            {/* 2. CHEMISTRY BOOK (Violet / Deep Indigo) */}
            <motion.div
              whileHover={{ x: 6, scale: 1.02 }}
              onClick={() => setActiveBook("CHEMISTRY")}
              className={`cursor-pointer transition-all duration-200 transform rotate-1 ${
                activeBook === "CHEMISTRY" ? "ring-2 ring-on-surface z-30" : "z-20 opacity-90"
              }`}
            >
              <div className="relative bg-[#DDD6FE] border-2 border-on-surface rounded-lg p-3 shadow-brutalist-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black tracking-widest text-purple-950 uppercase">
                    CHEMISTRY
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.2 rounded border border-on-surface">
                    PART I
                  </span>
                </div>
                <div className="h-1 bg-on-surface/20 rounded mt-1.5 w-2/3" />
                <div className="absolute right-0 top-1 bottom-1 w-2 bg-amber-50 border-l border-on-surface/30 rounded-r" />
              </div>
            </motion.div>

            {/* 3. MATHEMATICS BOOK (Sky Blue) */}
            <motion.div
              whileHover={{ x: 6, scale: 1.02 }}
              onClick={() => setActiveBook("MATHEMATICS")}
              className={`cursor-pointer transition-all duration-200 transform -rotate-1 ${
                activeBook === "MATHEMATICS" ? "ring-2 ring-on-surface z-20" : "z-10 opacity-90"
              }`}
            >
              <div className="relative bg-[#BAE6FD] border-2 border-on-surface rounded-lg p-3 shadow-brutalist-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black tracking-widest text-blue-950 uppercase">
                    MATHEMATICS
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.2 rounded border border-on-surface">
                    CALCULUS
                  </span>
                </div>
                <div className="h-1 bg-on-surface/20 rounded mt-1.5 w-4/5" />
                <div className="absolute right-0 top-1 bottom-1 w-2 bg-amber-50 border-l border-on-surface/30 rounded-r" />
              </div>
            </motion.div>

            {/* 4. BIOLOGY BOOK (Foundational Emerald Green) */}
            <motion.div
              whileHover={{ x: 6, scale: 1.02 }}
              onClick={() => setActiveBook("BIOLOGY")}
              className={`cursor-pointer transition-all duration-200 transform rotate-0 ${
                activeBook === "BIOLOGY" ? "ring-2 ring-on-surface z-10" : "z-0 opacity-90"
              }`}
            >
              <div className="relative bg-[#BBF7D0] border-2 border-on-surface rounded-lg p-3 shadow-brutalist-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black tracking-widest text-emerald-950 uppercase">
                    BIOLOGY
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.2 rounded border border-on-surface">
                    NCERT
                  </span>
                </div>
                <div className="h-1 bg-on-surface/20 rounded mt-1.5 w-1/2" />
                <div className="absolute right-0 top-1 bottom-1 w-2 bg-amber-50 border-l border-on-surface/30 rounded-r" />
              </div>
            </motion.div>

          </div>

          {/* RIGHT: High-Precision Textbook Intelligence Card */}
          <div className="w-full sm:flex-1 bg-surface-container/60 border-2 border-on-surface rounded-2xl p-4 shadow-brutalist-sm">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="font-mono text-[10px] font-black uppercase text-on-surface flex items-center gap-1.5">
                <BookOpen size={13} className="text-primary-dark" />
                {activeDetails.subject}
              </span>
              <span className="px-2 py-0.5 bg-primary text-on-surface font-mono text-[9px] font-black uppercase rounded border border-on-surface shadow-xs">
                {activeDetails.badge}
              </span>
            </div>

            <div className="space-y-2">
              <div className="bg-white border border-on-surface/30 rounded-lg p-2.5">
                <p className="text-[10px] font-mono font-bold text-secondary uppercase tracking-wider">
                  Target Blueprint Chapter
                </p>
                <p className="text-xs font-bold text-on-surface mt-0.5">
                  {activeDetails.weightage}
                </p>
              </div>

              <div className="bg-white border border-on-surface/30 rounded-lg p-2.5 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-mono font-bold text-secondary uppercase tracking-wider">
                    Core Formula / Principle
                  </p>
                  <p className="font-mono text-xs font-black text-on-surface mt-0.5">
                    {activeDetails.formula}
                  </p>
                </div>
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/30 border border-on-surface/60 flex items-center justify-center text-xs font-black">
                  ✦
                </span>
              </div>
            </div>

            <p className="mt-2.5 text-[9px] font-mono text-center text-secondary uppercase tracking-wider">
              Click any textbook to switch syllabus view
            </p>
          </div>

        </div>

        {/* Floating AI Chat Panel (Student question & AI Tutor explanation) */}
        <motion.div
          key={activeBook}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mt-6 pt-4 border-t-2 border-on-surface/10 space-y-3"
        >
          {/* Student Question Bubble */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-surface-container border border-on-surface flex items-center justify-center shrink-0 text-[10px] font-bold">
              👨‍🎓
            </div>
            <div className="bg-surface-container border border-on-surface/20 rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs text-on-surface font-sans shadow-sm">
              <span className="font-bold text-on-surface">Student:</span> "{activeDetails.dialogue.question}"
            </div>
          </div>

          {/* AI Tutor Response Bubble */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary border border-on-surface flex items-center justify-center shrink-0">
              <span className="text-[10px] font-black">⚡</span>
            </div>
            <div className="bg-primary/20 border-2 border-on-surface rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs text-on-surface font-sans shadow-brutalist-sm">
              <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono font-bold text-primary-dark">
                <EduSwathiIcon size={12} />
                <span>{activeDetails.dialogue.chapter}</span>
              </div>
              <p className="leading-snug">
                "{activeDetails.dialogue.answer}"
              </p>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

/**
 * Main AboutView Component
 */
export interface AboutViewProps {
  setActiveTab?: (tab: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setActiveTab }) => {
  const handleNavigate = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-on-surface">
      
      {/* Background Subtle Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(26, 28, 28, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(26, 28, 28, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px"
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* ========================================================= */}
        {/* 1. HERO SECTION: LEARNING, MADE PERSONAL. MADE SIMPLE.   */}
        {/* ========================================================= */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center mb-24 sm:mb-32">
          
          {/* Left Column: Typography & Intent */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/20 border-2 border-on-surface rounded-full shadow-brutalist-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-primary border border-on-surface animate-pulse" />
              <span className="font-mono text-xs font-black uppercase tracking-wider text-on-surface">
                THE EDUSWATHI PLATFORM
              </span>
            </div>

            {/* Requested Hero Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.04] font-display tracking-tight text-on-surface">
              LEARNING, <br />
              <span className="relative inline-block text-on-surface">
                MADE PERSONAL.
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/60 -z-10 -rotate-1 rounded" />
              </span> <br />
              <span className="text-primary-dark">MADE SIMPLE.</span>
            </h1>

            {/* Requested Short Description */}
            <p className="text-lg sm:text-xl text-secondary leading-relaxed font-sans max-w-2xl">
              EduSwathi turns your textbooks into an intelligent learning companion — helping you understand, practice, and learn at your own pace.
            </p>

            {/* Replacement for FAST STATS: YOUR TEXTBOOK. YOUR AI TUTOR. */}
            <div className="pt-2">
              <div className="p-5 sm:p-6 bg-surface border-2 border-on-surface rounded-2xl shadow-brutalist space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-on-surface">
                      YOUR TEXTBOOK. <br className="hidden sm:inline" />
                      <span className="text-primary-dark">YOUR AI TUTOR.</span>
                    </h2>
                  </div>
                  <span className="font-mono text-xs font-bold text-secondary uppercase bg-white px-3 py-1 border border-on-surface/20 rounded-full w-fit">
                    Karnataka 2nd PUC
                  </span>
                </div>

                {/* Requested Three Small Feature Pills */}
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase text-on-surface shadow-brutalist-sm hover:-translate-y-0.5 transition-transform">
                    <BookOpen size={14} className="text-primary-dark" />
                    ASK YOUR TEXTBOOK
                  </span>
                  
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase text-on-surface shadow-brutalist-sm hover:-translate-y-0.5 transition-transform">
                    <Brain size={14} className="text-on-surface" />
                    UNDERSTAND CONCEPTS
                  </span>
                  
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase text-on-surface shadow-brutalist-sm hover:-translate-y-0.5 transition-transform">
                    <Target size={14} className="text-primary-dark" />
                    PRACTICE SMARTER
                  </span>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: 3D Illustration & Textbooks */}
          <div className="lg:col-span-5">
            <Hero3DScene />
          </div>

        </div>

        {/* ========================================================= */}
        {/* 2. HOW EDUSWATHI HELPS (THREE LARGE CARDS)               */}
        {/* ========================================================= */}
        <div className="mb-28 sm:mb-36">
          
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-on-surface/20 rounded-full font-mono text-xs font-bold uppercase text-secondary">
              <span>✦</span> THREE CORE CAPABILITIES
            </div>
            <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-on-surface">
              HOW EDUSWATHI HELPS
            </h2>
            <p className="text-secondary font-sans text-base sm:text-lg">
              Engineered specifically for science students who need direct mastery over syllabus blueprints, question formats, and foundational intuition.
            </p>
          </div>

          {/* 3 Large Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Card 01 — LEARN */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-3 border-on-surface rounded-3xl p-8 shadow-brutalist flex flex-col justify-between hover:shadow-brutalist-lg transition-all"
            >
              <div>
                {/* Number & Icon Pill */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-primary border-2 border-on-surface rounded-2xl flex items-center justify-center font-mono font-black text-2xl text-on-surface shadow-brutalist-sm">
                    01
                  </div>
                  <span className="p-3 bg-surface-container border-2 border-on-surface/10 rounded-2xl text-on-surface">
                    <BookOpen size={24} />
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-on-surface mb-3">
                  LEARN
                </h3>
                
                <p className="text-base text-secondary leading-relaxed font-sans mb-6">
                  “Ask questions directly from your textbook and get simple explanations.”
                </p>

                {/* Visual 3D Miniature Snippet */}
                <div className="bg-surface border-2 border-on-surface/15 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-black text-on-surface">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span>INSTANT TEXTBOOK CITATION</span>
                  </div>
                  <div className="bg-white border border-on-surface/10 rounded-xl p-3 text-xs text-secondary font-sans">
                    <span className="font-bold text-on-surface">Q:</span> "How does a galvanometer convert into an ammeter?"
                    <div className="mt-1.5 pt-1.5 border-t border-on-surface/10 text-primary-dark font-medium flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>By connecting a low shunt resistance in parallel!</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-on-surface/10 flex items-center justify-between text-xs font-mono font-bold text-on-surface/70">
                <span>CHAPTER QUERIES</span>
                <span className="text-primary-dark font-black">UNLIMITED ✦</span>
              </div>
            </motion.div>

            {/* Card 02 — PRACTICE */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-3 border-on-surface rounded-3xl p-8 shadow-brutalist flex flex-col justify-between hover:shadow-brutalist-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-white border-2 border-on-surface rounded-2xl flex items-center justify-center font-mono font-black text-2xl text-on-surface shadow-brutalist-sm">
                    02
                  </div>
                  <span className="p-3 bg-primary/20 border-2 border-on-surface/10 rounded-2xl text-primary-dark">
                    <FileText size={24} />
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-on-surface mb-3">
                  PRACTICE
                </h3>
                
                <p className="text-base text-secondary leading-relaxed font-sans mb-6">
                  “Generate questions, quizzes and revision material from what you’re studying.”
                </p>

                {/* Visual 3D Miniature Snippet */}
                <div className="bg-surface border-2 border-on-surface/15 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between font-mono text-[11px] font-black text-on-surface">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>PUC BLUEPRINT QUIZ</span>
                    </span>
                    <span className="text-secondary text-[10px]">3 MARKS</span>
                  </div>
                  <div className="bg-white border border-on-surface/10 rounded-xl p-3 text-xs text-secondary font-sans space-y-1.5">
                    <div className="flex items-center gap-1.5 text-on-surface font-semibold">
                      <span className="w-4 h-4 rounded-full bg-primary border border-on-surface flex items-center justify-center text-[9px] font-black shrink-0">✓</span>
                      <span>Derive mirror equation for concave mirror</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface/70">
                      <span className="w-4 h-4 rounded-full bg-surface border border-on-surface/30 flex items-center justify-center text-[9px] shrink-0">○</span>
                      <span>Calculate focal length with sign convention</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-on-surface/10 flex items-center justify-between text-xs font-mono font-bold text-on-surface/70">
                <span>PYQ & MOCK PAPERS</span>
                <span className="text-primary-dark font-black">2018–2025 ✦</span>
              </div>
            </motion.div>

            {/* Card 03 — MASTER */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-3 border-on-surface rounded-3xl p-8 shadow-brutalist flex flex-col justify-between hover:shadow-brutalist-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-primary border-2 border-on-surface rounded-2xl flex items-center justify-center font-mono font-black text-2xl text-on-surface shadow-brutalist-sm">
                    03
                  </div>
                  <span className="p-3 bg-surface-container border-2 border-on-surface/10 rounded-2xl text-on-surface">
                    <TrendingUp size={24} />
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-on-surface mb-3">
                  MASTER
                </h3>
                
                <p className="text-base text-secondary leading-relaxed font-sans mb-6">
                  “Track what you understand and focus on the concepts that need more work.”
                </p>

                {/* Visual 3D Miniature Snippet */}
                <div className="bg-surface border-2 border-on-surface/15 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between font-mono text-[11px] font-black text-on-surface">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span>TOPIC MASTERY ENGINE</span>
                    </span>
                    <span className="font-bold text-primary-dark">86% READY</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[10px] font-mono font-bold text-on-surface mb-1">
                        <span>Wave Optics</span>
                        <span>92%</span>
                      </div>
                      <div className="h-2 bg-surface-container border border-on-surface/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[92%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-mono font-bold text-secondary mb-1">
                        <span>Ray Optics (Revise Prism)</span>
                        <span className="text-amber-700 font-bold">Needs Polish</span>
                      </div>
                      <div className="h-2 bg-surface-container border border-on-surface/20 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 w-[58%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-on-surface/10 flex items-center justify-between text-xs font-mono font-bold text-on-surface/70">
                <span>WEAK CONCEPT RADAR</span>
                <span className="text-primary-dark font-black">AUTOMATED ✦</span>
              </div>
            </motion.div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* 3. NOT ANOTHER AI CHATBOT. (FLOW & PRODUCT REALITY)       */}
        {/* ========================================================= */}
        <div className="bg-surface border-3 border-on-surface rounded-3xl p-8 sm:p-12 md:p-16 shadow-brutalist-lg mb-20 relative overflow-hidden">
          
          {/* Top Pill & Headline */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-18">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-on-surface rounded-full font-mono text-xs font-black uppercase shadow-brutalist-sm">
              <Zap size={14} className="text-primary-dark" />
              ACCURACY OVER HALLUCINATIONS
            </span>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-on-surface">
              NOT ANOTHER AI CHATBOT.
            </h2>
            
            <p className="text-xl sm:text-2xl text-secondary font-sans font-medium">
              EduSwathi is built around your learning material.
            </p>
          </div>

          {/* Requested Visual Flow: TEXTBOOK → ASK → UNDERSTAND → PRACTICE → MASTER */}
          <div className="mb-14">
            <div className="text-center font-mono text-xs font-bold uppercase tracking-widest text-secondary mb-6">
              THE 5-STEP GROUNDED MASTERY PIPELINE
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
              
              {/* Step 1: TEXTBOOK */}
              <div className="bg-white border-2 border-on-surface rounded-2xl p-5 shadow-brutalist-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
                <div>
                  <div className="w-9 h-9 bg-primary/20 border border-on-surface rounded-lg flex items-center justify-center font-mono font-black text-sm text-on-surface mb-3">
                    01
                  </div>
                  <div className="font-mono text-sm font-black uppercase text-on-surface mb-1">
                    TEXTBOOK
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Karnataka 2nd PUC Science syllabus & NCERT ground truth.
                  </p>
                </div>
                <div className="hidden lg:flex justify-end pt-3 text-on-surface/30">
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Step 2: ASK */}
              <div className="bg-white border-2 border-on-surface rounded-2xl p-5 shadow-brutalist-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
                <div>
                  <div className="w-9 h-9 bg-primary/20 border border-on-surface rounded-lg flex items-center justify-center font-mono font-black text-sm text-on-surface mb-3">
                    02
                  </div>
                  <div className="font-mono text-sm font-black uppercase text-on-surface mb-1">
                    ASK
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Ask questions naturally in English or Kannada anytime.
                  </p>
                </div>
                <div className="hidden lg:flex justify-end pt-3 text-on-surface/30">
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Step 3: UNDERSTAND */}
              <div className="bg-white border-2 border-on-surface rounded-2xl p-5 shadow-brutalist-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
                <div>
                  <div className="w-9 h-9 bg-primary border border-on-surface rounded-lg flex items-center justify-center font-mono font-black text-sm text-on-surface mb-3">
                    03
                  </div>
                  <div className="font-mono text-sm font-black uppercase text-on-surface mb-1">
                    UNDERSTAND
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Step-by-step Socratic breakdowns that build intuition.
                  </p>
                </div>
                <div className="hidden lg:flex justify-end pt-3 text-on-surface/30">
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Step 4: PRACTICE */}
              <div className="bg-white border-2 border-on-surface rounded-2xl p-5 shadow-brutalist-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
                <div>
                  <div className="w-9 h-9 bg-primary/20 border border-on-surface rounded-lg flex items-center justify-center font-mono font-black text-sm text-on-surface mb-3">
                    04
                  </div>
                  <div className="font-mono text-sm font-black uppercase text-on-surface mb-1">
                    PRACTICE
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Generate MCQs, 2-mark & 5-mark exam-format questions.
                  </p>
                </div>
                <div className="hidden lg:flex justify-end pt-3 text-on-surface/30">
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Step 5: MASTER */}
              <div className="bg-primary border-2 border-on-surface rounded-2xl p-5 shadow-brutalist-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
                <div>
                  <div className="w-9 h-9 bg-white border border-on-surface rounded-lg flex items-center justify-center font-mono font-black text-sm text-on-surface mb-3">
                    05
                  </div>
                  <div className="font-mono text-sm font-black uppercase text-on-surface mb-1">
                    MASTER
                  </div>
                  <p className="text-xs text-on-surface leading-relaxed font-medium">
                    Review progress, fix weak spots, and walk into exam day confident.
                  </p>
                </div>
                <div className="hidden lg:flex justify-end pt-3 text-on-surface">
                  <Award size={18} />
                </div>
              </div>

            </div>
          </div>

          {/* Comparison Matrix: Generic AI vs EduSwathi */}
          <div className="grid md:grid-cols-2 gap-6 bg-white border-2 border-on-surface rounded-2xl p-6 sm:p-8">
            
            {/* Generic Chatbot */}
            <div className="space-y-4 pb-6 md:pb-0 md:pr-6 md:border-r border-on-surface/10">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-black flex items-center justify-center text-xs">
                  ✕
                </span>
                <h4 className="font-mono text-sm font-black uppercase text-secondary">
                  GENERIC CHATBOTS
                </h4>
              </div>
              <ul className="space-y-2.5 text-sm text-secondary font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Hallucinates formulas not present in your actual curriculum.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Provides college-level or unstructured essays when you need a 3-mark answer.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Zero awareness of Karnataka Board marks distribution or blueprints.</span>
                </li>
              </ul>
            </div>

            {/* EduSwathi */}
            <div className="space-y-4 pt-6 md:pt-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-surface font-black flex items-center justify-center text-xs border border-on-surface">
                  ✓
                </span>
                <h4 className="font-mono text-sm font-black uppercase text-on-surface">
                  EDUSWATHI SYSTEM
                </h4>
              </div>
              <ul className="space-y-2.5 text-sm text-on-surface font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-primary-dark font-black">✦</span>
                  <span className="font-medium">Direct citations to chapter pages from your exact Karnataka textbooks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-dark font-black">✦</span>
                  <span className="font-medium">Answers structured according to official scoring schemes & key points.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-dark font-black">✦</span>
                  <span className="font-medium">Socratic explanations that build step-by-step student confidence.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Call to Action Banner */}
        <div className="border-3 border-on-surface bg-primary rounded-3xl p-8 sm:p-12 shadow-brutalist flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-on-surface">
              Ready to turn your textbooks into an active companion?
            </h3>
            <p className="text-sm sm:text-base text-on-surface/80 font-sans">
              Join students across Karnataka mastering Physics, Chemistry, Math & Biology.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => handleNavigate("dashboard")}
              className="px-6 py-3.5 bg-white border-2 border-on-surface rounded-2xl font-mono text-sm font-black uppercase shadow-brutalist-sm hover:shadow-brutalist hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>EXPLORE DASHBOARD</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
