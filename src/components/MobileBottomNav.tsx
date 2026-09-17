import React from "react";
import { motion } from "motion/react";
import { BookOpen, Sparkles, LayoutDashboard, Info } from "lucide-react";
import { EduSwathiIcon } from "./EduSwathiLogo";

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "home", label: "Home", isLogo: true },
    { id: "courses", label: "Exam Kit", icon: BookOpen },
    { id: "subject-bots", label: "AI Bots", icon: Sparkles, badge: "5" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, live: true },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t-3 border-on-surface shadow-[0_-4px_0_0_rgba(0,0,0,1)] px-2 py-1.5"
      role="navigation"
      aria-label="Mobile Navigation Bar"
      id="mobile-app-bottom-nav"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = (item as any).icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all select-none cursor-pointer min-w-[56px] min-h-[48px] ${
                isActive
                  ? "bg-primary border-2 border-on-surface shadow-brutalist-sm -translate-y-1 text-on-surface"
                  : "text-on-surface/70 hover:text-on-surface active:scale-95"
              }`}
              id={`mobile-nav-${item.id}`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative flex items-center justify-center">
                {item.isLogo ? (
                  <EduSwathiIcon size={22} animated={isActive} />
                ) : (
                  <Icon size={18} strokeWidth={isActive ? 2.8 : 2.2} />
                )}
                {(item as any).live && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}
                {(item as any).badge && !isActive && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-primary border border-on-surface text-on-surface rounded-full text-[8px] font-mono font-black flex items-center justify-center leading-none">
                    {(item as any).badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-mono font-black uppercase mt-0.5 tracking-tight ${isActive ? "text-on-surface" : "text-on-surface/80"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
