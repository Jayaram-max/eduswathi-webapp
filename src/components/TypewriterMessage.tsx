import React, { useState, useEffect, useRef } from "react";

interface TypewriterMessageProps {
  content: string;
  isStreaming?: boolean;
  speedMs?: number;
  onComplete?: () => void;
  className?: string;
  animate?: boolean;
}

export const TypewriterMessage: React.FC<TypewriterMessageProps> = ({
  content,
  isStreaming = false,
  speedMs = 10,
  onComplete,
  className = "",
  animate = true
}) => {
  const [displayedLength, setDisplayedLength] = useState(() => (animate ? 0 : content.length));
  const [isDone, setIsDone] = useState(() => !animate || content.length === 0);
  const targetContentRef = useRef(content);
  targetContentRef.current = content;

  // If animate is disabled (e.g. historical loaded messages), show immediately
  useEffect(() => {
    if (!animate) {
      setDisplayedLength(content.length);
      setIsDone(true);
    }
  }, [animate, content.length]);

  useEffect(() => {
    if (!animate) return;

    if (displayedLength >= content.length && !isStreaming) {
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    setIsDone(false);

    // Adaptive typing speed based on backlog
    const backlog = content.length - displayedLength;
    const step = backlog > 100 ? 5 : backlog > 40 ? 3 : backlog > 15 ? 2 : 1;
    const intervalTime = backlog > 40 ? Math.max(5, speedMs / 2) : speedMs;

    const timer = setTimeout(() => {
      setDisplayedLength((prev) => {
        const next = Math.min(prev + step, targetContentRef.current.length);
        if (next >= targetContentRef.current.length && !isStreaming) {
          setIsDone(true);
          if (onComplete) onComplete();
        }
        return next;
      });
    }, intervalTime);

    return () => clearTimeout(timer);
  }, [displayedLength, content.length, isStreaming, speedMs, animate, onComplete]);

  const handleSkip = () => {
    setDisplayedLength(content.length);
    setIsDone(true);
    if (onComplete) onComplete();
  };

  const visibleText = content.slice(0, displayedLength);

  return (
    <div className={`relative group/typewriter ${className}`}>
      <span>{visibleText}</span>
      {!isDone && (
        <span
          className="inline-block w-2 h-4 ml-0.5 bg-primary border border-on-surface align-middle animate-pulse"
          title="Streaming response..."
        />
      )}
      {!isDone && displayedLength > 20 && (
        <button
          onClick={handleSkip}
          type="button"
          className="ml-2 inline-flex items-center text-[10px] font-mono font-bold uppercase text-secondary/70 hover:text-on-surface bg-surface hover:bg-surface-container px-1.5 py-0.5 rounded border border-on-surface/30 cursor-pointer transition-opacity"
          title="Click to reveal full response immediately"
        >
          Skip ⏭
        </button>
      )}
    </div>
  );
};
