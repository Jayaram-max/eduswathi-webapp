/**
 * EduSwathi Voice Agent Service
 * Handles Speech-to-Text (STT), Text-to-Speech (TTS), Name Extraction,
 * and Session Persistence for the EduSwathi AI Voice Welcome Agent.
 */

export interface VoiceServiceOptions {
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onError?: (error: string) => void;
}

export interface TTSOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  rate?: number;
  pitch?: number;
  voiceURI?: string;
  profileId?: string;
}

export interface EduSwathiVoiceProfile {
  id: string;
  name: string;
  badge: string;
  description: string;
  defaultPitch: number;
  defaultRate: number;
  keywords: string[];
}

export const EDUSWATHI_VOICE_PROFILES: EduSwathiVoiceProfile[] = [
  {
    id: "swathi-indian",
    name: "Swathi (Indian English)",
    badge: "Authentic Swathi",
    description: "Natural, melodic Indian English accent — ideal for Edu Swathi",
    defaultPitch: 1.04,
    defaultRate: 0.95,
    keywords: ["neerja", "swara", "heera", "veena", "lekha", "kalyani", "priya", "shruti", "geeta", "en-in", "india"]
  },
  {
    id: "swathi-warm",
    name: "Swathi (Warm & Gentle)",
    badge: "Natural Warm",
    description: "Soothing, friendly, feminine mentor tone",
    defaultPitch: 1.04,
    defaultRate: 0.96,
    keywords: ["jenny", "samantha", "victoria", "karen", "ava", "libby"]
  },
  {
    id: "swathi-clear",
    name: "Swathi (Studio Clear)",
    badge: "Crisp Mentor",
    description: "Focused, articulate, high-definition academic pronunciation",
    defaultPitch: 1.02,
    defaultRate: 1.0,
    keywords: ["aria", "sonia", "google uk english female", "google us english female", "zira"]
  },
  {
    id: "swathi-bright",
    name: "Swathi (Sweet & Bright)",
    badge: "Cheerful",
    description: "Bright, energetic, and encouraging pace",
    defaultPitch: 1.10,
    defaultRate: 0.98,
    keywords: ["jenny", "aria", "samantha", "girl", "female"]
  }
];

export interface EduSwathiVoiceSettings {
  profileId: string;
  voiceURI: string;
  pitch: number;
  rate: number;
  lockedVoiceURI?: string;
  lockedVoiceName?: string;
}

const VOICE_SETTINGS_KEY = "eduswathi_voice_settings";

export function getEduSwathiVoiceSettings(): EduSwathiVoiceSettings {
  if (typeof window === "undefined") {
    return {
      profileId: "swathi-indian",
      voiceURI: "",
      pitch: 1.04,
      rate: 0.95,
      lockedVoiceURI: "",
      lockedVoiceName: ""
    };
  }
  try {
    const raw = localStorage.getItem(VOICE_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        profileId: parsed.profileId || "swathi-indian",
        voiceURI: parsed.voiceURI || "",
        pitch: typeof parsed.pitch === "number" ? parsed.pitch : 1.04,
        rate: typeof parsed.rate === "number" ? parsed.rate : 0.95,
        lockedVoiceURI: parsed.lockedVoiceURI || "",
        lockedVoiceName: parsed.lockedVoiceName || ""
      };
    }
  } catch {
    // Ignore JSON error
  }
  return {
    profileId: "swathi-indian",
    voiceURI: "",
    pitch: 1.04,
    rate: 0.95,
    lockedVoiceURI: "",
    lockedVoiceName: ""
  };
}

export function saveEduSwathiVoiceSettings(settings: Partial<EduSwathiVoiceSettings>): void {
  if (typeof window === "undefined") return;
  try {
    const current = getEduSwathiVoiceSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage write errors
  }
}

export function lockEduSwathiVoice(voiceURI: string, voiceName?: string): void {
  saveEduSwathiVoiceSettings({
    voiceURI,
    lockedVoiceURI: voiceURI,
    lockedVoiceName: voiceName || ""
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("eduswathi_voice_locked", { detail: { voiceURI, voiceName } }));
  }
}

