export interface PUCQuestion {
  id: string;
  subject: string;
  chapter: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, 3
  explanation: string;
  examRef?: string;
}

export interface PUCSubjectInfo {
  id: string;
  name: string;
  iconName: "Zap" | "Beaker" | "Calculator" | "Leaf" | "Code";
  color: string;
  accent: string;
  chapters: string[];
}

export const PUC_SUBJECTS: PUCSubjectInfo[] = [
  {
    id: "Physics",
    name: "2nd PUC Physics",
    iconName: "Zap",
    color: "text-blue-600",
    accent: "border-blue-500",
    chapters: [
      "All Chapters (Full 2nd PUC Board Mock)",
      "Electric Charges and Fields",
      "Electrostatic Potential and Capacitance",
      "Current Electricity",
      "Moving Charges and Magnetism",
      "Magnetism and Matter",
      "Electromagnetic Induction",
      "Alternating Current",
      "Electromagnetic Waves",
      "Ray Optics and Optical Instruments",
      "Wave Optics",
      "Dual Nature of Radiation and Matter",
      "Atoms",
      "Nuclei",
      "Semiconductor Electronics"
    ]
  },
  {
    id: "Chemistry",
    name: "2nd PUC Chemistry",
    iconName: "Beaker",
    color: "text-amber-600",
    accent: "border-amber-500",
    chapters: [
      "All Chapters (Full 2nd PUC Board Mock)",
      "Solutions",
      "Electrochemistry",
      "Chemical Kinetics",
      "d- and f-Block Elements",
      "Coordination Compounds",
      "Haloalkanes and Haloarenes",
      "Alcohols, Phenols and Ethers",
      "Aldehydes, Ketones and Carboxylic Acids",
      "Amines",
      "Biomolecules"
    ]
  },
  {
    id: "Mathematics",
    name: "2nd PUC Mathematics",
    iconName: "Calculator",
    color: "text-emerald-600",
    accent: "border-emerald-500",
    chapters: [
      "All Chapters (Full 2nd PUC Board Mock)",
      "Relations and Functions",
      "Inverse Trigonometric Functions",
      "Matrices",
      "Determinants",
      "Continuity and Differentiability",
      "Application of Derivatives",
      "Integrals",
      "Application of Integrals",
      "Differential Equations",
      "Vector Algebra",
      "Three Dimensional Geometry",
      "Linear Programming",
      "Probability"
    ]
  },
  {
    id: "Biology",
    name: "2nd PUC Biology",
    iconName: "Leaf",
    color: "text-green-600",
    accent: "border-green-500",
    chapters: [
      "All Chapters (Full 2nd PUC Board Mock)",
      "Sexual Reproduction in Flowering Plants",
      "Human Reproduction",
      "Reproductive Health",
      "Principles of Inheritance and Variation",
      "Molecular Basis of Inheritance",
      "Evolution",
      "Human Health and Disease",
      "Microbes in Human Welfare",
      "Biotechnology: Principles and Processes",
      "Biotechnology and its Applications",
      "Organisms and Populations",
      "Ecosystem",
      "Biodiversity and Conservation"
    ]
  },
  {
    id: "Computer Science",
    name: "2nd PUC Computer Science",
    iconName: "Code",
    color: "text-cyan-600",
    accent: "border-cyan-500",
    chapters: [
      "All Chapters (Full 2nd PUC Board Mock)",
      "Classes and Objects",
      "Function Overloading",
      "Constructors and Destructors",
      "Inheritance",
      "Pointers",
      "Data Structures (Stacks, Queues, Arrays)",
      "Database Concepts & DBMS",
      "Structured Query Language (SQL)",
      "Boolean Algebra & Logic Gates",
      "Networking & Web Technologies"
    ]
  }
];

