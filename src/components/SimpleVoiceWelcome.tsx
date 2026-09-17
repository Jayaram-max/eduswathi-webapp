import React, { useEffect, useRef } from "react";
import { speakText, ensureVoicesReady } from "../services/voiceAgentService";

interface SimpleVoiceWelcomeProps {
  onNameIdentified?: (name: string) => void;
}

/**
 * Voice Welcome:
 * Greets the user aloud with "Welcome to Edu Swathi" once upon visiting the app.
 * Completely voice-only with no UI overlays or microphone prompts.
 * Designed to handle mobile autoplay policies gracefully and stably.
 */
export const SimpleVoiceWelcome: React.FC<SimpleVoiceWelcomeProps> = () => {
  const ttsCancelRef = useRef<(() => void) | null>(null);
  const speechSuccessfullyStartedRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  const cleanup = () => {
    if (ttsCancelRef.current) {
      ttsCancelRef.current();
      ttsCancelRef.current = null;
    }
  };

  const playWelcome = () => {
    if (!isMountedRef.current || speechSuccessfullyStartedRef.current) return;
    cleanup();

    const greeting = "Welcome to Edu Swathi";
    const tts = speakText(greeting, {
      onStart: () => {
        speechSuccessfullyStartedRef.current = true;
      },
      onError: () => {
        // If autoplay was blocked on mobile, permit first gesture to play
      }
    });
    ttsCancelRef.current = tts.cancel;
  };

  useEffect(() => {
    isMountedRef.current = true;

    // Ensure voices are loaded first before attempting speech
    ensureVoicesReady(400).then(() => {
      if (!isMountedRef.current) return;
      playWelcome();
    });

    // Mobile fallback: When the user makes their first touch / interaction on mobile,
    // trigger the welcome speech if browser autoplay blocked it previously
    const handleFirstGesture = () => {
      if (!speechSuccessfullyStartedRef.current && isMountedRef.current) {
        playWelcome();
      }
    };

    window.addEventListener("pointerdown", handleFirstGesture, { once: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });

    return () => {
      isMountedRef.current = false;
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      cleanup();
    };
  }, []);

  return null;
};