export function clearLockedVoice(): void {
  saveEduSwathiVoiceSettings({
    voiceURI: "",
    lockedVoiceURI: "",
    lockedVoiceName: ""
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("eduswathi_voice_locked", { detail: { voiceURI: "", voiceName: "" } }));
  }
}

const SESSION_STORAGE_KEY = "eduswathi_student_name";
const LOCAL_STORAGE_KEY = "eduswathi_student_name_saved";

// Words to filter out when checking for standalone names
const FORBIDDEN_NAME_WORDS = new Set([
  "hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening",
  "yes", "no", "maybe", "ok", "okay", "sure", "yeah", "yep", "nope",
  "what", "who", "why", "how", "when", "where", "which",
  "eduswathi", "swathi", "ai", "bot", "assistant", "teacher", "student",
  "nothing", "none", "test", "name", "my name", "please", "help", "listening",
  "someone", "anybody", "nobody", "human", "friend", "user", "anonymous",
  "good", "fine", "well", "great", "nice", "cool", "super"
]);

/**
 * Clean and Title-Case a detected name (e.g. "rahul sharma" -> "Rahul Sharma")
 */
export function formatName(raw: string): string {
  const cleaned = raw.trim().replace(/[.,!?;:"'(){}[\]]/g, "").trim();
  if (!cleaned) return "";
  return cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Intelligent Name Extractor
 * Parses natural conversational utterances such as:
 * - "I'm Rahul"
 * - "I am Rahul"
 * - "My name is Priya"
 * - "This is Alex"
 * - "Call me Jordan"
 * - "Rahul here"
 * - "It's Maya"
 * - "Hello I am Jayaram"
 * - or simply "Jayaram"
 */
export function extractStudentName(input: string): string | null {
  if (!input) return null;
  let text = input.trim();

  // Strip excessive punctuation and clean whitespace
  text = text.replace(/[.,!?;:"'(){}[\]]/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return null;

  // Strip leading conversational greetings / fillers (e.g. "Hello, ", "Hi! ", "Um... ", "Yeah, ")
  const leadingGreetings = /^(?:hello|hi|hey|hey\s+there|good\s+morning|good\s+afternoon|good\s+evening|um+|uh+|well|yeah|yep|yes|sure|actually|so|ok|okay)\b[\s,]*/i;
  text = text.replace(leadingGreetings, "").trim();

  // Strip trailing conversational tags (e.g. "here", "speaking", "please", "nice to meet you", "thank you", "thanks")
  const trailingClosures = /\b(?:here|speaking|please|nice\s+to\s+meet\s+you|thank\s+you|thanks|bro|buddy|sir|ma'?am)$/i;
  text = text.replace(trailingClosures, "").trim();

  if (!text) return null;

  // Pattern 1: Conversational prefixes
  const prefixPatterns = [
    /^(?:my\s+name\s+is|my\s+name's|the\s+name\s+is|name\s+is|name's)\s+([a-zA-Z\s'-]{2,35})$/i,
    /^(?:i\s+am|i'm|im|myself)\s+([a-zA-Z\s'-]{2,35})$/i,
    /^(?:this\s+is|it\s+is|it's|its)\s+([a-zA-Z\s'-]{2,35})$/i,
    /^(?:call\s+me|you\s+can\s+call\s+me|they\s+call\s+me)\s+([a-zA-Z\s'-]{2,35})$/i,
    /^(?:i\s+go\s+by|i\s+am\s+called|i'm\s+called)\s+([a-zA-Z\s'-]{2,35})$/i,
  ];

  for (const pattern of prefixPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const candidate = match[1].trim().split(/\s+/).slice(0, 2).join(" ");
      const formatted = formatName(candidate);
      if (isValidName(formatted)) {
        return formatted;
      }
    }
  }

  // Also check if prefix is anywhere in the utterance (e.g., "Actually my name is Jayaram")
  const embeddedMatch = text.match(/(?:my\s+name\s+is|i\s+am|i'm)\s+([a-zA-Z\s'-]{2,30})/i);
  if (embeddedMatch && embeddedMatch[1]) {
    const candidate = embeddedMatch[1].trim().split(/\s+/).slice(0, 2).join(" ");
    const formatted = formatName(candidate);
    if (isValidName(formatted)) {
      return formatted;
    }
  }

  // Pattern 2: Standalone single or two-word candidate (e.g. "Jayaram" or "Rahul Sharma")
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length >= 1 && words.length <= 2) {
    const candidate = words.join(" ");
    const formatted = formatName(candidate);
    if (isValidName(formatted)) {
      return formatted;
    }
  }

  return null;
}

function isValidName(name: string): boolean {
  if (!name || name.length < 2 || name.length > 35) return false;
  const lower = name.toLowerCase();
  if (FORBIDDEN_NAME_WORDS.has(lower)) return false;

  const words = lower.split(/\s+/);
  for (const w of words) {
    if (FORBIDDEN_NAME_WORDS.has(w)) return false;
  }

  // Must only contain letters, spaces, hyphens, apostrophes
  return /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/.test(name);
}

// Global cached voices list
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  try {
    cachedVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      cachedVoices = window.speechSynthesis.getVoices();
    });
  } catch {
    // Ignore in unsupported environments
  }
}

/**
 * Asynchronously waits for speech synthesis voices to be loaded.
 * Essential for mobile Chrome and Safari where voices load asynchronously after initial page mount.
 */
export function ensureVoicesReady(timeoutMs: number = 600): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }
  const immediate = window.speechSynthesis.getVoices();
  if (immediate && immediate.length > 0) {
    cachedVoices = immediate;
    return Promise.resolve(immediate);
  }

  return new Promise((resolve) => {
    let settled = false;
    const complete = () => {
      if (settled) return;
      settled = true;
      try {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) cachedVoices = v;
      } catch {
        // Ignore
      }
      resolve(cachedVoices);
    };

    const onVoicesChanged = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      complete();
    };

    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    setTimeout(complete, timeoutMs);
  });
}

