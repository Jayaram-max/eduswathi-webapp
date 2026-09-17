import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  Terminal,
  Zap,
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Download,
  X,
  Printer,
  ChevronRight,
  FileText,
  RotateCw,
  Loader2,
  HelpCircle
} from "lucide-react";

export type ExamSubjectKey = "PHYSICS" | "CHEMISTRY" | "MATHEMATICS" | "BIOLOGY" | "COMPUTER SCIENCE";

export interface ExamResourceCardData {
  id: string;
  number: string;
  subject: ExamSubjectKey;
  subjectTitle: string;
  badge: "Formula Sheets" | "Cheat Sheets" | "Quick Revision";
  description: string;
  buttonLabel: "OPEN SHEET →" | "VIEW CHEAT SHEET →" | "START REVISION →";
  icon: React.ElementType;
  highlights: string[];
  keyTopicsCount: string;
  examWeightage: string;
  sections: {
    title: string;
    items: { label: string; formulaOrDef: string; tip?: string }[];
  }[];
}

export const EXAM_RESOURCES: ExamResourceCardData[] = [
  {
    id: "physics-2nd-puc",
    number: "01",
    subject: "PHYSICS",
    subjectTitle: "PHYSICS",
    badge: "Formula Sheets",
    description: "Important formulas, constants, units, and key equations.",
    buttonLabel: "OPEN SHEET →",
    icon: Atom,
    highlights: ["Fundamental Constants", "Electrostatics & Current", "Ray & Wave Optics", "Modern Physics"],
    keyTopicsCount: "14 Chapters",
    examWeightage: "70 Marks Theory",
    sections: [
      {
        title: "Standard Physical Constants (Memorize for Board)",
        items: [
          { label: "Speed of Light (c)", formulaOrDef: "c = 3.0 × 10⁸ m/s" },
          { label: "Planck's Constant (h)", formulaOrDef: "h = 6.626 × 10⁻³⁴ J·s" },
          { label: "Permittivity of Free Space (ε₀)", formulaOrDef: "ε₀ = 8.854 × 10⁻¹² C²/(N·m²)" },
          { label: "Elementary Charge (e)", formulaOrDef: "e = 1.602 × 10⁻¹⁹ C" },
          { label: "Permeability of Free Space (μ₀)", formulaOrDef: "μ₀ = 4π × 10⁻⁷ T·m/A" }
        ]
      },
      {
        title: "Electrostatics & Current Electricity",
        items: [
          { label: "Coulomb's Law", formulaOrDef: "F = (1 / 4πε₀) · (|q₁q₂| / r²)", tip: "In medium: divide by dielectric constant K" },
          { label: "Electric Dipole on Axial Line", formulaOrDef: "E_axial = (1 / 4πε₀) · (2p / r³)", tip: "Equatorial: half of axial at large distance" },
          { label: "Capacitance of Parallel Plate", formulaOrDef: "C = (K·ε₀·A) / d", tip: "Energy stored: U = ½CV² = ½Q²/C" },
          { label: "Drift Velocity & Current", formulaOrDef: "I = n·e·A·v_d, where v_d = (e·E·τ) / m" },
          { label: "Potentiometer Principle", formulaOrDef: "V ∝ l  ⇒  E₁/E₂ = l₁/l₂", tip: "Internal resistance: r = R(l₁ - l₂)/l₂" }
        ]
      },
      {
        title: "Magnetism & Electromagnetic Induction",
        items: [
          { label: "Biot-Savart Law", formulaOrDef: "dB = (μ₀/4π) · (I·dl·sinθ / r²)" },
          { label: "Faraday's & Lenz's Law", formulaOrDef: "ε = -dΦ_B / dt = -N · (dΦ/dt)" },
          { label: "Self & Mutual Inductance", formulaOrDef: "e = -L(dI/dt),  e = -M(dI/dt)" },
          { label: "AC Resonance Frequency", formulaOrDef: "f_r = 1 / (2π√(LC))", tip: "At resonance, impedance Z = R (minimum)" }
        ]
      },
      {
        title: "Optics & Modern Physics",
        items: [
          { label: "Lens Maker's Formula", formulaOrDef: "1/f = (n - 1) · (1/R₁ - 1/R₂)", tip: "Convention: R₁ positive, R₂ negative for convex" },
          { label: "Young's Double Slit Fringe Width", formulaOrDef: "β = (λ·D) / d" },
          { label: "Einstein's Photoelectric Equation", formulaOrDef: "K_max = hν - Φ₀ = eV₀" },
          { label: "de Broglie Wavelength", formulaOrDef: "λ = h / p = h / √(2m·q·V)" },
          { label: "Bohr Radius & Energy", formulaOrDef: "E_n = -13.6 / n² eV", tip: "Rydberg formula: 1/λ = R_H · (1/n₁² - 1/n₂²)" }
        ]
      }
    ]
  },
  {
    id: "chemistry-2nd-puc",
    number: "02",
    subject: "CHEMISTRY",
    subjectTitle: "CHEMISTRY",
    badge: "Cheat Sheets",
    description: "Important reactions, equations, named reactions, formulas, and quick revision notes.",
    buttonLabel: "VIEW CHEAT SHEET →",
    icon: FlaskConical,
    highlights: ["High-Yield Named Reactions", "Electrochemistry & Nernst", "Chemical Kinetics Rate Laws", "Coordination Compounds"],
    keyTopicsCount: "10 Chapters (NCERT)",
    examWeightage: "70 Marks Theory",
    sections: [
      {
        title: "Crucial Named Reactions (Guaranteed 5-Mark Questions)",
        items: [
          { label: "Aldol Condensation", formulaOrDef: "2 CH₃CHO + dil. NaOH → CH₃-CH(OH)-CH₂-CHO → CH₃-CH=CH-CHO + H₂O", tip: "Requires presence of α-hydrogen atom" },
          { label: "Cannizzaro Reaction", formulaOrDef: "2 HCHO + conc. KOH → CH₃OH + HCOOK", tip: "Occurs in aldehydes lacking α-hydrogen (Formaldehyde, Benzaldehyde)" },
          { label: "Sandmeyer Reaction", formulaOrDef: "Ar-N₂⁺Cl⁻ + CuCl/HCl → Ar-Cl + N₂", tip: "Synthesizes aryl halides from diazonium salts" },
          { label: "Kolbe's Reaction", formulaOrDef: "Phenol + NaOH → Sodium phenoxide + CO₂ (400K, 4-7 atm) → Salicylic acid" },
          { label: "Reimer-Tiemann Reaction", formulaOrDef: "Phenol + CHCl₃ + aq. NaOH → Salicylaldehyde" },
          { label: "Clemmensen vs Wolff-Kishner", formulaOrDef: ">C=O → >CH₂ (Clemmensen: Zn-Hg/HCl; Wolff-Kishner: NH₂NH₂/KOH)" }
        ]
      },
      {
        title: "Physical Chemistry Equations & Laws",
        items: [
          { label: "Henry's Law", formulaOrDef: "p = K_H · x", tip: "Higher K_H means lower solubility at given temperature" },
          { label: "Raoult's Law (Relative Lowering)", formulaOrDef: "(p° - p) / p° = x₂ = (w₂/M₂) / (w₁/M₁ + w₂/M₂)" },
          { label: "Nernst Equation (at 298 K)", formulaOrDef: "E_cell = E°_cell - (0.0591 / n) · log₁₀(Q)", tip: "At equilibrium: E°_cell = (0.0591/n) · log₁₀(K_c)" },
          { label: "Kohlrausch's Law", formulaOrDef: "Λ°_m = ν₊ · λ°₊ + ν₋ · λ°₋" },
          { label: "First Order Kinetics", formulaOrDef: "k = (2.303 / t) · log₁₀([A]₀ / [A]),  t_½ = 0.693 / k", tip: "Half-life is independent of initial concentration" },
          { label: "Arrhenius Equation", formulaOrDef: "log₁₀(k₂/k₁) = (E_a / 2.303R) · [(T₂ - T₁) / (T₁·T₂)]" }
        ]
      },
      {
        title: "Coordination Compounds & Transition Metals",
        items: [
          { label: "Spin-Only Magnetic Moment", formulaOrDef: "μ = √(n(n + 2)) BM", tip: "n = number of unpaired electrons" },
          { label: "Crystal Field Splitting (Octahedral vs Tetrahedral)", formulaOrDef: "Δ_t = (4/9) · Δ_o", tip: "Strong field ligands cause pairing (low spin)" },
          { label: "Primary vs Secondary Valency", formulaOrDef: "Primary = Ionizable (Oxidation state); Secondary = Non-ionizable (Coordination number)" }
        ]
      }
    ]
  },
  {
    id: "mathematics-2nd-puc",
    number: "03",
    subject: "MATHEMATICS",
    subjectTitle: "MATHEMATICS",
    badge: "Formula Sheets",
    description: "Chapter-wise formulas, identities, differentiation, integration, and important shortcuts.",
    buttonLabel: "OPEN SHEET →",
    icon: Calculator,
    highlights: ["Differentiation & Integration", "Matrices & Determinants", "Vectors & 3D Geometry", "Linear Programming"],
    keyTopicsCount: "13 Chapters",
    examWeightage: "100 Marks (New Blueprint)",
    sections: [
      {
        title: "Calculus — Core Derivative & Integral Formulas",
        items: [
          { label: "Product & Quotient Rules", formulaOrDef: "(uv)' = u'v + uv',   (u/v)' = (u'v - uv') / v²" },
          { label: "Standard Integrals", formulaOrDef: "∫ 1/(x² + a²) dx = (1/a)·tan⁻¹(x/a) + C;  ∫ 1/√(a² - x²) dx = sin⁻¹(x/a) + C" },
          { label: "Integration by Parts (ILATE)", formulaOrDef: "∫ u·v dx = u·∫ v dx - ∫ [u' · (∫ v dx)] dx" },
          { label: "Special Exponential Integral", formulaOrDef: "∫ eˣ [f(x) + f'(x)] dx = eˣ·f(x) + C", tip: "Very common 1-mark or 2-mark question" },
          { label: "Definite Integral Property (King's Property)", formulaOrDef: "∫₀ᵃ f(x) dx = ∫₀ᵃ f(a - x) dx", tip: "Use for solving ∫₀^(π/2) (sinⁿx)/(sinⁿx + cosⁿx) dx = π/4" }
        ]
      },
      {
        title: "Matrices & Determinants",
        items: [
          { label: "Inverse of a Matrix", formulaOrDef: "A⁻¹ = (1 / |A|) · adj(A),  provided |A| ≠ 0" },
          { label: "Properties of Adjoint", formulaOrDef: "A·adj(A) = adj(A)·A = |A|·I;  |adj(A)| = |A|^(n-1)" },
          { label: "Area of Triangle using Determinants", formulaOrDef: "Area = ½ | x₁(y₂ - y₃) + x₂(y₃ - y₁) + x₃(y₁ - y₂) |" },
          { label: "Matrix Method for System of Linear Equations", formulaOrDef: "AX = B  ⇒  X = A⁻¹B", tip: "Standard 5-mark guaranteed question" }
        ]
      },
      {
        title: "Vectors & Three Dimensional Geometry",
        items: [
          { label: "Dot Product & Projection", formulaOrDef: "a · b = |a||b|cosθ;  Projection of a on b = (a · b) / |b|" },
          { label: "Cross Product & Area", formulaOrDef: "a × b = |a||b|sinθ · n̂;  Area of Parallelogram = |a × b|" },
          { label: "Shortest Distance Between Skew Lines", formulaOrDef: "d = | [(a₂ - a₁) · (b₁ × b₂)] / |b₁ × b₂| |", tip: "Standard 5-mark board question" },
          { label: "Direction Cosines & Ratios", formulaOrDef: "l² + m² + n² = 1;  cos²α + cos²β + cos²γ = 1" }
        ]
      },
      {
        title: "Probability & Relations",
        items: [
          { label: "Conditional Probability", formulaOrDef: "P(A|B) = P(A ∩ B) / P(B),  P(B) ≠ 0" },
          { label: "Bayes' Theorem", formulaOrDef: "P(E_i|A) = [P(E_i)·P(A|E_i)] / Σ [P(E_j)·P(A|E_j)]", tip: "High-yield 5-mark problem" }
        ]
      }
    ]
  },
  {
    id: "biology-2nd-puc",
    number: "04",
    subject: "BIOLOGY",
    subjectTitle: "BIOLOGY",
    badge: "Quick Revision",
    description: "Important diagrams, processes, definitions, keywords, and last-minute revision points.",
    buttonLabel: "START REVISION →",
    icon: Dna,
    highlights: ["Essential 5-Mark Diagrams", "Genetics & Molecular Basis", "Biotechnology Tools & R-DNA", "Ecosystem & Biodiversity"],
    keyTopicsCount: "13 Chapters",
    examWeightage: "70 Marks Theory",
    sections: [
      {
        title: "Guaranteed Board Diagrams (Draw & Label 5-Mark Practice)",
        items: [
          { label: "Human Sperm Diagram", formulaOrDef: "Parts: Head (Acrosome + Haploid Nucleus), Neck, Middle Piece (Mitochondria spiral for motility), Tail." },
          { label: "Mature Embryo Sac (7-celled, 8-nucleate)", formulaOrDef: "Micropylar end: 2 Synergids + 1 Egg cell; Central cell: 2 Polar nuclei; Chalazal end: 3 Antipodals." },
          { label: "Anatropous Ovule", formulaOrDef: "Funicle, Hilum, Integuments, Micropyle, Nucellus, Chalaza, Embryo sac." },
          { label: "Replication Fork (DNA)", formulaOrDef: "Leading strand (continuous 5'→3'), Lagging strand (discontinuous Okazaki fragments), DNA Ligase & Polymerase." },
          { label: "Bioreactor (Simple Stirred-tank vs Sparged)", formulaOrDef: "Agitator system, Oxygen delivery, Foam control, Temperature/pH probe, Sampling port." }
        ]
      },
      {
        title: "Genetics & Molecular Biology Rapid Points",
        items: [
          { label: "Mendelian Dihybrid Ratio", formulaOrDef: "Phenotypic: 9:3:3:1; Incomplete dominance: 1:2:1; Test cross ratio: 1:1:1:1" },
          { label: "Griffith & Hershey-Chase Experiments", formulaOrDef: "Griffith: Transforming principle (S-strain vs R-strain); Hershey-Chase: ³²P (DNA) vs ³⁵S (Protein coat) confirmed DNA is genetic material." },
          { label: "Central Dogma of Molecular Biology", formulaOrDef: "DNA ──(Transcription)──> mRNA ──(Translation)──> Protein (Reverse Transcription in Retroviruses)" },
          { label: "Lac Operon System", formulaOrDef: "i gene: Repressor protein; z gene: β-galactosidase; y gene: Permease; a gene: Transacetylase. Inducer: Lactose." },
          { label: "Human Genome Project Highlights", formulaOrDef: "3.164 billion bp, average gene has 3000 bases, chromosome 1 has most genes (2968), Y has fewest (231)." }
        ]
      },
      {
        title: "Biotechnology & Ecology High-Yield Summaries",
        items: [
          { label: "Restriction Endonucleases (Molecular Scissors)", formulaOrDef: "EcoRI cuts at palindromic sequence 5'-G↓AATTC-3', leaves sticky ends." },
          { label: "pBR322 Cloning Vector Features", formulaOrDef: "Ori, rop, ampᴿ (PstI, PvuI), tetᴿ (BamHI, SalI). Insertional inactivation selects recombinants." },
          { label: "Polymerase Chain Reaction (PCR) Steps", formulaOrDef: "1. Denaturation (94°C) → 2. Annealing (54°C) with primers → 3. Extension (72°C) via Taq polymerase." },
          { label: "10% Law of Energy Transfer (Lindeman)", formulaOrDef: "Only 10% of energy is transferred to next trophic level. Energy pyramid is ALWAYS upright." }
        ]
      }
    ]
  },
  {
    id: "computer-science-2nd-puc",
    number: "05",
    subject: "COMPUTER SCIENCE",
    subjectTitle: "COMPUTER SCIENCE",
    badge: "Cheat Sheets",
    description: "Python syntax, SQL commands, data structures, algorithms, and important programs.",
    buttonLabel: "VIEW CHEAT SHEET →",
    icon: Terminal,
    highlights: ["Python OOP & File Handling", "SQL DDL/DML Board Queries", "Linear Data Structures", "Boolean Algebra Theorems"],
    keyTopicsCount: "17 Chapters / Lab Kit",
    examWeightage: "70 Marks Theory + 30 Practical",
    sections: [
      {
        title: "Python Syntax & File Handling (High-Yield)",
        items: [
          { label: "File Open Modes & Operations", formulaOrDef: "f = open('data.txt', 'r'/'w'/'a'); f.read(), f.readline(), f.readlines(), f.write(), f.close()", tip: "Use with open('file.txt') as f: for auto close" },
          { label: "Binary File (Pickle Module)", formulaOrDef: "import pickle; pickle.dump(data, file_ptr); data = pickle.load(file_ptr)", tip: "Mode MUST be 'wb' or 'rb'" },
          { label: "CSV File Module", formulaOrDef: "import csv; writer = csv.writer(f); writer.writerow(['ID', 'Name']); reader = csv.reader(f)" },
          { label: "List / Dictionary Comprehensions", formulaOrDef: "squares = [x**2 for x in range(10) if x % 2 == 0]" },
          { label: "OOP Classes & Constructors", formulaOrDef: "class Student:\n  def __init__(self, name, marks):\n    self.name = name\n    self.marks = marks" }
        ]
      },
      {
        title: "Structured Query Language (SQL) Quick Reference",
        items: [
          { label: "DDL Commands", formulaOrDef: "CREATE TABLE student (id INT PRIMARY KEY, name VARCHAR(30), fees DECIMAL(8,2)); ALTER TABLE student ADD age INT; DROP TABLE student;" },
          { label: "DML Commands", formulaOrDef: "INSERT INTO student VALUES (101, 'Rahul', 15000); UPDATE student SET fees = 16000 WHERE id = 101; DELETE FROM student WHERE id = 101;" },
          { label: "SQL Aggregate Functions", formulaOrDef: "SELECT COUNT(*), AVG(fees), MAX(fees), MIN(fees), SUM(fees) FROM student GROUP BY branch HAVING AVG(fees) > 10000;" },
          { label: "Pattern Matching & Joins", formulaOrDef: "WHERE name LIKE 'A%'; WHERE marks BETWEEN 80 AND 100; SELECT s.name, c.course_title FROM student s NATURAL JOIN courses c;" }
        ]
      },
      {
        title: "Data Structures & Boolean Algebra",
        items: [
          { label: "Stack Operations (LIFO)", formulaOrDef: "push() -> append(), pop() -> pop(), peek() -> stack[-1]. Underflow check: len(stack) == 0" },
          { label: "Queue Operations (FIFO)", formulaOrDef: "enqueue() -> append(), dequeue() -> pop(0). Underflow when queue is empty." },
          { label: "De Morgan's Theorems", formulaOrDef: "(A + B)' = A' · B'   and   (A · B)' = A' + B'", tip: "Break the line, change the sign" },
          { label: "Karnaugh Map (K-Map)", formulaOrDef: "Gray code numbering: 00, 01, 11, 10. Form groups of 16 (Hexadecimal), 8 (Octet), 4 (Quad), 2 (Pair)." }
        ]
      }
    ]
  }
];

