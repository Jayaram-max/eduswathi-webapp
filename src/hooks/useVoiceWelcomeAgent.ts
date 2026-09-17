import { useState, useEffect, useRef, useCallback } from "react";
import {
  speakText,
  VoiceRecognitionController,
  extractStudentName,
  getStoredStudentName,
  saveStoredStudentName,
  clearStoredStudentName
} from "../services/voiceAgentService";

export type AgentStage =
  | "idle" // Initial state waiting for user gesture/start
  | "greeting" // AI speaking: "Welcome to EduSwathi! 👋 May I know your name?"
  | "listening" // Student speaking into microphone
  | "thinking" // Extracting name from speech
  | "welcoming" // AI speaking: "Nice to meet you, [Name]! 😊 How can I help you today?"
  | "completed"; // Conversation complete, student can proceed

export interface UseVoiceWelcomeAgentReturn {
  stage: AgentStage;
  aiMessage: string;
  studentTranscript: string;
  studentName: string | null;
  isSpeaking: boolean;
  isListening: boolean;
  isThinking: boolean;
  error: string | null;
  isSupported: boolean;
  startConversation: () => void;
  restartConversation: () => void;
  submitNameManually: (name: string) => void;
  stopVoice: () => void;
  clearSavedName: () => void;
}

const GREETING_TEXT = "Welcome to Edu Swathi! May I know your name?";
const GREETING_DISPLAY = "Welcome to Edu Swathi! 👋 May I know your name?";

