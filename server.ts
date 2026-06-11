import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client on server level
// Set 'User-Agent': 'aistudio-build' in httpOptions for telemetry.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI endpoints proxy
app.post("/api/gemini", async (req, res) => {
  const { type, prompt, extraData } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({
      error: "Missing GEMINI_API_KEY. Please configure it in Settings > Secrets."
    });
  }

  try {
    let systemInstruction = "You are a senior software engineering mentor and architect for high-level fullstack code assessment platforms.";
    let prefixPrompt = "";

    switch (type) {
      case "explain":
        systemInstruction = "You are a master developer. Explain the provided code fragment carefully in detail. Breakdown complexity, explain design patterns, line-by-line actions, and conceptual operations.";
        prefixPrompt = `Please explain this code snippet:\n\n${prompt}`;
        break;
      case "bug":
        systemInstruction = "You are a rigorous code inspector. Identify bugs, logical gaps, type safety breaches, vulnerability exploits, or resource leaks in the user's code. Provide concrete corrected lines.";
        prefixPrompt = `Identify and fix bugs in this code snippet. Present the rectified snippet clearly:\n\n${prompt}`;
        break;
      case "optimize":
        systemInstruction = "You are an extreme system performance analyst. Refactor code snippets to reduce time complexity and optimize memory layouts. Elaborate why the changes yield higher speeds.";
        prefixPrompt = `Optimize the following code snippet for maximum scale and write-speed:\n\n${prompt}`;
        break;
      case "database":
        systemInstruction = "You are a professional Relational SQL architect. Design highly normalized schemas (up to 3NF). Provide tables, fields, types, foreign constraints, primary indicators, and sample insert rows.";
        prefixPrompt = `Design a comprehensive relational database schema and ERD plan for: ${prompt}`;
        break;
      case "api":
        systemInstruction = "You are an API Integration Designer. Generate full mock REST/GraphQL API contracts, endpoint structures, query parameters, authorization guard scopes, JSON requests, and response bodies.";
        prefixPrompt = `Create a solid REST API specification and Express route layout for: ${prompt}`;
        break;
      case "uml":
        systemInstruction = "You are an enterprise software architect. Design premium, valid Mermaid.js diagrams representing software architectures, class interfaces, sequence flows, or dynamic lifecycles.";
        prefixPrompt = `Generate a beautiful Mermaid.js UML diagram representing: ${prompt}. Return the output with the mermaid code correctly bounded by \`\`\`mermaid ... \`\`\``;
        break;
      case "exam":
        systemInstruction = "You are an Academic Director in L4 Software Development. Generate high-quality multiple choice assessment pools, coding tasks, and analytical grade checks.";
        prefixPrompt = `Generate a customized 3-question MCQ quiz plus 1 intermediate practical challenge on the topic: ${prompt}. Include full correctness explanations.`;
        break;
      case "project":
        systemInstruction = "You are a technical hackathon leader. Prepare actionable full-scale custom developer project guides, complete with file hierarchies, technology choices, model outlines, and core algorithms.";
        prefixPrompt = `Draft an advanced project prototype architecture for: ${prompt}`;
        break;
      case "logbook":
        systemInstruction = "You are an Internship Coordinator. Draft detailed daily reflective logbook logs tracking development hours, specific tickets tackled (e.g. bug fixing, database seed scripts), tools mastered, and blocks cleared.";
        prefixPrompt = `Compile a realistic, highly technical, professional developer internship logbook sequence for: ${prompt}`;
        break;
      case "career":
        systemInstruction = "You are a Tech Career Mentor and Lead Interviewer. Help software developers mock-test systems, write clean CVs, prep behavioral summaries, or handle tough tech questions.";
        prefixPrompt = `Guide me on: ${prompt}. Present constructive feedback, mock answers, and professional resume layouts.`;
        break;
      default:
        prefixPrompt = prompt;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prefixPrompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    const textResult = response.text || "No response received from Gemini model.";
    res.json({ result: textResult });
  } catch (err: any) {
    console.error("Gemini server proxy error:", err);
    res.status(500).json({ error: err?.message || "Internal Server Error" });
  }
});

// Simulated Web Compiler Server Route Handler (to test mock/real lightweight requests)
app.all("/api/playground/test", (req, res) => {
  res.json({
    status: 200,
    headers: req.headers,
    method: req.method,
    query: req.query,
    body: req.body,
    message: "Playground API Live Reflected successfully! Connection established."
  });
});

async function startServer() {
  // Vite dev middleware for fluid live workspace editing
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
    console.log(`L4SWD Server running on http://localhost:${PORT}`);
  });
}

startServer();
