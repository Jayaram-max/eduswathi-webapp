import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useFirebase } from "../context/FirebaseContext";
import { SubjectChatbotsView } from "./SubjectChatbotsView";
import { RealtimeProgressView } from "./RealtimeProgressView";
import { userTimingManager } from "../services/userTimingService";
import { TypewriterMessage } from "./TypewriterMessage";
import { EduSwathiLogo, EduSwathiIcon } from "./EduSwathiLogo";
import { RealtimeDashboardView } from "./RealtimeDashboardView";
import {
  LayoutGrid,
  Calendar,
  FileText,
  Award,
  Activity,
  User,
  Bell,
  Clock,
  BookOpen,
  TrendingUp,
  Sparkles,
  Check,
  Trash2,
  Send,
  Loader2,
  Zap,
  Brain,
  Bot,
  Plus,
  Mic,
  Paperclip,
  Share2,
  Download,
  GraduationCap,
  History,
  HelpCircle,
  FlaskConical,
  Dna,
  Calculator,
  Beaker,
  Leaf,
  Code,
  Languages,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  GripVertical,
  Edit3,
  Save,
  CheckCircle2,
  School,
  Target,
  FileUp,
  Copy,
  Eye
} from "lucide-react";
import Markdown from "react-markdown";
import { PUC_SUBJECTS, PUC_PRESET_QUESTIONS, PUCQuestion } from "../data/pucQuizzes";