/**
 * Robust detection of male voices across Android, iOS, Windows, ChromeOS, and macOS.
 * Specifically rejects Android Google TTS male identifiers (e.g. -end-, -gmf-, #male)
 * and iOS male identifiers (e.g. Rishi, Daniel, Oliver).
 */
export function isMaleVoice(voice: SpeechSynthesisVoice): boolean {
  if (!voice) return false;
  const name = (voice.name || "").toLowerCase();
  const uri = (voice.voiceURI || "").toLowerCase();
  const lang = (voice.lang || "").toLowerCase();
  const combined = `${name} ${uri} ${lang}`;

  // Android Google TTS male identifiers:
  // - "en-in-x-end-" or "-end-" (Google TTS Indian English male voice)
  // - "-gmf-" (Google TTS male voice)
  // - "#male" or "_male" or "male_"
  if (
    combined.includes("-end-") ||
    combined.includes("-gmf-") ||
    combined.includes("#male") ||
    combined.includes("_male") ||
    combined.includes("male_") ||
    combined.includes("-male") ||
    /\b(male|man|boy)\b/i.test(name) ||
    /\b(male|man|boy)\b/i.test(uri)
  ) {
    return true;
  }

  // Known male names across platforms:
  const maleKeywords = [
    "rishi", "david", "mark", "guy", "george", "james", "richard", "daniel",
    "stefan", "ravi", "pradeep", "mohan", "oliver", "steven", "paul", "eric",
    "bruce", "alex", "aaron", "arthur", "fred", "gordon", "lee", "tom",
    "suresh", "hemant", "karthik", "tarun", "miltiadis", "reed", "nathan"
  ];

  for (const m of maleKeywords) {
    if (new RegExp(`\\b${m}\\b`, "i").test(name) || new RegExp(`\\b${m}\\b`, "i").test(uri)) {
      return true;
    }
  }

  return false;
}

/**
 * Robust detection of authentic female voices across Android, iOS, Windows, ChromeOS, and macOS.
 * Prioritizes Android female tags (-cxx-, -ahp-, -ene-) and known natural female names.
 */
