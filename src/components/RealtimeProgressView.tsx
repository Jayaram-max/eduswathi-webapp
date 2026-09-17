import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRealtimeTiming } from "../hooks/useRealtimeTiming";
import { DayTimingRecord } from "../services/userTimingService";
import { useFirebase } from "../context/FirebaseContext";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  TrendingUp,
  Download,
  Target,
  BarChart3,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
  Tag
} from "lucide-react";

const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "General Revision"
];

const SUBJECT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  Mathematics: { bg: "bg-[#AFF833]", text: "text-on-surface", bar: "bg-[#85D40D]" },
  Physics: { bg: "bg-[#70D6FF]", text: "text-on-surface", bar: "bg-[#38B6FF]" },
  Chemistry: { bg: "bg-[#FF9F1C]", text: "text-on-surface", bar: "bg-[#E07A00]" },
  Biology: { bg: "bg-[#2EC4B6]", text: "text-on-surface", bar: "bg-[#1B9E93]" },
  "Computer Science": { bg: "bg-[#C77DFF]", text: "text-on-surface", bar: "bg-[#9D4EDD]" },
  "General Revision": { bg: "bg-surface-container", text: "text-on-surface", bar: "bg-primary" }
};

interface RealtimeProgressViewProps {
  onNavigateSubjectBots?: () => void;
  onNavigateQuizzes?: () => void;
}

