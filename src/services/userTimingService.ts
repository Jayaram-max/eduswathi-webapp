/**
 * User Real-Time Timing & Study Session Service
 * Provides real-time second-by-second user study tracking,
 * session logging, weekly engagement aggregation, and persistence.
 */

export interface StudySessionLog {
  id: string;
  subject: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  notes?: string;
  xpEarned: number;
}

export interface DayTimingRecord {
  date: string; // YYYY-MM-DD
  dayName: string; // "Mon", "Tue", ...
  totalSeconds: number;
  subjectBreakdown: Record<string, number>; // subject -> seconds
}

export interface UserTimingState {
  isRunning: boolean;
  currentSessionSeconds: number;
  activeSubject: string;
  todayTotalSeconds: number;
  dailyGoalMinutes: number;
  allTimeTotalSeconds: number;
  dailyHistory: Record<string, DayTimingRecord>; // YYYY-MM-DD -> record
  recentSessions: StudySessionLog[];
  lastSessionSavedAt: number | null;
}

const STORAGE_KEY = "edu_user_timing_v2";

// Helper to format date YYYY-MM-DD
function getTodayDateString(d = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDayName(d = new Date()): string {
  return DAYS[d.getDay()];
}

function generateInitialHistory(): Record<string, DayTimingRecord> {
  const history: Record<string, DayTimingRecord> = {};
  const today = new Date();

  // Create historical records for the previous 6 days + today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = getTodayDateString(d);
    const dayName = getDayName(d);

    // Initial baseline minutes for realistic starting progression
    const baselineMins = i === 0 ? 35 : [75, 110, 85, 140, 95, 160][6 - i] || 60;
    const baseSeconds = baselineMins * 60;

    history[dateKey] = {
      date: dateKey,
      dayName,
      totalSeconds: baseSeconds,
      subjectBreakdown: {
        Mathematics: Math.round(baseSeconds * 0.35),
        Physics: Math.round(baseSeconds * 0.25),
        Chemistry: Math.round(baseSeconds * 0.2),
        Biology: Math.round(baseSeconds * 0.1),
        "Computer Science": Math.round(baseSeconds * 0.1),
      },
    };
  }

  return history;
}

function loadSavedState(): UserTimingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const todayKey = getTodayDateString();
      if (!parsed.dailyHistory || !parsed.dailyHistory[todayKey]) {
        parsed.dailyHistory = { ...generateInitialHistory(), ...(parsed.dailyHistory || {}) };
      }
      return {
        isRunning: true, // Start active tracking automatically for user session
        currentSessionSeconds: parsed.currentSessionSeconds || 0,
        activeSubject: parsed.activeSubject || "Mathematics",
        todayTotalSeconds: parsed.dailyHistory[todayKey]?.totalSeconds || 1200,
        dailyGoalMinutes: parsed.dailyGoalMinutes || 120,
        allTimeTotalSeconds: parsed.allTimeTotalSeconds || 24000,
        dailyHistory: parsed.dailyHistory,
        recentSessions: parsed.recentSessions || [
          {
            id: "sess-init-1",
            subject: "Mathematics",
            startTime: Date.now() - 3600000,
            endTime: Date.now() - 1800000,
            durationSeconds: 1800,
            notes: "Calculus limits & derivatives review",
            xpEarned: 15,
          },
          {
            id: "sess-init-2",
            subject: "Physics",
            startTime: Date.now() - 7200000,
            endTime: Date.now() - 5400000,
            durationSeconds: 1800,
            notes: "Electromagnetic induction & wave mechanics",
            xpEarned: 15,
          },
        ],
        lastSessionSavedAt: parsed.lastSessionSavedAt || null,
      };
    }
  } catch (e) {
    console.warn("Failed to parse saved user timing state:", e);
  }

  const todayKey = getTodayDateString();
  const initHistory = generateInitialHistory();
  return {
    isRunning: true,
    currentSessionSeconds: 0,
    activeSubject: "Mathematics",
    todayTotalSeconds: initHistory[todayKey]?.totalSeconds || 2100,
    dailyGoalMinutes: 120,
    allTimeTotalSeconds: 24000,
    dailyHistory: initHistory,
    recentSessions: [
      {
        id: "sess-init-1",
        subject: "Mathematics",
        startTime: Date.now() - 3600000,
        endTime: Date.now() - 1800000,
        durationSeconds: 1800,
        notes: "Calculus limits & derivatives review",
        xpEarned: 15,
      },
    ],
    lastSessionSavedAt: null,
  };
}

class UserTimingManager {
  private state: UserTimingState;
  private listeners: Set<(state: UserTimingState) => void> = new Set();
  private timerId: number | null = null;
  private saveDebounceId: number | null = null;

  constructor() {
    this.state = loadSavedState();
    this.startTicker();
  }