export function isFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  if (!voice || isMaleVoice(voice)) return false;
  const name = (voice.name || "").toLowerCase();
  const uri = (voice.voiceURI || "").toLowerCase();
  const combined = `${name} ${uri}`;

  // Android Google TTS female indicators:
  // - "-cxx-" (primary female Indian English voice on Android)
  // - "-ahp-" (secondary female Indian English voice on Android)
  // - "-ene-", "-sfg-"
  if (
    combined.includes("-cxx") ||
    combined.includes("-ahp") ||
    combined.includes("-ene") ||
    combined.includes("-sfg") ||
    combined.includes("#female") ||
    combined.includes("_female") ||
    combined.includes("female_") ||
    combined.includes("-female") ||
    /\b(female|woman|girl)\b/i.test(name) ||
    /\b(female|woman|girl)\b/i.test(uri)
  ) {
    return true;
  }

  // Known female names across mobile and desktop:
  const femaleKeywords = [
    "neerja", "swara", "heera", "veena", "sangeeta", "lekha", "kalyani",
    "priya", "shruti", "geeta", "samantha", "victoria", "karen", "ava",
    "sonia", "libby", "fiona", "aria", "jenny", "zira", "moira", "tessa",
    "nicky", "allison", "susan", "serena", "ananya", "kavya", "kalpana", "aditi"
  ];

  for (const f of femaleKeywords) {
    if (new RegExp(`\\b${f}\\b`, "i").test(name) || new RegExp(`\\b${f}\\b`, "i").test(uri)) {
      return true;
    }
  }

  return false;
}

/**
 * Returns all available speech synthesis voices detected by the browser.
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  return voices && voices.length > 0 ? voices : cachedVoices;
}

/**
 * Searches for the best matching voice for Edu Swathi based on active profile or explicit voiceURI.
 * Prioritizes authentic Indian English female voices (Neerja, Swara, Veena, en-IN) and natural female voices.
 */
export function findFemaleVoice(preferredProfileId?: string, explicitURI?: string): SpeechSynthesisVoice | null {
  return findEduSwathiVoice({ profileId: preferredProfileId, voiceURI: explicitURI });
}