export const RealtimeProgressView: React.FC<RealtimeProgressViewProps> = ({
  onNavigateSubjectBots,
  onNavigateQuizzes
}) => {
  const {
    isRunning,
    currentSessionSeconds,
    activeSubject,
    todayTotalSeconds,
    dailyGoalMinutes,
    allTimeTotalSeconds,
    dailyHistory,
    recentSessions,
    formatHMS,
    formatDigitalStopwatch,
    toggleRunning,
    setActiveSubject,
    setDailyGoalMinutes,
    recordAndFinishSession,
    resetCurrentSession
  } = useRealtimeTiming();

  const { profile, completePomodoroSession } = useFirebase();
  const [sessionNotes, setSessionNotes] = useState("");
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [customGoalInput, setCustomGoalInput] = useState(dailyGoalMinutes.toString());

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleFinishSession = async () => {
    if (currentSessionSeconds < 5) {
      showToast("Session too short to record (<5s). Keep studying!");
      return;
    }

    const durationMins = Math.max(1, Math.round(currentSessionSeconds / 60));
    const saved = recordAndFinishSession(sessionNotes.trim() || undefined);
    setSessionNotes("");

    if (saved) {
      showToast(`🎉 Session saved: ${formatHMS(saved.durationSeconds)} on ${saved.subject}! +${saved.xpEarned} XP`);
      try {
        await completePomodoroSession(durationMins);
      } catch (err) {
        console.warn("Could not sync XP with firebase:", err);
      }
    }
  };

  // Calculate today's goal percentage
  const todayMinutes = Math.round(todayTotalSeconds / 60);
  const goalPercent = Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100));

  // Compute 7-day history list
  const historyEntries: DayTimingRecord[] = Object.values(dailyHistory) as DayTimingRecord[];
  const maxDaySeconds = Math.max(
    ...historyEntries.map((h: DayTimingRecord) => h.totalSeconds),
    3600
  );

  // Compute subject breakdown for today or all history
  const todayDateKey = new Date().toISOString().split("T")[0];
  const todayRecord = dailyHistory[todayDateKey] || {
    totalSeconds: todayTotalSeconds,
    subjectBreakdown: {}
  };

  // Combine subject stats
  const subjectAggregates: Record<string, number> = {};
  SUBJECT_OPTIONS.forEach((subj) => {
    subjectAggregates[subj] = todayRecord.subjectBreakdown?.[subj] || 0;
  });

  // Calculate estimated XP from today
  const estimatedTodayXP = Math.round((todayTotalSeconds / 60) * 0.75);

  const handleSaveDailyGoal = () => {
    const parsed = parseInt(customGoalInput, 10);
    if (!isNaN(parsed) && parsed >= 15 && parsed <= 720) {
      setDailyGoalMinutes(parsed);
      setIsGoalModalOpen(false);
      showToast(`🎯 Daily goal updated to ${parsed} minutes!`);
    } else {
      showToast("Please enter a valid goal between 15 and 720 minutes.");
    }
  };

  const handleExportHistory = () => {
    const exportData = {
      user: profile?.name || "Student",
      exportedAt: new Date().toISOString(),
      todayTotalSeconds,
      dailyGoalMinutes,
      allTimeTotalSeconds,
      recentSessions,
      dailyHistory
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eduswathi_study_timing_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Study timing log exported successfully!");
  };

  return (
    <div className="space-y-6 sm:space-y-8" id="realtime-user-timing-progress-page">
      {/* Toast Feedback */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-primary text-on-surface border-3 border-on-surface px-4 py-3 rounded-xl shadow-brutalist font-mono text-xs font-black uppercase flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-white border-3 sm:border-4 border-on-surface rounded-2xl p-4 sm:p-6 md:p-8 shadow-brutalist flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] sm:text-xs font-black uppercase px-2.5 py-1 bg-primary border-2 border-on-surface rounded-md shadow-brutalist-sm inline-flex items-center gap-1.5">
              <Clock size={13} /> REAL-TIME USER TIMING
            </span>
            <div className={`px-2.5 py-1 border-2 border-on-surface rounded-md font-mono text-[10px] sm:text-xs font-black uppercase flex items-center gap-1.5 shadow-brutalist-sm ${
              isRunning ? "bg-emerald-100 text-emerald-950" : "bg-amber-100 text-amber-950"
            }`}>
              <span className={`w-2 h-2 rounded-full ${isRunning ? "bg-emerald-600 animate-ping" : "bg-amber-600"}`} />
              <span>{isRunning ? "LIVE ENGINE RUNNING" : "TIMER PAUSED"}</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-on-surface">
            Study Progression & Real-Time Timing
          </h2>
          <p className="font-sans text-xs sm:text-sm text-secondary max-w-2xl">
            Continuous real-time study tracking active down to the second. Time invested across AI Subject Tutors, active recall quizzes, and syllabus notes is verified into your daily analytics ledger.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleExportHistory}
            className="px-3 py-2 bg-surface hover:bg-white border-2 border-on-surface rounded-xl font-mono text-[11px] font-black uppercase shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer flex items-center gap-1.5"
            title="Download JSON Timing Data"
          >
            <Download size={14} /> Export Log
          </button>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="px-3.5 py-2 bg-primary hover:bg-primary-dark border-2 border-on-surface rounded-xl font-mono text-[11px] font-black uppercase shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Target size={14} /> Goal: {dailyGoalMinutes}m
          </button>
        </div>
      </div>

      {/* Goal Adjustment Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border-4 border-on-surface rounded-2xl p-6 max-w-sm w-full shadow-brutalist space-y-4">
            <h3 className="font-display font-black text-lg uppercase">Set Daily Study Goal</h3>
            <p className="text-xs text-secondary">Choose how many minutes of active focused revision you plan to accomplish today:</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="15"
                max="720"
                value={customGoalInput}
                onChange={(e) => setCustomGoalInput(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-on-surface rounded-xl font-mono text-base font-black"
              />
              <span className="font-mono text-sm font-black">Minutes</span>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className="px-3 py-2 border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase bg-surface hover:bg-surface-container cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDailyGoal}
                className="px-4 py-2 border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase bg-primary hover:bg-primary-dark shadow-brutalist-sm cursor-pointer"
              >
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3 Core Cockpit Cards: Live Session Stopwatch, Today's Cumulative, and Weekly Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Real-Time Active Study Session Stopwatch (5 cols) */}
        <div className="lg:col-span-5 bg-white border-3 sm:border-4 border-on-surface rounded-2xl p-5 sm:p-6 shadow-brutalist space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <Clock size={13} className="text-primary-dark" /> CURRENT ACTIVE SESSION
              </span>
              <span className={`px-2 py-0.5 border border-on-surface rounded-md font-mono text-[9px] font-black uppercase flex items-center gap-1 ${
                isRunning ? "bg-emerald-100 text-emerald-950" : "bg-amber-100 text-amber-950"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-emerald-600 animate-pulse" : "bg-amber-600"}`} />
                {isRunning ? "Ticking Real-Time" : "Timer Paused"}
              </span>
            </div>

            {/* Big Digital Stopwatch Display */}
            <div className="bg-surface border-3 border-on-surface rounded-xl p-4 text-center shadow-brutalist-sm relative overflow-hidden">
              <div className="font-mono font-black text-4xl sm:text-5xl md:text-6xl text-on-surface tracking-tight py-1 select-none">
                {formatDigitalStopwatch(currentSessionSeconds)}
              </div>
              <div className="font-mono text-[10px] sm:text-[11px] font-black uppercase text-secondary flex items-center justify-center gap-2 mt-1">
                <span>Subject:</span>
                <span className="text-on-surface bg-primary/40 px-2 py-0.5 rounded border border-on-surface">
                  {activeSubject}
                </span>
                <span>•</span>
                <span className="text-emerald-700">
                  +{Math.max(1, Math.round(currentSessionSeconds / 120))} XP Earned
                </span>
              </div>
            </div>

            {/* Subject Selector for Active Timing */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-black uppercase tracking-wider text-secondary flex items-center gap-1">
                <Tag size={12} /> Focus Discipline
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {SUBJECT_OPTIONS.map((subj) => {
                  const isSelected = activeSubject === subj;
                  return (
                    <button
                      key={subj}
                      onClick={() => setActiveSubject(subj)}
                      className={`px-2 py-1.5 rounded-lg border-2 border-on-surface font-mono text-[10px] font-black truncate transition-all cursor-pointer ${
                        isSelected
                          ? `${SUBJECT_COLORS[subj]?.bg || "bg-primary"} text-on-surface shadow-brutalist-sm -translate-y-0.5`
                          : "bg-surface hover:bg-white text-secondary"
                      }`}
                      title={subj}
                    >
                      {subj.replace("Computer Science", "CS").replace("General Revision", "General")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session Optional Note Input */}
            <div className="space-y-1">
              <input
                type="text"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Session focus topic (e.g. Organic Reaction Mechanisms)..."
                className="w-full px-3 py-1.5 bg-surface border-2 border-on-surface rounded-xl font-sans text-xs focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="pt-2 border-t-2 border-on-surface/20 flex flex-wrap items-center gap-2">
            <button
              onClick={toggleRunning}
              className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl border-2 border-on-surface font-mono text-xs font-black uppercase shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isRunning ? "bg-amber-300 hover:bg-amber-400 text-on-surface" : "bg-primary hover:bg-primary-dark text-on-surface"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause size={15} strokeWidth={3} /> Pause Timer
                </>
              ) : (
                <>
                  <Play size={15} strokeWidth={3} /> Resume Timer
                </>
              )}
            </button>

            <button
              onClick={handleFinishSession}
              disabled={currentSessionSeconds < 5}
              className="py-2.5 px-4 rounded-xl border-2 border-on-surface font-mono text-xs font-black uppercase bg-emerald-400 hover:bg-emerald-500 text-on-surface shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              title="Save this study block to ledger"
            >
              <Check size={15} strokeWidth={3} /> Save Session
            </button>

            <button
              onClick={resetCurrentSession}
              className="p-2.5 rounded-xl border-2 border-on-surface font-mono text-xs font-black uppercase bg-surface hover:bg-rose-100 text-on-surface shadow-brutalist-sm transition-all cursor-pointer"
              title="Reset Stopwatch"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Card 2: Today's Cumulative Study Time (4 cols) */}
        <div className="lg:col-span-4 bg-white border-3 sm:border-4 border-on-surface rounded-2xl p-5 sm:p-6 shadow-brutalist space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <Target size={13} className="text-primary-dark" /> TODAY'S TIMING ACCUMULATION
              </span>
              <span className="font-mono text-[10px] font-black px-2 py-0.5 bg-primary/30 border border-on-surface rounded-md">
                Goal: {dailyGoalMinutes}m
              </span>
            </div>

            {/* Time metric callout */}
            <div className="space-y-1">
              <div className="font-mono font-black text-3xl sm:text-4xl text-on-surface tracking-tight">
                {formatHMS(todayTotalSeconds)}
              </div>
              <p className="font-sans text-xs text-secondary">
                {todayMinutes >= dailyGoalMinutes
                  ? "🎯 Daily study milestone unlocked! Excellent cognitive endurance."
                  : `${dailyGoalMinutes - todayMinutes} more minutes to complete today's target.`}
              </p>
            </div>

            {/* Progress Bar Towards Goal */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between font-mono text-[10px] font-black uppercase text-secondary">
                <span>Goal Progression</span>
                <span className="text-on-surface font-black">{goalPercent}%</span>
              </div>
              <div className="h-4 w-full bg-surface border-2 border-on-surface rounded-lg overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goalPercent}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-primary rounded border-r-2 border-on-surface"
                />
              </div>
            </div>

            {/* Metric pill metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2.5 bg-surface border-2 border-on-surface rounded-xl">
                <span className="font-mono text-[9px] font-black text-secondary uppercase block leading-none">
                  Today's Sessions
                </span>
                <span className="font-mono text-lg font-black text-on-surface mt-1 block">
                  {recentSessions.filter(s => s.startTime > Date.now() - 86400000).length + 1}
                </span>
              </div>
              <div className="p-2.5 bg-surface border-2 border-on-surface rounded-xl">
                <span className="font-mono text-[9px] font-black text-secondary uppercase block leading-none">
                  Estimated XP
                </span>
                <span className="font-mono text-lg font-black text-primary-dark mt-1 block">
                  +{estimatedTodayXP} XP
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t-2 border-on-surface/20">
            {onNavigateSubjectBots && (
              <button
                onClick={onNavigateSubjectBots}
                className="w-full py-2 bg-surface hover:bg-primary/20 border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Study with Subject Tutors</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Card 3: All-Time Study Stats & Cognitive Rank (3 cols) */}
        <div className="lg:col-span-3 bg-white border-3 sm:border-4 border-on-surface rounded-2xl p-5 sm:p-6 shadow-brutalist space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Award size={13} className="text-amber-500" /> COGNITIVE MILESTONES
            </span>

            <div className="p-3.5 bg-surface border-2 border-on-surface rounded-xl space-y-1">
              <span className="font-mono text-[9px] uppercase font-black text-secondary block">
                Total Tracked Time
              </span>
              <div className="font-mono font-black text-2xl text-on-surface">
                {(allTimeTotalSeconds / 3600).toFixed(1)} Hours
              </div>
              <span className="font-mono text-[9px] text-emerald-700 font-bold block">
                // Verified user clock cycles
              </span>
            </div>

            <div className="p-3.5 bg-surface border-2 border-on-surface rounded-xl space-y-1">
              <span className="font-mono text-[9px] uppercase font-black text-secondary block">
                Current Streak
              </span>
              <div className="font-mono font-black text-2xl text-on-surface flex items-center gap-2">
                <Flame size={20} className="text-amber-500 fill-amber-500" />
                <span>{profile?.streak || 3} Days</span>
              </div>
              <span className="font-mono text-[9px] text-secondary font-bold block">
                Active study logged daily
              </span>
            </div>

            <div className="p-3.5 bg-surface border-2 border-on-surface rounded-xl space-y-1">
              <span className="font-mono text-[9px] uppercase font-black text-secondary block">
                Cognitive Rank
              </span>
              <div className="font-mono font-black text-sm text-primary-dark uppercase">
                Accelerated Scholar
              </div>
              <span className="font-mono text-[9px] text-secondary block">
                Tier 3 STEM Specialist
              </span>
            </div>
          </div>

          <div className="pt-2 border-t-2 border-on-surface/20">
            {onNavigateQuizzes && (
              <button
                onClick={onNavigateQuizzes}
                className="w-full py-2 bg-surface hover:bg-accent/20 border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase shadow-brutalist-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Take Active Quiz</span>
                <Zap size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Weekly Engagement Chart & Subject Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left: Dynamic 7-Day Study Minutes Trend (8 cols) */}
        <div className="lg:col-span-8 bg-white border-3 sm:border-4 border-on-surface rounded-2xl p-5 sm:p-6 md:p-8 shadow-brutalist space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-black text-base sm:text-lg uppercase text-on-surface flex items-center gap-2">
                <BarChart3 size={18} className="text-primary-dark" /> Real-Time 7-Day Study Engagement Trend
              </h3>
              <span className="font-mono text-[10px] text-secondary uppercase tracking-wider block mt-0.5">
                // DYNAMIC_USER_TIMING_CHART • UPDATES LIVE IN REAL-TIME
              </span>
            </div>
            <span className="font-mono text-[10px] font-black px-2.5 py-1 bg-surface border-2 border-on-surface rounded-lg">
              Today: {formatHMS(todayTotalSeconds)}
            </span>
          </div>

          {/* Dynamic SVG Bar Chart */}
          <div className="h-64 w-full bg-surface border-2 border-on-surface rounded-xl p-4 sm:p-6 flex flex-col justify-end shadow-brutalist-sm relative">
            <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 pb-2 border-b-2 border-on-surface">
              {historyEntries.slice(-7).map((entry, idx) => {
                const isToday = idx === historyEntries.slice(-7).length - 1;
                const entrySeconds = isToday ? todayTotalSeconds : entry.totalSeconds;
                const heightPercent = Math.max(8, Math.min(100, Math.round((entrySeconds / maxDaySeconds) * 95)));
                const mins = Math.round(entrySeconds / 60);

                return (
                  <div key={entry.date || idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="font-mono text-[9px] font-black text-secondary group-hover:text-on-surface transition-colors hidden sm:block">
                      {mins}m
                    </span>
                    <div className="w-full max-w-[48px] h-full flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.4 }}
                        className={`w-full rounded-t-lg border-2 border-on-surface transition-all group-hover:opacity-90 ${
                          isToday
                            ? "bg-[#AFF833] shadow-brutalist-sm"
                            : "bg-surface-container hover:bg-primary/50"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis Day Labels */}
            <div className="flex justify-between items-center pt-3 font-mono text-[10px] sm:text-xs font-black uppercase text-secondary">
              {historyEntries.slice(-7).map((entry, idx) => {
                const isToday = idx === historyEntries.slice(-7).length - 1;
                return (
                  <div key={entry.date || idx} className="flex-1 text-center">
                    <span className={isToday ? "text-on-surface bg-primary px-1.5 py-0.5 rounded border border-on-surface" : ""}>
                      {entry.dayName || "Day"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-secondary">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#AFF833] border border-on-surface" />
              <span>Today's Real-Time Accumulation (Live Ticking)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-surface-container border border-on-surface" />
              <span>Historical Study Blocks</span>
            </div>
          </div>
        </div>

        {/* Right: Subject Breakdown Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white border-3 sm:border-4 border-on-surface rounded-2xl p-5 sm:p-6 md:p-8 shadow-brutalist space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-display font-black text-base sm:text-lg uppercase text-on-surface flex items-center gap-2">
                <BookOpen size={18} className="text-primary-dark" /> Subject Distribution
              </h3>
              <span className="font-mono text-[10px] text-secondary uppercase tracking-wider block mt-0.5">
                // REAL-TIME DISCIPLINE TIMINGS
              </span>
            </div>

            <div className="space-y-3.5">
              {SUBJECT_OPTIONS.map((subj) => {
                const subjSeconds = subjectAggregates[subj] || 0;
                const subjMins = Math.round(subjSeconds / 60);
                const subjPercent = todayTotalSeconds > 0
                  ? Math.min(100, Math.round((subjSeconds / todayTotalSeconds) * 100))
                  : 0;
                const col = SUBJECT_COLORS[subj] || { bg: "bg-surface", text: "text-on-surface", bar: "bg-primary" };

                return (
                  <div key={subj} className="space-y-1">
                    <div className="flex justify-between items-center font-mono text-[11px] font-black uppercase">
                      <span className="flex items-center gap-1.5 truncate">
                        <span className={`w-2 h-2 rounded-full border border-on-surface ${col.bg}`} />
                        <span className="truncate">{subj}</span>
                      </span>
                      <span className="text-secondary shrink-0">
                        {subjMins}m ({subjPercent}%)
                      </span>
                    </div>
                    <div className="h-3 w-full bg-surface border-2 border-on-surface rounded-md overflow-hidden p-0.5">
                      <motion.div
                        animate={{ width: `${subjPercent}%` }}
                        transition={{ duration: 0.3 }}
                        className={`h-full rounded ${col.bar} border-r border-on-surface`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-surface border-2 border-on-surface rounded-xl text-xs font-mono text-secondary space-y-1">
            <span className="font-black text-on-surface block uppercase text-[10px]">
              Active Recall Ratio:
            </span>
            <p className="text-[11px] leading-snug">
              Every second spent asking questions in Subject AI Tutors and verifying formulas automatically logs into these analytics buckets.
            </p>
          </div>
        </div>
      </div>

      {/* Real-Time Study Sessions Digital Ledger */}
      <div className="bg-white border-3 sm:border-4 border-on-surface rounded-2xl p-5 sm:p-6 md:p-8 shadow-brutalist space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-black text-lg sm:text-xl uppercase text-on-surface flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-600" /> Verified Study Session Ledger
            </h3>
            <span className="font-mono text-[10px] text-secondary uppercase tracking-wider block mt-0.5">
              // AUDITED_USER_TIMING_RECORDS • RECENT SESSIONS
            </span>
          </div>
          <span className="font-mono text-[10px] font-black px-2.5 py-1 bg-surface border-2 border-on-surface rounded-lg">
            Total Sessions: {recentSessions.length + (isRunning ? 1 : 0)}
          </span>
        </div>

        <div className="space-y-3">
          {/* Active Live Session Entry if Timer is Running */}
          {isRunning && (
            <div className="p-3.5 sm:p-4 bg-emerald-50 border-2 border-emerald-600 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-brutalist-sm animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border-2 border-emerald-700 bg-emerald-300 flex items-center justify-center font-mono font-black text-xs text-emerald-950">
                  LIVE
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-sm uppercase text-emerald-950">
                      Current Session: {activeSubject}
                    </span>
                    <span className="font-mono text-[9px] font-black px-1.5 py-0.5 bg-emerald-200 text-emerald-900 rounded border border-emerald-700">
                      IN PROGRESS
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-800 block mt-0.5">
                    Duration: {formatHMS(currentSessionSeconds)} • Started just now
                  </span>
                </div>
              </div>
              <button
                onClick={handleFinishSession}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-900 rounded-lg font-mono text-[10px] font-black uppercase text-white cursor-pointer self-start sm:self-center"
              >
                Log Session Now
              </button>
            </div>
          )}

          {/* Historical Sessions List */}
          {recentSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentSessions.slice(0, 8).map((sess) => {
                const col = SUBJECT_COLORS[sess.subject] || { bg: "bg-surface", text: "text-on-surface" };
                const dateFormatted = new Date(sess.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                return (
                  <div
                    key={sess.id}
                    className="p-3.5 bg-surface border-2 border-on-surface rounded-xl flex items-center justify-between gap-3 shadow-brutalist-sm hover:shadow-brutalist transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg border-2 border-on-surface flex items-center justify-center font-mono text-[10px] font-black shrink-0 ${col.bg}`}>
                        {sess.subject.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-black text-xs uppercase text-on-surface truncate">
                            {sess.subject}
                          </span>
                          <span className="font-mono text-[9px] text-secondary font-bold shrink-0">
                            {dateFormatted}
                          </span>
                        </div>
                        <span className="font-sans text-[11px] text-secondary truncate block mt-0.5">
                          {sess.notes || "Focused self-study session"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-black text-on-surface block">
                        {formatHMS(sess.durationSeconds)}
                      </span>
                      <span className="font-mono text-[9px] font-black text-emerald-700 block">
                        +{sess.xpEarned} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-on-surface/30 rounded-xl font-mono text-xs uppercase text-secondary">
              // NO PREVIOUS SESSIONS RECORDED YET. START STUDYING TO LOG FIRST BLOCK!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
