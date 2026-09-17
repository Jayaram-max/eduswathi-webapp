import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Keyboard,
  User,
  Brain,
  MessageSquare,
  Compass
} from "lucide-react";
import { useVoiceWelcomeAgent } from "../hooks/useVoiceWelcomeAgent";

interface VoiceWelcomeAgentProps {
  onContinueToApp?: (studentName?: string) => void;
  onExploreBots?: () => void;
  isOverlay?: boolean;
  onClose?: () => void;
}

export const VoiceWelcomeAgent: React.FC<VoiceWelcomeAgentProps> = ({
  onContinueToApp,
  onExploreBots,
  isOverlay = false,
  onClose
}) => {
  const {
    stage,
    aiMessage,
    studentTranscript,
    studentName,
    isSpeaking,
    isListening,
    isThinking,
    error,
    isSupported,
    startConversation,
    restartConversation,
    submitNameManually,
    stopVoice
  } = useVoiceWelcomeAgent(false);

  const [typedName, setTypedName] = useState("");
  const [showKeyboardInput, setShowKeyboardInput] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  // Auto-start greeting on mount after a micro delay, or prompt the user if autoplay is blocked
  useEffect(() => {
    const timer = setTimeout(() => {
      // Attempt auto-start greeting flow
      startConversation();
      setHasStartedOnce(true);
    }, 450);
    return () => clearTimeout(timer);
  }, [startConversation]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedName.trim()) {
      submitNameManually(typedName.trim());
      setTypedName("");
    }
  };

  const handleChipClick = (phrase: string) => {
    submitNameManually(phrase);
  };

  return (
    <div
      className={`min-h-screen w-full bg-surface text-on-surface font-sans flex flex-col justify-between selection:bg-primary ${
        isOverlay ? "fixed inset-0 z-50 overflow-y-auto" : "relative"
      }`}
    >
      {/* Background Subtle Neo-Brutalist Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #d4d4d4 1px, transparent 1px), linear-gradient(to bottom, #d4d4d4 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Top Bar: Brand & Quick Navigation */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary border-3 border-on-surface rounded-xl flex items-center justify-center font-display font-black text-xl shadow-brutalist-sm">
            ES
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl uppercase tracking-tight">
                Edu Swathi
              </span>
              <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-primary border border-on-surface rounded text-on-surface shadow-brutalist-sm">
                AI Voice Agent
              </span>
            </div>
            <p className="font-mono text-[11px] text-secondary font-bold">
              Autonomous Voice Welcome Companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-on-surface rounded-xl shadow-brutalist-sm">
              <User size={14} className="text-primary-dark" />
              <span className="font-mono text-xs font-bold text-on-surface">
                {studentName}
              </span>
            </div>
          )}

          <button
            onClick={() => {
              stopVoice();
              if (onContinueToApp) onContinueToApp(studentName || undefined);
              else if (onClose) onClose();
            }}
            className="px-4 py-2 bg-white hover:bg-surface-variant border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase tracking-wider shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer flex items-center gap-2"
          >
            <span>{studentName ? "Enter Console" : "Skip to Website"}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Main Focus Area: AI Avatar, Sound Wave, & Voice Interaction */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-6 py-6 my-auto flex flex-col items-center text-center">
        
        {/* Status Pill */}
        <div className="mb-6">
          <AnimatePresence mode="wait">
            {isSpeaking ? (
              <motion.div
                key="speaking"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary border-2 border-on-surface rounded-full shadow-brutalist-sm font-mono text-xs font-black uppercase tracking-wider"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-on-surface animate-ping" />
                <span>AI Speaking to You</span>
                <Volume2 size={14} className="ml-1" />
              </motion.div>
            ) : isListening ? (
              <motion.div
                key="listening"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-300 border-2 border-on-surface rounded-full shadow-brutalist-sm font-mono text-xs font-black uppercase tracking-wider"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span>Listening to your voice... Speak now</span>
                <Mic size={14} className="ml-1 text-red-700 animate-bounce" />
              </motion.div>
            ) : isThinking ? (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-200 border-2 border-on-surface rounded-full shadow-brutalist-sm font-mono text-xs font-black uppercase tracking-wider"
              >
                <span className="w-2 h-2 bg-on-surface rounded-full animate-spin" />
                <span>Understanding your name...</span>
              </motion.div>
            ) : studentName ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-200 border-2 border-on-surface rounded-full shadow-brutalist-sm font-mono text-xs font-black uppercase tracking-wider text-emerald-900"
              >
                <CheckCircle2 size={14} className="text-emerald-700" />
                <span>Name Verified: {studentName}</span>
              </motion.div>
            ) : (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-on-surface rounded-full shadow-brutalist-sm font-mono text-xs font-black uppercase tracking-wider"
              >
                <Sparkles size={14} className="text-primary-dark" />
                <span>AI Voice Assistant Ready</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Avatar with Interactive Sound Aura */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Animated concentric waves when AI speaks */}
          {isSpeaking && (
            <>
              <motion.div
                animate={{ scale: [1, 1.35, 1.6], opacity: [0.6, 0.3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-44 h-44 rounded-full bg-primary/40 pointer-events-none -z-10"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1.4], opacity: [0.7, 0.35, 0] }}
                transition={{ duration: 1.8, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-44 h-44 rounded-full bg-primary/50 pointer-events-none -z-10"
              />
            </>
          )}

          {/* Animated golden pulse when listening */}
          {isListening && (
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-44 h-44 rounded-full bg-amber-400/30 border-2 border-amber-500/50 pointer-events-none -z-10"
            />
          )}

          {/* Main Avatar Container */}
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-3xl bg-white border-4 border-on-surface shadow-brutalist-lg flex items-center justify-center relative overflow-hidden group">
            {/* Background Gradient Tone */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/30" />

            {/* Swathi AI Character Vector Face */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {/* Eyes with blink / animation */}
              <div className="flex gap-5 mb-2.5">
                <motion.div
                  animate={isSpeaking ? { scaleY: [1, 0.2, 1] } : { scaleY: 1 }}
                  transition={isSpeaking ? { duration: 0.3, repeat: Infinity, repeatDelay: 2 } : {}}
                  className="w-3.5 h-3.5 bg-on-surface rounded-full relative"
                >
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
                </motion.div>
                <motion.div
                  animate={isSpeaking ? { scaleY: [1, 0.2, 1] } : { scaleY: 1 }}
                  transition={isSpeaking ? { duration: 0.3, repeat: Infinity, repeatDelay: 2 } : {}}
                  className="w-3.5 h-3.5 bg-on-surface rounded-full relative"
                >
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
                </motion.div>
              </div>

              {/* Mouth with speaking / smiling animation */}
              <motion.div
                animate={
                  isSpeaking
                    ? { height: ["6px", "14px", "6px"], width: ["18px", "22px", "18px"], borderRadius: "8px" }
                    : isListening
                    ? { height: "8px", width: "16px", borderRadius: "10px" }
                    : { height: "8px", width: "20px", borderRadius: "0 0 10px 10px" }
                }
                transition={{ duration: 0.2, repeat: isSpeaking ? Infinity : 0 }}
                className="bg-on-surface"
              />

              {/* Cheeks */}
              <div className="absolute -bottom-1 flex justify-between w-20 px-1 opacity-70">
                <div className="w-2.5 h-1.5 rounded-full bg-red-300" />
                <div className="w-2.5 h-1.5 rounded-full bg-red-300" />
              </div>
            </div>

            {/* Corner Badge */}
            <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-primary border border-on-surface" />
          </div>
        </div>

        {/* Live Audio Wave Visualizer Bars */}
        <div className="flex items-center justify-center gap-1.5 h-8 mb-6">
          {[4, 8, 14, 22, 28, 18, 24, 12, 6].map((baseHeight, i) => {
            const active = isSpeaking || isListening;
            return (
              <motion.div
                key={i}
                animate={
                  active
                    ? {
                        height: [
                          `${Math.max(4, baseHeight * 0.4)}px`,
                          `${Math.min(32, baseHeight * 1.2)}px`,
                          `${Math.max(4, baseHeight * 0.3)}px`
                        ]
                      }
                    : { height: "4px" }
                }
                transition={
                  active
                    ? {
                        duration: 0.45,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.06,
                        ease: "easeInOut"
                      }
                    : { duration: 0.2 }
                }
                className={`w-1.5 rounded-full border border-on-surface transition-colors ${
                  isSpeaking
                    ? "bg-primary"
                    : isListening
                    ? "bg-amber-400"
                    : "bg-surface-variant"
                }`}
              />
            );
          })}
        </div>

        {/* Clean Conversation Presentation (The Core Dialogue) */}
        <div className="w-full max-w-xl space-y-4 mb-8">
          {/* AI Utterance Card */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white border-3 border-on-surface rounded-2xl shadow-brutalist text-left relative overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary-dark bg-primary px-2 py-0.5 rounded border border-on-surface">
                EDUSWATHI AI
              </span>
              <span className="text-[11px] font-mono font-bold text-secondary">
                Speech Output
              </span>
            </div>

            <p className="font-display text-2xl md:text-3xl font-black text-on-surface leading-snug">
              {aiMessage}
            </p>
          </motion.div>

          {/* Student Spoken Transcript Card */}
          {(studentTranscript || isListening || isThinking) && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-5 border-2 border-on-surface rounded-2xl shadow-brutalist-sm text-left transition-all ${
                isListening
                  ? "bg-amber-50 border-amber-600"
                  : "bg-surface border-on-surface"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-1.5">
                  <User size={12} /> YOU (STUDENT)
                </span>
                {isListening && (
                  <span className="font-mono text-[10px] font-black uppercase text-amber-700 animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Transcribing Voice...
                  </span>
                )}
              </div>

              <p className="font-sans text-lg font-bold text-on-surface italic">
                {studentTranscript ? (
                  `"${studentTranscript}"`
                ) : (
                  <span className="text-secondary/60 not-italic font-mono text-sm">
                    Say e.g. "I'm Rahul" or "My name is Priya"...
                  </span>
                )}
              </p>
            </motion.div>
          )}
        </div>

        {/* Microphone / Interaction Controls */}
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          {stage === "idle" && (
            <button
              onClick={() => {
                startConversation();
                setHasStartedOnce(true);
              }}
              className="w-full py-4 bg-primary hover:bg-accent border-3 border-on-surface rounded-2xl font-mono text-sm font-black uppercase tracking-wider shadow-brutalist hover:shadow-brutalist-lg transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <Mic size={20} />
              <span>Say Hello to Swathi</span>
            </button>
          )}

          {stage !== "idle" && (
            <div className="flex items-center gap-4">
              {/* Primary Mic Button */}
              <button
                onClick={() => {
                  if (isListening) {
                    stopVoice();
                  } else {
                    restartConversation();
                  }
                }}
                title={isListening ? "Listening... Click to mute" : "Click to speak again"}
                className={`w-16 h-16 rounded-2xl border-3 border-on-surface flex items-center justify-center shadow-brutalist transition-all cursor-pointer ${
                  isListening
                    ? "bg-red-400 hover:bg-red-500 animate-pulse text-white"
                    : isSpeaking
                    ? "bg-primary hover:bg-accent text-on-surface"
                    : "bg-white hover:bg-surface-variant text-on-surface"
                }`}
              >
                {isListening ? <Mic size={28} /> : <Mic size={28} />}
              </button>

              {/* Re-play Greeting / Restart */}
              <button
                onClick={restartConversation}
                title="Restart conversation"
                className="w-12 h-12 bg-white hover:bg-surface-variant border-2 border-on-surface rounded-xl flex items-center justify-center shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer text-secondary hover:text-on-surface"
              >
                <RotateCcw size={18} />
              </button>

              {/* Keyboard toggle fallback */}
              <button
                onClick={() => setShowKeyboardInput(!showKeyboardInput)}
                title="Type your name instead"
                className={`w-12 h-12 border-2 border-on-surface rounded-xl flex items-center justify-center shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer ${
                  showKeyboardInput ? "bg-primary text-on-surface" : "bg-white text-secondary hover:text-on-surface"
                }`}
              >
                <Keyboard size={18} />
              </button>
            </div>
          )}

          {/* Quick Name Chips for Frictionless Testing */}
          {stage !== "completed" && !studentName && (
            <div className="w-full pt-2">
              <span className="font-mono text-[10px] font-bold text-secondary uppercase block mb-2">
                Quick voice examples (or tap to test):
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {["I'm Rahul", "My name is Priya", "I'm Alex", "Call me Jordan"].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="px-3 py-1 bg-white hover:bg-primary border border-on-surface rounded-lg font-mono text-xs font-bold shadow-brutalist-sm transition-all cursor-pointer text-on-surface"
                  >
                    "{chip}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fallback Keyboard Input Modal / Form */}
          {showKeyboardInput && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleManualSubmit}
              className="w-full mt-2 p-4 bg-white border-2 border-on-surface rounded-2xl shadow-brutalist-sm"
            >
              <label className="font-mono text-[10px] font-black uppercase text-secondary block mb-1">
                Type your name (Keyboard Fallback)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="e.g. Rahul"
                  autoFocus
                  className="flex-1 px-3 py-2 bg-surface border-2 border-on-surface rounded-xl font-sans font-bold text-sm focus:outline-none focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-accent border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase shadow-brutalist-sm cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </motion.form>
          )}

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-3 bg-amber-100 border-2 border-amber-600 rounded-xl text-left flex items-start gap-2 text-xs font-mono font-bold text-amber-900"
            >
              <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{error}</p>
                <button
                  onClick={() => setShowKeyboardInput(true)}
                  className="underline text-amber-950 font-black mt-1 inline-block cursor-pointer"
                >
                  Type your name manually instead →
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Personalized Actions Once Student Name is Detected */}
        {studentName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl mt-8 p-6 bg-white border-3 border-on-surface rounded-3xl shadow-brutalist-lg text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary border-2 border-on-surface rounded-md font-mono text-[10px] font-black uppercase tracking-widest shadow-brutalist-sm">
              <CheckCircle2 size={12} className="text-on-surface" />
              SESSION PERSISTED FOR {studentName.toUpperCase()}
            </div>

            <h3 className="font-display text-2xl font-black uppercase tracking-tight">
              Ready to Learn, {studentName}?
            </h3>
            <p className="font-sans text-sm text-secondary leading-relaxed">
              Your name is now stored for your current Edu Swathi study session. All AI mentors and interactive tools will address you personally!
            </p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  stopVoice();
                  if (onContinueToApp) onContinueToApp(studentName);
                  else if (onClose) onClose();
                }}
                className="w-full py-3.5 bg-primary hover:bg-accent border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase tracking-wider shadow-brutalist hover:shadow-brutalist-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Enter Study Console</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => {
                  stopVoice();
                  if (onExploreBots) onExploreBots();
                  else if (onContinueToApp) onContinueToApp(studentName);
                }}
                className="w-full py-3.5 bg-white hover:bg-surface-variant border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase tracking-wider shadow-brutalist hover:shadow-brutalist-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Brain size={14} />
                <span>Explore 5 STEM Bots</span>
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer Branding Info */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-secondary border-t-2 border-on-surface/10 font-mono text-xs">
        <div className="flex items-center gap-2 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Edu Swathi Voice Agent v2.4 • Web Speech & Natural STT</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-bold uppercase">
          <span>Session: {studentName ? `Active (${studentName})` : "Awaiting Welcome"}</span>
          <span>•</span>
          <button
            onClick={() => {
              stopVoice();
              if (onContinueToApp) onContinueToApp(studentName || undefined);
              else if (onClose) onClose();
            }}
            className="underline hover:text-on-surface cursor-pointer"
          >
            Skip to Main Interface →
          </button>
        </div>
      </footer>
    </div>
  );
};
