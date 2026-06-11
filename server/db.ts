import { MongoClient, Db } from "mongodb";
import fs from "fs";
import path from "path";

// Location of the persistent backup state file in case MongoDB is not connected yet
const FALLBACK_DB_PATH = path.join(process.cwd(), "db_fallback.json");

// Define basic interface structures for our document collections
export interface UserDocument {
  id: string;
  username: string; // Acts as email/username
  name: string;
  role: "student" | "teacher" | "admin";
  passwordHash: string;
  xp: number;
  streak: number;
  level: string;
  created_at: string;
}

export interface ExamDocument {
  id: string;
  title: string;
  course: string;
  durationMins: number; // e.g. 30
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    points?: number;
  }[];
  createdBy: string; // username of the teacher
  created_at: string;
}

export interface UserExamResultDocument {
  id: string;
  examId: string;
  userId: string;
  username: string;
  studentName: string;
  score: number; // percentage
  xpEarned: number;
  completed_at: string;
}

// In-memory local state cache
let usersLocalCache: UserDocument[] = [];
let examsLocalCache: ExamDocument[] = [];
let resultsLocalCache: UserExamResultDocument[] = [];

// Seed baseline default mock exams and initial users
function seedDefaultLocalCache() {
  usersLocalCache = [
    {
      id: "u_remmy",
      username: "toxic_coderkiller",
      name: "Remmy Nsanzimana",
      role: "student",
      passwordHash: "$2a$10$7vCbyx697y9W3Xg5z1O0E.q2sH6i2Pq8SgYtNuV0AteV1E6qZf6sS", // Hashed "password123"
      xp: 14250,
      streak: 27,
      level: "L4 Developer",
      created_at: new Date().toISOString()
    },
    {
      id: "u_eric",
      username: "teacher_eric",
      name: "Erick Mugisha",
      role: "teacher",
      passwordHash: "$2a$10$7vCbyx697y9W3Xg5z1O0E.q2sH6i2Pq8SgYtNuV0AteV1E6qZf6sS", // "password123"
      xp: 1800,
      streak: 5,
      level: "Coordinator L4",
      created_at: new Date().toISOString()
    }
  ];

  examsLocalCache = [
    {
      id: "exam_react_1",
      title: "React 19 Actions Paradigm Assessment",
      course: "React Development",
      durationMins: 15,
      createdBy: "teacher_eric",
      created_at: new Date().toISOString(),
      questions: [
        {
          question: "Which task block is processed with higher priority in the JavaScript event loop?",
          options: [
            "Macrotasks (setTimeout, setInterval)",
            "Microtasks (Promises.then, queueMicrotask)",
            "Both have equal priority",
            "General background assets downloading"
          ],
          correctIndex: 1,
          explanation: "Microtasks are always processed fully before the event loop yields to macrotasks or re-renders the DOM canvas."
        },
        {
          question: "In React 19, which hook can be used to monitor the pending status of an asynchronous action function?",
          options: [
            "useMemo",
            "useTransition",
            "useActionPending",
            "useDebugValue"
          ],
          correctIndex: 1,
          explanation: "The useTransition hook yields a 'isPending' boolean along with a 'startTransition' function to run asynchronous triggers with active pending flags."
        }
      ]
    },
    {
      id: "exam_java_1",
      title: "Java OOP Class Constructors Overloading Exam",
      course: "Java Software Engineering",
      durationMins: 20,
      createdBy: "teacher_eric",
      created_at: new Date().toISOString(),
      questions: [
        {
          question: "How does a Java subclass invoke the constructor of its immediate parent class?",
          options: [
            "By calling this() with appropriate arguments",
            "By using the 'super' keyword as a function call: super()",
            "By calling parent.constructor()",
            "Java classes do not inherit parent constructors"
          ],
          correctIndex: 1,
          explanation: "The super() constructor call must be the very first statement inside a child subclass constructor to trigger the parent constructor hierarchy."
        }
      ]
    }
  ];

  resultsLocalCache = [];
  saveLocalCacheToDisk();
}

