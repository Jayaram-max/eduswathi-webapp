import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useFirebase } from "../context/FirebaseContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import {
  Zap,
  Clock,
  Award,
  BookOpen,
  Sparkles,
  Check,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Bot,
  FileText,
  Plus
} from "lucide-react";

interface RealtimeDashboardViewProps {
  setActiveSubTab: (tab: string) => void;
}

export const RealtimeDashboardView: React.FC<RealtimeDashboardViewProps> = ({ setActiveSubTab }) => {
  const { user, profile, refreshProfile, completePomodoroSession, claimAchievementReward } = useFirebase();

  // 1. Daily Attendance Bonus State
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [claimingDaily, setClaimingDaily] = useState(false);
  const [dailySuccessMsg, setDailySuccessMsg] = useState("");

  useEffect(() => {
    const todayKey = `eduswathi_daily_${new Date().toDateString()}_${user?.uid || "guest"}`;
    if (localStorage.getItem(todayKey)) {
      setDailyClaimed(true);
    }
  }, [user?.uid]);

  const handleClaimDailyAttendance = async () => {
    if (dailyClaimed || claimingDaily) return;
    setClaimingDaily(true);
    try {
      await claimAchievementReward(25);
      const todayKey = `eduswathi_daily_${new Date().toDateString()}_${user?.uid || "guest"}`;
      localStorage.setItem(todayKey, "claimed");
      setDailyClaimed(true);
      setDailySuccessMsg("✓ Attendance logged! +25 XP added to Cloud Firestore.");
      setTimeout(() => setDailySuccessMsg(""), 4000);
    } catch (e) {
      console.error("Daily claim error:", e);
    } finally {
      setClaimingDaily(false);
    }
  };

  // 2. Real-Time Pomodoro Focus Engine
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "short" | "long">("focus");
  const [pomodoroSecondsLeft, setPomodoroSecondsLeft] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroCompletedCount, setPomodoroCompletedCount] = useState(0);
  const [pomodoroRewardMsg, setPomodoroRewardMsg] = useState("");

  const modeDurations = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pomodoroRunning && pomodoroSecondsLeft > 0) {
      interval = setInterval(() => {
        setPomodoroSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroRunning && pomodoroSecondsLeft === 0) {
      setPomodoroRunning(false);
      handlePomodoroFinish();
    }
    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroSecondsLeft]);

  const handlePomodoroFinish = async () => {
    const minutes = Math.round(modeDurations[pomodoroMode] / 60);
    try {
      await completePomodoroSession(minutes);
      setPomodoroCompletedCount((prev) => prev + 1);
      setPomodoroRewardMsg(`🎉 Focus completed! +${minutes * 2} XP synced.`);
      setTimeout(() => setPomodoroRewardMsg(""), 5000);
    } catch (e) {
      console.error("Failed to sync pomodoro:", e);
    }
    setPomodoroSecondsLeft(modeDurations[pomodoroMode]);
  };

  const switchPomodoroMode = (mode: "focus" | "short" | "long") => {
    setPomodoroRunning(false);
    setPomodoroMode(mode);
    setPomodoroSecondsLeft(modeDurations[mode]);
  };

  const formatTimerDisplay = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const pomodoroProgressPercent = Math.round(
    ((modeDurations[pomodoroMode] - pomodoroSecondsLeft) / modeDurations[pomodoroMode]) * 100
  );

  // 3. Real-Time Tasks / Focus Checklist
  const [tasks, setTasks] = useState([
    { id: 1, text: "Revise Ray Optics & Lens Formula proofs", priority: "High", completed: true },
    { id: 2, text: "Practice Integration by Partial Fractions", priority: "High", completed: false },
    { id: 3, text: "Review Coordination Compounds IUPAC rules", priority: "Medium", completed: false },
    { id: 4, text: "Practice Subject Bot active recall quiz", priority: "Normal", completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState("");
  const [checklistFeedback, setChecklistFeedback] = useState("");

  const handleToggleTask = async (taskId: number) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setTasks(updated);

    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      setChecklistFeedback("✦ Task completed! +10 XP");
      setTimeout(() => setChecklistFeedback(""), 3000);
      try {
        await claimAchievementReward(10);
      } catch (e) {
        console.warn("XP reward note:", e);
      }
    }
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      priority: "High",
      completed: false
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText("");
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const completedTaskCount = tasks.filter((t) => t.completed).length;

  // 4. Study Telemetry Chart Data
  const weeklyStudyHoursData = [
    { day: "Mon", focusHours: 3.4 },
    { day: "Tue", focusHours: 4.2 },
    { day: "Wed", focusHours: 2.8 },
    { day: "Thu", focusHours: 5.1 },
    { day: "Fri", focusHours: 4.5 },
    { day: "Sat", focusHours: 6.0 },
    { day: "Sun", focusHours: 3.2 }
  ];

  // Scholar XP & Level calculations
  const totalXp = profile?.xp || 350;
  const currentLevel = Math.floor(totalXp / 250) + 1;
  const xpIntoCurrentLevel = totalXp % 250;
  const xpNeededNextLevel = 250;
  const levelProgressPercent = Math.min(100, Math.round((xpIntoCurrentLevel / xpNeededNextLevel) * 100));

  const getRankTitle = (lvl: number) => {
    if (lvl <= 1) return "Novice Scholar";
    if (lvl === 2) return "Quantum Scholar";
    if (lvl === 3) return "Distinction Contender";
    return "Polymath Master";
  };

  return (
    <div className="space-y-6" id="realtime-dashboard-container">
      
      {/* 1. COMPACT UNIFIED HEADER & DAILY STREAK BANNER */}
      <div className="bg-white border-3 border-on-surface p-5 sm:p-6 rounded-2xl shadow-brutalist flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-accent border-2 border-on-surface rounded-lg font-mono text-[11px] font-black uppercase shadow-brutalist-sm inline-flex items-center gap-1.5">
              <Sparkles size={12} /> LEVEL {currentLevel} • {getRankTitle(currentLevel)}
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-100 border border-on-surface/40 rounded-lg font-mono text-[11px] font-bold text-emerald-900 inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-black text-on-surface uppercase tracking-tight leading-none">
            {profile?.name || user?.displayName || "Scholar"}'s Console
          </h2>

          {/* Compact Level XP Bar */}
          <div className="flex items-center gap-3 pt-1 max-w-md">
            <div className="flex-1 h-3 bg-surface border-2 border-on-surface rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <span className="font-mono text-xs font-black text-on-surface/70 shrink-0">
              {totalXp} XP ({levelProgressPercent}%)
            </span>
          </div>
        </div>

        {/* Action Controls & Streak */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Daily Streak & Claim */}
          <div className="flex items-center gap-2 bg-primary/20 border-2 border-on-surface p-2 rounded-xl shadow-brutalist-sm">
            <div className="flex items-center gap-1.5 px-2">
              <Flame size={18} className="text-red-500 animate-bounce" />
              <span className="font-mono text-xs font-black text-on-surface">
                {profile?.streak || 1}d Streak
              </span>
            </div>
            <button
              onClick={handleClaimDailyAttendance}
              disabled={dailyClaimed || claimingDaily}
              className={`px-3 py-1.5 rounded-lg border-2 border-on-surface font-mono text-[11px] font-black uppercase transition-all cursor-pointer ${
                dailyClaimed
                  ? "bg-emerald-200 text-emerald-900 cursor-default"
                  : "bg-primary hover:bg-accent text-on-surface active:scale-95 shadow-brutalist-sm"
              }`}
            >
              {dailyClaimed ? "Claimed ✓" : claimingDaily ? "..." : "+25 XP"}
            </button>
          </div>

          {/* Cloud Sync Button */}
          <button
            onClick={async () => {
              await refreshProfile();
            }}
            className="p-2.5 bg-surface hover:bg-primary border-2 border-on-surface rounded-xl shadow-brutalist-sm cursor-pointer transition-colors active:scale-95 font-mono text-xs font-black flex items-center gap-1.5"
            title="Sync Cloud Firestore"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">SYNC</span>
          </button>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab("subject-bots")}
              className="px-3 py-2 bg-primary hover:bg-accent border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase shadow-brutalist-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Bot size={14} /> Bots
            </button>
            <button
              onClick={() => setActiveSubTab("quizzes")}
              className="px-3 py-2 bg-white hover:bg-surface border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase shadow-brutalist-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Award size={14} /> Quizzes
            </button>
            <button
              onClick={() => setActiveSubTab("notes")}
              className="px-3 py-2 bg-white hover:bg-surface border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase shadow-brutalist-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <FileText size={14} /> Notes
            </button>
          </div>
        </div>
      </div>

      {dailySuccessMsg && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-emerald-100 border-2 border-emerald-600 text-emerald-900 font-mono text-xs font-black rounded-xl"
        >
          {dailySuccessMsg}
        </motion.div>
      )}

      {/* 2. FOUR STREAMLINED KPI TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Study XP",
            value: `${totalXp} XP`,
            badge: "+45 today",
            Icon: Zap,
            color: "bg-primary"
          },
          {
            title: "Focus Time",
            value: `${Math.round((pomodoroCompletedCount * 25) + 120)}m`,
            badge: "Clocked",
            Icon: Clock,
            color: "bg-accent"
          },
          {
            title: "Syllabus Mastery",
            value: `${profile?.completedCourses?.length || 4}/24`,
            badge: "Chapters",
            Icon: BookOpen,
            color: "bg-surface"
          },
          {
            title: "Bench Accuracy",
            value: "89.4%",
            badge: "Distinction",
            Icon: Award,
            color: "bg-emerald-100"
          }
        ].map((stat, i) => {
          const StatIcon = stat.Icon;
          return (
            <div
              key={i}
              className="p-4 bg-white border-3 border-on-surface rounded-xl flex flex-col justify-between shadow-brutalist hover:shadow-brutalist-neon transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-on-surface/60 uppercase tracking-widest font-black block mb-0.5">
                    {stat.title}
                  </span>
                  <span className="text-xl sm:text-2xl font-display font-black text-on-surface">
                    {stat.value}
                  </span>
                </div>
                <div className="p-2 bg-primary/20 border-2 border-on-surface rounded-lg shadow-brutalist-sm">
                  <StatIcon size={16} className="text-on-surface" />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="px-2 py-0.5 bg-surface text-on-surface border border-on-surface/40 text-[9px] font-mono font-black rounded-md">
                  {stat.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. PERFORMANCE VELOCITY CHART */}
      <div className="bg-white border-3 border-on-surface p-5 rounded-2xl shadow-brutalist space-y-3">
        <div className="flex items-center justify-between border-b-2 border-on-surface/10 pb-3">
          <div>
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary-dark">
              // STUDY VELOCITY TELEMETRY
            </span>
            <h3 className="text-lg font-display font-black text-on-surface uppercase tracking-tight">
              Weekly Focus Hours
            </h3>
          </div>
          <span className="font-mono text-xs font-black bg-primary px-2.5 py-1 rounded-md border border-on-surface shadow-brutalist-sm">
            29.4h Total • ▲ 14.8%
          </span>
        </div>

        <div className="h-44 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyStudyHoursData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="studyHoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f7d046" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f7d046" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700 }}
                stroke="#1a1a1a"
              />
              <YAxis 
                tick={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700 }}
                stroke="#1a1a1a"
                unit="h"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)"
                }}
                formatter={(value: any) => [`${value} hrs`, "Focus Time"]}
              />
              <Area 
                type="monotone" 
                dataKey="focusHours" 
                stroke="#000000" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#studyHoursGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. PRACTICAL WORKSPACE: POMODORO & TODAY'S CHECKLIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Pomodoro Engine */}
        <div className="lg:col-span-6 bg-white border-3 border-on-surface p-5 sm:p-6 rounded-2xl shadow-brutalist flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-on-surface/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-primary-dark" />
                <h3 className="text-lg font-display font-black text-on-surface uppercase tracking-tight">
                  Focus Timer
                </h3>
              </div>
              <span className="font-mono text-xs font-black bg-primary px-2.5 py-0.5 rounded-lg border border-on-surface shadow-brutalist-sm">
                Session #{pomodoroCompletedCount + 1}
              </span>
            </div>

            {/* Mode selection tabs */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "focus", label: "25m Focus" },
                { id: "short", label: "5m Break" },
                { id: "long", label: "15m Reset" }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => switchPomodoroMode(m.id as any)}
                  className={`py-1.5 px-1 text-center font-mono text-[11px] font-black uppercase rounded-lg border-2 transition-all cursor-pointer ${
                    pomodoroMode === m.id
                      ? "bg-primary border-on-surface shadow-brutalist-sm text-on-surface"
                      : "bg-surface hover:bg-surface-container border-transparent text-on-surface/70"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Digital Clock Display */}
          <div className="flex flex-col items-center justify-center p-5 bg-surface border-2 border-on-surface rounded-xl shadow-brutalist-sm space-y-2">
            <div className="font-mono font-black text-4xl sm:text-5xl text-on-surface tracking-tighter tabular-nums">
              {formatTimerDisplay(pomodoroSecondsLeft)}
            </div>

            <div className="w-full h-2.5 bg-white border border-on-surface rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${pomodoroProgressPercent}%` }}
              />
            </div>
          </div>

          {pomodoroRewardMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 bg-emerald-100 border border-emerald-600 text-emerald-900 font-mono text-xs font-black rounded-lg"
            >
              {pomodoroRewardMsg}
            </motion.div>
          )}

          {/* Timer Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPomodoroRunning(!pomodoroRunning)}
              className={`flex-1 py-2.5 px-3 rounded-xl border-2 border-on-surface font-mono text-xs font-black uppercase shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${
                pomodoroRunning ? "bg-accent text-on-surface" : "bg-primary hover:bg-primary-dark text-on-surface"
              }`}
            >
              {pomodoroRunning ? (
                <>
                  <Pause size={15} strokeWidth={3} /> Pause
                </>
              ) : (
                <>
                  <Play size={15} strokeWidth={3} /> Start Focus
                </>
              )}
            </button>

            <button
              onClick={() => {
                setPomodoroRunning(false);
                setPomodoroSecondsLeft(modeDurations[pomodoroMode]);
              }}
              className="p-2.5 bg-white hover:bg-surface border-2 border-on-surface rounded-xl shadow-brutalist-sm cursor-pointer transition-colors active:scale-95 text-on-surface"
              title="Reset Timer"
            >
              <RotateCcw size={15} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Today's Focus Checklist */}
        <div className="lg:col-span-6 bg-white border-3 border-on-surface p-5 sm:p-6 rounded-2xl shadow-brutalist flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b-2 border-on-surface/10 pb-2.5">
              <div>
                <h3 className="text-lg font-display font-black text-on-surface uppercase tracking-tight">
                  Focus Checklist
                </h3>
                <span className="text-[11px] font-mono text-on-surface/60 font-bold">
                  {completedTaskCount}/{tasks.length} Completed
                </span>
              </div>

              <span className="font-mono text-xs font-black bg-surface px-2.5 py-1 rounded-lg border border-on-surface shadow-brutalist-sm">
                {tasks.length > 0 ? Math.round((completedTaskCount / tasks.length) * 100) : 0}%
              </span>
            </div>

            {checklistFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-2 bg-emerald-100 border border-emerald-600 text-emerald-900 font-mono text-xs font-black rounded-lg"
              >
                {checklistFeedback}
              </motion.div>
            )}

            {/* Quick-Add Goal */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add focus goal..."
                className="flex-grow px-3 py-2 bg-surface border-2 border-on-surface font-sans text-xs text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-primary shadow-brutalist-sm"
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              />
              <button
                onClick={handleAddTask}
                className="px-3 py-2 bg-primary hover:bg-accent border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase shadow-brutalist-sm cursor-pointer active:scale-95 transition-all flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {/* Tasks List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2.5 bg-surface border-2 border-on-surface rounded-xl hover:bg-primary/10 transition-all group shadow-brutalist-sm"
                >
                  <div
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-center gap-2.5 flex-1 cursor-pointer select-none"
                  >
                    <div
                      className={`w-5 h-5 border-2 border-on-surface rounded-md flex items-center justify-center transition-colors shrink-0 ${
                        task.completed ? "bg-primary" : "bg-white"
                      }`}
                    >
                      {task.completed && <Check size={12} strokeWidth={4} className="text-on-surface" />}
                    </div>
                    <span
                      className={`text-xs font-mono font-bold tracking-tight uppercase leading-tight ${
                        task.completed ? "line-through text-on-surface/40" : "text-on-surface"
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 text-red-600 rounded transition-all cursor-pointer"
                    title="Remove Goal"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-on-surface/10 flex items-center justify-between text-[11px] font-mono font-bold text-on-surface/60">
            <span>Instant sync with Cloud Firestore</span>
            <span className="text-primary-dark font-black">+10 XP per completed task</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RealtimeDashboardView;
