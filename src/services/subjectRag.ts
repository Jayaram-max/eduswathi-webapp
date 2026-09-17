/**
 * Dedicated Subject RAG (Retrieval-Augmented Generation) Knowledge Base
 * Exclusively covers the 5 academic STEM subjects:
 * - Mathematics (MATH_API_KEY)
 * - Physics (PHYSICS_API_KEY)
 * - Chemistry (CHEMISTRY_API_KEY)
 * - Biology (BIOLOGY_API_KEY)
 * - Computer Science (CS_API_KEY)
 */

export type SupportedSubject = "math" | "physics" | "chemistry" | "biology" | "cs";

export interface RagDocument {
  id: string;
  subject: SupportedSubject;
  title: string;
  topic: string;
  keywords: string[];
  keyFormulas: string[];
  content: string;
}

export const SUBJECT_RAG_CORPUS: Record<SupportedSubject, RagDocument[]> = {
  math: [
    {
      id: "math-calc-01",
      subject: "math",
      title: "Fundamental Theorem of Calculus & Definite Integrals",
      topic: "Calculus",
      keywords: ["integral", "derivative", "fundamental theorem", "area under curve", "antiderivative", "ftc", "riemann"],
      keyFormulas: [
        "Part 1: d/dx [∫_{a}^{x} f(t) dt] = f(x)",
        "Part 2: ∫_{a}^{b} f(x) dx = F(b) - F(a) where F'(x) = f(x)",
        "Integration by Parts: ∫ u dv = u*v - ∫ v du"
      ],
      content: "The Fundamental Theorem of Calculus establishes the inverse relationship between differentiation and integration. Part 1 proves that the rate of change of an accumulated area function is the original curve itself. Part 2 provides the standard evaluation algorithm for definite integrals using the antiderivative."
    },
    {
      id: "math-linear-02",
      subject: "math",
      title: "Eigenvalues, Eigenvectors & Matrix Diagonalization",
      topic: "Linear Algebra",
      keywords: ["eigenvalue", "eigenvector", "determinant", "matrix", "diagonalization", "characteristic equation", "linear transformation"],
      keyFormulas: [
        "A*v = λ*v",
        "Characteristic Equation: det(A - λ*I) = 0",
        "Diagonalization: A = P * D * P^{-1}"
      ],
      content: "An eigenvector v of a linear transformation represented by matrix A is a non-zero vector whose direction is invariant under the transformation, being only scaled by factor λ (the eigenvalue). Finding eigenvalues requires solving the characteristic polynomial det(A - λI) = 0."
    },
    {
      id: "math-series-03",
      subject: "math",
      title: "Taylor and Maclaurin Power Series Approximations",
      topic: "Analysis & Series",
      keywords: ["taylor", "maclaurin", "series", "approximation", "polynomial", "convergence", "radius"],
      keyFormulas: [
        "Taylor: f(x) = ∑_{n=0}^{∞} [f^{(n)}(a) / n!] * (x - a)^n",
        "Maclaurin (a=0): f(x) = ∑_{n=0}^{∞} [f^{(n)}(0) / n!] * x^n",
        "e^x = 1 + x + x²/2! + x³/3! + ...",
        "sin(x) = x - x³/3! + x⁵/5! - ..."
      ],
      content: "Taylor series represent smooth, infinitely differentiable functions as infinite polynomials centered around a point a. When a = 0, it is specifically termed a Maclaurin series. The radius of convergence R is determined via the Ratio Test: lim_{n→∞} |a_{n+1}/a_n| < 1."
    },
    {
      id: "math-prob-04",
      subject: "math",
      title: "Probability Distributions, Bayes' Theorem & Expected Value",
      topic: "Probability & Statistics",
      keywords: ["bayes", "probability", "conditional", "expected value", "variance", "normal distribution", "poisson"],
      keyFormulas: [
        "Bayes' Rule: P(A|B) = [P(B|A) * P(A)] / P(B)",
        "Expected Value: E[X] = ∑ x_i * P(X = x_i) or ∫ x * f(x) dx",
        "Variance: Var(X) = E[X²] - (E[X])²",
        "Normal PDF: f(x) = [1 / (σ√(2π))] * e^{-(x - μ)² / (2σ²)}"
      ],
      content: "Bayes' Theorem formalizes the mathematical updating of prior probability beliefs P(A) given newly observed empirical evidence B. Probability density functions characterize continuous random variables where area under curve equals total probability 1."
    },
    {
      id: "math-algebra-05",
      subject: "math",
      title: "Polynomial Roots, Quadratic Equation & Complex Numbers",
      topic: "Algebra",
      keywords: ["quadratic", "roots", "discriminant", "complex", "polynomial", "euler", "factorization"],
      keyFormulas: [
        "ax² + bx + c = 0 → x = [-b ± √(b² - 4ac)] / (2a)",
        "Discriminant Δ = b² - 4ac",
        "Euler's Formula: e^{iθ} = cos(θ) + i*sin(θ)"
      ],
      content: "The quadratic formula derives from completing the square on the general second-degree polynomial. The discriminant Δ categorizes the nature of the roots: Δ > 0 yields 2 distinct real roots, Δ = 0 yields 1 repeated real root, and Δ < 0 yields complex conjugate pair roots."
    }
  ],

  physics: [
    {
      id: "phys-mech-01",
      subject: "physics",
      title: "Newton's Laws of Motion & Work-Energy Theorem",
      topic: "Classical Mechanics",
      keywords: ["newton", "force", "acceleration", "kinetic energy", "work", "momentum", "potential energy"],
      keyFormulas: [
        "Newton's 2nd Law: F_net = m * a = dp/dt",
        "Work: W = ∫ F · dr = ΔK",
        "Kinetic Energy: K = (1/2) * m * v²",
        "Conservation of Momentum: ∑ p_initial = ∑ p_final"
      ],
      content: "Newtonian mechanics governs macroscopic motion under inertial frames. Newton's 2nd Law states net force equals the time derivative of momentum. The Work-Energy theorem proves the net work performed on a particle equals its change in kinetic energy."
    },
    {
      id: "phys-em-02",
      subject: "physics",
      title: "Maxwell's Equations & Electromagnetic Wave Propagation",
      topic: "Electromagnetism",
      keywords: ["maxwell", "electric field", "magnetic field", "flux", "induction", "light speed", "lorentz"],
      keyFormulas: [
        "Gauss's Law (E): ∮ E · dA = Q_encl / ε_0",
        "Gauss's Law (B): ∮ B · dA = 0",
        "Faraday's Law: ∮ E · dl = -dΦ_B / dt",
        "Ampère-Maxwell Law: ∮ B · dl = μ_0 * I + μ_0 * ε_0 * (dΦ_E / dt)",
        "Wave Speed: c = 1 / √(μ_0 * ε_0) ≈ 3.00 × 10⁸ m/s"
      ],
      content: "Maxwell's four differential/integral equations unify electric and magnetic phenomena, proving that oscillating time-varying electric and magnetic fields create self-propagating electromagnetic radiation travelling at the universal speed c in vacuum."
    },
    {
      id: "phys-thermo-03",
      subject: "physics",
      title: "Thermodynamics Laws, Entropy & Carnot Cycle",
      topic: "Thermodynamics",
      keywords: ["thermodynamics", "entropy", "carnot", "heat", "efficiency", "internal energy", "temperature"],
      keyFormulas: [
        "1st Law: ΔU = Q - W",
        "2nd Law: ΔS_universe ≥ 0",
        "Entropy: dS = dQ_rev / T",
        "Carnot Engine Efficiency: η = 1 - (T_C / T_H)"
      ],
      content: "The First Law of Thermodynamics guarantees conservation of energy including heat and mechanical work. The Second Law dictates irreversible processes increase net universe entropy, placing an upper theoretical limit on heat engine conversion efficiency (Carnot limit)."
    },
    {
      id: "phys-quantum-04",
      subject: "physics",
      title: "Quantum Wave-Particle Duality & Uncertainty Principle",
      topic: "Quantum Physics",
      keywords: ["quantum", "schrodinger", "heisenberg", "uncertainty", "planck", "de broglie", "wavefunction"],
      keyFormulas: [
        "De Broglie Wavelength: λ = h / p",
        "Heisenberg Uncertainty: Δx * Δp ≥ ℏ / 2",
        "Time-Dependent Schrödinger: iℏ (∂Ψ/∂t) = Ĥ Ψ",
        "Photoelectric Effect: K_max = h*f - Φ"
      ],
      content: "Quantum mechanics dictates that matter exhibits both wave and particle characteristics. Heisenberg's Uncertainty Principle establishes a fundamental trade-off: position and momentum are complementary observables whose measurement variances are bounded by ℏ/2."
    },
    {
      id: "phys-rel-05",
      subject: "physics",
      title: "Special Relativity, Lorentz Factor & Mass-Energy Equivalence",
      topic: "Relativity",
      keywords: ["relativity", "einstein", "lorentz", "time dilation", "length contraction", "mass energy", "e=mc2"],
      keyFormulas: [
        "Lorentz Factor: γ = 1 / √(1 - v²/c²)",
        "Time Dilation: Δt = γ * Δt_0",
        "Length Contraction: L = L_0 / γ",
        "Mass-Energy: E² = (p*c)² + (m_0 * c²)² → E = m*c²"
      ],
      content: "Einstein's Special Theory rests on two postulates: physics laws are invariant in all inertial frames, and the vacuum speed of light c is constant for all observers. This entails time dilation, spatial length contraction, and relativistic mass-energy equivalence."
    }
  ],

  chemistry: [
    {
      id: "chem-org-01",
      subject: "chemistry",
      title: "Nucleophilic Substitution Mechanisms (SN1 vs SN2)",
      topic: "Organic Chemistry",
      keywords: ["sn1", "sn2", "substitution", "nucleophile", "carbocation", "inversion", "solvent", "polar aprotic"],
      keyFormulas: [
        "SN2 Rate: Rate = k * [Substrate] * [Nucleophile] (Bimolecular, 1 step, Walden inversion)",
        "SN1 Rate: Rate = k * [Substrate] (Unimolecular, 2 steps, carbocation intermediate, racemization)"
      ],
      content: "SN2 is a concerted, single-step backside attack requiring a strong nucleophile and sterically unhindered methyl/primary substrate in polar aprotic solvent. SN1 involves rate-determining leaving-group departure to form a stable tertiary/secondary carbocation, leading to racemization."
    },
    {
      id: "chem-thermo-02",
      subject: "chemistry",
      title: "Gibbs Free Energy, Spontaneity & Chemical Equilibrium",
      topic: "Physical Chemistry",
      keywords: ["gibbs", "enthalpy", "entropy", "spontaneous", "equilibrium", "delta g", "le chatelier"],
      keyFormulas: [
        "Gibbs Energy: ΔG = ΔH - T * ΔS",
        "Equilibrium Relation: ΔG° = -R * T * ln(K_eq)",
        "Non-Standard: ΔG = ΔG° + R * T * ln(Q)"
      ],
      content: "A reaction is thermodynamically spontaneous at constant temperature and pressure if and only if ΔG < 0. When ΔG = 0, the reaction has reached chemical dynamic equilibrium. Le Chatelier's principle dictates how an equilibrium responds to shifts in pressure, temperature, or concentration."
    },
    {
      id: "chem-acid-03",
      subject: "chemistry",
      title: "Acid-Base Equilibria, Buffers & Henderson-Hasselbalch",
      topic: "Analytical Chemistry",
      keywords: ["acid", "base", "buffer", "ph", "henderson hasselbalch", "pka", "titration", "conjugate"],
      keyFormulas: [
        "pH = -log₁₀[H⁺]",
        "Henderson-Hasselbalch: pH = pKa + log₁₀([A⁻] / [HA])",
        "Water Autoionization: Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ (at 25°C)",
        "pKa + pKb = 14"
      ],
      content: "Buffer systems consist of a weak acid and its conjugate base that resist changes in pH upon addition of small amounts of strong acid or base. The buffer achieves maximum capacity when pH = pKa, meaning [A⁻] = [HA]."
    },
    {
      id: "chem-structure-04",
      subject: "chemistry",
      title: "Orbital Hybridization, VSEPR & Molecular Geometry",
      topic: "Inorganic Chemistry",
      keywords: ["hybridization", "vsepr", "geometry", "sp3", "sp2", "sp", "bond angle", "tetrahedral", "sigma pi"],
      keyFormulas: [
        "Steric Number = (Number of bonded atoms) + (Number of lone pairs)",
        "SN=4: sp³ hybridization (109.5° tetrahedral, trigonal pyramidal, or bent)",
        "SN=3: sp² hybridization (120° trigonal planar)",
        "SN=2: sp hybridization (180° linear)"
      ],
      content: "VSEPR (Valence Shell Electron Pair Repulsion) predicts 3D geometries based on electrostatic repulsion among electron domains. Orbital hybridization describes mathematical linear combinations of atomic orbitals (s, p, d) forming equivalent hybrid bonding orbitals."
    },
    {
      id: "chem-electro-05",
      subject: "chemistry",
      title: "Electrochemistry, Galvanic Cells & Nernst Equation",
      topic: "Electrochemistry",
      keywords: ["electrochemistry", "galvanic", "nernst", "redox", "anode", "cathode", "cell potential"],
      keyFormulas: [
        "Cell Potential: E°_cell = E°_cathode - E°_anode",
        "Nernst Equation: E = E° - [R*T / (n*F)] * ln(Q) = E° - [0.0592 / n] * log₁₀(Q)",
        "Free Energy Link: ΔG° = -n * F * E°_cell"
      ],
      content: "Electrochemical redox reactions convert chemical energy into electrical work. Oxidation occurs at the anode, while reduction occurs at the cathode (AN OX, RED CAT). The Nernst equation accounts for deviations from standard 1 M concentrations."
    }
  ],

  biology: [
    {
      id: "bio-genetics-01",
      subject: "biology",
      title: "The Central Dogma, DNA Replication & Transcription",
      topic: "Molecular Biology",
      keywords: ["dna", "rna", "transcription", "translation", "polymerase", "replication fork", "okazaki", "ribosome"],
      keyFormulas: [
        "Central Dogma: DNA --(Transcription)--> mRNA --(Translation)--> Polypeptide",
        "Replication Rule: Synthesis exclusively in 5' to 3' direction",
        "Leading Strand: Continuous; Lagging Strand: Discontinuous Okazaki fragments joined by DNA Ligase"
      ],
      content: "Replication relies on DNA Helicase (unwinds duplex), Primase (synthesizes RNA primer), DNA Polymerase III (elongates 5'→3'), DNA Polymerase I (replaces primer), and Ligase (covalently seals phosphodiester backbone). Transcription synthesizes mRNA transcripts from the template antisense strand."
    },
    {
      id: "bio-energetics-02",
      subject: "biology",
      title: "Cellular Respiration, Krebs Cycle & ATP Synthase",
      topic: "Cellular Bioenergetics",
      keywords: ["respiration", "glycolysis", "krebs", "citric acid", "mitochondria", "electron transport", "atp synthase"],
      keyFormulas: [
        "Overall Reaction: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~30-32 ATP",
        "Glycolysis Yield: 2 Pyruvate + 2 Net ATP + 2 NADH (cytoplasm)",
        "Proton Gradient: H⁺ pumped into intermembrane space drives ATP Synthase rotor"
      ],
      content: "Cellular respiration oxidizes glucose through four major phases: Glycolysis (cytosol), Pyruvate Oxidation (mitochondrial matrix), Citric Acid Cycle, and Oxidative Phosphorylation (inner mitochondrial cristae) via chemiosmosis driven by the proton motive force."
    },
    {
      id: "bio-neuro-03",
      subject: "biology",
      title: "Neural Action Potentials & Synaptic Transmission",
      topic: "Neurobiology & Physiology",
      keywords: ["neuron", "action potential", "myelin", "depolarization", "synapse", "neurotransmitter", "sodium potassium"],
      keyFormulas: [
        "Resting Potential: ~ -70 mV maintained by 3Na⁺ out / 2K⁺ in ATP pump",
        "Depolarization: Voltage-gated Na⁺ channels open rapidly to +30 mV",
        "Repolarization: Voltage-gated K⁺ channels open, Na⁺ channels inactivate"
      ],
      content: "An action potential is an all-or-none electrophysiological signal. Threshold (~ -55 mV) opens voltage-gated Na+ channels. Saltatory conduction occurs along myelinated axons where signals jump between Nodes of Ranvier, vastly increasing conduction velocity."
    },
    {
      id: "bio-crispr-04",
      subject: "biology",
      title: "CRISPR-Cas9, Gene Regulation & Lac Operon",
      topic: "Genetics & Biotechnology",
      keywords: ["crispr", "cas9", "operon", "lac operon", "promoter", "repressor", "guide rna", "gene regulation"],
      keyFormulas: [
        "CRISPR Components: Cas9 Endonuclease + single guide RNA (sgRNA) targeting PAM (NGG)",
        "Lac Operon Logic: Lactose present → Allolactose binds Repressor → Repressor releases Operator → Transcription ON"
      ],
      content: "The lac operon is a model inducible prokaryotic transcriptional switch. When glucose is absent and lactose is present, cAMP-CAP complex activates transcription. CRISPR-Cas9 provides precise targeted double-stranded DNA cleavage guided by complementary 20-nucleotide crRNA."
    },
    {
      id: "bio-eco-05",
      subject: "biology",
      title: "Mendelian Genetics, Hardy-Weinberg & Natural Selection",
      topic: "Evolutionary Genetics",
      keywords: ["mendel", "hardy weinberg", "allele", "genotype", "punnett", "natural selection", "phenotype"],
      keyFormulas: [
        "Hardy-Weinberg Equation: p² + 2pq + q² = 1",
        "Allele Frequency Sum: p + q = 1",
        "Monohybrid Heterozygous Cross (Aa x Aa): 1:2:1 Genotype, 3:1 Phenotype"
      ],
      content: "Hardy-Weinberg equilibrium states allele and genotype frequencies in a population remain constant over generations in the absence of evolutionary influences (no mutation, random mating, no gene flow, large population size, and no natural selection)."
    }
  ],

  cs: [
    {
      id: "cs-algo-01",
      subject: "cs",
      title: "Big-O Asymptotic Complexity & Common Algorithm Runtimes",
      topic: "Algorithms",
      keywords: ["big-o", "complexity", "asymptotic", "quicksort", "mergesort", "binary search", "time complexity"],
      keyFormulas: [
        "Binary Search: O(log n) time, O(1) space",
        "Merge Sort: O(n log n) time guaranteed, O(n) auxiliary space",
        "Quick Sort: O(n log n) average time, O(n²) worst-case, O(log n) stack space",
        "Hash Table Lookup: O(1) average time, O(n) worst-case collision"
      ],
      content: "Big-O notation characterizes the upper asymptotic growth rate of an algorithm as input size n approaches infinity. It ignores constant factors and lower-order terms to classify operational scalability and memory consumption."
    },
    {
      id: "cs-structures-02",
      subject: "cs",
      title: "Trees, Binary Search Trees, Heaps & Balancing (AVL/Red-Black)",
      topic: "Data Structures",
      keywords: ["tree", "bst", "heap", "avl", "red-black", "priority queue", "balanced", "traversal"],
      keyFormulas: [
        "Balanced BST Height: h = ⌊log₂ n⌋",
        "BST Search/Insert: O(log n) average, O(n) degenerate skew",
        "Min/Max Heap Insert/Extract: O(log n) time, Peek: O(1) time",
        "Tree Traversals: In-order (Left, Root, Right), Pre-order, Post-order"
      ],
      content: "Self-balancing binary search trees (AVL, Red-Black) enforce rotational invariants after insertion and deletion, guaranteeing O(log n) search, insert, and delete operations by bounding tree height against degenerating into a linear linked list."
    },
    {
      id: "cs-systems-03",
      subject: "cs",
      title: "Operating Systems: Concurrency, Processes, Threads & Deadlocks",
      topic: "Systems & Architecture",
      keywords: ["process", "thread", "concurrency", "mutex", "deadlock", "virtual memory", "paging"],
      keyFormulas: [
        "Coffman Deadlock Conditions: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait",
        "Amdahl's Law Speedup: S(s) = 1 / [(1 - p) + (p / s)]"
      ],
      content: "A process represents an isolated executing program instance with its own virtual address space; threads share process memory (heap, code, data) while maintaining individual stacks and register state. Concurrency synchronization relies on mutexes, semaphores, and condition variables."
    },
    {
      id: "cs-database-04",
      subject: "cs",
      title: "Database Engines: B-Trees vs LSM-Trees, ACID & Normalization",
      topic: "Databases & Storage",
      keywords: ["database", "b-tree", "lsm-tree", "acid", "sql", "index", "transactions", "cap theorem"],
      keyFormulas: [
        "ACID: Atomicity, Consistency, Isolation, Durability",
        "CAP Theorem: In the presence of Network Partition (P), choose Consistency (C) or Availability (A)",
        "B-Tree: Optimized for read-heavy disk I/O; LSM-Tree: Optimized for sequential write-heavy I/O (MemTable + SSTables)"
      ],
      content: "Relational database engines utilize B+ Tree indexes for balanced disk block read access. Distributed write-heavy engines (Cassandra, RocksDB) adopt Log-Structured Merge (LSM) trees that buffer writes in memory before sequential append-only disk flushing."
    },
    {
      id: "cs-dp-05",
      subject: "cs",
      title: "Dynamic Programming: Optimal Substructure & Memoization",
      topic: "Advanced Algorithms",
      keywords: ["dynamic programming", "memoization", "tabulation", "knapsack", "substructure", "overlapping subproblems"],
      keyFormulas: [
        "0/1 Knapsack State: DP[i][w] = max(DP[i-1][w], DP[i-1][w - wt[i-1]] + val[i-1])",
        "Longest Common Subsequence (LCS): DP[i][j] = DP[i-1][j-1] + 1 if s1[i]==s2[j] else max(DP[i-1][j], DP[i][j-1])"
      ],
      content: "Dynamic programming solves optimization problems featuring overlapping subproblems and optimal substructure. Solutions can be implemented top-down with recursive memoization caching or bottom-up with iterative tabulation arrays."
    }
  ]
};