  private startTicker() {
    if (this.timerId) return;
    this.timerId = window.setInterval(() => {
      if (!this.state.isRunning) return;

      const todayKey = getTodayDateString();
      const currentSubj = this.state.activeSubject;

      // Update state
      const nextSessionSeconds = this.state.currentSessionSeconds + 1;
      const nextTodaySeconds = this.state.todayTotalSeconds + 1;
      const nextAllTime = this.state.allTimeTotalSeconds + 1;

      // Update daily history
      const history = { ...this.state.dailyHistory };
      if (!history[todayKey]) {
        history[todayKey] = {
          date: todayKey,
          dayName: getDayName(),
          totalSeconds: 0,
          subjectBreakdown: {},
        };
      }
      const dayRecord = { ...history[todayKey] };
      dayRecord.totalSeconds += 1;
      const subjBreakdown = { ...dayRecord.subjectBreakdown };
      subjBreakdown[currentSubj] = (subjBreakdown[currentSubj] || 0) + 1;
      dayRecord.subjectBreakdown = subjBreakdown;
      history[todayKey] = dayRecord;

      this.state = {
        ...this.state,
        currentSessionSeconds: nextSessionSeconds,
        todayTotalSeconds: nextTodaySeconds,
        allTimeTotalSeconds: nextAllTime,
        dailyHistory: history,
      };

      this.notify();
      this.schedulePersist();
    }, 1000);
  }

  private schedulePersist() {
    if (this.saveDebounceId) return;
    this.saveDebounceId = window.setTimeout(() => {
      this.saveDebounceId = null;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn("Failed to persist user timing:", e);
      }
    }, 3000);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  public getState(): UserTimingState {
    return this.state;
  }

  public subscribe(cb: (state: UserTimingState) => void): () => void {
    this.listeners.add(cb);
    cb(this.state);
    return () => this.listeners.delete(cb);
  }

  public start() {
    if (!this.state.isRunning) {
      this.state = { ...this.state, isRunning: true };
      this.notify();
      this.schedulePersist();
    }
  }

  public pause() {
    if (this.state.isRunning) {
      this.state = { ...this.state, isRunning: false };
      this.notify();
      this.schedulePersist();
    }
  }

  public toggleRunning() {
    if (this.state.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  public setActiveSubject(subject: string) {
    this.state = { ...this.state, activeSubject: subject };
    this.notify();
    this.schedulePersist();
  }

  public setDailyGoalMinutes(minutes: number) {
    this.state = { ...this.state, dailyGoalMinutes: Math.max(15, minutes) };
    this.notify();
    this.schedulePersist();
  }

  public recordAndFinishSession(notes?: string) {
    const duration = this.state.currentSessionSeconds;
    if (duration < 5) return; // Skip trivial zero-length clicks

    const xpEarned = Math.max(5, Math.round((duration / 60) * 0.75));
    const newSession: StudySessionLog = {
      id: `sess-${Date.now()}`,
      subject: this.state.activeSubject,
      startTime: Date.now() - duration * 1000,
      endTime: Date.now(),
      durationSeconds: duration,
      notes: notes || `Focus on ${this.state.activeSubject}`,
      xpEarned,
    };

    this.state = {
      ...this.state,
      currentSessionSeconds: 0,
      recentSessions: [newSession, ...this.state.recentSessions.slice(0, 19)],
      lastSessionSavedAt: Date.now(),
    };

    this.notify();
    this.schedulePersist();
    return newSession;
  }

  public resetCurrentSession() {
    this.state = {
      ...this.state,
      currentSessionSeconds: 0,
    };
    this.notify();
    this.schedulePersist();
  }

  /**
   * Log extra learning time (e.g. from Subject Chatbots or Quizzes)
   */
  public logAdditionalStudy(seconds: number, subject: string) {
    const todayKey = getTodayDateString();
    const history = { ...this.state.dailyHistory };
    if (!history[todayKey]) {
      history[todayKey] = {
        date: todayKey,
        dayName: getDayName(),
        totalSeconds: 0,
        subjectBreakdown: {},
      };
    }
    const dayRecord = { ...history[todayKey] };
    dayRecord.totalSeconds += seconds;
    const subjBreakdown = { ...dayRecord.subjectBreakdown };
    subjBreakdown[subject] = (subjBreakdown[subject] || 0) + seconds;
    dayRecord.subjectBreakdown = subjBreakdown;
    history[todayKey] = dayRecord;

    this.state = {
      ...this.state,
      todayTotalSeconds: this.state.todayTotalSeconds + seconds,
      allTimeTotalSeconds: this.state.allTimeTotalSeconds + seconds,
      dailyHistory: history,
    };

    this.notify();
    this.schedulePersist();
  }
}

export const userTimingManager = new UserTimingManager();
