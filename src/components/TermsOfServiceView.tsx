import React from "react";
import { motion } from "motion/react";
import { 
  FileCheck, 
  Scale, 
  AlertTriangle, 
  Sparkles, 
  ArrowLeft, 
  Mail, 
  Printer,
  ShieldCheck
} from "lucide-react";

interface TermsOfServiceViewProps {
  onNavigateHome: () => void;
  onNavigateToPrivacy: () => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({
  onNavigateHome,
  onNavigateToPrivacy
}) => {
  const handlePrint = () => {
    window.print();
  };

  const terms = [
    {
      icon: FileCheck,
      title: "1. Acceptance of Terms",
      desc: "By accessing EduSwathi, you agree to these simplified terms. Our platform is created to help 2nd PUC Science students study, revise, and practice effectively."
    },
    {
      icon: ShieldCheck,
      title: "2. Student Conduct & Acceptable Use",
      desc: "EduSwathi is an educational study space. Please use the AI subject tutors, cheat sheets, and formula tools respectfully and for academic learning purposes."
    },
    {
      icon: Sparkles,
      title: "3. AI Study Guidance Disclaimer",
      desc: "Our AI bots and revision tools provide instant academic assistance based on Karnataka State Board curricula. Always verify crucial formulas and numerical answers with official textbooks before board examinations."
    },
    {
      icon: Scale,
      title: "4. Platform Content & Intellectual Property",
      desc: "EduSwathi study templates and design assets belong to EduSwathi. Any original notes, questions, or custom syllabi you create belong entirely to you."
    },
    {
      icon: AlertTriangle,
      title: "5. Service Availability & Updates",
      desc: "We continuously update revision sheets and subject models. While we aim for 24/7 uptime, services may occasionally undergo brief maintenance."
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
            onClick={onNavigateToPrivacy}
            className="px-4 py-2 bg-surface hover:bg-surface-container border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            Privacy Policy →
          </button>
          <button
            onClick={handlePrint}
            className="p-2 bg-white hover:bg-primary border-2 border-on-surface rounded-xl shadow-brutalist-sm transition-all cursor-pointer"
            title="Print Terms"
          >
            <Printer size={16} />
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-white border-3 sm:border-4 border-on-surface p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-brutalist space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-primary border-2 border-on-surface rounded font-mono text-[10px] font-black uppercase tracking-wider shadow-brutalist-sm text-on-surface">
            Terms of Service
          </span>
          <span className="font-mono text-xs text-secondary">
            Updated: August 2026
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-on-surface">
          Simple Terms of Service
        </h1>
        <p className="text-secondary text-base leading-relaxed">
          Clear, student-friendly rules for using <strong className="text-on-surface">EduSwathi</strong> to prepare for your 2nd PUC Science examinations.
        </p>
      </div>

      {/* Condensed Terms List */}
      <div className="space-y-4">
        {terms.map((term, index) => {
          const IconComp = term.icon;
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
                    {term.title}
                  </h2>
                  <p className="text-secondary text-sm sm:text-base leading-relaxed">
                    {term.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Support Box */}
      <div className="bg-surface border-2 border-on-surface rounded-2xl p-6 shadow-brutalist-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-black text-base flex items-center gap-2">
            <Mail size={18} className="text-primary-dark" /> Have questions regarding our terms?
          </h3>
          <p className="text-secondary text-xs sm:text-sm">
            Reach out to our support team at <strong className="text-on-surface">support@eduswathi.org</strong>
          </p>
        </div>
        <a
          href="mailto:support@eduswathi.org"
          className="brutalist-button bg-primary hover:bg-accent text-on-surface px-5 py-2.5 font-mono text-xs font-black uppercase rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-brutalist-sm"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};
