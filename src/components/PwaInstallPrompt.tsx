import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Share, PlusSquare } from "lucide-react";

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed as PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // Check if dismissed before in this session
    const isDismissed = sessionStorage.getItem("eduswathi_pwa_dismissed");
    if (isDismissed) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If on iOS and not standalone, show after a short delay
    let iosTimer: NodeJS.Timeout | null = null;
    if (isIosDevice) {
      iosTimer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIosInstructions(false);
    sessionStorage.setItem("eduswathi_pwa_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div
      className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-45 max-w-sm sm:w-96 bg-white border-3 border-on-surface rounded-2xl shadow-brutalist p-3.5 sm:p-4 text-on-surface animate-fade-in select-none"
      id="pwa-install-banner"
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary border-2 border-on-surface flex items-center justify-center shrink-0 shadow-brutalist-sm">
            <Smartphone size={20} className="text-on-surface" />
          </div>
          <div>
            <h4 className="font-display font-black text-xs uppercase tracking-tight leading-none">
              Install Edu Swathi App
            </h4>
            <p className="font-sans text-[11px] text-secondary leading-snug mt-1">
              Add to your phone for instant offline AI study & full-screen mode.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 text-secondary hover:text-on-surface rounded-md cursor-pointer transition-colors"
          aria-label="Close install prompt"
        >
          <X size={15} />
        </button>
      </div>

      {showIosInstructions ? (
        <div className="mt-3 p-2.5 bg-surface border-2 border-on-surface rounded-xl text-[11px] font-sans space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-on-surface">
            <span>Tap Safari</span> <Share size={13} className="inline text-primary-dark" />
            <span>then select</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-primary-dark bg-white px-2 py-1 border border-on-surface rounded-md">
            <PlusSquare size={13} /> <span>“Add to Home Screen”</span>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2 px-3 bg-primary hover:bg-accent border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase shadow-brutalist-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            id="install-app-btn"
          >
            <Download size={14} />
            <span>Install on Phone</span>
          </button>
          <button
            onClick={handleDismiss}
            className="py-2 px-3 bg-surface hover:bg-surface-container border-2 border-on-surface rounded-xl font-mono text-[11px] font-bold uppercase transition-all cursor-pointer"
          >
            Later
          </button>
        </div>
      )}
    </div>
  );
};