interface DashboardViewProps {
  onOpenAuth?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenAuth, onNavigateTab }) => {
  const { user, profile, refreshProfile, submitQuizScore, completePomodoroSession, claimAchievementReward, updateUserProfile, logout } = useFirebase();
  const [activeSubTab, setActiveSubTab] = useState("dashboard");
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Student Profile Editing State
  const [editName, setEditName] = useState(profile?.name || "");
  const [editStream, setEditStream] = useState(profile?.stream || "2nd PUC (PCMB)");
  const [editTargetExam, setEditTargetExam] = useState(profile?.targetExam || "Karnataka 2nd PUC Board Exam 2025");
  const [editCollege, setEditCollege] = useState(profile?.college || "");
  const [editBio, setEditBio] = useState(profile?.bio || "");
  const [editPreferredSubject, setEditPreferredSubject] = useState(profile?.preferredSubject || "Physics");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<string | null>(null);
  const [isSyncingProfile, setIsSyncingProfile] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      if (profile.name) setEditName(profile.name);
      if (profile.stream) setEditStream(profile.stream);
      if (profile.targetExam) setEditTargetExam(profile.targetExam);
      if (profile.college) setEditCollege(profile.college);
      if (profile.bio) setEditBio(profile.bio);
      if (profile.preferredSubject) setEditPreferredSubject(profile.preferredSubject);
    }
  }, [profile]);

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateUserProfile({
        name: editName.trim() || profile?.name || "Student",
        stream: editStream,
        targetExam: editTargetExam,
        college: editCollege.trim(),
        bio: editBio.trim(),
        preferredSubject: editPreferredSubject
      });
      setProfileSaveSuccess("Student profile updated & saved to cloud successfully!");
      setTimeout(() => setProfileSaveSuccess(null), 4000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleResyncProfile = async () => {
    setIsSyncingProfile(true);
    try {
      await refreshProfile();
      setSyncNotice("Cloud profile synchronised successfully!");
      setTimeout(() => setSyncNotice(null), 3500);
    } catch (err) {
      console.error("Error syncing profile:", err);
    } finally {
      setIsSyncingProfile(false);
    }
  };

  // Achievements Systems State
  const [claimedBadges, setClaimedBadges] = useState<string[]>([]);
  const [badgeFilter, setBadgeFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [confettiBadge, setConfettiBadge] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      try {
        const saved = localStorage.getItem(`claimed_badges_${user.uid}`);
        setClaimedBadges(saved ? JSON.parse(saved) : []);
      } catch {
        setClaimedBadges([]);
      }
    } else {
      setClaimedBadges([]);
    }
  }, [user?.uid]);

  const handleClaimReward = async (badgeId: string, xpReward: number) => {
    if (!user?.uid) return;
    try {
      await claimAchievementReward(xpReward);
      const updatedClaims = [...claimedBadges, badgeId];
      setClaimedBadges(updatedClaims);
      localStorage.setItem(`claimed_badges_${user.uid}`, JSON.stringify(updatedClaims));
      setConfettiBadge(badgeId);
      setTimeout(() => {
        setConfettiBadge(null);
      }, 5000);
    } catch (err) {
      console.error("Failed to claim badge reward:", err);
    }
  };

  // State for TODAY'S FOCUS PROGRESS
  const [tasks, setTasks] = useState([
    { id: 1, text: "Examine Quantum Entanglement Vectors", completed: true },
    { id: 2, text: "Audit Systems Cache Eviction Schedulers", completed: false },
    { id: 3, text: "Complete Neuroscience Dopamine Loops Reading", completed: false },
    { id: 4, text: "Verify code proofs for distributed hash rings", completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState("");
  const [showChecklistSuccess, setShowChecklistSuccess] = useState(false);

  // Pomodoro Study Timer State & Core Engine
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(25 * 60);
  const [pomodoroIsActive, setPomodoroIsActive] = useState(false);
  const [pomodoroCompletedCycles, setPomodoroCompletedCycles] = useState(() => {
    try {
      const saved = localStorage.getItem("edu_pomo_cycles");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [pomodoroTotalMinutes, setPomodoroTotalMinutes] = useState(() => {
    try {
      const saved = localStorage.getItem("edu_pomo_mins");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [showPomodoroWidget, setShowPomodoroWidget] = useState(false);
  const [pomodoroFocusNotes, setPomodoroFocusNotes] = useState("");
  const [pomodoroAlert, setPomodoroAlert] = useState<string | null>(null);

  // Drag tracking for movable focus button
  const isDraggingPomoRef = useRef(false);
  const pomoDragDistanceRef = useRef(0);

  const playTimerSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5 note
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log("Audio not allowed yet by user interaction", e);
    }
  };

  const handleTimerCompleted = async () => {
    playTimerSound();
    setPomodoroIsActive(false);

    if (pomodoroMode === "focus") {
      const minsFocused = 25;
      const newCycles = pomodoroCompletedCycles + 1;
      const newMins = pomodoroTotalMinutes + minsFocused;
      
      setPomodoroCompletedCycles(newCycles);
      setPomodoroTotalMinutes(newMins);
      
      try {
        localStorage.setItem("edu_pomo_cycles", newCycles.toString());
        localStorage.setItem("edu_pomo_mins", newMins.toString());
      } catch (e) {}

      setPomodoroAlert("🌟 Phenomenal! Focus Wave Consolidated. Standard Study Cycle is complete.");
      
      // Update custom tasks
      const focusText = pomodoroFocusNotes.trim();
      const sessionLabel = focusText || "General Studies";
      if (focusText) {
        const text = `Consolidated focus session: ${focusText}`;
        setTasks(prev => [...prev, { id: Date.now(), text, completed: true }]);
      } else {
        setTasks(prev => [...prev, { id: Date.now(), text: `Completed a 25-minute study wave for ${sessionLabel}`, completed: true }]);
      }

      // Log real-time study timing
      userTimingManager.logAdditionalStudy(25 * 60, sessionLabel);

      // Add actual XP Reward in Firebase!
      try {
        await completePomodoroSession(25);
      } catch (e) {
        console.error("Failed to update Pomodoro database XP reward.", e);
      }

      // Switch to break
      setPomodoroMode("shortBreak");
      setPomodoroTimeLeft(5 * 60);
    } else {
      setPomodoroAlert("☕ Break Over! Shift attention back to focus interval.");
      setPomodoroMode("focus");
      setPomodoroTimeLeft(25 * 60);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (pomodoroIsActive) {
      interval = setInterval(() => {
        setPomodoroTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimeout(() => {
              handleTimerCompleted();
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoroIsActive, pomodoroMode, pomodoroFocusNotes, pomodoroCompletedCycles, pomodoroTotalMinutes]);

  const handleManualSwitchMode = (mode: "focus" | "shortBreak" | "longBreak") => {
    setPomodoroIsActive(false);
    setPomodoroMode(mode);
    if (mode === "focus") {
      setPomodoroTimeLeft(25 * 60);
    } else if (mode === "shortBreak") {
      setPomodoroTimeLeft(5 * 60);
    } else if (mode === "longBreak") {
      setPomodoroTimeLeft(15 * 60);
    }
  };

  const [notesInput, setNotesInput] = useState("");
  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfExtractProgress, setPdfExtractProgress] = useState("");
  const [uploadedFileMeta, setUploadedFileMeta] = useState<{
    name: string;
    size: string;
    pageCount: number;
    charCount: number;
  } | null>(null);
  const [notesActiveTab, setNotesActiveTab] = useState<"shortNote" | "extractedText">("shortNote");
  const [pdfErrorMessage, setPdfErrorMessage] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2nd PUC Focused MCQ Quiz Generator State
  const [quizSubject, setQuizSubject] = useState<string>("Physics");
  const [pucChapter, setPucChapter] = useState<string>("All Chapters (Full 2nd PUC Board Mock)");
  const [pucExamMode, setPucExamMode] = useState<"board" | "kcet">("board");
  const [quizTopic, setQuizTopic] = useState("2nd PUC Physics - Full Board Exam");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [quizDifficulty, setQuizDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [quizNumQuestions, setQuizNumQuestions] = useState<number>(5);
  const [isQuizGenerating, setIsQuizGenerating] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<{
    id?: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    chapter?: string;
    examRef?: string;
  }[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFeedbackScore, setQuizFeedbackScore] = useState<number | null>(null);
  const [quizStatus, setQuizStatus] = useState("");

  // Schedule Planner State
  const [scheduleItems, setScheduleItems] = useState([
    { id: 1, day: "Mon", subject: "Quantum Foundations", time: "09:00 - 11:30", type: "theory", completed: true },
    { id: 2, day: "Wed", subject: "Rust Kernels & Caching", time: "14:00 - 16:00", type: "lab", completed: false },
    { id: 3, day: "Fri", subject: "Dopamine & Flow Consolidation", time: "10:00 - 12:00", type: "bio-hacking", completed: false },
    { id: 4, day: "Sat", subject: "Distributed Hash Ring Defense", time: "13:00 - 15:30", type: "code", completed: false }
  ]);
  const [schedDay, setSchedDay] = useState("Mon");
  const [schedSubject, setSchedSubject] = useState("");
  const [schedTime, setSchedTime] = useState("10:00 - 12:00");
  const [schedType, setSchedType] = useState("theory");

  // Handle study checklist
  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTaskText.trim(), completed: false }]);
    setNewTaskText("");
  };

  const handleToggleTask = (id: number) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      const newlyCompletedAll = updated.every(t => t.completed) && updated.length > 0;
      if (newlyCompletedAll) {
        setShowChecklistSuccess(true);
        setTimeout(() => setShowChecklistSuccess(false), 5000);
      }
      return updated;
    });
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Smart Notes Generator Call
  const handleGenerateNotes = async () => {
    if (!notesInput.trim() || isNotesLoading) return;
    setIsNotesLoading(true);
    setPdfErrorMessage(null);

    const docName = uploadedFileMeta?.name || "Textbook Excerpt";
    const promptText = `Provide a premium, high-yield, structured study SHORT NOTE for this material ("${docName}").
Focus on core concepts, clear definitions, important formulas/laws with units/meaning, high-yield exam takeaways, and 3 active recall test questions.

MATERIAL:
"""
${notesInput.slice(0, 45000)}
"""`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: promptText, json: true, isSmartNotes: true })
      });
      if (!response.ok) throw new Error("Synthesis request failed");
      const data = await response.json();
      setGeneratedNotes(data.text);
      setNotesActiveTab("shortNote");
    } catch (err: any) {
      console.error("Notes synthesis error:", err);
      // Construct fallback note from input content
      const lines = notesInput.split("\n").filter(l => l.trim().length > 0).slice(0, 10);
      setGeneratedNotes(`# 📘 ${docName.replace(/\.[^/.]+$/, "")} — Study Short Note\n\n## 🎯 Executive Overview\nKey extracted highlights from ${uploadedFileMeta ? `${uploadedFileMeta.name} (${uploadedFileMeta.pageCount} pages)` : "your study context"}.\n\n## 🔑 Key Concepts & Definitions\n${lines.map(l => `- **${l.trim().slice(0, 45)}...**: ${l.trim()}`).join("\n")}\n\n## ⚡ Core Takeaways\n- Focus on the primary formulas and principles outlined in the text.\n- Review self-assessment questions.`);
      setNotesActiveTab("shortNote");
    } finally {
      setIsNotesLoading(false);
    }
  };

  const handleCopyNotes = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleDownloadNotes = () => {
    if (!generatedNotes) return;
    const blob = new Blob([generatedNotes], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(uploadedFileMeta?.name || "study-notes").replace(/\.[^/.]+$/, "")}-short-notes.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetNotes = () => {
    setNotesInput("");
    setGeneratedNotes(null);
    setUploadedFileMeta(null);
    setPdfErrorMessage(null);
    setNotesActiveTab("shortNote");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Real PDF & Document processing and extraction helper
  const processFile = async (file: File) => {
    if (!file) return;
    
    const fileType = file.name.split('.').pop()?.toLowerCase();
    const isPdf = fileType === "pdf" || file.type === "application/pdf";

    if (isPdf) {
      setIsExtractingPdf(true);
      setIsNotesLoading(true);
      setPdfErrorMessage(null);
      setPdfExtractProgress(`Reading "${file.name}"...`);

      const reader = new FileReader();
      reader.onerror = () => {
        setIsExtractingPdf(false);
        setIsNotesLoading(false);
        setPdfErrorMessage("Failed to read PDF file from device.");
      };

      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        setPdfExtractProgress(`Extracting content & synthesizing short note...`);

        try {
          const response = await fetch("/api/smart-notes/extract-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              base64,
              filename: file.name
            })
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || "Server failed to extract PDF content.");
          }

          const data = await response.json();
          const rawExtracted = data.extractedText || "";
          
          setNotesInput(rawExtracted);
          setGeneratedNotes(data.shortNote || "");

          const sizeFormatted = file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            : `${(file.size / 1024).toFixed(1)} KB`;

          setUploadedFileMeta({
            name: file.name,
            size: sizeFormatted,
            pageCount: data.pageCount || 1,
            charCount: data.charCount || rawExtracted.length
          });

          setNotesActiveTab("shortNote");
        } catch (err: any) {
          console.error("PDF upload error:", err);
          setPdfErrorMessage(err.message || "Failed to extract and process PDF.");
        } finally {
          setIsExtractingPdf(false);
          setIsNotesLoading(false);
          setPdfExtractProgress("");
        }
      };

      reader.readAsDataURL(file);
    } else if (fileType && ["txt", "md", "json", "csv", "xml", "js", "ts", "tsx", "html", "css"].includes(fileType)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) || "";
        setNotesInput(text);
        setUploadedFileMeta({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          pageCount: 1,
          charCount: text.length
        });
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) || "";
        setNotesInput(text);
        setUploadedFileMeta({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          pageCount: 1,
          charCount: text.length
        });
      };
      reader.readAsText(file);
    }
  };

  // Drag & drop handler for PDF
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Manual click-to-upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // 2nd PUC Specific Question Builder & Fallback
  const getPucFallbackQuestions = (subj: string, ch: string, count: number) => {
    const list = PUC_PRESET_QUESTIONS[subj] || PUC_PRESET_QUESTIONS["Physics"] || [];
    let filtered = list;
    if (ch && !ch.startsWith("All Chapters")) {
      const matched = list.filter(q => q.chapter.toLowerCase().includes(ch.toLowerCase()));
      if (matched.length > 0) filtered = matched;
    }
    
    // Shuffle slightly for variation
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const result = [];
    for (let i = 0; i < count; i++) {
      const q = shuffled[i % shuffled.length];
      result.push({
        id: `${q.id}-${i}`,
        question: q.question,
        options: [...q.options],
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        chapter: q.chapter,
        examRef: q.examRef || "Karnataka 2nd PUC Board Blueprint"
      });
    }
    return result;
  };

  // Instant Load 2nd PUC Board Model Paper / Past Paper Questions
  const handleLoadPresetBoardQuiz = () => {
    const questions = getPucFallbackQuestions(quizSubject, pucChapter, quizNumQuestions);
    setQuizTopic(`2nd PUC ${quizSubject}: ${pucChapter}`);
    setQuizQuestions(questions);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizFeedbackScore(null);
  };

  // Multiple Choice Quiz Solver / Fetcher strictly for Karnataka 2nd PUC
  const handleGenerateQuiz = async () => {
    setIsQuizGenerating(true);
    setQuizQuestions(null);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizFeedbackScore(null);
    setQuizStatus(`Synthesizing 2nd PUC ${quizSubject} MCQs strictly aligned with Karnataka Board blueprint...`);

    const finalTopic = `2nd PUC ${quizSubject} - ${pucChapter}${customTopic.trim() ? ` (${customTopic.trim()})` : ""}`;
    setQuizTopic(finalTopic);

    const quizPrompt = `You are a strict Karnataka Pre-University Education Board (KSEAB) examiner and 2nd PUC syllabus expert.
Generate a ${quizNumQuestions}-question Multiple Choice Test (MCQs) strictly from the Karnataka 2nd PUC (Class 12 / NCERT) curriculum for:
Subject: "2nd PUC ${quizSubject}"
Chapter / Topic: "${pucChapter}" ${customTopic.trim() ? `(Sub-concept: ${customTopic.trim()})` : ""}
Exam Mode: "${pucExamMode === "kcet" ? "KCET / Karnataka CET entrance exam level" : "Karnataka 2nd PUC Annual Board Exam (Part-A 1-mark MCQs pattern)"}"
Difficulty Level: "${quizDifficulty}".

CRITICAL INSTRUCTIONS:
1. Every question MUST test real Karnataka 2nd PUC textbook concepts, laws, definitions, reactions, equations, or theorems.
2. Formulate exactly 4 plausible options (A, B, C, D). There must be strictly ONE clear correct answer.
3. In explanation, provide an authoritative 2nd PUC textbook justification citing the specific principle or NCERT formula.
4. Output STRICTLY a valid JSON array of ${quizNumQuestions} objects without markdown ticks, code blocks, or preamble. Schema:
[
  {
    "question": "Clear 2nd PUC question string",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctIndex": 0,
    "chapter": "${pucChapter}",
    "explanation": "Authoritative textbook explanation",
    "examRef": "Karnataka 2nd PUC ${pucExamMode === 'kcet' ? 'KCET' : 'Annual Exam'} Blueprint"
  }
]`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: quizPrompt, 
          json: true,
          subject: quizSubject.toLowerCase() === "computer science" ? "cs" : quizSubject.toLowerCase()
        })
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      
      let cleanText = data.text ? data.text.trim() : "";
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();
      }
      
      const parsed = JSON.parse(cleanText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuizQuestions(parsed);
      } else {
        throw new Error();
      }
    } catch {
      // Fallback: Real 2nd PUC Board questions curated for Karnataka State syllabus
      const fallbackQuiz = getPucFallbackQuestions(quizSubject, pucChapter, quizNumQuestions);
      setQuizQuestions(fallbackQuiz);
    } finally {
      setIsQuizGenerating(false);
    }
  };

  const handleSelectQuizOption = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmitQuizAnswers = async () => {
    if (!quizQuestions || quizSubmitted) return;
    
    let correct = 0;
    quizQuestions.forEach((q, i) => {
      if (userAnswers[i] === q.correctIndex) correct++;
    });

    const score = Math.round((correct / quizQuestions.length) * 100);
    setQuizFeedbackScore(score);
    setQuizSubmitted(true);

    try {
      await submitQuizScore(quizTopic.replace(/\s+/g, "_"), score);
    } catch (e) {
      console.error(e);
    }
  };

  // Schedule Custom Creator
  const handleAddScheduleBlock = () => {
    if (!schedSubject.trim()) return;
    setScheduleItems(prev => [
      ...prev,
      {
        id: Date.now(),
        day: schedDay,
        subject: schedSubject.trim(),
        time: schedTime,
        type: schedType,
        completed: false
      }
    ]);
    setSchedSubject("");
  };

  // Locked Gate Auth wrapper for unauthenticated browser sessions
  if (!user && !isDemoMode) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-on-surface p-6 sm:p-12 rounded-2xl shadow-brutalist relative overflow-hidden text-on-surface"
          id="locked-cockpit-stage"
        >
          <div className="absolute inset-x-0 top-0 h-2 bg-primary border-b-2 border-on-surface" />
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 border-2 border-on-surface rounded-xl flex items-center justify-center mx-auto shadow-brutalist-sm mb-6 sm:mb-8 animate-pulse">
            <Brain size={36} className="text-on-surface" />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black font-display text-on-surface tracking-tight uppercase">Cognitive Console Locked</h2>
            <p className="text-secondary max-w-lg mx-auto leading-relaxed font-sans text-xs sm:text-sm font-medium">
              Authenticate your student profile block to retrieve real-time cognitive tracking, Socratic academic metrics, customized study planners, and secure graduation certificates.
            </p>
          </div>

          <div className="font-mono text-[10px] sm:text-xs uppercase bg-primary text-on-surface py-2 px-4 sm:py-2.5 sm:px-6 border-2 border-on-surface inline-block rounded-lg font-bold tracking-widest my-6 sm:my-8 shadow-brutalist-sm">
            // ACCESS_CREDENTIALS_REQUIRED
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button 
              onClick={() => {
                if (onOpenAuth) {
                  onOpenAuth();
                }
              }}
              className="w-full sm:w-auto brutalist-button brutalist-button-primary hover:shadow-brutalist-neon px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-black uppercase transition-all cursor-pointer shadow-brutalist-sm"
            >
              Sign In / Register
            </button>
            <button 
              onClick={() => setIsDemoMode(true)}
              className="w-full sm:w-auto brutalist-button bg-surface hover:bg-white text-on-surface px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-black uppercase transition-all cursor-pointer border-2 border-on-surface shadow-brutalist-sm"
            >
              Explore Demo Scholar Mode →
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none px-0 py-0" id="dashboard-brutalist-stage">
      {/* Demo Mode Notice Banner if user is exploring in demo mode */}
      {!user && isDemoMode && (
        <div className="bg-primary text-on-surface border-b-4 border-on-surface px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs font-black uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Previewing EduSwathi Console in Demo Mode • All interactive tools active</span>
          </div>
          <button
            onClick={() => onOpenAuth?.()}
            className="px-3 py-1 bg-white hover:bg-surface border-2 border-on-surface rounded-md text-[10px] font-black uppercase shadow-brutalist-sm cursor-pointer transition-all active:scale-95"
          >
            Sign In to Sync to Cloud →
          </button>
        </div>
      )}

      {/* Pure Neo-Brutalist Frame Container */}
      <div className="min-h-[calc(100vh-4.5rem)] bg-white text-on-surface flex flex-col lg:flex-row shadow-none">
        
        {/* Left Side Navigation Panel - sticky on desktop */}
        <aside className="w-full lg:w-72 bg-surface border-b-4 lg:border-b-0 lg:border-r-4 border-on-surface p-3.5 sm:p-5 lg:p-6 flex flex-col justify-between shrink-0 lg:sticky lg:top-0 lg:self-start lg:h-[calc(100vh-4.5rem)] lg:overflow-y-auto">
          <div className="space-y-4 lg:space-y-8">
            {/* Logo Row */}
            <div className="flex items-center justify-between">
              <EduSwathiLogo 
                variant="primary"
                size="sm"
                animated={true}
              />

              <div className="lg:hidden font-mono text-[10px] font-black uppercase bg-white px-2 py-1 border border-on-surface rounded-md">
                Active: {activeSubTab}
              </div>
            </div>

            {/* Nav Menu Tabs: Scrollable Pill Strip on Mobile, Vertical on Desktop */}
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-1.5 lg:pb-0">
              {[
                { id: "dashboard", label: "Dashboard", Icon: LayoutGrid, live: true },
                { id: "subject-bots", label: "Subject Bots", Icon: Sparkles },
                { id: "schedule", label: "Schedule", Icon: Calendar },
                { id: "notes", label: "Smart Notes", Icon: FileText },
                { id: "quizzes", label: "Quizzes", Icon: Award },
                { id: "progress", label: "Progress", Icon: Activity },
                { id: "profile", label: "Profile", Icon: User }
              ].map((tab) => {
                const isActive = activeSubTab === tab.id;
                const Icon = tab.Icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-mono text-xs font-black uppercase transition-all tracking-wider whitespace-nowrap shrink-0 lg:shrink lg:w-full cursor-pointer border-2 min-h-[40px]
                      ${isActive 
                        ? "bg-primary text-on-surface border-on-surface shadow-brutalist-sm" 
                        : "text-on-surface/75 hover:text-on-surface hover:bg-primary/10 border-transparent"
                      }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Icon size={16} className="text-on-surface shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {(tab as any).live && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-2 hidden sm:block" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Badge inside Sidebar Footer */}
          <div className="hidden lg:block bg-white border-2 border-on-surface p-4 rounded-xl relative overflow-hidden shadow-brutalist-sm mt-6">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-y-4 translate-x-4">
              <Brain size={80} className="text-on-surface" />
            </div>
            <span className="font-mono text-[9px] font-black uppercase text-primary-dark block mb-1">// SECURE SCHOLAR VAULT</span>
            <span className="font-sans text-xs font-bold block text-on-surface/80 max-w-[170px] truncate">
              {profile?.email || (user ? user.email : "demo-scholar@eduswathi.ai")}
            </span>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[9px] font-bold text-on-surface/50 uppercase">ONLINE</span>
              </div>
              <span className="font-mono text-[9px] font-black text-primary-dark">
                {profile?.xp || 350} XP
              </span>
            </div>
          </div>
        </aside>

        {/* Right Main Console View Body */}
        <main className="flex-1 bg-surface-container/20 flex flex-col min-w-0">
          
          {/* Top Bar Navigation Block */}
          <header className="border-b-4 border-on-surface px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 bg-white flex items-center justify-between gap-4 sticky top-0 z-10">
            <div>
              <span className="font-mono text-[9px] font-black text-primary-dark tracking-widest uppercase">
                {user ? "// STUDENT_SESSION_ACTIVE" : "// DEMO_SCHOLAR_ACTIVE"}
              </span>
              <h1 className="text-base sm:text-lg font-display font-black text-on-surface leading-none mt-1">
                Welcome back, {profile?.name || (user?.displayName || "Scholar")}
              </h1>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Notification Loop */}
              <div className="relative p-2 sm:p-2.5 bg-white border-2 border-on-surface rounded-lg shadow-brutalist-sm cursor-pointer hover:bg-primary/10 transition-colors">
                <Bell size={16} className="text-on-surface" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary block border border-on-surface animate-ping" />
              </div>

              {/* Styled Student Profile Bubble */}
              <div 
                onClick={() => {
                  if (!user && onOpenAuth) {
                    onOpenAuth();
                  } else {
                    setActiveSubTab("profile");
                  }
                }}
                className="flex items-center gap-2 sm:gap-2.5 pl-2 border-l-2 border-on-surface/10 cursor-pointer hover:opacity-85 transition-opacity"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary border-2 border-on-surface rounded-lg flex items-center justify-center font-mono text-on-surface font-black text-xs sm:text-sm uppercase shadow-brutalist-sm">
                  {(profile?.name || (user ? "S" : "D")).substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left leading-none">
                  <span className="text-xs font-bold text-on-surface block uppercase max-w-[120px] truncate">
                    {profile?.name || (user?.displayName || "Scholar")}
                  </span>
                  <span className="text-[9px] font-mono text-primary-dark uppercase mt-0.5 block tracking-tight font-black">
                    🔥 {profile?.streak || 1} DAYS
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Tab Sub-views Panel Content */}
          <div className="flex-1 p-3.5 sm:p-6 lg:p-8">

            {/* SUB-VIEW: 1. REAL-TIME OVERVIEW DASHBOARD */}
            {activeSubTab === "dashboard" && (
              <RealtimeDashboardView setActiveSubTab={setActiveSubTab} />
            )}

            {/* SUB-VIEW: SUBJECT CHATBOTS */}
            {activeSubTab === "subject-bots" && (
              <div className="h-[calc(100vh-170px)] min-h-[580px] w-full">
                <SubjectChatbotsView />
              </div>
            )}

            {/* SUB-VIEW: 3. SCHEDULE */}
            {activeSubTab === "schedule" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Custom schedule block visualizer */}
                <div className="lg:col-span-8 bg-white border-4 border-on-surface p-6 lg:p-8 rounded-xl space-y-6 shadow-brutalist">
                  <div className="border-b-2 border-on-surface pb-4">
                    <h3 className="text-xl font-display font-black text-on-surface uppercase tracking-tight leading-none">Weekly Study Blocks</h3>
                    <span className="text-[10px] font-mono text-on-surface/40 uppercase tracking-widest mt-1 block">// ACTIVE_TIMETABLE_METRICS</span>
                  </div>

                  <div className="space-y-3.5">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName) => {
                      const itemsForDay = scheduleItems.filter(item => item.day === dayName);
                      return (
                        <div key={dayName} className="p-4 bg-surface border-2 border-on-surface rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-brutalist-sm">
                          <div className="w-12 h-12 bg-primary border-2 border-on-surface rounded-lg flex items-center justify-center font-mono font-black text-sm text-on-surface shadow-brutalist-sm">
                            {dayName}
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            {itemsForDay.length > 0 ? (
                              itemsForDay.map(block => (
                                <div 
                                  key={block.id}
                                  onClick={() => {
                                    setScheduleItems(prev => prev.map(item => item.id === block.id ? { ...item, completed: !item.completed } : item));
                                  }}
                                  className={`p-3 bg-white border-2 border-on-surface rounded-lg flex items-center justify-between gap-3 cursor-pointer hover:border-primary transition-all shadow-brutalist-sm
                                    ${block.completed ? "opacity-40 line-through bg-surface" : ""}`}
                                >
                                  <div>
                                    <span className="font-mono text-[9px] font-bold text-on-surface/60 uppercase tracking-wide mr-2 bg-surface border border-on-surface/20 px-1.5 py-0.5 rounded">{block.time}</span>
                                    <span className="font-sans font-bold text-xs text-on-surface uppercase tracking-wide">{block.subject}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[8.5px] font-black uppercase text-primary-dark mr-2">[{block.type}]</span>
                                    <div className={`w-3.5 h-3.5 rounded border-2 border-on-surface ${block.completed ? "bg-primary" : "bg-white"}`} />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-[10px] font-mono text-on-surface/40 uppercase tracking-widest font-black block pt-1">// NO_BLOCKED_ROADMAPS_YET</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Study Creator */}
                <div className="lg:col-span-4 bg-white border-4 border-on-surface p-6 lg:p-8 rounded-xl flex flex-col justify-between space-y-6 shadow-brutalist">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b-2 border-on-surface pb-4">
                      <Calendar size={16} className="text-on-surface animate-pulse" />
                      <h3 className="text-base font-display font-black text-on-surface uppercase tracking-tight">// Lock Study Hour</h3>
                    </div>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="font-mono text-[10px] font-black text-on-surface/70 uppercase block tracking-wider">Day Selection</label>
                        <select 
                          value={schedDay}
                          onChange={(e) => setSchedDay(e.target.value)}
                          className="w-full p-2.5 bg-surface border-2 border-on-surface rounded-lg text-on-surface font-sans text-xs focus:outline-none cursor-pointer shadow-brutalist-sm font-black"
                        >
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[10px] font-black text-on-surface/70 uppercase block tracking-wider font-bold">Subject / Course Topic</label>
                        <input 
                          type="text" 
                          value={schedSubject}
                          onChange={(e) => setSchedSubject(e.target.value)}
                          placeholder="e.g. Purkinje Impulse Buffers"
                          className="w-full p-2.5 bg-white border-2 border-on-surface rounded-lg text-on-surface font-sans text-xs focus:outline-none focus:ring-2 focus:ring-primary placeholder-on-surface/30 shadow-brutalist-sm font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[10px] font-black text-on-surface/70 uppercase block tracking-wider">Hours Slots</label>
                        <input 
                          type="text" 
                          value={schedTime}
                          onChange={(e) => setSchedTime(e.target.value)}
                          placeholder="e.g. 10:00 - 12:00"
                          className="w-full p-2.5 bg-white border-2 border-on-surface rounded-lg text-on-surface font-sans text-xs focus:outline-none shadow-brutalist-sm font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[10px] font-black text-on-surface/70 uppercase block tracking-wider">Category Tag</label>
                        <select 
                          value={schedType}
                          onChange={(e) => setSchedType(e.target.value)}
                          className="w-full p-2.5 bg-surface border-2 border-on-surface rounded-lg text-on-surface font-sans text-xs focus:outline-none cursor-pointer shadow-brutalist-sm font-black"
                        >
                          <option value="theory">Theory</option>
                          <option value="lab">Lab Exercises</option>
                          <option value="bio-hacking">Bio-hacking</option>
                          <option value="code">Code Proofs</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleAddScheduleBlock}
                    className="brutalist-button brutalist-button-primary w-full py-3.5 text-xs shadow-brutalist-sm hover:shadow-brutalist"
                  >
                    Authorize Hour Block
                  </button>
                </div>
              </div>
            )}

            {/* SUB-VIEW: 4. SMART NOTES */}
            {activeSubTab === "notes" && (
              <div className="space-y-8">
                <div className="border-b-2 border-on-surface pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-display font-black text-on-surface uppercase tracking-tight leading-none">Smart Notes & PDF Extractor</h3>
                    <span className="text-[10px] font-mono text-on-surface/40 uppercase tracking-widest mt-1 block">// PDF_PARSER_&_SOCRATIC_SHORT_NOTE_ENGINE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-primary/20 border border-on-surface text-on-surface font-mono text-[10px] font-black uppercase rounded">
                      PDF Parsing Active
                    </span>
                    <span className="px-2.5 py-1 bg-surface border border-on-surface text-on-surface/70 font-mono text-[10px] font-bold uppercase rounded">
                      Gemini 2.5 Flash
                    </span>
                  </div>
                </div>

                {/* PDF Drag & Drop Upload Zone */}
                <div className="space-y-3">
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => !isExtractingPdf && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all shadow-brutalist-sm cursor-pointer
                      ${isExtractingPdf ? "bg-primary/10 border-primary cursor-wait" : isDragOver ? "bg-primary/20 border-primary scale-[1.01]" : "bg-white hover:bg-surface border-on-surface"}`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept=".pdf,application/pdf,.txt,.md,.json,.csv" 
                    />
                    
                    {isExtractingPdf ? (
                      <div className="flex flex-col items-center space-y-3 py-2">
                        <Loader2 size={36} className="text-on-surface animate-spin" />
                        <div>
                          <h4 className="font-display font-black text-sm text-on-surface uppercase tracking-wide">
                            {pdfExtractProgress || "Extracting Information From PDF..."}
                          </h4>
                          <p className="text-[11px] text-on-surface/60 font-sans mt-1">
                            Analyzing document structure, extracting text & generating structured short note...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 border-2 border-on-surface flex items-center justify-center mb-3 shadow-brutalist-sm">
                          <FileUp size={24} className="text-on-surface" />
                        </div>
                        <h4 className="font-display font-black text-sm text-on-surface uppercase tracking-wide">
                          Upload or Drop Study PDF Here
                        </h4>
                        <p className="text-xs text-on-surface/70 font-sans mt-1 max-w-md">
                          Click to browse or drop any 2nd PUC chapter, textbook excerpt, or study PDF. The engine will extract the information and instantly synthesize a concise, high-yield short note.
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-[10px] font-mono font-bold text-on-surface/50 bg-surface px-2 py-0.5 rounded border border-on-surface/20">
                            SUPPORTS: .PDF, .TXT, .MD
                          </span>
                          <span className="text-[10px] font-mono font-bold text-primary-dark bg-primary/30 px-2 py-0.5 rounded border border-on-surface/30">
                            AUTO-SUMMARIZATION
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Uploaded File Info Card */}
                  {uploadedFileMeta && (
                    <div className="bg-primary/15 border-2 border-on-surface rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-brutalist-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white border-2 border-on-surface flex items-center justify-center font-mono font-black text-xs">
                          PDF
                        </div>
                        <div>
                          <div className="font-sans font-bold text-xs text-on-surface flex items-center gap-2">
                            <span>{uploadedFileMeta.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white border border-on-surface/30 rounded">
                              {uploadedFileMeta.size}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-on-surface/70 flex items-center gap-2 mt-0.5">
                            <span>Pages: {uploadedFileMeta.pageCount}</span>
                            <span>•</span>
                            <span>Extracted: {uploadedFileMeta.charCount.toLocaleString()} chars</span>
                            <span>•</span>
                            <span className="text-primary-dark font-bold">Extraction Complete ✓</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleGenerateNotes}
                          disabled={isNotesLoading}
                          className="px-3 py-1.5 bg-white hover:bg-surface border-2 border-on-surface rounded-lg font-mono text-[10px] font-black uppercase shadow-brutalist-sm active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                        >
                          <Sparkles size={12} />
                          Re-Synthesize Note
                        </button>
                        <button
                          onClick={handleResetNotes}
                          className="px-3 py-1.5 bg-white hover:bg-rose-50 border-2 border-on-surface rounded-lg font-mono text-[10px] font-black uppercase shadow-brutalist-sm active:translate-x-0.5 active:translate-y-0.5 transition-all text-rose-700 flex items-center gap-1.5"
                        >
                          <Trash2 size={12} />
                          Clear File
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Error Notification */}
                  {pdfErrorMessage && (
                    <div className="p-3 bg-rose-50 border-2 border-rose-500 rounded-xl text-xs text-rose-900 font-sans flex items-center justify-between gap-2 shadow-brutalist-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-rose-700">[ERROR]</span>
                        <span>{pdfErrorMessage}</span>
                      </div>
                      <button 
                        onClick={() => setPdfErrorMessage(null)} 
                        className="font-mono text-[10px] font-bold underline hover:text-rose-950"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>

                {/* Main 2-Column Work Bench */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Extracted Information & Context Input */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-[10px] font-black text-on-surface/70 tracking-wider flex items-center gap-1.5">
                        <BookOpen size={13} />
                        // EXTRACTED PDF TEXT & INPUT CONTEXT
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-on-surface/50 font-bold">
                          {notesInput.length.toLocaleString()} CHARACTERS
                        </span>
                        {notesInput && (
                          <button
                            onClick={() => handleCopyNotes(notesInput)}
                            className="font-mono text-[9px] text-on-surface/70 hover:text-on-surface font-bold underline"
                          >
                            Copy Raw
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="Upload a PDF above to automatically extract content here, or paste textbook excerpts, formulas, and syllabus topics to synthesize a short note..."
                      className="w-full h-72 p-4 bg-white border-2 border-on-surface rounded-xl text-xs font-sans text-on-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder-on-surface/40 resize-none leading-relaxed shadow-brutalist font-normal"
                    />

                    {/* Quick Topic Starters if user has not uploaded a PDF yet */}
                    {!notesInput && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono text-on-surface/60 font-bold uppercase tracking-wider block">
                          // QUICK SAMPLE 2ND PUC EXCERPTS:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: "⚡ Physics: EMI & AC", text: "Electromagnetic Induction: Faraday's Law states that the magnitude of induced emf in a circuit is proportional to the time rate of change of magnetic flux through the circuit. Formula: ε = -dΦ/dt. Lenz's Law indicates the direction of induced emf opposes the change in flux producing it. Self-inductance L = (μ₀ * N² * A) / l. Alternating current in an LCR series circuit: Impedance Z = √(R² + (X_L - X_C)²), Resonant frequency f₀ = 1 / (2π√(LC)). Quality factor Q = (1/R) * √(L/C)." },
                            { label: "🧪 Chem: Electrochemistry", text: "Electrochemistry: Galvanic cell converts chemical energy to electrical energy. Daniell cell reaction: Zn(s) + Cu²⁺(aq) -> Zn²⁺(aq) + Cu(s). Nernst Equation at 298K: E_cell = E°_cell - (0.0591/n) * log(Q). Standard hydrogen electrode (SHE) potential is assigned as 0.00 V. Kohlrausch's Law of independent migration of ions states that limiting molar conductivity of an electrolyte can be represented as the sum of individual contributions of anions and cations. Faraday's 1st Law: m = Z * I * t." },
                            { label: "📐 Math: Integrals", text: "Integrals: Fundamental Theorem of Calculus connects differentiation and integration. Standard formulas: ∫ xⁿ dx = (xⁿ⁺¹)/(n+1) + C, ∫ (1/x) dx = ln|x| + C, ∫ eˣ dx = eˣ + C. Integration by parts: ∫ u v dx = u ∫ v dx - ∫ [u' (∫ v dx)] dx. Definite integral properties: ∫ₐᵇ f(x)dx = ∫ₐᵇ f(a + b - x)dx. When function is odd: f(-x) = -f(x), then ∫₋ₐᵃ f(x)dx = 0." }
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setNotesInput(item.text);
                                setUploadedFileMeta({
                                  name: `${item.label.split(":")[1].trim()}.txt`,
                                  size: "1.2 KB",
                                  pageCount: 1,
                                  charCount: item.text.length
                                });
                              }}
                              className="px-2.5 py-1 bg-surface hover:bg-primary/20 border border-on-surface rounded text-[10px] font-mono font-bold text-on-surface transition-all shadow-brutalist-sm"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <button 
                        onClick={handleGenerateNotes}
                        disabled={isNotesLoading || isExtractingPdf || !notesInput.trim()}
                        className="brutalist-button brutalist-button-primary w-full p-3.5 text-xs shadow-brutalist hover:shadow-brutalist-neon transition-all"
                      >
                        {isNotesLoading ? (
                          <>
                            <Loader2 size={15} className="animate-spin mr-2 inline" />
                            Synthesizing High-Yield Short Note...
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} className="mr-2 inline" />
                            {generatedNotes ? "Re-Synthesize Short Note" : "Synthesize Socratic Short Note"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Synthesized Short Note & Document View */}
                  <div className="lg:col-span-6">
                    <div className="h-full bg-white border-4 border-on-surface rounded-xl p-5 lg:p-6 flex flex-col justify-between min-h-[480px] shadow-brutalist">
                      <div className="space-y-4">
                        {/* Header & View Mode Switcher */}
                        <div className="flex flex-wrap items-center justify-between border-b-2 border-on-surface/10 pb-3 gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setNotesActiveTab("shortNote")}
                              className={`px-3 py-1 font-mono text-[10px] font-black uppercase rounded border transition-all ${
                                notesActiveTab === "shortNote"
                                  ? "bg-primary text-on-surface border-on-surface shadow-brutalist-sm"
                                  : "bg-surface text-on-surface/60 border-transparent hover:text-on-surface"
                              }`}
                            >
                              📘 Synthesized Short Note
                            </button>
                            <button
                              onClick={() => setNotesActiveTab("extractedText")}
                              className={`px-3 py-1 font-mono text-[10px] font-black uppercase rounded border transition-all ${
                                notesActiveTab === "extractedText"
                                  ? "bg-primary text-on-surface border-on-surface shadow-brutalist-sm"
                                  : "bg-surface text-on-surface/60 border-transparent hover:text-on-surface"
                              }`}
                            >
                              📄 Extracted Raw Text
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {generatedNotes && (
                              <>
                                <button
                                  onClick={() => handleCopyNotes(notesActiveTab === "shortNote" ? generatedNotes : notesInput)}
                                  className="px-2.5 py-1 bg-surface hover:bg-surface-container border border-on-surface rounded font-mono text-[9px] font-black uppercase flex items-center gap-1 shadow-brutalist-sm"
                                  title="Copy content to clipboard"
                                >
                                  {copySuccess ? (
                                    <>
                                      <Check size={11} className="text-emerald-700" />
                                      <span className="text-emerald-700">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={11} />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={handleDownloadNotes}
                                  className="px-2.5 py-1 bg-surface hover:bg-surface-container border border-on-surface rounded font-mono text-[9px] font-black uppercase flex items-center gap-1 shadow-brutalist-sm"
                                  title="Download markdown note"
                                >
                                  <Download size={11} />
                                  <span>.MD</span>
                                </button>
                              </>
                            )}
                            <span className="font-mono text-[9px] text-on-surface/60 font-black">
                              {generatedNotes ? "STATUS: READY" : "STATUS: AWAITING PDF"}
                            </span>
                          </div>
                        </div>

                        {/* Note Viewer Body */}
                        <div className="max-h-[520px] overflow-y-auto pr-2 space-y-3">
                          {notesActiveTab === "shortNote" ? (
                            generatedNotes ? (
                              <div className="prose prose-sm max-w-none text-xs font-sans leading-relaxed space-y-3 text-on-surface">
                                <div className="markdown-body font-sans text-xs text-on-surface space-y-3">
                                  <Markdown
                                    components={{
                                      h1: ({ ...props }) => <h1 className="font-display font-black text-base text-on-surface uppercase border-b border-on-surface/20 pb-1 mt-4 mb-2 tracking-tight" {...props} />,
                                      h2: ({ ...props }) => <h2 className="font-display font-bold text-sm text-primary-dark uppercase mt-3 mb-1.5 tracking-tight flex items-center gap-1.5" {...props} />,
                                      h3: ({ ...props }) => <h3 className="font-sans font-bold text-xs text-on-surface uppercase mt-2 mb-1" {...props} />,
                                      p: ({ ...props }) => <p className="text-xs text-on-surface/90 leading-relaxed my-1.5 font-normal" {...props} />,
                                      ul: ({ ...props }) => <ul className="list-disc list-inside space-y-1 my-2 pl-1" {...props} />,
                                      ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-1 my-2 pl-1" {...props} />,
                                      li: ({ ...props }) => <li className="text-xs text-on-surface/85 font-normal" {...props} />,
                                      strong: ({ ...props }) => <strong className="font-bold text-on-surface" {...props} />,
                                      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-primary bg-primary/10 pl-3 py-1.5 my-2 rounded-r italic text-xs font-mono text-on-surface" {...props} />,
                                      code: ({ ...props }) => <code className="px-1.5 py-0.5 bg-surface border border-on-surface/20 rounded font-mono text-[11px] text-primary-dark font-bold" {...props} />
                                    }}
                                  >
                                    {generatedNotes}
                                  </Markdown>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-20 flex flex-col items-center justify-center space-y-3 text-on-surface/40">
                                <div className="w-12 h-12 rounded-xl bg-surface border-2 border-on-surface/20 flex items-center justify-center">
                                  <BookOpen size={24} className="text-on-surface/30" />
                                </div>
                                <div className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface/60">
                                  No Short Note Generated Yet
                                </div>
                                <p className="text-xs font-sans text-on-surface/50 max-w-xs">
                                  Upload any chapter or textbook PDF on the left to extract the text and generate your high-yield short note automatically.
                                </p>
                              </div>
                            )
                          ) : (
                            // Extracted Raw Text View
                            notesInput ? (
                              <div className="bg-surface p-4 rounded-xl border border-on-surface/20">
                                <div className="font-mono text-[10px] text-on-surface/60 font-bold mb-2 pb-1 border-b border-on-surface/10 uppercase">
                                  Raw Text Extracted from Document ({notesInput.length} chars)
                                </div>
                                <pre className="font-mono text-[11px] text-on-surface/80 whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
                                  {notesInput}
                                </pre>
                              </div>
                            ) : (
                              <div className="text-center py-20 text-on-surface/30 font-mono text-[10px] uppercase font-bold tracking-wider">
                                // NO_DOCUMENT_TEXT_LOADED_YET
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Bottom Footer Actions */}
                      {generatedNotes && (
                        <div className="mt-4 pt-3 border-t-2 border-on-surface/10 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-on-surface/50 font-bold">
                            EduSwathi High-Yield Format • 2nd PUC Ready
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyNotes(generatedNotes)}
                              className="brutalist-button brutalist-button-secondary px-3 py-1.5 text-[10px] shadow-brutalist-sm"
                            >
                              {copySuccess ? "✓ Copied Note" : "Copy Note to Clipboard"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SUB-VIEW: 5. QUIZZES */}
            {activeSubTab === "quizzes" && (
              <div className="space-y-8">
                <div className="border-b-2 border-on-surface pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-display font-black text-on-surface uppercase tracking-tight leading-none">
                      Practice Quizzes
                    </h3>
                    <span className="text-[10px] font-mono text-on-surface/40 uppercase tracking-widest mt-1 block">
                      // MCQS_PRACTICE_ENGINE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-on-surface/50 uppercase tracking-widest hidden sm:inline-block">
                      // ACTIVE_EVALUATION
                    </span>
                  </div>
                </div>

                {!quizQuestions ? (() => {
                  const currentSubjectConfig = PUC_SUBJECTS.find(s => s.id === quizSubject) || PUC_SUBJECTS[0];

                  return (
                    <div className="max-w-4xl mx-auto bg-white border-4 border-on-surface rounded-2xl p-6 md:p-8 space-y-8 shadow-brutalist">
                      
                      {/* Header block */}
                      <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-display font-black text-on-surface uppercase tracking-tight leading-none">
                          Configure Quiz
                        </h2>
                        <p className="text-xs text-on-surface/65 font-sans font-medium leading-relaxed">
                          Choose your subject, unit, and difficulty to practice multiple-choice questions.
                        </p>
                      </div>

                      {/* 1. 2nd PUC Subject Selection */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="font-mono text-[11px] font-black text-on-surface uppercase tracking-wider block">
                            Step 1: Select 2nd PUC Subject
                          </label>
                          <span className="text-[10px] font-mono text-primary-dark font-black uppercase">
                            Target: 2nd PUC {quizSubject}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                          {PUC_SUBJECTS.map((subj) => {
                            const isSelected = quizSubject === subj.id;
                            let SubjIcon = Zap;
                            if (subj.iconName === "Beaker") SubjIcon = Beaker;
                            if (subj.iconName === "Calculator") SubjIcon = Calculator;
                            if (subj.iconName === "Leaf") SubjIcon = Leaf;
                            if (subj.iconName === "Code") SubjIcon = Code;

                            return (
                              <button
                                key={subj.id}
                                onClick={() => {
                                  setQuizSubject(subj.id);
                                  setPucChapter(subj.chapters[0]);
                                  setCustomTopic("");
                                }}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 text-center group
                                  ${isSelected 
                                    ? "bg-primary/25 border-on-surface shadow-brutalist-sm translate-y-[-2px] border-4" 
                                    : `bg-slate-50 border-on-surface/20 hover:border-on-surface/80 hover:bg-white`}`}
                              >
                                <div className={`p-2.5 rounded-xl border-2 border-on-surface/15 bg-white shadow-sm flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                  <SubjIcon size={20} className={subj.color} />
                                </div>
                                <div>
                                  <span className="text-[11px] font-display font-black uppercase tracking-tight text-on-surface block leading-snug">
                                    {subj.id}
                                  </span>
                                  <span className="text-[9px] font-mono text-on-surface/50 uppercase block">
                                    2nd PUC
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. 2nd PUC Chapter Selector */}
                      <div className="space-y-3 bg-slate-50 p-4 sm:p-5 border-2 border-on-surface rounded-xl shadow-brutalist-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <label className="font-mono text-[11px] font-black text-on-surface uppercase tracking-wider block">
                            Step 2: Select 2nd PUC Chapter / Unit
                          </label>
                          <span className="text-[10px] font-mono text-on-surface/60">
                            {currentSubjectConfig.chapters.length - 1} Board Units Available
                          </span>
                        </div>

                        {/* Chapter Dropdown */}
                        <select
                          value={pucChapter}
                          onChange={(e) => setPucChapter(e.target.value)}
                          className="w-full p-3.5 bg-white border-2 border-on-surface rounded-xl text-xs font-sans font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-brutalist-sm cursor-pointer"
                        >
                          {currentSubjectConfig.chapters.map((ch, idx) => (
                            <option key={idx} value={ch} className="py-1">
                              {ch === currentSubjectConfig.chapters[0] ? `★ ${ch}` : `Unit ${idx}: ${ch}`}
                            </option>
                          ))}
                        </select>

                        {/* Quick Chapter Chips (Top 4 most frequent chapters) */}
                        <div className="pt-2">
                          <span className="text-[10px] font-mono text-on-surface/50 uppercase font-black tracking-wider block mb-2">
                            Quick Unit Selectors:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {currentSubjectConfig.chapters.slice(0, 6).map((ch, idx) => (
                              <button
                                key={idx}
                                onClick={() => setPucChapter(ch)}
                                className={`px-2.5 py-1 text-[10px] font-mono rounded-lg border transition-all cursor-pointer ${
                                  pucChapter === ch
                                    ? "bg-on-surface text-white border-on-surface font-black shadow-sm"
                                    : "bg-white hover:bg-slate-100 text-on-surface/80 border-on-surface/30"
                                }`}
                              >
                                {ch.length > 28 ? ch.slice(0, 26) + "…" : ch}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 3. 2nd PUC Exam Pattern & Test Config */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        
                        {/* Exam Blueprint Mode */}
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] font-black text-on-surface uppercase tracking-wider block">
                            // Exam Pattern
                          </label>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => setPucExamMode("board")}
                              className={`p-3 rounded-xl border-2 text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer text-left flex items-center justify-between
                                ${pucExamMode === "board" 
                                  ? "bg-emerald-300 border-on-surface text-on-surface shadow-brutalist-sm font-black border-4" 
                                  : "bg-slate-50 hover:bg-white border-on-surface/20 text-on-surface/75"}`}
                            >
                              <span>Board Part-A (1 Mark)</span>
                              {pucExamMode === "board" && <Check size={13} strokeWidth={3} />}
                            </button>
                            <button
                              onClick={() => setPucExamMode("kcet")}
                              className={`p-3 rounded-xl border-2 text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer text-left flex items-center justify-between
                                ${pucExamMode === "kcet" 
                                  ? "bg-emerald-300 border-on-surface text-on-surface shadow-brutalist-sm font-black border-4" 
                                  : "bg-slate-50 hover:bg-white border-on-surface/20 text-on-surface/75"}`}
                            >
                              <span>KCET / Applied Level</span>
                              {pucExamMode === "kcet" && <Check size={13} strokeWidth={3} />}
                            </button>
                          </div>
                        </div>

                        {/* Number of Questions (5, 10, or 15 - 15 is full 2nd PUC Section A) */}
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] font-black text-on-surface uppercase tracking-wider block">
                            // Number of MCQs
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { num: 5, label: "5 MCQs", tag: "Sprint" },
                              { num: 10, label: "10 MCQs", tag: "Standard" },
                              { num: 15, label: "15 MCQs", tag: "Board Part-A" }
                            ].map(({ num, label, tag }) => {
                              const isActive = quizNumQuestions === num;
                              return (
                                <button
                                  key={num}
                                  onClick={() => setQuizNumQuestions(num)}
                                  className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-center
                                    ${isActive 
                                      ? "bg-emerald-400 border-on-surface text-on-surface shadow-brutalist-sm border-4 font-black" 
                                      : "bg-slate-50 hover:bg-white border-on-surface/20 text-on-surface/75"}`}
                                >
                                  <span className="text-xs font-mono font-black">{num}</span>
                                  <span className="text-[8px] font-mono uppercase opacity-75">{tag}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Difficulty */}
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] font-black text-on-surface uppercase tracking-wider block">
                            // Difficulty
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(["Easy", "Medium", "Hard"] as const).map((diff) => {
                              const isActive = quizDifficulty === diff;
                              return (
                                <button
                                  key={diff}
                                  onClick={() => setQuizDifficulty(diff)}
                                  className={`py-3.5 px-2 rounded-xl border-2 text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer text-center
                                    ${isActive 
                                      ? "bg-emerald-400 border-on-surface text-on-surface shadow-brutalist-sm border-4" 
                                      : "bg-slate-50 hover:bg-white border-on-surface/20 text-on-surface/75"}`}
                                >
                                  {diff}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* Dual Action Launchers: AI Generation vs Instant Board Exam MCQs */}
                      <div className="pt-2 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            onClick={handleGenerateQuiz}
                            disabled={isQuizGenerating}
                            className="brutalist-button brutalist-button-primary bg-emerald-400 hover:bg-emerald-500 text-on-surface text-xs font-mono font-black uppercase tracking-wider py-4 rounded-xl border-4 border-on-surface shadow-brutalist hover:shadow-brutalist-neon flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isQuizGenerating ? <Loader2 size={16} className="animate-spin text-on-surface" /> : <Zap size={16} className="text-on-surface" />}
                            <span>{isQuizGenerating ? "Formulating 2nd PUC MCQs..." : `Generate 2nd PUC AI Test (${quizNumQuestions} Qs)`}</span>
                          </button>

                          <button
                            onClick={handleLoadPresetBoardQuiz}
                            disabled={isQuizGenerating}
                            className="brutalist-button bg-amber-300 hover:bg-amber-400 text-on-surface text-xs font-mono font-black uppercase tracking-wider py-4 rounded-xl border-4 border-on-surface shadow-brutalist hover:shadow-brutalist-neon flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles size={16} className="text-on-surface" />
                            <span>Practice Curated 2nd PUC Board Questions</span>
                          </button>
                        </div>

                        {isQuizGenerating && (
                          <div className="p-3.5 bg-primary/10 border-2 border-on-surface rounded-xl text-center shadow-brutalist-sm">
                            <p className="text-[11px] font-mono text-primary-dark uppercase tracking-widest font-black animate-pulse">
                              {quizStatus}
                            </p>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })() : (
                  <div className="max-w-3xl mx-auto space-y-6">
                    {/* Active Quiz Header Banner */}
                    <div className="bg-white border-4 border-on-surface p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-brutalist">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-[9px] font-black px-2.5 py-0.5 bg-primary/20 border-2 border-on-surface text-on-surface uppercase rounded tracking-wide">
                            2nd PUC {quizSubject}
                          </span>
                          <span className="font-mono text-[9px] font-black px-2.5 py-0.5 bg-slate-100 border-2 border-on-surface text-on-surface/80 uppercase rounded tracking-wide">
                            {pucChapter}
                          </span>
                          <span className="font-mono text-[9px] font-black px-2.5 py-0.5 bg-emerald-100 border-2 border-on-surface text-emerald-950 uppercase rounded tracking-wide">
                            {pucExamMode === "kcet" ? "KCET Format" : "Board Part-A"}
                          </span>
                        </div>
                        <h4 className="text-sm font-sans font-bold text-on-surface uppercase tracking-tight">
                          Karnataka 2nd PUC Objective Examination Section
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            setQuizQuestions(null);
                            setUserAnswers({});
                            setQuizSubmitted(false);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border-2 border-on-surface rounded-lg font-mono text-[10px] font-black uppercase text-on-surface transition-all cursor-pointer"
                        >
                          Change Subject
                        </button>
                      </div>
                    </div>

                    {/* Active Question loop */}
                    {quizQuestions.map((q, qIdx) => {
                      const isAnswered = userAnswers[qIdx] !== undefined;

                      return (
                        <div key={qIdx} className="bg-white border-4 border-on-surface p-6 lg:p-8 rounded-xl space-y-5 shadow-brutalist">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-on-surface/10 pb-3">
                            <span className="font-mono text-[10px] font-black px-2.5 py-1 bg-primary/20 border-2 border-on-surface text-on-surface uppercase rounded-lg tracking-wide inline-block shadow-brutalist-sm">
                              2nd PUC MCQ 0{qIdx+1} of {quizQuestions.length}
                            </span>
                            {q.examRef && (
                              <span className="font-mono text-[9px] font-bold text-on-surface/60 bg-slate-100 px-2.5 py-0.5 border border-on-surface/20 rounded">
                                {q.examRef}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-sans font-bold text-on-surface uppercase tracking-wide leading-relaxed">
                            {q.question}
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                            {q.options.map((option, oIdx) => {
                              const isSelected = userAnswers[qIdx] === oIdx;
                              const isCorrect = q.correctIndex === oIdx;
                              
                              let optionClass = "bg-white border-on-surface hover:border-primary/50 text-on-surface hover:bg-primary/5";
                              if (isSelected) {
                                optionClass = "bg-primary/25 border-on-surface text-on-surface font-black shadow-brutalist-sm";
                              }
                              
                              if (quizSubmitted) {
                                if (isCorrect) {
                                  optionClass = "bg-[#d8fbc2] border-on-surface text-emerald-950 font-black shadow-brutalist-sm border-2";
                                } else if (isSelected) {
                                  optionClass = "bg-red-100 border-on-surface text-red-900 font-black shadow-brutalist-sm border-2";
                                } else {
                                  optionClass = "opacity-40 bg-surface border-on-surface/20 text-on-surface/40 cursor-not-allowed";
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  disabled={quizSubmitted}
                                  onClick={() => handleSelectQuizOption(qIdx, oIdx)}
                                  className={`text-left p-3.5 border-2 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer leading-relaxed flex items-start justify-between gap-2
                                    ${optionClass}`}
                                >
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-black text-on-surface/60 shrink-0">
                                      {["(A)", "(B)", "(C)", "(D)"][oIdx]}
                                    </span>
                                    <span>{option}</span>
                                  </div>
                                  {quizSubmitted && isCorrect && <Check size={14} strokeWidth={4} className="text-emerald-950 shrink-0 mt-0.5" />}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className="p-4 bg-emerald-50 border-2 border-on-surface rounded-xl text-[11px] font-sans leading-relaxed text-on-surface/85 shadow-brutalist-sm">
                              <span className="text-primary-dark font-mono font-black uppercase text-[10px] block mb-1">
                                ✦ 2nd PUC Karnataka Board Solution & Reasoning:
                              </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Quiz Controls Footer */}
                    <div className="bg-white border-4 border-on-surface p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-brutalist">
                      {!quizSubmitted ? (
                        <>
                          <div>
                            <p className="text-[11px] font-mono text-on-surface/70 uppercase tracking-wide font-black">
                              Answered {Object.keys(userAnswers).length} of {quizQuestions.length} Questions
                            </p>
                            <span className="text-[9px] font-mono text-on-surface/40 uppercase">
                              Karnataka 2nd PUC Section-A Examination Format
                            </span>
                          </div>
                          <button
                            onClick={handleSubmitQuizAnswers}
                            disabled={Object.keys(userAnswers).length < quizQuestions.length}
                            className="brutalist-button brutalist-button-primary bg-emerald-400 px-6 py-3 text-xs font-mono font-black uppercase shadow-brutalist-sm hover:shadow-brutalist whitespace-nowrap self-stretch sm:self-auto cursor-pointer disabled:opacity-40"
                          >
                            ✓ Submit 2nd PUC Test
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="text-left space-y-0.5">
                            <span className="font-mono text-[10px] text-on-surface/50 uppercase block tracking-wider font-semibold">
                              2nd PUC Evaluation Benchmark:
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-display font-black text-on-surface leading-none">
                                Score: <span className="text-primary-dark font-black">{quizFeedbackScore}%</span>
                              </span>
                              <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border border-on-surface uppercase ${
                                (quizFeedbackScore || 0) >= 85 
                                  ? "bg-emerald-300 text-emerald-950" 
                                  : (quizFeedbackScore || 0) >= 60 
                                  ? "bg-primary text-on-surface" 
                                  : "bg-amber-200 text-amber-950"
                              }`}>
                                {(quizFeedbackScore || 0) >= 85 
                                  ? "Distinction" 
                                  : (quizFeedbackScore || 0) >= 60 
                                  ? "First Class" 
                                  : "Needs Revision"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2.5 self-stretch sm:self-auto">
                            <button
                              onClick={() => {
                                setQuizQuestions(null);
                                setUserAnswers({});
                                setQuizSubmitted(false);
                              }}
                              className="brutalist-button bg-slate-100 hover:bg-slate-200 px-5 py-3 text-xs font-mono font-black shadow-brutalist-sm cursor-pointer"
                            >
                              New 2nd PUC Test
                            </button>
                            <button
                              onClick={async () => {
                                await refreshProfile();
                                setActiveSubTab("dashboard");
                              }}
                              className="brutalist-button brutalist-button-primary bg-emerald-400 px-5 py-3 text-xs font-mono font-black shadow-brutalist-sm hover:shadow-brutalist cursor-pointer"
                            >
                              Return to Cockpit
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUB-VIEW: 6. REAL-TIME PROGRESS & USER STUDY TIMING */}
            {activeSubTab === "progress" && (
              <RealtimeProgressView 
                onNavigateSubjectBots={() => setActiveSubTab("subject-bots")}
                onNavigateQuizzes={() => setActiveSubTab("quizzes")}
              />
            )}

            {/* SUB-VIEW: 7. PROFILE SETTINGS */}
            {activeSubTab === "profile" && (
              <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Save Feedback Banner */}
                {profileSaveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-100 border-4 border-on-surface rounded-xl shadow-brutalist flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 size={20} className="text-emerald-800 shrink-0" />
                      <span className="text-xs font-mono font-black text-emerald-950 uppercase tracking-tight">
                        {profileSaveSuccess}
                      </span>
                    </div>
                    <button 
                      onClick={() => setProfileSaveSuccess(null)}
                      className="text-emerald-900 font-mono text-xs font-black hover:opacity-75 cursor-pointer"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}

                {/* Cloud Sync Feedback Banner */}
                {syncNotice && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-primary/25 border-4 border-on-surface rounded-xl shadow-brutalist flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={20} className="text-on-surface shrink-0" />
                      <span className="text-xs font-mono font-black text-on-surface uppercase tracking-tight">
                        {syncNotice}
                      </span>
                    </div>
                    <button 
                      onClick={() => setSyncNotice(null)}
                      className="text-on-surface font-mono text-xs font-black hover:opacity-75 cursor-pointer"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}

                {/* Profile cockpit main summary */}
                <div className="p-6 md:p-8 bg-white border-4 border-on-surface rounded-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left shadow-brutalist">
                  <div className="w-24 h-24 bg-primary border-4 border-on-surface rounded-2xl flex items-center justify-center font-display text-4xl text-on-surface font-black shadow-brutalist shrink-0">
                    {(profile?.name || editName || "S").substring(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-3 flex-1 min-w-0">
                    <div>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span className="font-mono text-[9px] font-black text-primary-dark uppercase tracking-widest px-2.5 py-0.5 bg-primary/20 border-2 border-on-surface rounded-md shadow-brutalist-sm">
                          // 2ND PUC SCHOLAR COCKPIT
                        </span>
                        <span className="font-mono text-[9px] font-black text-emerald-900 uppercase tracking-widest px-2 py-0.5 bg-emerald-100 border-2 border-on-surface rounded-md">
                          {profile?.stream || editStream || "2nd PUC (PCMB)"}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-display font-black text-on-surface uppercase tracking-tight leading-none mt-2 truncate">
                        {profile?.name || editName || "Student Scholar"}
                      </h3>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1.5">
                        <span className="font-mono text-[10px] text-on-surface/60 uppercase font-black tracking-tight bg-surface py-1 px-2.5 border-2 border-on-surface rounded-lg shadow-brutalist-sm truncate max-w-full">
                          {profile?.email || "student@eduswathi.org"}
                        </span>
                        {(profile?.college || editCollege) && (
                          <span className="font-mono text-[10px] text-on-surface/70 uppercase font-bold tracking-tight bg-slate-100 py-1 px-2.5 border border-on-surface/30 rounded-lg flex items-center gap-1">
                            <School size={12} />
                            {profile?.college || editCollege}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Readiness Progress */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[9px] font-mono font-black uppercase text-on-surface/70 mb-1">
                        <span>Karnataka 2nd PUC Board Exam Readiness</span>
                        <span className="text-emerald-700 font-bold">
                          {Math.min(65 + Math.floor((profile?.xp || 0) / 10), 98)}% Prepared
                        </span>
                      </div>
                      <div className="w-full bg-surface border-2 border-on-surface h-3 rounded-full overflow-hidden shadow-brutalist-sm">
                        <div 
                          className="h-full bg-emerald-400 border-r-2 border-on-surface transition-all duration-700" 
                          style={{ width: `${Math.min(65 + Math.floor((profile?.xp || 0) / 10), 98)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                      <div className="px-3.5 py-2 bg-surface border-2 border-on-surface rounded-lg shadow-brutalist-sm text-center md:text-left">
                        <span className="font-mono text-[8px] text-on-surface/50 block uppercase font-black tracking-wider">// STREAK</span>
                        <span className="font-display text-base font-black text-on-surface">🔥 {profile?.streak || 1} DAYS</span>
                      </div>
                      <div className="px-3.5 py-2 bg-surface border-2 border-on-surface rounded-lg shadow-brutalist-sm text-center md:text-left">
                        <span className="font-mono text-[8px] text-on-surface/50 block uppercase font-black tracking-wider">// COGNITIVE XP</span>
                        <span className="font-display text-base font-black text-on-surface">⚡ {profile?.xp || 0} XP</span>
                      </div>
                      <div className="px-3.5 py-2 bg-surface border-2 border-on-surface rounded-lg shadow-brutalist-sm text-center md:text-left">
                        <span className="font-mono text-[8px] text-on-surface/50 block uppercase font-black tracking-wider">// FOCUS LOGGED</span>
                        <span className="font-display text-base font-black text-on-surface">⏱️ {pomodoroTotalMinutes} MINS</span>
                      </div>
                      <div className="px-3.5 py-2 bg-surface border-2 border-on-surface rounded-lg shadow-brutalist-sm text-center md:text-left">
                        <span className="font-mono text-[8px] text-on-surface/50 block uppercase font-black tracking-wider">// TARGET EXAM</span>
                        <span className="font-display text-xs font-black text-on-surface block mt-1">
                          {profile?.targetExam || editTargetExam || "Board Exam 2025"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EDIT STUDENT PROFILE FORM */}
                <div className="bg-white border-4 border-on-surface p-6 md:p-8 rounded-2xl space-y-6 shadow-brutalist">
                  <div className="border-b-2 border-on-surface pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-display font-black text-on-surface uppercase tracking-tight leading-none flex items-center gap-2">
                        <Edit3 size={18} />
                        Student Academic Profile
                      </h4>
                      <span className="text-[10px] font-mono text-on-surface/50 uppercase tracking-widest mt-1 block">
                        // CUSTOMIZE_TARGET_EXAM_AND_STREAM
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] font-black text-on-surface uppercase tracking-wider block">
                          Student Display Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full p-3 bg-slate-50 border-2 border-on-surface rounded-xl text-xs font-sans font-bold text-on-surface focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary shadow-brutalist-sm"
                        />
                      </div>

                      {/* Stream Selection */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] font-black text-on-surface uppercase tracking-wider block">
                          2nd PUC Academic Stream
                        </label>
                        <select
                          value={editStream}
                          onChange={(e) => setEditStream(e.target.value)}
                          className="w-full p-3 bg-slate-50 border-2 border-on-surface rounded-xl text-xs font-sans font-bold text-on-surface focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary shadow-brutalist-sm cursor-pointer"
                        >
                          <option value="2nd PUC (PCMB)">2nd PUC Science (PCMB - Physics, Chem, Math, Bio)</option>
                          <option value="2nd PUC (PCMC)">2nd PUC Science (PCMC - Physics, Chem, Math, Comp Sci)</option>
                          <option value="2nd PUC (Commerce)">2nd PUC Commerce (CEBA / SEBA / HEBA)</option>
                          <option value="2nd PUC (Arts)">2nd PUC Arts (HEPS / HEGP)</option>
                          <option value="1st PUC (Science)">1st PUC (Class 11 Science)</option>
                        </select>
                      </div>

                      {/* Target Examination */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] font-black text-on-surface uppercase tracking-wider block">
                          Primary Target Examination
                        </label>
                        <select
                          value={editTargetExam}
                          onChange={(e) => setEditTargetExam(e.target.value)}
                          className="w-full p-3 bg-slate-50 border-2 border-on-surface rounded-xl text-xs font-sans font-bold text-on-surface focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary shadow-brutalist-sm cursor-pointer"
                        >
                          <option value="Karnataka 2nd PUC Board Exam 2025">Karnataka 2nd PUC Board Exam (KSEAB 2025)</option>
                          <option value="KCET (Karnataka Common Entrance Test)">KCET (Karnataka Common Entrance Test)</option>
                          <option value="NEET-UG (Medical Entrance)">NEET-UG (Medical Entrance)</option>
                          <option value="JEE Main (Engineering)">JEE Main (Engineering)</option>
                          <option value="Both 2nd PUC Board + KCET">Combined 2nd PUC Board + KCET</option>
                        </select>
                      </div>

                      {/* College / Institution Name */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] font-black text-on-surface uppercase tracking-wider block">
                          PU College / Institution Name
                        </label>
                        <input
                          type="text"
                          value={editCollege}
                          onChange={(e) => setEditCollege(e.target.value)}
                          placeholder="e.g., Vijaya PU College, National PU College"
                          className="w-full p-3 bg-slate-50 border-2 border-on-surface rounded-xl text-xs font-sans font-bold text-on-surface focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary shadow-brutalist-sm"
                        />
                      </div>

                      {/* Preferred Subject */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] font-black text-on-surface uppercase tracking-wider block">
                          Priority Subject Focus
                        </label>
                        <select
                          value={editPreferredSubject}
                          onChange={(e) => setEditPreferredSubject(e.target.value)}
                          className="w-full p-3 bg-slate-50 border-2 border-on-surface rounded-xl text-xs font-sans font-bold text-on-surface focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary shadow-brutalist-sm cursor-pointer"
                        >
                          <option value="Physics">Physics (Mechanics, Electromagnetism, Modern Physics)</option>
                          <option value="Chemistry">Chemistry (Physical, Inorganic, Organic)</option>
                          <option value="Mathematics">Mathematics (Calculus, Vectors, Probability)</option>
                          <option value="Biology">Biology (Reproduction, Genetics, Biotechnology)</option>
                          <option value="Computer Science">Computer Science (C++, Data Structures, SQL)</option>
                        </select>
                      </div>

                      {/* Study Goal / Bio */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="font-mono text-[10px] font-black text-on-surface uppercase tracking-wider block">
                          Academic Study Goal / Bio
                        </label>
                        <textarea
                          rows={2}
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          placeholder="e.g., Aiming for 95%+ marks in Karnataka 2nd PUC Annual Exam and high rank in KCET."
                          className="w-full p-3 bg-slate-50 border-2 border-on-surface rounded-xl text-xs font-sans font-medium text-on-surface focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary shadow-brutalist-sm"
                        />
                      </div>

                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-end">
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="brutalist-button brutalist-button-primary bg-primary hover:bg-accent text-on-surface px-6 py-3 text-xs font-mono font-black uppercase tracking-wider rounded-xl border-2 border-on-surface shadow-brutalist-sm hover:shadow-brutalist flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSavingProfile ? (
                          <Loader2 size={16} className="animate-spin text-on-surface" />
                        ) : (
                          <Save size={16} className="text-on-surface" />
                        )}
                        <span>{isSavingProfile ? "Saving Profile..." : "Save Profile Details"}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Awarded Cognitive Badge List with Interactive Gamification */}
                {confettiBadge && (
                  <div className="p-4 bg-primary text-on-surface border-4 border-on-surface rounded-xl shadow-brutalist flex items-center justify-between gap-4 animate-bounce">
                    <div className="flex items-center gap-3">
                      <Sparkles className="animate-spin text-on-surface shrink-0" size={24} />
                      <div>
                        <h5 className="font-display font-black text-xs uppercase leading-none">Cognitive Achievement Unlocked & Claimed!</h5>
                        <p className="text-[10px] font-mono mt-1">// XP Credited Directly To Distributed Study Vault</p>
                      </div>
                    </div>
                    <button onClick={() => setConfettiBadge(null)} className="font-extrabold font-mono hover:bg-white/20 p-1 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer">✕</button>
                  </div>
                )}

                <div className="bg-white border-4 border-on-surface p-6 lg:p-8 rounded-xl space-y-6 shadow-brutalist">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-display font-black text-on-surface uppercase tracking-tight leading-none">Knowledge Achievements & Badges</h4>
                      <span className="text-[10px] font-mono text-on-surface/40 uppercase tracking-widest mt-1 block">// EARNED_ACHIEVEMENTS_LOGS</span>
                    </div>

                    {/* Neo-brutalist filter triggers */}
                    <div className="flex items-center gap-2">
                      {(["all", "unlocked", "locked"] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setBadgeFilter(filter)}
                          className={`px-3 py-1 text-[9px] uppercase font-mono font-black border-2 border-on-surface rounded-md shadow-brutalist-sm transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                            badgeFilter === filter 
                              ? "bg-primary text-on-surface" 
                              : "bg-surface text-on-surface/60 hover:text-on-surface"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Badges calculation definition inside view */}
                  {(() => {
                    const lastActiveHours = profile?.lastActive ? new Date(profile.lastActive).getHours() : new Date().getHours();
                    const isEarlyBird = lastActiveHours >= 4 && lastActiveHours < 9;

                    const systemBadges = [
                      {
                        id: "socratic_pioneer",
                        title: "Socratic Pioneer",
                        unlocked: true,
                        desc: "Successfully booted the neural Eduswathi scholar cockpit.",
                        xpReward: 20,
                        Icon: Sparkles,
                        progressText: "Completed",
                        pct: 100
                      },
                      {
                        id: "early_bird",
                        title: "Early Bird",
                        unlocked: isEarlyBird,
                        desc: "Log active study between 4:00 AM and 9:00 AM (Active clock time).",
                        xpReward: 50,
                        Icon: Clock,
                        progressText: isEarlyBird ? "Completed" : `Last active hour: ${lastActiveHours}:00 (Target: 4-9 AM)`,
                        pct: isEarlyBird ? 100 : 0
                      },
                      {
                        id: "deep_learner",
                        title: "Deep Learner",
                        unlocked: pomodoroTotalMinutes >= 25,
                        desc: "Maintain undivided focus for 25+ minutes in study waves.",
                        xpReward: 75,
                        Icon: Timer,
                        progressText: `${pomodoroTotalMinutes}/25 focus mins`,
                        pct: Math.min((pomodoroTotalMinutes / 25) * 100, 100)
                      },
                      {
                        id: "continuous_synapses",
                        title: "Continuous Synapses",
                        unlocked: (profile?.streak || 1) >= 3,
                        desc: "Maintain a daily learning check-in streak of at least 3 days.",
                        xpReward: 50,
                        Icon: TrendingUp,
                        progressText: `${profile?.streak || 1}/3 days`,
                        pct: Math.min(((profile?.streak || 1) / 3) * 100, 100)
                      },
                      {
                        id: "socratic_champion",
                        title: "Socratic Champion",
                        unlocked: (profile?.xp || 0) >= 150,
                        desc: "Achieve 150+ XP in academic feedback matrices.",
                        xpReward: 100,
                        Icon: Brain,
                        progressText: `${profile?.xp || 0}/150 XP`,
                        pct: Math.min(((profile?.xp || 0) / 150) * 100, 100)
                      },
                      {
                        id: "polymath_scholar",
                        title: "Polymath Scholar",
                        unlocked: (profile?.completedCourses?.length || 0) >= 1,
                        desc: "Graduate from at least 1 academic course pathway.",
                        xpReward: 150,
                        Icon: GraduationCap,
                        progressText: `${profile?.completedCourses?.length || 0}/1 courses completed`,
                        pct: Math.min(((profile?.completedCourses?.length || 0) / 1) * 100, 100)
                      }
                    ];

                    const filtered = systemBadges.filter((b) => {
                      if (badgeFilter === "unlocked") return b.unlocked;
                      if (badgeFilter === "locked") return !b.unlocked;
                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="py-8 text-center text-on-surface/40 font-mono text-[9px] border-2 border-dashed border-on-surface/30 rounded-xl bg-surface uppercase">
                          No {badgeFilter} achievements found here. Keep studying!
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map((badge) => {
                          const isClaimed = claimedBadges.includes(badge.id);
                          return (
                            <div
                              key={badge.id}
                              className={`p-4 border-4 rounded-xl flex flex-col justify-between gap-4 transition-all shadow-brutalist-sm relative overflow-hidden bg-white ${
                                badge.unlocked 
                                  ? "border-on-surface" 
                                  : "border-on-surface/35 grayscale opacity-60"
                              }`}
                            >
                              {/* Badge Metadata Header */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <div className="p-1 border-2 border-on-surface bg-primary/20 rounded-md">
                                      <badge.Icon size={16} className="text-on-surface" />
                                    </div>
                                    <span className="text-xs font-black block font-sans text-on-surface uppercase tracking-tight leading-none">
                                      {badge.title}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-on-surface/70 lowercase font-medium pr-2 md:pr-0">
                                    {badge.desc}
                                  </p>
                                </div>
                                <span className={`shrink-0 px-1.5 py-0.5 rounded-md text-[8px] font-mono font-black border-2 border-on-surface uppercase ${
                                  badge.unlocked ? "bg-primary text-on-surface" : "bg-surface text-on-surface/30 border-dashed"
                                }`}>
                                  {badge.unlocked ? "unlocked" : "locked"}
                                </span>
                              </div>

                              {/* Progress Trackers */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[8px] font-mono font-black text-on-surface/60 uppercase">
                                  <span>🚀 {badge.progressText}</span>
                                  <span>{Math.round(badge.pct)}%</span>
                                </div>
                                <div className="w-full bg-surface border-2 border-on-surface h-2.5 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all duration-500 border-r-2 border-on-surface" 
                                    style={{ width: `${badge.pct}%` }}
                                  />
                                </div>
                              </div>

                              {/* Gamified Action Triggers */}
                              <div className="flex items-center justify-between gap-2 border-t-2 border-dashed border-on-surface/30 pt-3">
                                <span className="font-mono text-[9px] font-black text-primary-dark uppercase">
                                  🏆 Reward: +{badge.xpReward} XP
                                </span>

                                {badge.unlocked ? (
                                  isClaimed ? (
                                    <button 
                                      disabled
                                      className="px-2 py-1 text-[8px] font-mono font-black uppercase tracking-tight bg-emerald-50 text-emerald-700 border-2 border-emerald-400 rounded-md cursor-not-allowed"
                                    >
                                      Claimed ✓
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleClaimReward(badge.id, badge.xpReward)}
                                      className="px-2 py-1 text-[8px] font-mono font-black uppercase tracking-tight bg-primary hover:bg-accent text-on-surface border-2 border-on-surface rounded-md shadow-brutalist-sm transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                                    >
                                      Claim XP
                                    </button>
                                  )
                                ) : (
                                  <button
                                    disabled
                                    className="px-2 py-1 text-[8px] font-mono font-black uppercase tracking-tight bg-surface text-on-surface/30 border-2 border-on-surface/30 border-dashed rounded-md cursor-not-allowed"
                                  >
                                    Locked
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Profile Controls Row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleResyncProfile}
                    disabled={isSyncingProfile}
                    className="brutalist-button brutalist-button-primary flex-1 p-4 text-xs font-mono font-black uppercase tracking-wider rounded-xl border-4 border-on-surface shadow-brutalist-sm hover:shadow-brutalist flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSyncingProfile ? <Loader2 size={16} className="animate-spin text-on-surface" /> : <RotateCcw size={16} className="text-on-surface" />}
                    <span>{isSyncingProfile ? "Syncing..." : "Resync Cloud Database"}</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      logout().catch(() => {});
                    }}
                    className="brutalist-button bg-red-400 hover:bg-red-500 text-on-surface px-6 py-4 text-xs font-mono font-black uppercase tracking-wider rounded-xl border-4 border-on-surface shadow-brutalist-sm hover:shadow-brutalist shrink-0 cursor-pointer"
                  >
                    Logout Session
                  </button>
                </div>

              </div>
            )}

          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* NEURAL STUDY POMODORO SYSTEM (FLOATABLE & MOVEABLE WIDGET) */}
      {/* ========================================================================= */}
      <motion.div 
        drag
        dragMomentum={false}
        onDragStart={() => {
          isDraggingPomoRef.current = true;
          pomoDragDistanceRef.current = 0;
        }}
        onDrag={(_, info) => {
          pomoDragDistanceRef.current += Math.abs(info.delta.x) + Math.abs(info.delta.y);
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDraggingPomoRef.current = false;
          }, 80);
        }}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-mono touch-none select-none"
        id="moveable-pomodoro-container"
      >
        
        {/* Toggleable alert alert notification */}
        {pomodoroAlert && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xs bg-yellow-300 border-4 border-on-surface p-4 rounded-xl shadow-brutalist text-xs text-on-surface relative font-bold"
          >
            <button 
              onClick={() => setPomodoroAlert(null)}
              className="absolute top-1.5 right-2 font-black cursor-pointer hover:text-red-600"
            >
              ×
            </button>
            <p className="mr-3">{pomodoroAlert}</p>
          </motion.div>
        )}

        {/* Small Ticking Bubble Trigger (Moveable anywhere!) */}
        {!showPomodoroWidget && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onPointerDown={() => {
              pomoDragDistanceRef.current = 0;
            }}
            onClick={() => {
              if (pomoDragDistanceRef.current > 6 || isDraggingPomoRef.current) return;
              setShowPomodoroWidget(true);
            }}
            className="flex items-center gap-2.5 bg-yellow-300 hover:bg-yellow-400 border-4 border-on-surface px-4 py-3.5 rounded-full shadow-brutalist cursor-grab active:cursor-grabbing text-on-surface transition-all select-none"
            id="pomo-floating-trigger"
            title="Drag anywhere to move • Click to expand"
          >
            <div className={`w-3.5 h-3.5 rounded-full relative ${pomodoroIsActive ? "bg-red-500 animate-pulse" : "bg-on-surface/35"}`}>
              {pomodoroIsActive && <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></span>}
            </div>
            <span className="font-display font-black text-xs uppercase tracking-tight">
              {pomodoroMode === "focus" ? "🎯 Focus" : "☕ Break"}
            </span>
            <span className="font-mono font-black text-sm bg-white px-2 py-0.5 rounded-xl border-2 border-on-surface">
              {Math.floor(pomodoroTimeLeft / 60).toString().padStart(2, "0")}:
              {(pomodoroTimeLeft % 60).toString().padStart(2, "0")}
            </span>
          </motion.div>
        )}

        {/* Dynamic Expanded Brutalist Study Timer Console */}
        {showPomodoroWidget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-80 bg-white border-4 border-on-surface p-5 rounded-2xl shadow-brutalist text-on-surface flex flex-col space-y-4 cursor-default"
            id="pomo-expanded-console"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-on-surface pb-2.5 cursor-grab active:cursor-grabbing" title="Drag to move anywhere">
              <div className="flex items-center gap-1.5">
                <Timer size={18} className="text-primary-dark" />
                <h4 className="font-display font-black text-sm uppercase tracking-tight text-on-surface leading-none">Focus Chronometer</h4>
              </div>
              <button 
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPomodoroWidget(false);
                }}
                className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-red-400 border-2 border-on-surface rounded-lg text-xs font-black transition-colors cursor-pointer text-on-surface"
                title="Minimize to floating pill"
              >
                —
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg border-2 border-on-surface">
              {[
                { label: "Focus", id: "focus" as const },
                { label: "Short", id: "shortBreak" as const },
                { label: "Long", id: "longBreak" as const }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualSwitchMode(tab.id);
                  }}
                  className={`py-1.5 text-[9px] font-mono font-black uppercase text-center rounded border-2 transition-all cursor-pointer
                    ${pomodoroMode === tab.id 
                      ? "bg-primary-dark text-white border-on-surface shadow-brutalist-sm" 
                      : "bg-transparent text-on-surface/60 border-transparent hover:text-on-surface"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main Timer Dial */}
            <div className="bg-slate-50 border-4 border-on-surface rounded-xl p-5 text-center relative overflow-hidden flex flex-col items-center justify-center space-y-1">
              <span className="font-mono font-black text-4xl text-on-surface tracking-tight leading-none animate-none">
                {Math.floor(pomodoroTimeLeft / 60).toString().padStart(2, "0")}:
                {(pomodoroTimeLeft % 60).toString().padStart(2, "0")}
              </span>
              <span className="text-[8px] font-mono uppercase font-black text-on-surface/40 tracking-wider">
                {pomodoroIsActive ? "🔊 Cycle active..." : "▫ paused"}
              </span>
            </div>

            {/* Context Notes */}
            <div className="space-y-1">
              <span className="font-mono text-[8px] font-black text-on-surface/50 uppercase tracking-widest block px-1">// FOCUS TARGET LOG</span>
              <input
                type="text"
                value={pomodoroFocusNotes}
                onChange={(e) => setPomodoroFocusNotes(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder="Ex. Organic reaction mechanisms..."
                className="w-full text-[10px] font-mono p-2.5 bg-white border-2 border-on-surface rounded-lg placeholder:text-on-surface/30 focus:bg-primary/5 focus:outline-none"
              />
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-12 gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPomodoroIsActive(!pomodoroIsActive);
                }}
                className={`col-span-9 py-2.5 rounded-xl border-2 border-on-surface hover:shadow-brutalist-sm text-[10px] uppercase font-mono font-black text-center flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer
                  ${pomodoroIsActive 
                    ? "bg-red-400 hover:bg-red-500 text-on-surface" 
                    : "bg-emerald-400 hover:bg-emerald-500 text-on-surface"}`}
              >
                {pomodoroIsActive ? (
                  <>
                    <Pause size={12} strokeWidth={3} />
                    <span>Pause Sprint</span>
                  </>
                ) : (
                  <>
                    <Play size={12} strokeWidth={3} />
                    <span>Initiate Sprint</span>
                  </>
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleManualSwitchMode(pomodoroMode);
                }}
                className="col-span-3 py-2.5 rounded-xl border-2 border-on-surface bg-slate-100 hover:bg-slate-200 hover:shadow-brutalist-sm flex items-center justify-center transition-all active:scale-95 cursor-pointer text-on-surface"
              >
                <div className="flex items-center gap-1 font-mono text-[10px] font-black uppercase">
                  <RotateCcw size={12} strokeWidth={3} />
                </div>
              </button>
            </div>

            {/* Session Stats */}
            <div className="bg-yellow-100/60 border-2 border-on-surface rounded-xl p-3 flex items-center gap-3">
              <div className="p-1.5 bg-yellow-300 border border-on-surface rounded-lg shrink-0">
                <Coffee size={14} className="text-on-surface" />
              </div>
              <div className="font-mono text-[8.5px] leading-tight text-on-surface/85">
                <p className="font-black uppercase tracking-wider text-on-surface">// Cognitive session stats</p>
                <p className="mt-0.5">Completed Waves: <b className="text-primary-dark">{pomodoroCompletedCycles} runs</b></p>
                <p>Total Focus Time: <b className="text-primary-dark">{pomodoroTotalMinutes} minutes</b></p>
              </div>
            </div>

          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
