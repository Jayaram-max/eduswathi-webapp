import React, { useState, useEffect } from "react";
import {
  X,
  Volume2,
  Sparkles,
  Check,
  RotateCcw,
  Sliders,
  Music,
  Globe2,
  ShieldCheck,
  Lock
} from "lucide-react";
import {
  EDUSWATHI_VOICE_PROFILES,
  EduSwathiVoiceProfile,
  EduSwathiVoiceSettings,
  getEduSwathiVoiceSettings,
  saveEduSwathiVoiceSettings,
  getAvailableVoices,
  findEduSwathiVoice,
  testEduSwathiVoice,
  lockEduSwathiVoice,
  isFemaleVoice,
  isMaleVoice,
  ensureVoicesReady
} from "../services/voiceAgentService";

interface EduSwathiVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceChanged?: (settings: EduSwathiVoiceSettings) => void;
}

export const EduSwathiVoiceModal: React.FC<EduSwathiVoiceModalProps> = ({
  isOpen,
  onClose,
  onVoiceChanged
}) => {
  const [settings, setSettings] = useState<EduSwathiVoiceSettings>(getEduSwathiVoiceSettings());
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [activeVoiceName, setActiveVoiceName] = useState<string>("");

  // Load voices on mount & listen for browser voiceschanged event
  useEffect(() => {
    const updateVoices = () => {
      const voices = getAvailableVoices();
      setAvailableVoices(voices);
      const current = getEduSwathiVoiceSettings();
      const resolved = findEduSwathiVoice({
        profileId: current.profileId,
        voiceURI: current.voiceURI || current.lockedVoiceURI
      });
      if (resolved) {
        setActiveVoiceName(`${resolved.name} (${resolved.lang})`);
      }
    };

    updateVoices();
    ensureVoicesReady(500).then(() => {
      updateVoices();
    });

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
      }
    };
  }, []);

  // Update resolved voice name whenever settings change
  useEffect(() => {
    const resolved = findEduSwathiVoice({
      profileId: settings.profileId,
      voiceURI: settings.voiceURI || settings.lockedVoiceURI
    });
    if (resolved) {
      setActiveVoiceName(`${resolved.name} (${resolved.lang})`);
    } else {
      setActiveVoiceName("Browser Default Female Voice");
    }
  }, [settings.profileId, settings.voiceURI, settings.lockedVoiceURI]);

  if (!isOpen) return null;

  const handleSelectProfile = (profile: EduSwathiVoiceProfile) => {
    const resolved = findEduSwathiVoice({ profileId: profile.id });
    const targetURI = resolved ? resolved.voiceURI : "";
    const updated: EduSwathiVoiceSettings = {
      ...settings,
      profileId: profile.id,
      voiceURI: targetURI,
      lockedVoiceURI: targetURI,
      lockedVoiceName: resolved ? resolved.name : "",
      pitch: profile.defaultPitch,
      rate: profile.defaultRate
    };
    setSettings(updated);
    saveEduSwathiVoiceSettings(updated);
    if (targetURI && resolved) {
      lockEduSwathiVoice(targetURI, resolved.name);
    }
    onVoiceChanged?.(updated);
  };

  const handleSelectDeviceVoice = (voiceURI: string) => {
    const chosenVoice = availableVoices.find((v) => v.voiceURI === voiceURI);
    const updated: EduSwathiVoiceSettings = {
      ...settings,
      voiceURI,
      lockedVoiceURI: voiceURI,
      lockedVoiceName: chosenVoice ? chosenVoice.name : ""
    };
    setSettings(updated);
    saveEduSwathiVoiceSettings(updated);
    if (voiceURI && chosenVoice) {
      lockEduSwathiVoice(voiceURI, chosenVoice.name);
    }
    onVoiceChanged?.(updated);
  };

  const handleRateChange = (newRate: number) => {
    const updated = { ...settings, rate: newRate };
    setSettings(updated);
    saveEduSwathiVoiceSettings(updated);
    onVoiceChanged?.(updated);
  };

  const handlePitchChange = (newPitch: number) => {
    const updated = { ...settings, pitch: newPitch };
    setSettings(updated);
    saveEduSwathiVoiceSettings(updated);
    onVoiceChanged?.(updated);
  };

  const handleResetDefaults = () => {
    const defaultProfile = EDUSWATHI_VOICE_PROFILES[0];
    const resolved = findEduSwathiVoice({ profileId: "swathi-indian" });
    const reset: EduSwathiVoiceSettings = {
      profileId: "swathi-indian",
      voiceURI: resolved ? resolved.voiceURI : "",
      lockedVoiceURI: resolved ? resolved.voiceURI : "",
      lockedVoiceName: resolved ? resolved.name : "",
      pitch: defaultProfile.defaultPitch,
      rate: defaultProfile.defaultRate
    };
    setSettings(reset);
    saveEduSwathiVoiceSettings(reset);
    if (resolved) {
      lockEduSwathiVoice(resolved.voiceURI, resolved.name);
    }
    onVoiceChanged?.(reset);
  };

  const handleTestVoice = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingTest(true);
    testEduSwathiVoice({
      voiceURI: settings.voiceURI || settings.lockedVoiceURI,
      profileId: settings.profileId,
      pitch: settings.pitch,
      rate: settings.rate,
      sampleText: "Hello! I am Edu Swathi, your personal AI learning companion for Karnataka 2nd PUC.",
      onStart: () => setIsPlayingTest(true),
      onEnd: () => setIsPlayingTest(false)
    });
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (window.speechSynthesis) window.speechSynthesis.cancel();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edu-swathi-voice-modal-title"
    >
      <div className="bg-white border-4 border-on-surface rounded-2xl w-full max-w-lg shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-primary border-b-3 border-on-surface p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-on-surface flex items-center justify-center shadow-brutalist-sm">
              <Volume2 size={20} className="text-on-surface stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-on-surface text-surface px-1.5 py-0.5 rounded">
                  Voice Engine
                </span>
                <span className="font-mono text-[10px] font-bold text-on-surface/80">
                  // MOBILE_CONSISTENT
                </span>
              </div>
              <h2 id="edu-swathi-voice-modal-title" className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-on-surface leading-none mt-0.5">
                Edu Swathi Voice
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 rounded-lg border-2 border-on-surface bg-white hover:bg-surface transition-colors cursor-pointer shadow-brutalist-sm"
            aria-label="Close voice settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Mobile Stability Banner */}
          <div className="p-3 bg-emerald-50 border-2 border-emerald-800 rounded-xl flex items-start gap-2.5 shadow-brutalist-sm">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 border border-emerald-950 flex items-center justify-center text-white shrink-0 mt-0.5">
              <ShieldCheck size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-[11px] font-black uppercase text-emerald-950 tracking-wide">
                  Voice Stability Locked
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-200 border border-emerald-800 rounded text-[9px] font-mono font-bold text-emerald-950 uppercase shrink-0">
                  Active
                </span>
              </div>
              <p className="font-sans text-[11px] text-emerald-900 leading-snug mt-0.5">
                Edu Swathi is locked to your chosen voice. It will stay consistent and won't switch to a male or robotic voice in mobile view.
              </p>
            </div>
          </div>

          {/* Active Voice Info Box */}
          <div className="p-3.5 bg-surface border-2 border-on-surface rounded-xl shadow-brutalist-sm flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[10px] font-bold text-secondary uppercase block">
                Active Locked Voice
              </span>
              <p className="font-display font-black text-xs sm:text-sm text-on-surface truncate mt-0.5">
                {activeVoiceName || "Scanning voices..."}
              </p>
            </div>
            <button
              onClick={handleTestVoice}
              disabled={isPlayingTest}
              className={`px-3 py-2 ${isPlayingTest ? "bg-accent" : "bg-primary hover:bg-accent"} border-2 border-on-surface rounded-lg font-mono text-[11px] font-black uppercase text-on-surface shadow-brutalist-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0`}
            >
              <Volume2 size={14} className={isPlayingTest ? "animate-bounce" : ""} />
              <span>{isPlayingTest ? "Speaking..." : "Test Voice"}</span>
            </button>
          </div>

          {/* Voice Presets */}
          <div className="space-y-2">
            <label className="font-mono text-xs font-black uppercase tracking-wider text-on-surface flex items-center justify-between">
              <span>Choose Voice Style</span>
              <span className="text-[10px] text-primary-dark font-mono font-bold">Tap to Lock</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EDUSWATHI_VOICE_PROFILES.map((profile) => {
                const isSelected = settings.profileId === profile.id;
                return (
                  <button
                    key={profile.id}
                    onClick={() => handleSelectProfile(profile)}
                    className={`p-3 rounded-xl border-2 border-on-surface text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative ${
                      isSelected
                        ? "bg-primary shadow-brutalist-sm -translate-y-0.5 ring-2 ring-on-surface"
                        : "bg-surface hover:bg-white hover:shadow-brutalist-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5 bg-white border border-on-surface rounded text-on-surface">
                        {profile.badge}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-white border border-on-surface flex items-center justify-center">
                          <Check size={12} className="stroke-[3] text-on-surface" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-display font-black text-xs uppercase tracking-tight text-on-surface">
                        {profile.name}
                      </h4>
                      <p className="font-sans text-[11px] text-secondary leading-snug mt-0.5">
                        {profile.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Device Voice Dropdown (Advanced) */}
          <div className="space-y-2">
            <label className="font-mono text-xs font-black uppercase tracking-wider text-on-surface flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe2 size={13} /> Installed Mobile & System Voices
              </span>
              <span className="text-[10px] text-secondary font-sans font-normal">
                {availableVoices.length} voices found
              </span>
            </label>

            <select
              value={settings.voiceURI || settings.lockedVoiceURI || ""}
              onChange={(e) => handleSelectDeviceVoice(e.target.value)}
              className="w-full px-3 py-2.5 bg-surface border-2 border-on-surface rounded-xl font-sans text-xs font-bold text-on-surface focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary shadow-brutalist-sm cursor-pointer"
            >
              <option value="">Auto-matched Female Voice (Recommended)</option>
              {availableVoices
                .slice()
                .sort((a, b) => {
                  const aFemale = isFemaleVoice(a);
                  const bFemale = isFemaleVoice(b);
                  if (aFemale && !bFemale) return -1;
                  if (!aFemale && bFemale) return 1;

                  const aIn = a.lang.toLowerCase().includes("in");
                  const bIn = b.lang.toLowerCase().includes("in");
                  if (aIn && !bIn) return -1;
                  if (!aIn && bIn) return 1;
                  return a.name.localeCompare(b.name);
                })
                .map((v) => {
                  const female = isFemaleVoice(v);
                  const male = isMaleVoice(v);
                  const isIndian = v.lang.toLowerCase().includes("in");
                  let tag = female ? "✓ Female" : male ? "Male" : "Voice";
                  if (isIndian) tag += ", en-IN";
                  if (v.localService) tag += ", Offline/Local";

                  return (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({tag})
                    </option>
                  );
                })}
            </select>
          </div>

          {/* Voice Tuning Sliders: Rate and Pitch */}
          <div className="p-3.5 bg-surface border-2 border-on-surface rounded-xl space-y-3 shadow-brutalist-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-black uppercase text-on-surface flex items-center gap-1.5">
                <Sliders size={13} /> Voice Cadence & Pitch
              </span>
              <button
                onClick={handleResetDefaults}
                className="text-[10px] font-mono font-bold uppercase text-primary-dark hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={10} /> Reset
              </button>
            </div>

            {/* Speaking Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-secondary font-mono text-[11px]">Speaking Speed</span>
                <span className="font-mono text-[11px] text-on-surface">{settings.rate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.20"
                step="0.02"
                value={settings.rate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-secondary">
                <span>Slow (0.80x)</span>
                <span>Default (0.95x)</span>
                <span>Fast (1.20x)</span>
              </div>
            </div>

            {/* Speaking Pitch */}
            <div className="space-y-1 pt-1 border-t border-on-surface/10">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-secondary font-mono text-[11px]">Pitch Resonance</span>
                <span className="font-mono text-[11px] text-on-surface">{settings.pitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.90"
                max="1.25"
                step="0.02"
                value={settings.pitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-secondary">
                <span>Deeper (0.90)</span>
                <span>Natural Warm (1.04)</span>
                <span>Higher (1.25)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-surface border-t-2 border-on-surface p-3.5 sm:p-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              onClose();
            }}
            className="px-4 py-2 bg-white border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase text-on-surface hover:bg-surface shadow-brutalist-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              onClose();
            }}
            className="px-5 py-2 bg-primary hover:bg-accent border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase text-on-surface shadow-brutalist-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
          >
            <Check size={14} className="stroke-[3]" />
            <span>Done</span>
          </button>
        </div>

      </div>
    </div>
  );
};
