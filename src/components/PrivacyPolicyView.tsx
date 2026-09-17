import React from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Cpu, 
  UserCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Mail, 
  Printer,
  Sparkles
} from "lucide-react";

interface PrivacyPolicyViewProps {
  onNavigateHome: () => void;
  onNavigateToTerms: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({
  onNavigateHome,
  onNavigateToTerms
}) => {
  const handlePrint = () => {
    window.print();
  };

  const keyPoints = [
    {
      icon: Database,
      title: "1. Information We Collect",
      desc: "We collect only what is needed to power your study experience: your display name, chosen subjects (PCMB/PCMC), study streak counts, and AI tutor chat history."
    },
    {
      icon: Cpu,
      title: "2. How We Use Your Data",
      desc: "Data is used strictly to tailor exam kits, personalize AI subject bot explanations, and track your milestone progress across 2nd PUC topics."
    },
    {
      icon: Sparkles,
      title: "3. AI Interaction & Privacy",
      desc: "Your academic prompts are processed to generate instant formulas, revision notes, and quiz answers. We never sell or auction your personal data to third-party advertisers."
    },
    {
      icon: Lock,
      title: "4. Security & Storage",
      desc: "All session records, notes, and profile states are encrypted in transit and stored in protected cloud infrastructure with strict access controls."
    },
    {
      icon: UserCheck,
      title: "5. Your Rights & Control",
      desc: "You have full control over your study data. You can clear your revision chats, reset streak counters, or request account deletion at any time."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      {/* Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase tracking-wider shadow-brutalist-sm hover:bg-primary transition-all cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToTerms}
            className="px-4 py-2 bg-surface hover:bg-surface-container border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            Terms of Service →
          </button>
          <button
            onClick={handlePrint}
            className="p-2 bg-white hover:bg-primary border-2 border-on-surface rounded-xl shadow-brutalist-sm transition-all cursor-pointer"
            title="Print Policy"
          >
            <Printer size={16} />
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-white border-3 sm:border-4 border-on-surface p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-brutalist space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-primary border-2 border-on-surface rounded font-mono text-[10px] font-black uppercase tracking-wider shadow-brutalist-sm text-on-surface">
            Privacy Policy
          </span>
          <span className="font-mono text-xs text-secondary">
            Updated: August 2026
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-on-surface">
          Student Data & Privacy
        </h1>
        <p className="text-secondary text-base leading-relaxed">
          At <strong className="text-on-surface">EduSwathi</strong>, we respect your privacy. Here is a straightforward, transparent summary of how your data is handled.
        </p>
      </div>

      {/* Condensed Key Points */}
      <div className="space-y-4">
        {keyPoints.map((point, index) => {
          const IconComp = point.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border-2 border-on-surface rounded-2xl p-5 sm:p-6 shadow-brutalist-sm hover:shadow-brutalist transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/25 border-2 border-on-surface flex items-center justify-center shrink-0 shadow-brutalist-sm text-on-surface">
                  <IconComp size={20} />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h2 className="text-lg font-black text-on-surface">
                    {point.title}
                  </h2>
                  <p className="text-secondary text-sm sm:text-base leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Contact Box */}
      <div className="bg-surface border-2 border-on-surface rounded-2xl p-6 shadow-brutalist-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-black text-base flex items-center gap-2">
            <Mail size={18} className="text-primary-dark" /> Questions about your privacy?
          </h3>
          <p className="text-secondary text-xs sm:text-sm">
            Contact our student safety team at <strong className="text-on-surface">privacy@eduswathi.org</strong>
          </p>
        </div>
        <a
          href="mailto:privacy@eduswathi.org"
          className="brutalist-button bg-primary hover:bg-accent text-on-surface px-5 py-2.5 font-mono text-xs font-black uppercase rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-brutalist-sm"
        >
          Email Us
        </a>
      </div>
    </div>
  );
};