export function findEduSwathiVoice(options: { profileId?: string; voiceURI?: string } = {}): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const list = getAvailableVoices();
  if (!list || list.length === 0) return null;

  const currentSettings = getEduSwathiVoiceSettings();
  
  // 1. Explicit voiceURI match or locked voiceURI match
  // Crucial for mobile consistency: If a voice has been chosen or locked, ALWAYS use it!
  const targetURI = options.voiceURI || currentSettings.voiceURI || currentSettings.lockedVoiceURI;
  if (targetURI) {
    const explicitMatch = list.find((v) => v.voiceURI === targetURI || v.name === targetURI);
    if (explicitMatch) return explicitMatch;
  }

  const activeProfileId = options.profileId || currentSettings.profileId || "swathi-indian";
  const profile = EDUSWATHI_VOICE_PROFILES.find((p) => p.id === activeProfileId) || EDUSWATHI_VOICE_PROFILES[0];

  let resolvedVoice: SpeechSynthesisVoice | null = null;

  // 2. Profile-based matching: If swathi-indian, prioritize authentic en-IN female voices
  if (activeProfileId === "swathi-indian") {
    // 2a. Genuine Indian English female voices (prefer local offline voices so mobile doesn't drop/switch)
    const indianFemales = list.filter(
      (v) =>
        (v.lang.toLowerCase().replace("_", "-") === "en-in" || v.lang.toLowerCase().includes("in")) &&
        isFemaleVoice(v)
    );

    if (indianFemales.length > 0) {
      // Prefer offline local voice first to prevent network voice drops on mobile
      const local = indianFemales.find((v) => v.localService || !v.name.toLowerCase().includes("network"));
      resolvedVoice = local || indianFemales[0];
    }

    // 2b. Check authentic Indian female names
    if (!resolvedVoice) {
      const indianNameMatch = list.find(
        (v) =>
          (v.lang.toLowerCase().includes("in") || v.name.toLowerCase().includes("india") || v.lang.toLowerCase().startsWith("en")) &&
          ["neerja", "sangeeta", "swara", "heera", "veena", "lekha", "kalyani", "priya", "shruti", "geeta", "aditi", "ananya"].some(
            (kw) => v.name.toLowerCase().includes(kw)
          ) &&
          !isMaleVoice(v)
      );
      if (indianNameMatch) resolvedVoice = indianNameMatch;
    }

    // 2c. Any non-male en-IN voice (prefer local)
    if (!resolvedVoice) {
      const nonMaleIndian = list.filter(
        (v) =>
          v.lang.toLowerCase().replace("_", "-") === "en-in" &&
          !isMaleVoice(v)
      );
      if (nonMaleIndian.length > 0) {
        resolvedVoice = nonMaleIndian.find((v) => !v.name.toLowerCase().includes("network")) || nonMaleIndian[0];
      }
    }
  }

  // 3. Profile keyword matching
  if (!resolvedVoice) {
    for (const kw of profile.keywords) {
      const match = list.find(
        (v) =>
          (v.lang.toLowerCase().startsWith("en") || v.lang.toLowerCase().includes("in")) &&
          v.name.toLowerCase().includes(kw) &&
          !isMaleVoice(v)
      );
      if (match) {
        resolvedVoice = match;
        break;
      }
    }
  }

  // 4. High quality natural female English voices across iOS/Android/Windows
  if (!resolvedVoice) {
    const highQualityFemales = [
      "sangeeta", "veena", "neerja", "samantha", "aria", "jenny", "victoria", "karen", "ava", "sonia", "libby", "fiona", "zira"
    ];
    for (const kw of highQualityFemales) {
      const match = list.find(
        (v) =>
          v.lang.toLowerCase().startsWith("en") &&
          v.name.toLowerCase().includes(kw) &&
          !isMaleVoice(v)
      );
      if (match) {
        resolvedVoice = match;
        break;
      }
    }
  }

  // 5. Any English voice detected as female
  if (!resolvedVoice) {
    const anyFemale = list.find(
      (v) => v.lang.toLowerCase().startsWith("en") && isFemaleVoice(v)
    );
    if (anyFemale) resolvedVoice = anyFemale;
  }

  // 6. Any English voice not tagged male
  if (!resolvedVoice) {
    const nonMale = list.find(
      (v) => v.lang.toLowerCase().startsWith("en") && !isMaleVoice(v)
    );
    if (nonMale) resolvedVoice = nonMale;
  }

  // 7. Last resort: first English voice or first voice in list
  if (!resolvedVoice) {
    resolvedVoice = list.find((v) => v.lang.toLowerCase().startsWith("en")) || list[0] || null;
  }

  // CRUCIAL: Automatically lock this voice in localStorage so it NEVER changes on mobile view!
  if (resolvedVoice && !currentSettings.lockedVoiceURI && typeof window !== "undefined") {
    try {
      saveEduSwathiVoiceSettings({
        lockedVoiceURI: resolvedVoice.voiceURI,
        lockedVoiceName: resolvedVoice.name
      });
    } catch {
      // Ignore
    }
  }

  return resolvedVoice;
}

// Global reference to prevent V8 garbage-collecting utterances mid-speech (Chromium issue 679437)
if (typeof window !== "undefined") {
  (window as any).__eduSwathiActiveUtterances = (window as any).__eduSwathiActiveUtterances || [];
}

/**
 * Text-to-Speech (TTS) engine configured specifically for Edu Swathi
 * with natural conversational warmth and authentic female pronunciation.
 * Guarantees voice consistency on mobile devices.
 */