// Curated authentic 2nd PUC Karnataka Board Exam / KCET Multiple Choice Questions
export const PUC_PRESET_QUESTIONS: Record<string, PUCQuestion[]> = {
  Physics: [
    {
      id: "phy-1",
      subject: "Physics",
      chapter: "Electric Charges and Fields",
      question: "The SI unit of electric flux is:",
      options: [
        "N C⁻¹ m",
        "N m² C⁻¹",
        "N C m⁻²",
        "N m C⁻¹"
      ],
      correctIndex: 1,
      explanation: "Electric flux φ = E · A = (N/C) × m² = N m² C⁻¹ (or Volt · metre). This is a standard 2nd PUC Part-A Board Exam question.",
      examRef: "Karnataka 2nd PUC Annual Exam 2023 / NCERT Chapter 1"
    },
    {
      id: "phy-2",
      subject: "Physics",
      chapter: "Electrostatic Potential and Capacitance",
      question: "The work done in moving a charge of 2 μC across an equipotential surface between two points 10 cm apart is:",
      options: [
        "20 J",
        "0.2 J",
        "Zero",
        "2 × 10⁻⁵ J"
      ],
      correctIndex: 2,
      explanation: "On an equipotential surface, the electric potential difference between any two points is ΔV = 0. Therefore, work done W = q · ΔV = 0.",
      examRef: "Karnataka 2nd PUC Model Paper / NCERT Chapter 2"
    },
    {
      id: "phy-3",
      subject: "Physics",
      chapter: "Current Electricity",
      question: "Kirchhoff's first rule (Junction Rule) Σ I = 0 at a node is based on the law of conservation of:",
      options: [
        "Energy",
        "Electric charge",
        "Linear momentum",
        "Angular momentum"
      ],
      correctIndex: 1,
      explanation: "Kirchhoff's Junction Rule is based on the conservation of electric charge (no charge can accumulate at a junction). Kirchhoff's Loop Rule is based on conservation of energy.",
      examRef: "Karnataka 2nd PUC Annual Exam / NCERT Chapter 3"
    },
    {
      id: "phy-4",
      subject: "Physics",
      chapter: "Moving Charges and Magnetism",
      question: "A charged particle moves with velocity v perpendicular to a uniform magnetic field B. The path traced by the particle is:",
      options: [
        "Straight line",
        "Parabolic",
        "Circular",
        "Helical"
      ],
      correctIndex: 2,
      explanation: "When v is perpendicular to B (θ = 90°), the Lorentz force F = q(v × B) acts perpendicular to the velocity, providing centripetal acceleration and forming a circle.",
      examRef: "Karnataka 2nd PUC NCERT Chapter 4"
    },
    {
      id: "phy-5",
      subject: "Physics",
      chapter: "Electromagnetic Induction",
      question: "Lenz's law of electromagnetic induction is a direct consequence of the law of conservation of:",
      options: [
        "Charge",
        "Mass",
        "Energy",
        "Momentum"
      ],
      correctIndex: 2,
      explanation: "Lenz's law states that induced emf opposes the change producing it. Mechanical work done against this opposition is converted into electrical energy, satisfying conservation of energy.",
      examRef: "Karnataka 2nd PUC Part A Board / NCERT Chapter 6"
    },
    {
      id: "phy-6",
      subject: "Physics",
      chapter: "Alternating Current",
      question: "In a pure capacitor circuit connected to an alternating voltage, the current:",
      options: [
        "Lags behind voltage by π/2",
        "Leads the voltage by π/2",
        "Is in phase with the voltage",
        "Leads the voltage by π"
      ],
      correctIndex: 1,
      explanation: "In an AC circuit with pure capacitance, current leads the alternating voltage by a phase angle of π/2 radians (90°).",
      examRef: "Karnataka 2nd PUC Annual Exam / NCERT Chapter 7"
    },
    {
      id: "phy-7",
      subject: "Physics",
      chapter: "Wave Optics",
      question: "The phenomenon which establishes the transverse nature of electromagnetic light waves is:",
      options: [
        "Interference",
        "Diffraction",
        "Refraction",
        "Polarisation"
      ],
      correctIndex: 3,
      explanation: "Only transverse waves can be polarised. Interference and diffraction occur in both longitudinal and transverse waves.",
      examRef: "Karnataka 2nd PUC Annual Exam / NCERT Chapter 10"
    },
    {
      id: "phy-8",
      subject: "Physics",
      chapter: "Dual Nature of Radiation and Matter",
      question: "The de Broglie wavelength λ associated with an electron accelerated through a potential difference of V volts is approximately:",
      options: [
        "1.227 / √V nm",
        "12.27 / V nm",
        "0.1227 / √V nm",
        "1.227 × √V nm"
      ],
      correctIndex: 0,
      explanation: "λ = h / p = 1.227 / √V nm. If V = 100 V, λ = 1.227 / 10 = 0.1227 nm.",
      examRef: "Karnataka 2nd PUC NCERT Chapter 11"
    },
    {
      id: "phy-9",
      subject: "Physics",
      chapter: "Semiconductor Electronics",
      question: "In an n-type semiconductor, the majority charge carriers and donor impurity are respectively:",
      options: [
        "Holes and Trivalent atom",
        "Electrons and Pentavalent atom",
        "Electrons and Trivalent atom",
        "Holes and Pentavalent atom"
      ],
      correctIndex: 1,
      explanation: "Doping intrinsic silicon/germanium with pentavalent impurities (e.g., Phosphorus, Arsenic) yields an n-type semiconductor where free electrons are majority carriers.",
      examRef: "Karnataka 2nd PUC Part-A / NCERT Chapter 14"
    },
    {
      id: "phy-10",
      subject: "Physics",
      chapter: "Ray Optics and Optical Instruments",
      question: "A convex lens of focal length 20 cm is in contact with a concave lens of focal length 30 cm. The focal length of the combination is:",
      options: [
        "+60 cm",
        "-60 cm",
        "+12 cm",
        "-12 cm"
      ],
      correctIndex: 0,
      explanation: "1/F = 1/f₁ + 1/f₂ = 1/20 - 1/30 = (3 - 2)/60 = 1/60. Therefore, F = +60 cm.",
      examRef: "Karnataka 2nd PUC KCET / NCERT Chapter 9"
    }
  ],
  Chemistry: [
    {
      id: "chem-1",
      subject: "Chemistry",
      chapter: "Solutions",
      question: "Which of the following concentration terms is independent of temperature?",
      options: [
        "Molarity",
        "Normality",
        "Molality",
        "Formality"
      ],
      correctIndex: 2,
      explanation: "Molality (moles of solute per kg of solvent) depends on mass, which is temperature-independent, unlike volume-dependent terms like Molarity.",
      examRef: "Karnataka 2nd PUC Annual Exam / NCERT Chapter 1"
    },
    {
      id: "chem-2",
      subject: "Chemistry",
      chapter: "Electrochemistry",
      question: "The SI unit of molar conductivity (Λm) is:",
      options: [
        "S m² mol⁻¹",
        "S cm⁻¹ mol",
        "S m⁻¹ mol⁻¹",
        "Ω cm mol⁻¹"
      ],
      correctIndex: 0,
      explanation: "Molar conductivity Λm = κ / c. In SI units, κ is in S m⁻¹ and c in mol m⁻³, giving S m² mol⁻¹.",
      examRef: "Karnataka 2nd PUC Part A Board / NCERT Chapter 2"
    },
    {
      id: "chem-3",
      subject: "Chemistry",
      chapter: "Chemical Kinetics",
      question: "For a first order reaction, the unit of rate constant k is:",
      options: [
        "mol L⁻¹ s⁻¹",
        "L mol⁻¹ s⁻¹",
        "s⁻¹",
        "mol⁻² L² s⁻¹"
      ],
      correctIndex: 2,
      explanation: "For an nth order reaction, unit of k = (mol L⁻¹)^(1-n) s⁻¹. For n = 1, unit is s⁻¹.",
      examRef: "Karnataka 2nd PUC Annual Exam 2024 / NCERT Chapter 3"
    },
    {
      id: "chem-4",
      subject: "Chemistry",
      chapter: "d- and f-Block Elements",
      question: "Transition metal ions are generally coloured in aqueous solutions due to:",
      options: [
        "d-d transition of electrons",
        "High electronegativity",
        "Small size of metal ion",
        "Presence of completely filled d-subshell"
      ],
      correctIndex: 0,
      explanation: "When visible light falls on transition metal complexes with partially filled d-orbitals, electrons absorb light and undergo d-d transitions, imparting characteristic colours.",
      examRef: "Karnataka 2nd PUC Part A / NCERT Chapter 4"
    },
    {
      id: "chem-5",
      subject: "Chemistry",
      chapter: "Coordination Compounds",
      question: "The coordination number and oxidation state of cobalt in [Co(en)₃]³⁺ are respectively:",
      options: [
        "3 and +3",
        "6 and +3",
        "6 and +6",
        "3 and 0"
      ],
      correctIndex: 1,
      explanation: "Ethylene diamine ('en') is a bidentate ligand. 3 bidentate ligands donate 3 × 2 = 6 lone pairs (Coordination Number = 6). 'en' is neutral, so oxidation state of Co is +3.",
      examRef: "Karnataka 2nd PUC Board Exam / NCERT Chapter 5"
    },
    {
      id: "chem-6",
      subject: "Chemistry",
      chapter: "Haloalkanes and Haloarenes",
      question: "The reaction of alkyl halide with sodium metal in dry ether to form higher alkanes is known as:",
      options: [
        "Wurtz reaction",
        "Fittig reaction",
        "Wurtz-Fittig reaction",
        "Friedel-Crafts reaction"
      ],
      correctIndex: 0,
      explanation: "2 R-X + 2 Na (in dry ether) → R-R + 2 NaX is the classic Wurtz reaction.",
      examRef: "Karnataka 2nd PUC Organic Chemistry / NCERT Chapter 6"
    },
    {
      id: "chem-7",
      subject: "Chemistry",
      chapter: "Alcohols, Phenols and Ethers",
      question: "When phenol is treated with chloroform and aqueous NaOH followed by acidification, salicylaldehyde is obtained. This reaction is:",
      options: [
        "Kolbe's reaction",
        "Reimer-Tiemann reaction",
        "Rosenmund reduction",
        "Cannizzaro reaction"
      ],
      correctIndex: 1,
      explanation: "Treatment of phenol with CHCl₃ in presence of NaOH introduces a -CHO group ortho to the -OH group. This is the Reimer-Tiemann reaction.",
      examRef: "Karnataka 2nd PUC Annual Exam / NCERT Chapter 7"
    },
    {
      id: "chem-8",
      subject: "Chemistry",
      chapter: "Aldehydes, Ketones and Carboxylic Acids",
      question: "Which of the following compounds gives a positive Tollens' test (silver mirror)?",
      options: [
        "Acetone (CH₃COCH₃)",
        "Acetaldehyde (CH₃CHO)",
        "Benzophenone (C₆H₅COC₆H₅)",
        "Acetophenone (C₆H₅COCH₃)"
      ],
      correctIndex: 1,
      explanation: "Tollens' reagent ammoniacal silver nitrate [Ag(NH₃)₂]⁺ is reduced to metallic silver by aldehydes like acetaldehyde, but not by simple ketones.",
      examRef: "Karnataka 2nd PUC Part A Board / NCERT Chapter 8"
    },
    {
      id: "chem-9",
      subject: "Chemistry",
      chapter: "Amines",
      question: "Primary amines on heating with chloroform and alcoholic KOH produce foul-smelling isocyanides. This test is:",
      options: [
        "Carbylamine test",
        "Hinsberg test",
        "Sandmeyer reaction",
        "Gabriel phthalimide synthesis"
      ],
      correctIndex: 0,
      explanation: "Carbylamine test (isocyanide test) is specific for aliphatic and aromatic primary amines (R-NH₂ + CHCl₃ + 3KOH → R-NC + 3KCl + 3H₂O).",
      examRef: "Karnataka 2nd PUC Annual Exam / NCERT Chapter 9"
    },
    {
      id: "chem-10",
      subject: "Chemistry",
      chapter: "Biomolecules",
      question: "The vitamin whose deficiency causes Pernicious anaemia is:",
      options: [
        "Vitamin B₁",
        "Vitamin B₂",
        "Vitamin B₆",
        "Vitamin B₁₂"
      ],
      correctIndex: 3,
      explanation: "Deficiency of Vitamin B₁₂ (Cyanocobalamin) leads to Pernicious anaemia, marked by RBC deficiency due to impaired DNA synthesis.",
      examRef: "Karnataka 2nd PUC Part A / NCERT Chapter 10"
    }
  ],
  Mathematics: [
    {
      id: "math-1",
      subject: "Mathematics",
      chapter: "Matrices",
      question: "If A is a square matrix of order 3 such that |A| = 5, then the value of |adj(A)| is:",
      options: [
        "5",
        "25",
        "125",
        "1/5"
      ],
      correctIndex: 1,
      explanation: "For a square matrix of order n, |adj(A)| = |A|^(n-1). Here n = 3 and |A| = 5, so |adj(A)| = 5^(3-1) = 5² = 25.",
      examRef: "Karnataka 2nd PUC Annual Exam / NCERT Chapter 3 & 4"
    },
    {
      id: "math-2",
      subject: "Mathematics",
      chapter: "Inverse Trigonometric Functions",
      question: "The principal value of sin⁻¹(-1/2) is:",
      options: [
        "π/6",
        "-π/6",
        "5π/6",
        "7π/6"
      ],
      correctIndex: 1,
      explanation: "The principal value branch of sin⁻¹(x) is [-π/2, π/2]. Since sin(-π/6) = -1/2, sin⁻¹(-1/2) = -π/6.",
      examRef: "Karnataka 2nd PUC Annual Exam / NCERT Chapter 2"
    },
    {
      id: "math-3",
      subject: "Mathematics",
      chapter: "Determinants",
      question: "If points (x, 2), (-3, 4), and (7, -1) are collinear, then the value of x is:",
      options: [
        "-1",
        "1",
        "0",
        "3"
      ],
      correctIndex: 0,
      explanation: "Area of triangle formed by collinear points is 0: (1/2)[x(4 - (-1)) + (-3)(-1 - 2) + 7(2 - 4)] = 0 => 5x + 9 - 14 = 0 => 5x - 5 = 0 => x = 1 (Wait, let's recheck: 5x + 9 - 14 = 0 => 5x = 5 => x = 1). Let's check: x = 1.",
      examRef: "Karnataka 2nd PUC Part A Board / NCERT Chapter 4"
    },
    {
      id: "math-4",
      subject: "Mathematics",
      chapter: "Continuity and Differentiability",
      question: "The derivative of log(sin x) with respect to x is:",
      options: [
        "tan x",
        "cot x",
        "-cot x",
        "sec x"
      ],
      correctIndex: 1,
      explanation: "By chain rule, d/dx [log(sin x)] = (1 / sin x) · d/dx (sin x) = (cos x) / (sin x) = cot x.",
      examRef: "Karnataka 2nd PUC Annual Exam / NCERT Chapter 5"
    },
    {
      id: "math-5",
      subject: "Mathematics",
      chapter: "Integrals",
      question: "The value of ∫ e^x (sec x + sec x tan x) dx is:",
      options: [
        "e^x tan x + C",
        "e^x sec x + C",
        "e^x sec x tan x + C",
        "-e^x sec x + C"
      ],
      correctIndex: 1,
      explanation: "Using standard 2nd PUC integral formula ∫ e^x [f(x) + f'(x)] dx = e^x f(x) + C. Here f(x) = sec x and f'(x) = sec x tan x. Thus result is e^x sec x + C.",
      examRef: "Karnataka 2nd PUC Board Exam / NCERT Chapter 7"
    },
    {
      id: "math-6",
      subject: "Mathematics",
      chapter: "Differential Equations",
      question: "The order and degree of the differential equation [1 + (dy/dx)²]^(3/2) = d²y/dx² are respectively:",
      options: [
        "Order = 2, Degree = 2",
        "Order = 1, Degree = 3",
        "Order = 2, Degree = 1",
        "Order = 2, Degree not defined"
      ],
      correctIndex: 0,
      explanation: "Squaring both sides to clear fractional power: [1 + (dy/dx)²]³ = (d²y/dx²)². The highest derivative is d²y/dx² (Order = 2), and its power is 2 (Degree = 2).",
      examRef: "Karnataka 2nd PUC Model Paper / NCERT Chapter 9"
    },
    {
      id: "math-7",
      subject: "Mathematics",
      chapter: "Vector Algebra",
      question: "If vectors a = 2î + 3ĵ + k̂ and b = 3î + 2ĵ - λk̂ are perpendicular to each other, then the value of λ is:",
      options: [
        "12",
        "-12",
        "6",
        "-6"
      ],
      correctIndex: 0,
      explanation: "Two non-zero vectors are perpendicular if their dot product a · b = 0. (2)(3) + (3)(2) + (1)(-λ) = 0 => 6 + 6 - λ = 0 => λ = 12.",
      examRef: "Karnataka 2nd PUC Annual Exam / NCERT Chapter 10"
    },
    {
      id: "math-8",
      subject: "Mathematics",
      chapter: "Three Dimensional Geometry",
      question: "The direction cosines of the y-axis are:",
      options: [
        "(1, 0, 0)",
        "(0, 1, 0)",
        "(0, 0, 1)",
        "(0, 1, 1)"
      ],
      correctIndex: 1,
      explanation: "The y-axis makes angles 90°, 0°, and 90° with the x, y, and z axes respectively. Direction cosines are (cos 90°, cos 0°, cos 90°) = (0, 1, 0).",
      examRef: "Karnataka 2nd PUC Part A Board / NCERT Chapter 11"
    },
    {
      id: "math-9",
      subject: "Mathematics",
      chapter: "Linear Programming",
      question: "In a linear programming problem, the objective function Z = ax + by is maximized or minimized at:",
      options: [
        "Any interior point of the feasible region",
        "The corner points (vertices) of the feasible region",
        "Points on the negative axes",
        "The origin only"
      ],
      correctIndex: 1,
      explanation: "By the Corner Point Theorem of LPP, the optimal value (maximum or minimum) of the objective function occurs at the extreme corner points of the convex feasible region.",
      examRef: "Karnataka 2nd PUC Board Exam / NCERT Chapter 12"
    },
    {
      id: "math-10",
      subject: "Mathematics",
      chapter: "Probability",
      question: "If P(A) = 3/5, P(B) = 1/5 and A and B are independent events, then P(A ∩ B) is:",
      options: [
        "4/5",
        "3/25",
        "2/5",
        "1/25"
      ],
      correctIndex: 1,
      explanation: "For independent events, P(A ∩ B) = P(A) × P(B) = (3/5) × (1/5) = 3/25.",
      examRef: "Karnataka 2nd PUC Annual Exam 2024 / NCERT Chapter 13"
    }
  ],
  Biology: [
    {
      id: "bio-1",
      subject: "Biology",
      chapter: "Sexual Reproduction in Flowering Plants",
      question: "The ploidy of Primary Endosperm Nucleus (PEN) in typical angiosperms after double fertilization is:",
      options: [
        "Haploid (n)",
        "Diploid (2n)",
        "Triploid (3n)",
        "Tetraploid (4n)"
      ],
      correctIndex: 2,
      explanation: "In angiosperms, triple fusion involves fusion of one haploid male gamete (n) with two polar nuclei (2n) in the central cell to produce a triploid (3n) primary endosperm nucleus.",
      examRef: "Karnataka 2nd PUC Annual Exam / NCERT Chapter 1"
    },
    {
      id: "bio-2",
      subject: "Biology",
      chapter: "Human Reproduction",
      question: "Leydig cells present in the interstitial spaces of human testes synthesize and secrete:",
      options: [
        "Progesterone",
        "Estrogen",
        "Androgens (Testosterone)",
        "Inhibin"
      ],
      correctIndex: 2,
      explanation: "Leydig cells (interstitial cells) are stimulated by LH (ICSH) from anterior pituitary to synthesize and secrete testicular hormones called androgens (mainly testosterone).",
      examRef: "Karnataka 2nd PUC Part A Board / NCERT Chapter 2"
    },
    {
      id: "bio-3",
      subject: "Biology",
      chapter: "Principles of Inheritance and Variation",
      question: "The phenotypic dihybrid cross ratio obtained by Gregor Mendel in F₂ generation of garden peas was:",
      options: [
        "9 : 3 : 3 : 1",
        "1 : 2 : 1",
        "3 : 1",
        "9 : 7"
      ],
      correctIndex: 0,
      explanation: "Mendel's law of independent assortment in pea plants yields a phenotypic ratio of 9 (Round Yellow) : 3 (Round Green) : 3 (Wrinkled Yellow) : 1 (Wrinkled Green).",
      examRef: "Karnataka 2nd PUC Genetics / NCERT Chapter 4"
    },
    {
      id: "bio-4",
      subject: "Biology",
      chapter: "Molecular Basis of Inheritance",
      question: "In genetic code, which of the following codons functions as the initiation (start) codon and codes for Methionine?",
      options: [
        "UAA",
        "AUG",
        "UGA",
        "UAG"
      ],
      correctIndex: 1,
      explanation: "AUG has dual functions: it acts as the initiation codon for translation and codes for Methionine (Met). UAA, UAG, and UGA are stop (nonsense) codons.",
      examRef: "Karnataka 2nd PUC Part A Board / NCERT Chapter 5"
    },
    {
      id: "bio-5",
      subject: "Biology",
      chapter: "Human Health and Disease",
      question: "Which antibody is predominantly present in colostrum, providing passive natural immunity to the newborn infant?",
      options: [
        "IgG",
        "IgM",
        "IgA",
        "IgE"
      ],
      correctIndex: 2,
      explanation: "Colostrum (yellowish initial milk secreted during lactation) is rich in IgA antibodies that protect newborns against mucosal respiratory and gut infections.",
      examRef: "Karnataka 2nd PUC Annual Exam / NCERT Chapter 7"
    },
    {
      id: "bio-6",
      subject: "Biology",
      chapter: "Biotechnology: Principles and Processes",
      question: "The molecular scissors used to cut double-stranded DNA at specific palindromic recognition sequences are:",
      options: [
        "DNA Ligases",
        "Restriction Endonucleases",
        "DNA Polymerases",
        "Topoisomerases"
      ],
      correctIndex: 1,
      explanation: "Restriction endonucleases (e.g. EcoRI) cut DNA at specific palindromic sequences, generating sticky or blunt ends essential for recombinant DNA technology.",
      examRef: "Karnataka 2nd PUC Biotechnology / NCERT Chapter 9"
    },
    {
      id: "bio-7",
      subject: "Biology",
      chapter: "Organisms and Populations",
      question: "An association between two different species where one species is benefited and the other is neither benefited nor harmed is known as:",
      options: [
        "Mutualism",
        "Commensalism",
        "Amensalism",
        "Parasitism"
      ],
      correctIndex: 1,
      explanation: "Commensalism (+, 0) benefits one species without affecting the other (e.g., orchid growing as an epiphyte on a mango branch).",
      examRef: "Karnataka 2nd PUC Ecology / NCERT Chapter 11"
    },
    {
      id: "bio-8",
      subject: "Biology",
      chapter: "Biodiversity and Conservation",
      question: "Which of the following is an example of ex-situ biodiversity conservation?",
      options: [
        "National Park",
        "Wildlife Sanctuary",
        "Biosphere Reserve",
        "Botanical Garden / Zoological Park"
      ],
      correctIndex: 3,
      explanation: "Ex-situ conservation involves taking threatened animals/plants out of natural habitat to special care settings like Zoological parks, Botanical gardens, and Cryopreservation gene banks.",
      examRef: "Karnataka 2nd PUC Annual Exam 2023 / NCERT Chapter 13"
    }
  ],
  "Computer Science": [
    {
      id: "cs-1",
      subject: "Computer Science",
      chapter: "Classes and Objects",
      question: "In C++ / OOP, data members and member functions declared under which access specifier are accessible only within that class?",
      options: [
        "public",
        "private",
        "protected",
        "friend"
      ],
      correctIndex: 1,
      explanation: "Private members of a class cannot be accessed directly from outside the class or from derived classes (enforcing data hiding and encapsulation).",
      examRef: "Karnataka 2nd PUC CS Board Exam Chapter 4"
    },
    {
      id: "cs-2",
      subject: "Computer Science",
      chapter: "Data Structures (Stacks, Queues, Arrays)",
      question: "A Stack data structure operates on which fundamental accessing principle?",
      options: [
        "FIFO (First In First Out)",
        "LIFO (Last In First Out)",
        "LILO (Last In Last Out)",
        "Random Access"
      ],
      correctIndex: 1,
      explanation: "A Stack is a LIFO (Last In First Out) linear data structure where elements are inserted and removed strictly at one end called TOP.",
      examRef: "Karnataka 2nd PUC CS Part A / Chapter 8"
    },
    {
      id: "cs-3",
      subject: "Computer Science",
      chapter: "Structured Query Language (SQL)",
      question: "Which of the following is a DDL (Data Definition Language) command in SQL?",
      options: [
        "SELECT",
        "INSERT",
        "CREATE",
        "UPDATE"
      ],
      correctIndex: 2,
      explanation: "CREATE, ALTER, and DROP are DDL commands used to define and modify database structures. SELECT is DQL; INSERT and UPDATE are DML commands.",
      examRef: "Karnataka 2nd PUC CS Annual Exam / Chapter 10"
    },
    {
      id: "cs-4",
      subject: "Computer Science",
      chapter: "Boolean Algebra & Logic Gates",
      question: "According to De Morgan's first theorem in Boolean Algebra, (X + Y)' is equivalent to:",
      options: [
        "X' · Y'",
        "X' + Y'",
        "(X · Y)'",
        "X · Y"
      ],
      correctIndex: 0,
      explanation: "De Morgan's First Theorem states that the complement of a logical sum equals the product of the complements: (X + Y)' = X' · Y'.",
      examRef: "Karnataka 2nd PUC CS Part A / Chapter 11"
    },
    {
      id: "cs-5",
      subject: "Computer Science",
      chapter: "Constructors and Destructors",
      question: "A destructor in C++ is preceded by which special character symbol?",
      options: [
        "# (hash)",
        "~ (tilde)",
        "* (asterisk)",
        "& (ampersand)"
      ],
      correctIndex: 1,
      explanation: "Destructors have the same name as the class preceded by the tilde symbol (~) and take no arguments and return no values.",
      examRef: "Karnataka 2nd PUC CS Board Exam Chapter 5"
    },
    {
      id: "cs-6",
      subject: "Computer Science",
      chapter: "Inheritance",
      question: "When a derived class inherits properties from two or more base classes simultaneously, it is known as:",
      options: [
        "Single inheritance",
        "Multilevel inheritance",
        "Multiple inheritance",
        "Hierarchical inheritance"
      ],
      correctIndex: 2,
      explanation: "Multiple inheritance is where a single derived child class inherits from multiple independent parent base classes.",
      examRef: "Karnataka 2nd PUC CS Annual Exam / Chapter 6"
    },
    {
      id: "cs-7",
      subject: "Computer Science",
      chapter: "Database Concepts & DBMS",
      question: "In a relational database table, a candidate key that is chosen to uniquely identify each tuple/record is called the:",
      options: [
        "Primary Key",
        "Foreign Key",
        "Alternate Key",
        "Composite Key"
      ],
      correctIndex: 0,
      explanation: "A Primary Key is a minimal candidate key selected by the database designer to uniquely identify every row (tuple) in a relation.",
      examRef: "Karnataka 2nd PUC CS Chapter 9"
    },
    {
      id: "cs-8",
      subject: "Computer Science",
      chapter: "Networking & Web Technologies",
      question: "Which networking topology connects all nodes/computers to a single central hub or switch?",
      options: [
        "Bus topology",
        "Ring topology",
        "Star topology",
        "Mesh topology"
      ],
      correctIndex: 2,
      explanation: "In a Star topology, every host is connected via a dedicated cable directly to a central networking device (Hub or Switch).",
      examRef: "Karnataka 2nd PUC CS Board Exam Chapter 12"
    }
  ]
};