export function useVoiceWelcomeAgent(autoStart: boolean = false): UseVoiceWelcomeAgentReturn {
  const [stage, setStage] = useState<AgentStage>("idle");
  const [aiMessage, setAiMessage] = useState<string>(GREETING_DISPLAY);
  const [studentTranscript, setStudentTranscript] = useState<string>("");
  const [studentName, setStudentName] = useState<string | null>(() => getStoredStudentName());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionControllerRef = useRef<VoiceRecognitionController>(new VoiceRecognitionController());
  const ttsCancelRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const speechSilenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isSupported = VoiceRecognitionController.isSupported();

  // Clean up on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (ttsCancelRef.current) ttsCancelRef.current();
      recognitionControllerRef.current.stop();
      if (speechSilenceTimerRef.current) clearTimeout(speechSilenceTimerRef.current);
    };
  }, []);

  // Listen to external session storage changes
  useEffect(() => {
    const handleNameChange = (e: any) => {
      const updated = e.detail?.name ?? getStoredStudentName();
      setStudentName(updated);
    };
    window.addEventListener("eduswathi_student_name_updated", handleNameChange);
    return () => window.removeEventListener("eduswathi_student_name_updated", handleNameChange);
  }, []);

  /**
   * AI Welcoming speech after name detection
   */
  const speakPersonalizedWelcome = useCallback((name: string) => {
    if (!isMountedRef.current) return;

    setStage("welcoming");
    setIsThinking(false);
    setIsListening(false);
    setIsSpeaking(true);

    const welcomeDisplay = `Nice to meet you, ${name}! 😊 How can I help you today?`;
    const welcomeSpeech = `Nice to meet you, ${name}! How can I help you today?`;

    setAiMessage(welcomeDisplay);

    if (ttsCancelRef.current) ttsCancelRef.current();

    ttsCancelRef.current = speakText(welcomeSpeech, {
      onStart: () => {
        if (isMountedRef.current) setIsSpeaking(true);
      },
      onEnd: () => {
        if (isMountedRef.current) {
          setIsSpeaking(false);
          setStage("completed");
        }
      },
      onError: () => {
        if (isMountedRef.current) {
          setIsSpeaking(false);
          setStage("completed");
        }
      }
    }).cancel;
  }, []);

  /**
   * Process student utterance and attempt name detection
   */
  const processStudentSpeech = useCallback((transcriptText: string) => {
    if (!isMountedRef.current) return;

    setIsThinking(true);
    setStage("thinking");

    const detected = extractStudentName(transcriptText);

    if (detected) {
      saveStoredStudentName(detected);
      setStudentName(detected);
      setError(null);
      // Small pause for natural conversational flow
      setTimeout(() => {
        speakPersonalizedWelcome(detected);
      }, 400);
    } else {
      // Couldn't extract cleanly — politely ask for clarification
      setIsThinking(false);
      setError("I couldn't catch your name clearly. Could you say, for example, \"I'm Rahul\" or type it below?");
      setStage("listening");
      // Prompt student to try again
      listenToStudent();
    }
  }, [speakPersonalizedWelcome]);

  /**
   * Start listening to student's voice
   */
  const listenToStudent = useCallback(() => {
    if (!isMountedRef.current) return;

    setError(null);
    setStudentTranscript("");
    setIsListening(true);
    setStage("listening");

    const started = recognitionControllerRef.current.start({
      onSpeechStart: () => {
        if (isMountedRef.current) {
          setIsListening(true);
          setError(null);
        }
      },
      onTranscript: (text, isFinal) => {
        if (!isMountedRef.current) return;
        setStudentTranscript(text);

        // Reset silence timer on every spoken chunk
        if (speechSilenceTimerRef.current) clearTimeout(speechSilenceTimerRef.current);

        if (isFinal) {
          recognitionControllerRef.current.stop();
          setIsListening(false);
          processStudentSpeech(text);
        } else {
          // If the student pauses for 1.6 seconds after speaking, process the captured interim
          speechSilenceTimerRef.current = setTimeout(() => {
            if (text.trim().length > 1) {
              recognitionControllerRef.current.stop();
              setIsListening(false);
              processStudentSpeech(text);
            }
          }, 1600);
        }
      },
      onError: (errMessage) => {
        if (isMountedRef.current) {
          setIsListening(false);
          setError(errMessage);
        }
      },
      onSpeechEnd: () => {
        if (isMountedRef.current) {
          setIsListening(false);
        }
      }
    });

    if (!started) {
      setIsListening(false);
    }
  }, [processStudentSpeech]);

  /**
   * Main starter function: AI speaks greeting then automatically listens
   */
  const startConversation = useCallback(() => {
    setError(null);
    setStudentTranscript("");
    setStage("greeting");
    setIsSpeaking(true);
    setAiMessage(GREETING_DISPLAY);

    if (ttsCancelRef.current) ttsCancelRef.current();

    ttsCancelRef.current = speakText(GREETING_TEXT, {
      onStart: () => {
        if (isMountedRef.current) {
          setIsSpeaking(true);
          setStage("greeting");
        }
      },
      onEnd: () => {
        if (isMountedRef.current) {
          setIsSpeaking(false);
          // Automatically transition to listening as soon as AI finishes speaking!
          setTimeout(() => {
            listenToStudent();
          }, 250);
        }
      },
      onError: () => {
        if (isMountedRef.current) {
          setIsSpeaking(false);
          listenToStudent();
        }
      }
    }).cancel;
  }, [listenToStudent]);

  /**
   * Fallback for typing name manually
   */
  const submitNameManually = useCallback((rawName: string) => {
    const formatted = extractStudentName(rawName) || rawName.trim();
    if (!formatted) {
      setError("Please enter a valid name.");
      return;
    }
    recognitionControllerRef.current.stop();
    setIsListening(false);
    setStudentTranscript(`I'm ${formatted}`);
    saveStoredStudentName(formatted);
    setStudentName(formatted);
    setError(null);
    speakPersonalizedWelcome(formatted);
  }, [speakPersonalizedWelcome]);

  /**
   * Stop everything (voice recognition & speech synthesis)
   */
  const stopVoice = useCallback(() => {
    if (ttsCancelRef.current) ttsCancelRef.current();
    recognitionControllerRef.current.stop();
    setIsSpeaking(false);
    setIsListening(false);
    setIsThinking(false);
    if (speechSilenceTimerRef.current) clearTimeout(speechSilenceTimerRef.current);
  }, []);

  /**
   * Restart the welcome conversation from scratch
   */
  const restartConversation = useCallback(() => {
    stopVoice();
    setError(null);
    setStudentTranscript("");
    setAiMessage(GREETING_DISPLAY);
    startConversation();
  }, [stopVoice, startConversation]);

  /**
   * Clear saved student name
   */
  const clearSavedName = useCallback(() => {
    clearStoredStudentName();
    setStudentName(null);
    setStage("idle");
    setAiMessage(GREETING_DISPLAY);
    setStudentTranscript("");
  }, []);

  // Optional auto-start on mount if requested
  useEffect(() => {
    if (autoStart && stage === "idle") {
      startConversation();
    }
  }, [autoStart, stage, startConversation]);

  return {
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
    stopVoice,
    clearSavedName
  };
}