export function speakText(text: string, options: TTSOptions = {}): { cancel: () => void } {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported in this environment.");
    if (options.onEnd) options.onEnd();
    return { cancel: () => {} };
  }

  const synth = window.speechSynthesis;
  let isCanceled = false;
  let keepAliveInterval: any = null;

  // Unpause in case the browser suspended it
  try {
    if (synth.paused) {
      synth.resume();
    }
  } catch {
    // Ignore resume errors
  }

  // Ensure "Edu Swathi" is pronounced with natural cadence as two words
  const normalizedText = text
    .replace(/EduSwathi/g, "Edu Swathi")
    .replace(/eduswathi/gi, "Edu Swathi");

  const utterance = new SpeechSynthesisUtterance(normalizedText);
  const currentSettings = getEduSwathiVoiceSettings();

  // Keep a global reference to prevent garbage collection
  try {
    (window as any).__eduSwathiActiveUtterances.push(utterance);
  } catch {
    // Ignore
  }

  const cleanupUtterance = () => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
    try {
      if (typeof window !== "undefined" && (window as any).__eduSwathiActiveUtterances) {
        const arr = (window as any).__eduSwathiActiveUtterances;
        const idx = arr.indexOf(utterance);
        if (idx !== -1) arr.splice(idx, 1);
      }
    } catch {
      // Ignore
    }
  };

  const playUtterance = () => {
    if (isCanceled) {
      cleanupUtterance();
      return;
    }

    // Resolve target voice with locked priority
    const targetVoice = findEduSwathiVoice({
      profileId: options.profileId || currentSettings.profileId,
      voiceURI: options.voiceURI || currentSettings.voiceURI || currentSettings.lockedVoiceURI
    });

    if (targetVoice) {
      utterance.voice = targetVoice;
      utterance.lang = targetVoice.lang || "en-IN";
    } else {
      utterance.lang = "en-IN";
    }

    // Rate: 0.95 gives natural conversational clarity
    utterance.rate = options.rate ?? currentSettings.rate ?? 0.95;
    
    // Pitch: 1.04 gives a warm, sweet, melodic resonance without robotic distortion
    utterance.pitch = options.pitch ?? currentSettings.pitch ?? 1.04;

    let hasEnded = false;
    const finish = () => {
      cleanupUtterance();
      if (hasEnded) return;
      hasEnded = true;
      options.onEnd?.();
    };

    if (options.onStart) {
      utterance.onstart = () => {
        if (!isCanceled) options.onStart?.();
      };
    }

    utterance.onend = () => {
      finish();
    };

    utterance.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "canceled") {
        console.warn("SpeechSynthesis error:", e);
        options.onError?.(e);
      }
      finish();
    };

    // Keep-alive timer for Chrome/Edge (prevents 15-second speech silence cutoff)
    keepAliveInterval = setInterval(() => {
      try {
        if (synth.speaking) {
          synth.pause();
          synth.resume();
        } else {
          cleanupUtterance();
        }
      } catch {
        cleanupUtterance();
      }
    }, 10000);

    try {
      synth.cancel();
      // Tiny delay after cancel to prevent Chrome audio queue race condition
      setTimeout(() => {
        if (!isCanceled) {
          if (synth.paused) synth.resume();
          synth.speak(utterance);
        } else {
          cleanupUtterance();
        }
      }, 25);
    } catch (err) {
      console.warn("Error calling synth.speak:", err);
      finish();
    }
  };

  // If voices are empty (common on mobile during first mount), wait up to 350ms
  const available = getAvailableVoices();
  if (available.length === 0 && typeof window !== "undefined") {
    ensureVoicesReady(350).then(() => {
      if (!isCanceled) {
        playUtterance();
      } else {
        cleanupUtterance();
      }
    });
  } else {
    playUtterance();
  }

  return {
    cancel: () => {
      isCanceled = true;
      cleanupUtterance();
      try {
        synth.cancel();
      } catch {
        // Ignore
      }
    }
  };
}

/**
 * Speaks a sample test sentence with custom or current Edu Swathi voice settings.
 */
export function testEduSwathiVoice(options: {
  voiceURI?: string;
  profileId?: string;
  pitch?: number;
  rate?: number;
  sampleText?: string;
  onStart?: () => void;
  onEnd?: () => void;
} = {}): { cancel: () => void } {
  const sample = options.sampleText || "Hello! I am Edu Swathi, your personal AI learning companion.";
  return speakText(sample, {
    voiceURI: options.voiceURI,
    profileId: options.profileId,
    pitch: options.pitch,
    rate: options.rate,
    onStart: options.onStart,
    onEnd: options.onEnd
  });
}