// Persist the backup JSON state on the disk
function saveLocalCacheToDisk() {
  try {
    const backupObj = {
      users: usersLocalCache,
      exams: examsLocalCache,
      results: resultsLocalCache
    };
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(backupObj, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write database fallback state to disk:", err);
  }
}

// Load cached tables from disk
export function initLocalDiskDatabase() {
  if (fs.existsSync(FALLBACK_DB_PATH)) {
    try {
      const fileContent = fs.readFileSync(FALLBACK_DB_PATH, "utf-8");
      const parsed = JSON.parse(fileContent);
      usersLocalCache = parsed.users || [];
      examsLocalCache = parsed.exams || [];
      resultsLocalCache = parsed.results || [];
      console.log(`Fallback disk DB loaded successfully with: ${usersLocalCache.length} users, ${examsLocalCache.length} exams.`);
    } catch (err) {
      console.error("Corrupted database backup file. Reinjecting baseline seed...", err);
      seedDefaultLocalCache();
    }
  } else {
    seedDefaultLocalCache();
  }
}

// Initialize on start
initLocalDiskDatabase();


// --- MongoDB Atlas connection logic with lazy connection ---
let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let currentConnectionURI: string | null = null;

export async function getMongoDBConnection(customURI?: string): Promise<{ success: boolean; message: string; isRealMongo: boolean }> {
  // Use custom URI if passed (for test logins), otherwise read environment
  const testURI = customURI || process.env.MONGODB_URI;

  if (!testURI) {
    return {
      success: false,
      message: "No MONGODB_URI found. Utilizing high-efficiency server-side JSON file backup.",
      isRealMongo: false
    };
  }

  // If already connected with the same URI, avoid duplicating
  if (mongoDb && mongoClient && currentConnectionURI === testURI) {
    return { success: true, message: "Restored active MongoDB Atlas session.", isRealMongo: true };
  }

  try {
    console.log(`Lazy initiating MongoDB connection...`);
    // Connect to Atlas
    const client = new MongoClient(testURI, { 
      connectTimeoutMS: 8000, 
      serverSelectionTimeoutMS: 8000 
    });
    
    await client.connect();
    // Verify connection by pinging
    const database = client.db("l4swd_db");
    await database.command({ ping: 1 });
    
    mongoClient = client;
    mongoDb = database;
    currentConnectionURI = testURI;
    
    console.log("MongoDB Atlas connected successfully!");

    // Dynamically synchronize local cache tables into MongoDB Collections once connected!
    await syncAllCollectionsToAtlas();

    return { 
      success: true, 
      message: "Direct line to MongoDB Atlas established! Server synced.", 
      isRealMongo: true 
    };
  } catch (err: any) {
    console.error("MongoDB Connection Failed:", err);
    return { 
      success: false, 
      message: `Connection failed: ${err?.message || "Verify your connection credentials and IP whitelist."}`, 
      isRealMongo: false 
    };
  }
}

// Sync local server state JSON to/from MongoDB
async function syncAllCollectionsToAtlas() {
  if (!mongoDb) return;
  try {
    const usersColl = mongoDb.collection("users");
    const examsColl = mongoDb.collection("exams");
    const resultsColl = mongoDb.collection("results");

    // Load any users that are in Atlas but missing locally, and vice versa
    const atlasUsers = await usersColl.find({}).toArray();
    if (atlasUsers.length > 0) {
      // Merge: Add atlas users if not in local
      for (const aUser of atlasUsers) {
        if (!usersLocalCache.some(u => u.username === aUser.username)) {
          usersLocalCache.push({
            id: aUser.id || `u_${Date.now()}`,
            username: aUser.username,
            name: aUser.name,
            role: aUser.role,
            passwordHash: aUser.passwordHash,
            xp: aUser.xp || 0,
            streak: aUser.streak || 0,
            level: aUser.level || "L4 Student",
            created_at: aUser.created_at || new Date().toISOString()
          });
        }
      }
    }

    // Push local register entries that are missing on Atlas
    for (const localUser of usersLocalCache) {
      const match = await usersColl.findOne({ username: localUser.username });
      if (!match) {
        await usersColl.insertOne(localUser);
      } else {
        // Sync score / metrics to Atlas
        await usersColl.updateOne({ username: localUser.username }, { $set: { xp: localUser.xp, streak: localUser.streak } });
      }
    }

    // Direct sync for Exams
    const atlasExams = await examsColl.find({}).toArray();
    if (atlasExams.length > 0) {
      for (const aExam of atlasExams) {
        if (!examsLocalCache.some(e => e.id === aExam.id)) {
          examsLocalCache.push({
            id: aExam.id,
            title: aExam.title,
            course: aExam.course,
            durationMins: aExam.durationMins || 20,
            questions: aExam.questions || [],
            createdBy: aExam.createdBy,
            created_at: aExam.created_at || new Date().toISOString()
          });
        }
      }
    }

    for (const localExam of examsLocalCache) {
      const match = await examsColl.findOne({ id: localExam.id });
      if (!match) {
        await examsColl.insertOne(localExam);
      }
    }

    // Direct sync for results
    for (const resDoc of resultsLocalCache) {
      const match = await resultsColl.findOne({ id: resDoc.id });
      if (!match) {
        await resultsColl.insertOne(resDoc);
      }
    }

    saveLocalCacheToDisk();
    console.log("MongoDB Collections flawlessly synchronized with local cache database.");
  } catch (err) {
    console.error("Failed to sync schemas with MongoDB Atlas:", err);
  }
}

// Public API Operations for Users
export const dbUsers = {
  find: async (username: string): Promise<UserDocument | null> => {
    // Check Mongo first
    if (mongoDb) {
      try {
        const u = await mongoDb.collection("users").findOne({ username: username.toLowerCase().trim() });
        if (u) return u as any;
      } catch (err) {
        console.error("MongoDB read user error:", err);
      }
    }
    // Fallback to cache find
    const match = usersLocalCache.find(u => u.username.toLowerCase().trim() === username.toLowerCase().trim());
    return match || null;
  },

  create: async (user: UserDocument): Promise<UserDocument> => {
    user.username = user.username.toLowerCase().trim();
    // Add to cache
    usersLocalCache.push(user);
    saveLocalCacheToDisk();

    // Propagate to Atlas if connected
    if (mongoDb) {
      try {
        await mongoDb.collection("users").insertOne(user);
      } catch (err) {
        console.error("MongoDB insert user fail, kept locally:", err);
      }
    }
    return user;
  },

  updateStats: async (username: string, xp: number, streak?: number): Promise<void> => {
    const user = usersLocalCache.find(u => u.username.toLowerCase().trim() === username.toLowerCase().trim());
    if (user) {
      user.xp = xp;
      if (streak !== undefined) user.streak = streak;
      saveLocalCacheToDisk();
    }

    if (mongoDb) {
      try {
        await mongoDb.collection("users").updateOne(
          { username: username.toLowerCase().trim() },
          { $set: { xp, ...(streak !== undefined ? { streak } : {}) } }
        );
      } catch (err) {
        console.error("MongoDB stats update error:", err);
      }
    }
  },

  getAll: async (): Promise<UserDocument[]> => {
    if (mongoDb) {
      try {
        const res = await mongoDb.collection("users").find({}).toArray();
        if (res.length > 0) return res as any[];
      } catch (err) {
        console.error("Failed getting users from Mongo:", err);
      }
    }
    return usersLocalCache;
  }
};

// Public API Operations for Exams
export const dbExams = {
  getAll: async (): Promise<ExamDocument[]> => {
    if (mongoDb) {
      try {
        const res = await mongoDb.collection("exams").find({}).toArray();
        if (res.length > 0) return res as any[];
      } catch (err) {
        console.error("MongoDB exams fetch error:", err);
      }
    }
    return examsLocalCache;
  },

  create: async (exam: ExamDocument): Promise<ExamDocument> => {
    examsLocalCache.push(exam);
    saveLocalCacheToDisk();

    if (mongoDb) {
      try {
        await mongoDb.collection("exams").insertOne(exam);
      } catch (err) {
        console.error("MongoDB exam insert error:", err);
      }
    }
    return exam;
  }
};

// Public API Operations for Results Submit
export const dbResults = {
  getAllByStudent: async (username: string): Promise<UserExamResultDocument[]> => {
    if (mongoDb) {
      try {
        const res = await mongoDb.collection("results").find({ username: username.toLowerCase().trim() }).toArray();
        return res as any[];
      } catch (err) {
        console.error("MongoDB results retrieve error:", err);
      }
    }
    return resultsLocalCache.filter(r => r.username.toLowerCase().trim() === username.toLowerCase().trim());
  },

  getAll: async (): Promise<UserExamResultDocument[]> => {
    if (mongoDb) {
      try {
        const res = await mongoDb.collection("results").find({}).toArray();
        if (res.length > 0) return res as any[];
      } catch (err) {
        console.error("MongoDB error fetching results:", err);
      }
    }
    return resultsLocalCache;
  },

  create: async (resDoc: UserExamResultDocument): Promise<UserExamResultDocument> => {
    resultsLocalCache.push(resDoc);
    saveLocalCacheToDisk();

    if (mongoDb) {
      try {
        await mongoDb.collection("results").insertOne(resDoc);
      } catch (err) {
        console.error("MongoDB insert result error:", err);
      }
    }
    return resDoc;
  }
};
