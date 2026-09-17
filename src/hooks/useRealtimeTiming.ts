import { useState, useEffect } from "react";
import {
  userTimingManager,
  UserTimingState,
  StudySessionLog,
} from "../services/userTimingService";

export function useRealtimeTiming() {
  const [timingState, setTimingState] = useState<UserTimingState>(() =>
    userTimingManager.getState()
  );

  useEffect(() => {
    const unsubscribe = userTimingManager.subscribe((nextState) => {
      setTimingState(nextState);
    });
    return unsubscribe;
  }, []);

  const formatHMS = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
    }
    return `${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  };

  const formatDigitalStopwatch = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return {
    ...timingState,
    formatHMS,
    formatDigitalStopwatch,
    startTiming: () => userTimingManager.start(),
    pauseTiming: () => userTimingManager.pause(),
    toggleRunning: () => userTimingManager.toggleRunning(),
    setActiveSubject: (subj: string) => userTimingManager.setActiveSubject(subj),
    setDailyGoalMinutes: (mins: number) => userTimingManager.setDailyGoalMinutes(mins),
    recordAndFinishSession: (notes?: string): StudySessionLog | undefined =>
      userTimingManager.recordAndFinishSession(notes),
    resetCurrentSession: () => userTimingManager.resetCurrentSession(),
    logAdditionalStudy: (sec: number, subj: string) =>
      userTimingManager.logAdditionalStudy(sec, subj),
  };
}
