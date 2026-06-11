import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { dbUsers, dbExams, dbResults, getMongoDBConnection } from "./server/db";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Signing Secret for JSON Web Tokens
const JWT_SECRET = process.env.JWT_SECRET || "l4swd_jwt_secret_parameters_256_bit_2026";

// On server launch, attempt automatic connection to MongoDB Atlas if connection URI exists in environment variables
(async () => {
  const result = await getMongoDBConnection();
  console.log(`Database initialization: ${result.message} (Real MongoDB: ${result.isRealMongo})`);
})();

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

// --- DATABASE DIAGNOSTICS & MANUAL ATLAS CONNECT ENGINES ---
app.get("/api/database/status", async (req, res) => {
  const result = await getMongoDBConnection();
  res.json({
    connected: result.isRealMongo,
    message: result.message,
    mongoUriConfigured: !!process.env.MONGODB_URI
  });
});

app.post("/api/database/connect", async (req, res) => {
  const { mongodbUri } = req.body;
  if (!mongodbUri) {
    return res.status(400).json({ error: "Please specify a valid MongoDB Atlas connection URI." });
  }

  const result = await getMongoDBConnection(mongodbUri);
  if (result.success) {
    res.json({ success: true, message: result.message });
  } else {
    res.status(400).json({ success: false, error: result.message });
  }
});

// --- JWT AUTHENTICATION MIDDLEWARE GUARD ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. Bearer validation token is missing." });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Session expired or signature is invalid." });
    }
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ENDPOINTS (JWT) ---
app.post("/api/auth/register", async (req, res) => {
  const { username, name, password, role } = req.body;

  if (!username || !name || !password || !role) {
    return res.status(400).json({ error: "All registration attributes (username, name, password, role) are required." });
  }

  try {
    const existing = await dbUsers.find(username);
    if (existing) {
      return res.status(409).json({ error: "A registration record with this username already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = `u_${Date.now()}`;
    const newUser = await dbUsers.create({
      id,
      username,
      name,
      role: role.toLowerCase() as any,
      passwordHash,
      xp: 150, // Initial beginner award XP
      streak: 1,
      level: role.toLowerCase() === "teacher" ? "Faculty Teacher" : "L4 Student",
      created_at: new Date().toISOString()
    });

    // Create secure JWT payload and token signature
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, name: newUser.name, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
        xp: newUser.xp,
        streak: newUser.streak,
        level: newUser.level
      }
    });
  } catch (err: any) {
    console.error("User registration crash:", err);
    res.status(500).json({ error: err?.message || "Internal registration failure." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password specifications are required." });
  }

  try {
    const user = await dbUsers.find(username);
    if (!user) {
      return res.status(401).json({ error: "Incorrect credentials." });
    }

    const correctMatch = await bcrypt.compare(password, user.passwordHash);
    if (!correctMatch) {
      return res.status(401).json({ error: "Incorrect credentials." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
        level: user.level
      }
    });
  } catch (err: any) {
    console.error("User login crash:", err);
    res.status(500).json({ error: err?.message || "Internal validation checkpoint error." });
  }
});

app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
  try {
    const user = await dbUsers.find(req.user.username);
    if (!user) {
      return res.status(404).json({ error: "User profile record not found." });
    }
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      xp: user.xp,
      streak: user.streak,
      level: user.level
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed restoring authenticated profile session parameters." });
  }
});

// --- SAVING USERS & EXAMS API ENDPOINTS ---
app.get("/api/exams", async (req, res) => {
  try {
    const list = await dbExams.getAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed querying exams storage partition." });
  }
});

app.post("/api/exams", authenticateToken, async (req: any, res) => {
  const { title, course, durationMins, questions } = req.body;

  if (!title || !course || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Exam title, course specification, and complete questions matrix are required." });
  }

  if (req.user.role !== "teacher" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Only authorized teacher credentials can register active exams." });
  }

  try {
    const newExam = await dbExams.create({
      id: `exam_${Date.now()}`,
      title,
      course,
      durationMins: parseInt(durationMins) || 20,
      questions,
      createdBy: req.user.name,
      created_at: new Date().toISOString()
    });
    res.json(newExam);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed saving exam to database collection." });
  }
});

app.post("/api/exams/submit", authenticateToken, async (req: any, res) => {
  const { examId, score, xpEarned } = req.body;

  if (!examId || score === undefined || !xpEarned) {
    return res.status(400).json({ error: "Submission parameters (examId, score, xpEarned) are incomplete." });
  }

  try {
    const user = await dbUsers.find(req.user.username);
    if (!user) {
      return res.status(404).json({ error: "Participant profile not found." });
    }

    const resultDoc = await dbResults.create({
      id: `res_${Date.now()}`,
      examId,
      userId: req.user.id,
      username: req.user.username,
      studentName: req.user.name,
      score: parseFloat(score),
      xpEarned: parseInt(xpEarned),
      completed_at: new Date().toISOString()
    });

    // Award XP directly inside MongoDB / persistent local disk store
    const newXpTotal = user.xp + parseInt(xpEarned);
    await dbUsers.updateStats(req.user.username, newXpTotal, user.streak + 1);

    res.json({
      success: true,
      result: resultDoc,
      newXpTotal
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed committing assessment results." });
  }
});

app.get("/api/exams/results", authenticateToken, async (req: any, res) => {
  try {
    // Teachers and admins get all results. Students only get their own results
    if (req.user.role === "teacher" || req.user.role === "admin") {
      const allResults = await dbResults.getAll();
      res.json(allResults);
    } else {
      const userResults = await dbResults.getAllByStudent(req.user.username);
      res.json(userResults);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed resolving student results." });
  }
});

app.get("/api/users/leaderboard", async (req, res) => {
  try {
    const users = await dbUsers.getAll();
    const formatted = users.map((u, index) => ({
      rank: index + 1, // we'll sort them first
      name: u.name,
      nickname: u.username,
      xp: u.xp,
      streak: u.streak,
      level: u.level
    }))
    .sort((a, b) => b.xp - a.xp)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed resolving leaderboard metrics." });
  }
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
