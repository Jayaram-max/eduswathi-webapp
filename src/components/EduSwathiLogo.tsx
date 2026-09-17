import React from "react";
import { motion } from "motion/react";
import logoImg from "../assets/images/eduswathi-logo.png";

export interface EduSwathiIconProps {
  size?: number | string;
  className?: string;
  theme?: "light" | "dark" | "monochrome" | "monochrome-white";
  variant?: "standalone" | "badge";
  animated?: boolean;
  concept?: "ascending-folio" | "dual-wing" | "isometric-fold";
  showSparkle?: boolean;
  onClick?: () => void;
}

/**
 * EduSwathi Icon Symbol:
 * Exact geometric match to the official EduSwathi master brand logo:
 * - Circular white field
 * - Solid black outer ring
 * - Stylized geometric black "E" emblem with left spine triangular notch (<)
 * - Slanted neon lime capsule pill
 * - Curved metallic silver wire loop
 * - Top-right neon lime 4-point sparkle star
 */
export const EduSwathiIcon: React.FC<EduSwathiIconProps> = ({
  size = 36,
  className = "",
  theme = "light",
  variant = "standalone",
  animated = false,
  onClick
}) => {
  const numericSize = typeof size === "number" ? size : parseInt(size, 10) || 36;
  const isDark = theme === "dark";

  const svgContent = (
    <svg
      viewBox="0 0 1000 1000"
      width={numericSize}
      height={numericSize}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none overflow-visible rounded-full ${
        isDark ? "ring-1 ring-white/20" : "shadow-xs"
      } ${className}`}
      aria-label="EduSwathi Official Logo"
      style={{
        width: numericSize,
        height: numericSize,
        aspectRatio: "1/1",
      }}
    >
      {/* Outer White Background */}
      <rect width="1000" height="1000" fill="#FFFFFF" rx="500" />

      {/* Outer Black Ring */}
      <circle cx="500" cy="500" r="424" fill="#FFFFFF" stroke="#121316" strokeWidth="66" />

      {/* Main Stylized Black 'E' Monogram with Inner Cutout */}
      <path
        d="
          M 340 310
          L 605 310
          A 55 55 0 0 1 660 365
          A 55 55 0 0 1 605 420
          L 380 420
          A 15 15 0 0 0 365 435
          L 365 555
          A 15 15 0 0 0 380 570
          L 605 570
          A 55 55 0 0 1 660 625
          A 55 55 0 0 1 605 680
          L 340 680
          A 65 65 0 0 1 275 615
          L 275 375
          A 65 65 0 0 1 340 310
          Z
        "
        fill="#121316"
      />

      {/* Left Spine Chevron Notch: White Triangle pointing into Black Spine */}
      <path
        d="M 270 462 L 310 495 L 270 528 Z"
        fill="#FFFFFF"
        stroke="#121316"
        strokeWidth="7"
        strokeLinejoin="round"
      />

      {/* Slanted Neon Lime Capsule Pill */}
      <g transform="translate(488, 526) rotate(-9.5)">
        <rect x="-124" y="-39" width="248" height="78" rx="39" fill="#A8F518" />
      </g>

      {/* Metallic Wire Loop / Accent Arc */}
      <path
        d="M 556 450 C 566 433 596 426 622 435 C 642 443 648 460 646 473"
        fill="none"
        stroke="#989DA6"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Top-Right 4-Point Neon Lime Sparkle */}
      <path
        d="
          M 672 328
          Q 672 360 640 360
          Q 672 360 672 392
          Q 672 360 704 360
          Q 672 360 672 328
          Z
        "
        fill="#A8F518"
      />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="inline-flex items-center justify-center shrink-0 cursor-pointer"
        onClick={onClick}
      >
        {svgContent}
      </motion.div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {svgContent}
    </div>
  );
};

export interface EduSwathiLogoProps {
  variant?: "primary" | "icon" | "badge" | "horizontal" | "favicon";
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark" | "monochrome" | "monochrome-white";
  animated?: boolean;
  className?: string;
  concept?: "ascending-folio" | "dual-wing" | "isometric-fold";
  onClick?: () => void;
  showTagline?: boolean;
}

/**
 * EduSwathi Logo Component:
 * Features the exact circular emblem paired with the bold EduSwathi brand typography.
 */
export const EduSwathiLogo: React.FC<EduSwathiLogoProps> = ({
  variant = "primary",
  size = "md",
  theme = "light",
  animated = false,
  className = "",
  onClick,
  showTagline = false
}) => {
  const isDark = theme === "dark";
  const isMonoBlack = theme === "monochrome";
  const isMonoWhite = theme === "monochrome-white";

  // Size configurations
  const sizeMap = {
    sm: { icon: 34, text: "text-lg", badge: 38, gap: "gap-2", tag: "text-[8px]" },
    md: { icon: 44, text: "text-xl sm:text-2xl", badge: 48, gap: "gap-2.5", tag: "text-[9px]" },
    lg: { icon: 56, text: "text-3xl sm:text-4xl", badge: 60, gap: "gap-3.5", tag: "text-[10px]" },
    xl: { icon: 72, text: "text-4xl sm:text-5xl", badge: 76, gap: "gap-4", tag: "text-xs" },
  };

  const currentSize = sizeMap[size];

  // 1. COMPOSITION: ICON ONLY
  if (variant === "icon") {
    return (
      <div 
        onClick={onClick}
        className={`inline-flex items-center justify-center ${onClick ? "cursor-pointer" : ""} ${className}`}
      >
        <EduSwathiIcon
          size={currentSize.icon}
          theme={theme}
          variant="standalone"
          animated={animated}
        />
      </div>
    );
  }

  // 2. COMPOSITION: BADGE / FAVICON VERSION
  if (variant === "favicon" || variant === "badge") {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center rounded-full ${
          isDark ? "bg-[#161818] ring-1 ring-white/10" : "bg-white shadow-brutalist-sm"
        } ${onClick ? "cursor-pointer" : ""} ${className}`}
      >
        <EduSwathiIcon
          size={currentSize.icon}
          theme={theme}
          variant="badge"
          animated={animated}
        />
      </div>
    );
  }

  // 3. COMPOSITION: HORIZONTAL LOGO (Compact bar lockup)
  if (variant === "horizontal") {
    return (
      <div
        onClick={onClick}
        className={`group inline-flex items-center ${currentSize.gap} select-none ${
          onClick ? "cursor-pointer" : ""
        } ${className}`}
      >
        <EduSwathiIcon
          size={currentSize.icon}
          theme={theme}
          variant="standalone"
          animated={animated}
        />
        <div className="flex items-center font-display font-black tracking-tight leading-none text-xl sm:text-2xl">
          <span className={isDark || isMonoWhite ? "text-white" : "text-[#1A1C1C]"}>
            Edu
          </span>
          <span
            className={
              isMonoBlack
                ? "text-[#1A1C1C]"
                : isMonoWhite
                ? "text-white"
                : isDark
                ? "text-primary font-black"
                : "text-[#558C00] sm:text-[#4d7400] font-black group-hover:text-primary transition-colors"
            }
          >
            Swathi
          </span>
        </div>
      </div>
    );
  }

  // 4. COMPOSITION: PRIMARY STANDARD LOCKUP (Icon + Brand Wordmark + Optional Tagline)
  return (
    <div
      onClick={onClick}
      className={`group inline-flex items-center ${currentSize.gap} select-none ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Icon with Clean Circular Shadow */}
      <div
        className="relative flex items-center justify-center rounded-full shadow-brutalist-sm group-hover:shadow-brutalist group-hover:-translate-y-0.5 transition-all shrink-0 bg-white"
        style={{
          width: currentSize.icon,
          height: currentSize.icon,
        }}
      >
        <EduSwathiIcon
          size={currentSize.icon}
          theme={theme}
          variant="standalone"
          animated={animated}
        />
      </div>

      {/* Wordmark: "Edu" in Black/White, "Swathi" in Lime-Green */}
      <div className="flex flex-col leading-none">
        <div
          className={`font-display font-black tracking-tight ${currentSize.text} flex items-center gap-0.5`}
        >
          {/* "Edu" */}
          <span
            className={
              isDark || isMonoWhite
                ? "text-white"
                : "text-[#1A1C1C]"
            }
          >
            Edu
          </span>

          {/* "Swathi" in Neon Green */}
          <span
            className={
              isMonoBlack
                ? "text-[#1A1C1C]"
                : isMonoWhite
                ? "text-white"
                : isDark
                ? "text-primary font-black"
                : "text-[#558C00] sm:text-[#4d7400] font-black group-hover:text-[#65A30D] transition-colors"
            }
          >
            Swathi
          </span>

          {/* Sparkle Tag */}
          <span className="text-primary font-black ml-0.5 select-none text-xs sm:text-sm">
            ✦
          </span>
        </div>

        {/* Optional Tagline */}
        {showTagline && (
          <div
            className={`font-mono font-bold tracking-widest uppercase ${currentSize.tag} ${
              isDark ? "text-surface/60" : "text-on-surface-variant/70"
            } mt-1`}
          >
            AI Learning Companion
          </div>
        )}
      </div>
    </div>
  );
};

export default EduSwathiLogo;