/**
 * Microphone permission helper - safely returns true without pre-emptively opening media streams.
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  return true;
}

/**
 * Speech Recognition (STT) Controller
 * Enhanced with continuous mode, auto-recovery from silence, mic pre-warm,
 * and real-time interim/final transcript streaming.
 */
export class VoiceRecognitionController {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentOptions: VoiceServiceOptions | null = null;
  private restartTimeout: any = null;
  private isExplicitlyStopped: boolean = false;

  public static isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public async start(options: VoiceServiceOptions): Promise<boolean> {
    if (!VoiceRecognitionController.isSupported()) {
      options.onError?.("Speech recognition is not supported in this browser. You can type your name directly.");
      return false;
    }

    this.stop();
    this.isExplicitlyStopped = false;
    this.currentOptions = options;

    // Prompt mic permission so browser dialog triggers cleanly
    await requestMicrophonePermission();

    return this.initAndStartRecognition();
  }

  private initAndStartRecognition(): boolean {
    if (this.isExplicitlyStopped) return false;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    try {
      this.recognition = new SpeechRecognitionClass();
      const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      // Mobile browsers (especially Android Chrome) crash or abort if continuous is true
      this.recognition.continuous = !isMobile;
      this.recognition.interimResults = true;
      // Default to Indian English for Karnataka 2nd PUC students, fallback to browser language
      this.recognition.lang = "en-IN";
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.currentOptions?.onSpeechStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const transcriptChunk = res[0].transcript;
          if (res.isFinal) {
            finalTranscript += transcriptChunk;
          } else {
            interimTranscript += transcriptChunk;
          }
        }

        const activeText = (finalTranscript || interimTranscript).trim();
        if (activeText) {
          this.currentOptions?.onTranscript?.(activeText, !!finalTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        const errType = event.error;

        // "no-speech" is not fatal in continuous mode; student may just be thinking
        if (errType === "no-speech") {
          return;
        }

        if (errType === "aborted") {
          return;
        }

        if (errType === "not-allowed" || errType === "service-not-allowed") {
          this.isListening = false;
          this.currentOptions?.onError?.("Microphone access was denied. Please allow microphone permissions in your browser or iframe.");
          return;
        }

        console.warn("Speech recognition warning:", errType);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // If still supposed to be listening and not explicitly stopped, auto-restart
        if (!this.isExplicitlyStopped && this.currentOptions) {
          clearTimeout(this.restartTimeout);
          this.restartTimeout = setTimeout(() => {
            if (!this.isExplicitlyStopped && this.currentOptions) {
              try {
                this.recognition?.start();
              } catch {
                this.initAndStartRecognition();
              }
            }
          }, 150);
        } else {
          this.currentOptions?.onSpeechEnd?.();
        }
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      if (err.name === "InvalidStateError") {
        this.isListening = true;
        return true;
      }
      console.warn("Failed to initialize speech recognition:", err);
      this.currentOptions?.onError?.("Could not start microphone. Tap the mic button or type your name.");
      return false;
    }
  }

  public stop(): void {
    this.isExplicitlyStopped = true;
    this.isListening = false;
    clearTimeout(this.restartTimeout);
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // Ignore
      }
      this.recognition = null;
    }
  }

  public getIsRunning(): boolean {
    return this.isListening;
  }
}

/**
 * Session persistence helper for the student's name
 */
export function getStoredStudentName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      sessionStorage.getItem(SESSION_STORAGE_KEY) ||
      localStorage.getItem(LOCAL_STORAGE_KEY) ||
      null
    );
  } catch {
    return null;
  }
}

export function saveStoredStudentName(name: string): void {
  if (typeof window === "undefined" || !name) return;
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, name);
    localStorage.setItem(LOCAL_STORAGE_KEY, name);
    // Dispatch custom event so reactive components update instantly
    window.dispatchEvent(
      new CustomEvent("eduswathi_student_name_updated", { detail: { name } })
    );
  } catch (err) {
    console.warn("Could not save student name in storage", err);
  }
}

export function clearStoredStudentName(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent("eduswathi_student_name_updated", { detail: { name: null } })
    );
  } catch {
    // Ignore
  }
}