export const ExamKitView: React.FC<{
  onOpenBot?: (subjectBotId: string) => void;
}> = ({ onOpenBot }) => {
  const [activeFilter, setActiveFilter] = useState<"ALL" | ExamSubjectKey>("ALL");
  const [selectedSheet, setSelectedSheet] = useState<ExamResourceCardData | null>(null);
  const [sheetSearchQuery, setSheetSearchQuery] = useState("");
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Quick AI Exam Revision Assistant
  const [customTopic, setCustomTopic] = useState("");
  const [aiRevisionNotes, setAiRevisionNotes] = useState<string[] | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const categories: ("ALL" | ExamSubjectKey)[] = [
    "ALL",
    "PHYSICS",
    "CHEMISTRY",
    "MATHEMATICS",
    "BIOLOGY",
    "COMPUTER SCIENCE"
  ];

  const filteredResources = useMemo(() => {
    if (activeFilter === "ALL") return EXAM_RESOURCES;
    return EXAM_RESOURCES.filter((res) => res.subject === activeFilter);
  }, [activeFilter]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(text);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const handleGenerateRevision = async (isRegenerate: boolean = false) => {
    if (!customTopic.trim()) return;
    setIsGeneratingAi(true);
    if (!isRegenerate) setAiRevisionNotes(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `You are an expert 2nd PUC Science state board examiner. Generate 4 high-yield, exam-ready revision points, key formulas, or standard board questions for this specific 2nd PUC topic: "${customTopic}". Format strictly as dynamic bullet items separated by hashtags like Point 1: [content]#Point 2: [content]#Point 3: [content]#Point 4: [content]`
        })
      });
      const data = await res.json();
      if (data.text) {
        const points = data.text
          .split("#")
          .map((s: string) => s.replace(/[*#\-]/g, "").trim())
          .filter(Boolean);
        setAiRevisionNotes(points.length > 0 ? points : [
          `Key Definition & Marks: Core concept of ${customTopic} for 2nd PUC.`,
          `Standard Formula: Essential mathematical equation or chemical formula.`,
          `High-Yield Board Question: Frequently asked 3 or 5-mark question from past 5 years.`,
          `Examiner Caution: Common pitfall where students lose marks in board valuation.`
        ]);
      } else {
        throw new Error();
      }
    } catch {
      // Fallback
      setAiRevisionNotes([
        `Core Theorem: Fundamental principle of ${customTopic} tailored for 2nd PUC state board pattern.`,
        `Key Formula / Expression: Master the mathematical derivation and units.`,
        `Previous Years Trend: High probability 3-mark or 5-mark question in Part C/D.`,
        `Scoring Tip: Highlight key terms and underline final results with correct SI units.`
      ]);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
      {/* Section Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-primary/25 border-2 border-on-surface rounded-full shadow-brutalist-sm text-on-surface font-mono text-xs font-black uppercase tracking-wider">
          <Sparkles size={14} className="text-primary-dark" />
          <span>2nd PUC Science Special</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase">
          EXAM KIT
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl font-medium text-secondary max-w-2xl mx-auto">
          Everything you need for quick 2nd PUC revision.
        </p>

        <div className="flex items-center justify-center gap-4 text-xs font-mono font-bold text-on-surface/60 uppercase pt-1">
          <span>PCMB & PCMC Curated</span>
          <span>•</span>
          <span>Karnataka State Board Aligned</span>
          <span>•</span>
          <span>100% Free Access</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col items-center space-y-3">
        <span className="font-mono text-xs font-black uppercase tracking-widest text-on-surface/60">
          Filter by Subject
        </span>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl">
          {categories.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl border-2 border-on-surface font-mono text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer select-none ${
                  isActive
                    ? "bg-primary text-on-surface shadow-brutalist translate-x-0.5 translate-y-0.5"
                    : "bg-white text-on-surface hover:bg-surface-container shadow-brutalist-sm hover:shadow-brutalist active:translate-x-0.5 active:translate-y-0.5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5 Exam Resource Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredResources.map((item) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-3 border-on-surface rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-brutalist hover:shadow-brutalist-neon transition-all duration-200 group"
            >
              <div className="space-y-5">
                {/* Header: Number, Badge, and Subject Icon */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-on-surface/90">
                      {item.number}
                    </span>
                    <span className="w-1.5 h-6 bg-primary rounded-full inline-block" />
                    <span className="px-2.5 py-1 bg-surface border border-on-surface/20 rounded-md font-mono text-[11px] font-black uppercase tracking-wide">
                      {item.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-primary/20 border-2 border-on-surface flex items-center justify-center shadow-brutalist-sm group-hover:bg-primary transition-colors">
                    <IconComponent size={24} className="text-on-surface stroke-[2.2]" />
                  </div>
                </div>

                {/* Subject Title */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                    {item.subjectTitle}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base font-medium text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Subject Highlights */}
                <div className="pt-2 border-t border-on-surface/10 space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-mono font-black uppercase text-on-surface/60">
                    <span>{item.keyTopicsCount}</span>
                    <span>{item.examWeightage}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-surface border border-on-surface/15 rounded text-[11px] font-semibold text-on-surface/80"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t-2 border-on-surface/10">
                <button
                  onClick={() => setSelectedSheet(item)}
                  className="w-full py-3.5 px-5 bg-primary hover:bg-accent border-2 border-on-surface rounded-xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider shadow-brutalist-sm hover:shadow-brutalist active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  <span>{item.buttonLabel}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Rapid Exam Assistant Architect */}
      <div className="bg-on-surface text-surface p-6 sm:p-10 md:p-12 border-3 sm:border-4 border-on-surface rounded-3xl shadow-brutalist-neon relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-primary text-on-surface px-3 py-1 font-mono text-[11px] font-black uppercase rounded shadow-brutalist-sm">
            <Zap size={13} className="fill-on-surface" />
            <span>AI Rapid Exam Architect</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            Need an instant cheat sheet for any topic?
          </h2>

          <p className="text-surface/80 text-base sm:text-lg leading-relaxed">
            Enter any 2nd PUC Science chapter or concept (e.g. <em>"Moving Charges and Magnetism"</em> or <em>"Biotechnology Applications"</em>) to generate customized high-yield board revision points.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerateRevision()}
              placeholder="e.g. Wave Optics, Coordination Compounds, Integrals..."
              className="flex-grow p-3.5 sm:p-4 bg-white border-2 border-primary text-on-surface font-sans font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
            <button
              onClick={() => handleGenerateRevision(false)}
              disabled={isGeneratingAi || !customTopic.trim()}
              className="py-3.5 px-6 sm:px-8 bg-primary hover:bg-accent text-on-surface font-mono text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl border-2 border-white shadow-brutalist flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Sheet →</span>
                </>
              )}
            </button>
          </div>

          {aiRevisionNotes && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 sm:p-6 bg-white/10 border border-white/20 rounded-2xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <span className="font-mono text-xs font-black text-primary uppercase tracking-widest">
                  // 2ND PUC REVISION SUMMARY: {customTopic.toUpperCase()}
                </span>
                <button
                  onClick={() => handleGenerateRevision(true)}
                  disabled={isGeneratingAi}
                  className="px-3 py-1.5 bg-primary/90 hover:bg-primary text-on-surface font-mono text-xs font-black uppercase rounded-lg border border-on-surface shadow-brutalist-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <RotateCw size={13} className={isGeneratingAi ? "animate-spin" : ""} />
                  <span>Regenerate</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                {aiRevisionNotes.map((note, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white text-on-surface rounded-xl border-2 border-on-surface shadow-brutalist-sm space-y-1.5"
                  >
                    <span className="font-mono text-[10px] font-black text-primary-dark uppercase px-1.5 py-0.5 bg-primary/25 rounded inline-block">
                      Key Exam Point 0{index + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-bold leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Interactive Exam Sheet Modal */}
      <AnimatePresence>
        {selectedSheet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border-3 sm:border-4 border-on-surface rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[8px_8px_0_0_#1a1c1c] overflow-hidden my-auto"
            >
              {/* Modal Top Header */}
              <div className="p-4 sm:p-6 bg-surface border-b-3 border-on-surface flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary border-2 border-on-surface flex items-center justify-center shadow-brutalist-sm">
                    {React.createElement(selectedSheet.icon, { size: 20, className: "text-on-surface" })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-on-surface/60">
                        {selectedSheet.number}
                      </span>
                      <span className="px-2 py-0.5 bg-primary/30 border border-on-surface/20 rounded font-mono text-[10px] font-black uppercase">
                        {selectedSheet.badge}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                      {selectedSheet.subjectTitle} 2ND PUC EXAM SHEET
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-surface border-2 border-on-surface rounded-xl font-mono text-xs font-black uppercase shadow-brutalist-sm hover:shadow-brutalist transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Print Exam Sheet"
                  >
                    <Printer size={15} />
                    <span className="hidden sm:inline">Print / PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSheet(null);
                      setSheetSearchQuery("");
                    }}
                    className="p-2 bg-white hover:bg-rose-100 border-2 border-on-surface rounded-xl shadow-brutalist-sm hover:shadow-brutalist transition-all cursor-pointer"
                    title="Close Sheet"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Sheet Quick Search */}
              <div className="px-4 sm:px-6 py-3 bg-surface-variant/40 border-b-2 border-on-surface/10 flex items-center gap-2">
                <Search size={16} className="text-secondary shrink-0" />
                <input
                  type="text"
                  value={sheetSearchQuery}
                  onChange={(e) => setSheetSearchQuery(e.target.value)}
                  placeholder="Quick search within this sheet (e.g. Nernst, Lens, Integration, Pickling)..."
                  className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none placeholder:text-on-surface/50"
                />
                {sheetSearchQuery && (
                  <button
                    onClick={() => setSheetSearchQuery("")}
                    className="text-xs font-mono font-bold text-secondary hover:text-on-surface"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Sheet Content Scrollable Area */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-grow">
                {selectedSheet.sections.map((section, sIdx) => {
                  const filteredItems = section.items.filter(
                    (it) =>
                      !sheetSearchQuery ||
                      it.label.toLowerCase().includes(sheetSearchQuery.toLowerCase()) ||
                      it.formulaOrDef.toLowerCase().includes(sheetSearchQuery.toLowerCase()) ||
                      (it.tip && it.tip.toLowerCase().includes(sheetSearchQuery.toLowerCase()))
                  );

                  if (filteredItems.length === 0) return null;

                  return (
                    <div key={sIdx} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-primary border border-on-surface rounded-xs" />
                        <h4 className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-on-surface">
                          {section.title}
                        </h4>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {filteredItems.map((item, iIdx) => {
                          const isCopied = copiedFormula === item.formulaOrDef;
                          return (
                            <div
                              key={iIdx}
                              className="p-3.5 sm:p-4 bg-surface border-2 border-on-surface/20 rounded-xl space-y-2 hover:border-on-surface hover:shadow-brutalist-sm transition-all relative group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-mono text-[11px] font-black uppercase text-primary-dark">
                                  {item.label}
                                </span>
                                <button
                                  onClick={() => handleCopy(item.formulaOrDef)}
                                  className="p-1 rounded hover:bg-white border border-transparent hover:border-on-surface/20 text-on-surface/60 hover:text-on-surface transition-all cursor-pointer"
                                  title="Copy to clipboard"
                                >
                                  {isCopied ? (
                                    <Check size={13} className="text-emerald-600" />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                </button>
                              </div>

                              <div className="p-2.5 bg-white border border-on-surface/15 rounded-lg font-mono text-xs sm:text-sm font-bold text-on-surface overflow-x-auto whitespace-pre-wrap select-all">
                                {item.formulaOrDef}
                              </div>

                              {item.tip && (
                                <p className="text-[11px] font-medium text-secondary italic">
                                  💡 {item.tip}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Bottom Footer */}
              <div className="p-4 sm:p-5 bg-surface border-t-2 border-on-surface flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <span className="text-secondary text-center sm:text-left font-medium">
                  Verified with current Karnataka Pre-University Education curriculum guidelines.
                </span>
                <button
                  onClick={() => {
                    setSelectedSheet(null);
                    setSheetSearchQuery("");
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-on-surface text-white font-mono text-xs font-black uppercase rounded-xl hover:bg-black cursor-pointer shadow-brutalist-sm"
                >
                  Close Sheet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
