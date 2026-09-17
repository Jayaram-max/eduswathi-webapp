import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { PDFParse } from "pdf-parse";
import {
  normalizeSubjectId,
  retrieveSubjectRag,
  formatRagContextForPrompt,
  SupportedSubject,
  SUBJECT_RAG_CORPUS
} from "./src/services/subjectRag";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Base Gemini AI Setup
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Subject-specific API key getter - strictly for Math, Physics, Chemistry, Biology, CS
  const getSubjectKeyInfo = (subjectId: string): { key: string; keyName: string; isDedicated: boolean } => {
    const norm = normalizeSubjectId(subjectId);
    switch (norm) {
      case "math":
        return {
          key: process.env.MATH_API_KEY || apiKey,
          keyName: "MATH_API_KEY",
          isDedicated: !!process.env.MATH_API_KEY
        };
      case "physics":
        return {
          key: process.env.PHYSICS_API_KEY || apiKey,
          keyName: "PHYSICS_API_KEY",
          isDedicated: !!process.env.PHYSICS_API_KEY
        };
      case "chemistry":
        return {
          key: process.env.CHEMISTRY_API_KEY || apiKey,
          keyName: "CHEMISTRY_API_KEY",
          isDedicated: !!process.env.CHEMISTRY_API_KEY
        };
      case "biology":
        return {
          key: process.env.BIOLOGY_API_KEY || apiKey,
          keyName: "BIOLOGY_API_KEY",
          isDedicated: !!process.env.BIOLOGY_API_KEY
        };
      case "cs":
        return {
          key: process.env.CS_API_KEY || apiKey,
          keyName: "CS_API_KEY",
          isDedicated: !!process.env.CS_API_KEY
        };
      default:
        return {
          key: apiKey,
          keyName: "GEMINI_API_KEY",
          isDedicated: false
        };
    }
  };

  // Dedicated GenAI client using the subject's own API key
  const getSubjectClient = (subjectId: string) => {
    const { key } = getSubjectKeyInfo(subjectId);
    return new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  const getSubjectSystemPrompt = (subjectId: string, socraticMode = true): string => {
    const socraticInstruction = socraticMode
      ? "Employ the Socratic method when appropriate: guide the student through conceptual steps, verify their reasoning, and ask a thought-provoking follow-up question to test their mastery."
      : "Provide clear, detailed, and directly applicable explanations with step-by-step solutions.";

    const basePrompt = `You are Eduswathi's dedicated Subject AI Tutor. Keep your tone encouraging, rigorous, and clear, styled for a modern student learning environment. Use markdown formatting with bold headings, bullet points, and code/math blocks. ${socraticInstruction}`;

    const norm = normalizeSubjectId(subjectId);
    switch (norm) {
      case "math":
        return `${basePrompt}
You specialize in Mathematics (Algebra, Calculus, Linear Algebra, Statistics, Discrete Math, Geometry). 
- Ground your derivations in verified theorems (Fundamental Theorem of Calculus, Taylor/Maclaurin series, Matrix Diagonalization, Bayes' Theorem).
- Always show clean step-by-step arithmetic and algebraic derivations.
- Use standard notation for math expressions (e.g. x^2, \\sqrt{}, \\int, \\frac{a}{b}, matrices).
- When a student asks to solve a problem, break it into: 1. Core Principle, 2. Step-by-Step Derivation, 3. Verification Check, 4. Practice Question.`;

      case "physics":
        return `${basePrompt}
You specialize in Physics (Classical Mechanics, Electromagnetism, Quantum Physics, Thermodynamics, Optics, Relativity).
- Ground explanations in fundamental laws: Newton's Laws, Maxwell's Equations, Thermodynamics laws, Heisenberg Uncertainty, Lorentz transformations.
- Emphasize fundamental physical intuition, vector components, and conservation laws (energy, momentum).
- Always specify units (SI: m/s², N, J, W, T, etc.) throughout calculations.
- Relate abstract equations to tangible real-world phenomena.`;

      case "chemistry":
        return `${basePrompt}
You specialize in Chemistry (Organic, Inorganic, Physical Chemistry, Biochemistry, Stoichiometry).
- Ground mechanisms in verified chemical kinetics, SN1/SN2 pathways, Gibbs Free Energy (ΔG = ΔH - TΔS), Henderson-Hasselbalch, and VSEPR orbital geometries.
- Show balanced chemical reaction equations with state symbols (s, l, g, aq).
- For Organic Chemistry, clearly describe reaction mechanisms, functional groups, nucleophiles/electrophiles, and stereochemistry.
- Highlight molecular geometry, electron configurations, and periodic trends.`;

      case "biology":
        return `${basePrompt}
You specialize in Biology & Life Sciences (Cellular Biology, Genetics, Neuroscience, Physiology, Ecology, Evolution).
- Ground explanations in the Central Dogma, ATP Chemiosmosis & Cellular Respiration, Action Potential Ion Fluxes, CRISPR-Cas9, and Hardy-Weinberg equilibrium.
- Explain biological pathways and biochemical loops (e.g. Krebs cycle, glycolysis, photosynthesis) with clear stage-by-stage descriptions.
- Connect molecular structures to organismal function and evolutionary purpose.
- Use clear anatomical terminology paired with simple analogies.`;

      case "cs":
        return `${basePrompt}
You specialize in Computer Science & Programming (Algorithms, Data Structures, Python, TypeScript/JavaScript, C++, System Design, Databases).
- Ground analysis in Asymptotic Big-O complexity, balanced trees, OS concurrency/deadlocks, and B-Tree vs LSM-Tree database storage paradigms.
- Provide clean, idiomatic, well-commented code snippets.
- Analyze Time & Space Complexity using Big-O notation (e.g., O(n log n) time, O(1) auxiliary space).
- Highlight potential edge cases, debugging tips, and memory considerations.`;

      default:
        return `${basePrompt}
You are Eduswathi, a versatile and insightful STEM academic tutor across all sciences and computing.`;
    }
  };

  // API Route: Subject Chatbot Dedicated Handler with Subject RAG Integration
  const handleChatRequest = async (req: express.Request, res: express.Response, explicitSubject?: string) => {
    try {
      const { message, messages, json, isSmartNotes, subject, socraticMode = true } = req.body;
      const rawSubject = explicitSubject || subject || "general";
      const subjectId = normalizeSubjectId(rawSubject);
      const keyInfo = getSubjectKeyInfo(subjectId);

      // Formulate prompt content
      let promptContent = message || "";
      if (!promptContent && Array.isArray(messages) && messages.length > 0) {
        promptContent = messages.map((m: any) => `${m.role === "user" ? "Student" : "Eduswathi"}: ${m.content || m.text}`).join("\n\n");
      }

      if (!promptContent) {
        return res.status(400).json({ error: "No message content provided." });
      }

      // Determine active AI client using the subject's own API key
      const activeClient = isSmartNotes ? ai : getSubjectClient(subjectId);
      
      // Perform Subject RAG Retrieval if querying one of the 5 subjects
      let ragPromptContext = "";
      if (!isSmartNotes && subjectId !== "general") {
        const ragDocs = retrieveSubjectRag(subjectId as SupportedSubject, promptContent, 3);
        ragPromptContext = formatRagContextForPrompt(subjectId as SupportedSubject, ragDocs);
      }

      const activeSystemInstruction = isSmartNotes
        ? "You are Eduswathi, a premium Socratic study assistant. Summarize textbooks and notes with extreme high fidelity, structured headers, vocabulary lists, and active recall queries in elegant markdown."
        : `${getSubjectSystemPrompt(subjectId, socraticMode)}${ragPromptContext ? `\n\n${ragPromptContext}` : ""}`;

      // Response headers for subject RAG identification
      res.setHeader("X-Subject-Rag-Key", keyInfo.keyName);
      res.setHeader("X-Subject-Id", subjectId);
      res.setHeader("X-Subject-Key-Dedicated", keyInfo.isDedicated ? "true" : "false");

      // JSON Response Mode
      if (json) {
        const response = await activeClient.models.generateContent({
          model: "gemini-2.5-flash",
          contents: promptContent,
          config: {
            systemInstruction: activeSystemInstruction,
          }
        });
        return res.json({
          text: response.text || "",
          subject: subjectId,
          ragKey: keyInfo.keyName,
          isDedicatedKey: keyInfo.isDedicated
        });
      }

      // Streaming Response Mode
      const chat = activeClient.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: activeSystemInstruction,
        },
      });

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const responseStream = await chat.sendMessageStream({ message: promptContent });
      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(chunk.text);
        }
      }
      res.end();
    } catch (error: any) {
      console.error("Gemini Subject Chat API Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "Failed to generate subject response" });
      } else {
        res.end();
      }
    }
  };

  // Status endpoint reporting each of the 5 subject RAG API keys
  app.get("/api/rag/status", (req, res) => {
    const subjects: Record<SupportedSubject, { keyName: string; configured: boolean; ragDocs: number }> = {
      math: {
        keyName: "MATH_API_KEY",
        configured: !!process.env.MATH_API_KEY,
        ragDocs: SUBJECT_RAG_CORPUS.math.length
      },
      physics: {
        keyName: "PHYSICS_API_KEY",
        configured: !!process.env.PHYSICS_API_KEY,
        ragDocs: SUBJECT_RAG_CORPUS.physics.length
      },
      chemistry: {
        keyName: "CHEMISTRY_API_KEY",
        configured: !!process.env.CHEMISTRY_API_KEY,
        ragDocs: SUBJECT_RAG_CORPUS.chemistry.length
      },
      biology: {
        keyName: "BIOLOGY_API_KEY",
        configured: !!process.env.BIOLOGY_API_KEY,
        ragDocs: SUBJECT_RAG_CORPUS.biology.length
      },
      cs: {
        keyName: "CS_API_KEY",
        configured: !!process.env.CS_API_KEY,
        ragDocs: SUBJECT_RAG_CORPUS.cs.length
      }
    };
    res.json({
      baseConfigured: !!process.env.GEMINI_API_KEY,
      subjects
    });
  });

  // Dedicated Subject RAG Retrieval endpoint
  app.post("/api/rag/:subject", async (req, res) => {
    try {
      const rawSubject = req.params.subject;
      const subjectId = normalizeSubjectId(rawSubject);
      if (subjectId === "general") {
        return res.status(400).json({ error: "RAG is available for: math, physics, chemistry, biology, cs." });
      }

      const { query, socraticMode = true } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Missing query for subject RAG." });
      }

      const supported = subjectId as SupportedSubject;
      const keyInfo = getSubjectKeyInfo(supported);
      const retrievedDocs = retrieveSubjectRag(supported, query, 3);
      const ragPromptContext = formatRagContextForPrompt(supported, retrievedDocs);

      const client = getSubjectClient(supported);
      const systemInstruction = `${getSubjectSystemPrompt(supported, socraticMode)}\n\n${ragPromptContext}`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
          systemInstruction,
        }
      });

      res.json({
        subject: supported,
        ragKey: keyInfo.keyName,
        isDedicatedKey: keyInfo.isDedicated,
        retrievedDocs: retrievedDocs.map((d) => ({
          title: d.title,
          topic: d.topic,
          keyFormulas: d.keyFormulas
        })),
        text: response.text || ""
      });
    } catch (error: any) {
      console.error("Subject RAG Error:", error);
      res.status(500).json({ error: error.message || "Failed to process subject RAG query" });
    }
  });

  // API Routes for General & Dedicated Subjects
  app.post("/api/chat", (req, res) => handleChatRequest(req, res));
  app.post("/api/chat/:subject", (req, res) => handleChatRequest(req, res, req.params.subject));

  // Smart Notes PDF Extraction and Short Note Synthesis Endpoint
  app.post("/api/smart-notes/extract-pdf", async (req, res) => {
    try {
      const { base64, filename = "uploaded-document.pdf" } = req.body;

      if (!base64) {
        return res.status(400).json({ error: "Missing PDF base64 payload." });
      }

      // Clean base64 string
      const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
      const pdfBuffer = Buffer.from(cleanBase64, "base64");

      let extractedText = "";
      let pageCount = 1;

      try {
        const parser = new PDFParse({ data: pdfBuffer });
        const result = await parser.getText();
        extractedText = (result?.text || "").trim();
        pageCount = result?.total || result?.pages?.length || 1;
        await parser.destroy().catch(() => {});
      } catch (parseErr: any) {
        console.warn("pdf-parse extraction warning:", parseErr.message);
      }

      const cleanDocTitle = filename.replace(/\.[^/.]+$/, "");
      let shortNote = "";

      // If we got substantive text from pdf-parse, feed extracted text to Gemini
      if (extractedText.length >= 40) {
        const truncatedText = extractedText.slice(0, 45000);
        const prompt = `You are EduSwathi's Smart Notes Engine. A student uploaded a study PDF document named "${filename}" (${pageCount} page${pageCount > 1 ? "s" : ""}).

EXTRACTED TEXT FROM UPLOADED PDF:
"""
${truncatedText}
"""

Synthesize a high-yield, clear, and structured SHORT NOTE based exclusively on the information extracted above. Follow this clean, professional markdown format:

# 📘 ${cleanDocTitle} — Study Short Note

## 🎯 Executive Overview
A clear 2-3 sentence summary capturing the core premise and objective of this document.

## 🔑 Key Concepts & Definitions
- List and define the most crucial definitions, terms, or principles found in the text.

## ⚡ Core Formulas, Laws & Key Mechanics
- If the text contains scientific laws, equations, mathematical relations, or system rules, list each clearly with its variables and meaning.
- If purely conceptual or non-STEM, highlight the core structural arguments or rules.

## 📌 High-Yield Takeaways (Quick Revision)
- Concise bullet points of the top takeaways a student must remember for exams.

## 🧠 Active Recall Self-Test
1. **Question 1**: [Question based on the document]
   - *Key Answer*: [Concise answer]
2. **Question 2**: [Question based on the document]
   - *Key Answer*: [Concise answer]
3. **Question 3**: [Question based on the document]
   - *Key Answer*: [Concise answer]`;

        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              systemInstruction: "You are EduSwathi's precision academic synthesizer. Produce authoritative, scannable, high-yield study short notes from student-uploaded course materials."
            }
          });
          shortNote = response.text || "";
        } catch (genErr: any) {
          console.error("Gemini text generation failed, creating structured fallback note:", genErr.message);
          // Fallback note using the extracted text
          const lines = extractedText.split("\n").filter(l => l.trim().length > 0).slice(0, 8);
          shortNote = `# 📘 ${cleanDocTitle} — Extracted Summary Note\n\n## 🎯 Executive Overview\nExtracted content from ${filename} (${pageCount} pages).\n\n## 🔑 Key Highlights Extracted\n${lines.map(l => `- ${l.trim()}`).join("\n")}\n\n## 📌 Document Length\nTotal characters extracted: ${extractedText.length} characters across ${pageCount} pages.`;
        }
      } else {
        // Text in PDF was short/scanned, send inlineData directly to Gemini multimodal PDF reader
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: "application/pdf"
                }
              },
              {
                text: `You are EduSwathi's Smart Notes Engine. The student uploaded a PDF titled "${filename}".
1. Thoroughly read and extract the core knowledge, equations, concepts, and diagrams from this PDF.
2. Produce a clear, high-yield, structured SHORT NOTE in markdown covering:
- # 📘 ${cleanDocTitle} — Study Short Note
- ## 🎯 Executive Overview (2-3 sentences)
- ## 🔑 Key Concepts & Definitions
- ## ⚡ Core Formulas, Laws & Key Mechanics
- ## 📌 High-Yield Takeaways (Quick Revision)
- ## 🧠 Active Recall Self-Test (3 questions with concise answers)`
              }
            ],
            config: {
              systemInstruction: "You are EduSwathi's precision academic synthesizer. Read PDF documents accurately and produce high-yield, structured study notes."
            }
          });
          shortNote = response.text || "";
          if (!extractedText) {
            extractedText = `[Text directly read and synthesized by Gemini Multimodal PDF Engine from ${filename}]`;
          }
        } catch (pdfAiErr: any) {
          console.error("Gemini PDF vision error:", pdfAiErr.message);
          shortNote = `# 📘 ${cleanDocTitle} — Note\n\nCould not extract plain text or generate AI summary for this PDF: ${pdfAiErr.message}`;
        }
      }

      return res.json({
        success: true,
        filename,
        pageCount,
        extractedText,
        shortNote,
        charCount: extractedText.length
      });
    } catch (error: any) {
      console.error("PDF Extraction Endpoint Error:", error);
      return res.status(500).json({ error: error.message || "Failed to process PDF." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