/**
 * Normalizes input subject strings into one of the 5 supported subjects
 */
export function normalizeSubjectId(subject: string): SupportedSubject | "general" {
  const s = (subject || "").toLowerCase().trim();
  if (s.includes("math")) return "math";
  if (s.includes("phys")) return "physics";
  if (s.includes("chem")) return "chemistry";
  if (s.includes("bio")) return "biology";
  if (s.includes("cs") || s.includes("comp") || s.includes("code") || s.includes("algo") || s.includes("program")) return "cs";
  return "general";
}

/**
 * Performs keyword & token scoring to retrieve the top relevant RAG documents for a subject
 */
export function retrieveSubjectRag(
  subject: SupportedSubject,
  query: string,
  topK = 3
): RagDocument[] {
  const corpus = SUBJECT_RAG_CORPUS[subject] || [];
  if (corpus.length === 0) return [];

  const queryTokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  // Score each document
  const scored = corpus.map((doc) => {
    let score = 0;
    const docTitleLower = doc.title.toLowerCase();
    const docTopicLower = doc.topic.toLowerCase();
    const docContentLower = doc.content.toLowerCase();

    for (const token of queryTokens) {
      // Keyword match (highest weight)
      if (doc.keywords.some((k) => k.toLowerCase().includes(token) || token.includes(k.toLowerCase()))) {
        score += 5;
      }
      // Title match
      if (docTitleLower.includes(token)) {
        score += 4;
      }
      // Topic match
      if (docTopicLower.includes(token)) {
        score += 3;
      }
      // Content match
      if (docContentLower.includes(token)) {
        score += 1;
      }
      // Formula match
      if (doc.keyFormulas.some((f) => f.toLowerCase().includes(token))) {
        score += 3;
      }
    }

    return { doc, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Return top K (if none scored, return top defaults from corpus)
  const topMatches = scored.filter((s) => s.score > 0).map((s) => s.doc);
  if (topMatches.length === 0) {
    return corpus.slice(0, topK);
  }
  return topMatches.slice(0, topK);
}

/**
 * Formats retrieved RAG documents into a context block for Gemini grounding
 */
export function formatRagContextForPrompt(subject: SupportedSubject, docs: RagDocument[]): string {
  if (!docs || docs.length === 0) return "";

  const subjectHeader = subject.toUpperCase();
  const chunks = docs.map((doc, idx) => {
    const formulas = doc.keyFormulas.length > 0
      ? `\nKey Verified Formulas/Principles:\n${doc.keyFormulas.map((f) => `• ${f}`).join("\n")}`
      : "";
    return `[RAG SOURCE ${idx + 1}: ${doc.title} (${doc.topic})]
Verified Reference Notes:
${doc.content}${formulas}`;
  }).join("\n\n");

  return `
--- DEDICATED SUBJECT RAG KNOWLEDGE CORPUS (${subjectHeader}) ---
${chunks}
--- END RETRIEVED RAG CORPUS ---
INSTRUCTION: You MUST ground your explanations in the verified academic formulas and principles provided in the retrieved RAG corpus above when relevant. Cite the specific laws, theorems, or mechanisms.
`;
}
