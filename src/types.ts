export interface CourseModule {
  id: string;
  title: string;
  description: string;
  category: 'frontend' | 'backend' | 'devops' | 'design' | 'general';
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown formatted content
  duration: string;
  xpValue: number;
  quiz: QuizQuestion[];
  initialCode?: string;
  language?: 'javascript' | 'html' | 'java' | 'sql';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DeveloperProfile {
  name: string;
  nickname: string;
  level: string;
  role: string;
  avatarUrl: string;
  bio: string;
  skills: { name: string; level: number; category: string }[];
  projects: Project[];
  certificates: Certificate[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  screenshotUrl?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface StudentRank {
  rank: number;
  name: string;
  nickname: string;
  xp: number;
  streak: number;
  level: string;
  isCurrentUser?: boolean;
}

export interface ForumTopic {
  id: string;
  title: string;
  author: string;
  replies: number;
  views: number;
  tags: string[];
  content: string;
  repliesList: { author: string; content: string; time: string; authorRole?: string }[];
}

export const InitialDeveloperProfile: DeveloperProfile = {
  name: "Remmy Nsanzimana",
  nickname: "TOXIC CODERKILLER",
  level: "L4 Software Development (Term 3)",
  role: "Full-Stack Developer & System Designer",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
  bio: "Passionate software engineer focused on architectural excellence, rapid full-stack engineering, and AI automation systems. Living in the fast lane of code compile speeds.",
  skills: [
    { name: "Advanced ES6+ JavaScript", level: 95, category: "Language" },
    { name: "React (Vite, Hooks, Tailwind)", level: 90, category: "Frontend" },
    { name: "Node.js & Express.js API Design", level: 85, category: "Backend" },
    { name: "MongoDB & SQL Schema Architecture", level: 80, category: "Database" },
    { name: "Git Workflow & CI/CD", level: 90, category: "DevOps" },
    { name: "Software Design Patterns & UML", level: 85, category: "Architecture" }
  ],
  projects: [
    {
      id: "proj_1",
      title: "FocusGuard Dev Engine",
      description: "A secure sandboxed local developer shell that guards active focus time, blocks distracting app requests, and calculates deep-focus learning telemetry.",
      tags: ["React", "Custom Hook State", "TailwindCSS"],
      githubUrl: "https://github.com/toxic-coderkiller/focusguard-engine",
      liveUrl: "https://focusguard.dev"
    },
    {
      id: "proj_2",
      title: "OmniSchema ERD Builder",
      description: "An AI-guided schema visualizer that generates interactive Entity-Relationship Diagrams (ERDs) and SQL compilation queries from human descriptions.",
      tags: ["NextJS", "D3.js", "Gemini API"],
      githubUrl: "https://github.com/toxic-coderkiller/omnischema"
    }
  ],
  certificates: [
    {
      id: "cert_1",
      title: "Advanced Software Engineering Principles",
      issuer: "L4 Smart Learning Assessment Board",
      date: "May 2026",
      credentialId: "L4SE-90812-XYZ"
    },
    {
      id: "cert_2",
      title: "Full-Stack Developer Certification (Express & React)",
      issuer: "AI Studio Academy",
      date: "April 2026",
      credentialId: "AISA-7128-BC"
    }
  ]
};

export const SampleLeaderboard: StudentRank[] = [
  { rank: 1, name: "Remmy Nsanzimana", nickname: "TOXIC CODERKILLER", xp: 14250, streak: 27, level: "L4 Developer", isCurrentUser: true },
  { rank: 2, name: "Aline Uwase", nickname: "SHADOW_CODE", xp: 13840, streak: 14, level: "L4 Architect" },
  { rank: 3, name: "Patrick Ishimwe", nickname: "BYTE_CRUSHER", xp: 12100, streak: 20, level: "L4 Engineer" },
  { rank: 4, name: "Diana Keza", nickname: "CSS_QUEEN", xp: 11950, streak: 5, level: "L4 Frontend" },
  { rank: 5, name: "Eric Ndayisaba", nickname: "DEV_BEAST", xp: 10500, streak: 18, level: "L4 Backend" },
  { rank: 6, name: "Claude Manzi", nickname: "ZERO_BUG", xp: 9800, streak: 3, level: "L4 Student" }
];

export const SampleForumTopics: ForumTopic[] = [
  {
    id: "topic_1",
    title: "Understanding React 19 Use Transition and Action Hooks",
    author: "TOXIC CODERKILLER",
    replies: 4,
    views: 142,
    tags: ["React 19", "Hooks", "Frontend"],
    content: "With React 19 graduating to stable, the new Actions paradigm is massive. Let's discuss how we can leverage `useTransition` for handling pending forms asynchronously without manually setting loading flags.",
    repliesList: [
      { author: "Aline Uwase", authorRole: "Classmate", content: "Totally. It cleans up form handlers significantly. No more toggling state variables like setIsPending manually inside try/catch blocks.", time: "2 hours ago" },
      { author: "Erick Mugisha", authorRole: "Teacher", content: "Great point Remmy. Note that standard React 19 forms also accept functions directly into the action prop. This is a crucial concept that will appear in the Term 3 practical exam.", time: "1 hour ago" }
    ]
  },
  {
    id: "topic_2",
    title: "Best practices for architecting Express routers for multi-role user dashboards",
    author: "BYTE_CRUSHER",
    replies: 2,
    views: 89,
    tags: ["Express.js", "Security", "Backend"],
    content: "How are you guys separating Teacher, Student, and Parent endpoint permissions? Inside separate middleware files or dynamic roles?",
    repliesList: [
      { author: "TOXIC CODERKILLER", authorRole: "Full-Stack Developer", content: "Separate middleware is the cleanest approach. For example, a wrapper custom route guard `checkRole(['teacher', 'administrator'])` checks decoded JWT payloads.", time: "30 minutes ago" }
    ]
  }
];

export const CourseModulesList: CourseModule[] = [
  {
    id: "mod_js",
    title: "Advanced JavaScript & ES6+",
    description: "Deep dive into closures, prototypal inheritance, execution contexts, async sequences, generators, and reactive patterns.",
    category: "frontend",
    lessons: [
      {
        id: "js_1",
        title: "Asynchronous Code execution and Event Loop mechanics",
        duration: "25 mins",
        xpValue: 150,
        content: `### The Async Event Loop Mechanics

In Term 3 of your L4 Software Engineering course, understanding asynchronous Javascript is paramount. JavaScript is a single-threaded language, but it achieves high concurrent execution through the **Event Loop**.

#### Microtasks vs Macrotasks
- **Microtasks**: Handles Promise callbacks (\`then\`, \`catch\`, \`finally\`), \`queueMicrotask\`, and \`MutationObserver\`. Microtasks have absolute priority over macrotasks and are drained fully before the page re-renders.
- **Macrotasks**: Includes \`setTimeout\`, \`setInterval\`, UI rendering, and network trigger callbacks.

\`\`\`javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output Sequence: 1, 4, 3, 2
\`\`\`
`,
        initialCode: `// Modify this playground script to demonstrate microtask priority
console.log("Starting script...");

setTimeout(() => {
  console.log("Macrotask: setTimeout executed");
}, 0);

Promise.resolve().then(() => {
  console.log("Microtask: Custom promise resolved!");
});

console.log("Ending script...");
`,
        language: "javascript",
        quiz: [
          {
            question: "Which task block is processed with higher priority in the event loop?",
            options: [
              "Macrotasks (e.g. setTimeout, setInterval)",
              "Microtasks (e.g. Promises.then, queueMicrotask)",
              "Both have equal priority",
              "External HTTP Fetch events"
            ],
            correctIndex: 1,
            explanation: "Microtasks are always drained fully before the event loop advances to process another macrotask or triggers a DOM render."
          }
        ]
      }
    ]
  },
  {
    id: "mod_react",
    title: "React Development (Vite & Tailwind)",
    description: "Component design, custom state hooks, dependency trees, performance memoization, and custom UI framework creation.",
    category: "frontend",
    lessons: [
      {
        id: "react_1",
        title: "Creating Fluid Custom Hooks for Productivity Apps",
        duration: "30 mins",
        xpValue: 180,
        content: `### Fluid Custom Hooks in React

A crucial practice in modern React design is encapsulating custom logic (like timers, geolocation state, and system triggers) inside fully interactive custom hooks.

Let's dissect a reactive custom **Timer Hook** that supports start, stop, pause, and countdown states. We use high-precision interval functions protected by React's \`useEffect\` layout bounds.

#### Example Architecture
\`\`\`typescript
import { useState, useEffect, useRef } from "react";

export function useDeepTimer(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Avoid stale states and clear intervals appropriately
  ...
}
\`\`\`
`,
        initialCode: `// Write a simple custom tick hook simulator in pure JavaScript here!
function simulateTimer(totalSeconds) {
  let count = totalSeconds;
  console.log("Focus session begun, seconds: " + count);
  
  const timerId = setInterval(() => {
    count--;
    console.log("Focus Timer Ticking: " + count + "s remaining");
    if (count <= 0) {
      clearInterval(timerId);
      console.log("Focus Timer Completed!");
    }
  }, 1000);
}

simulateTimer(5);
`,
        language: "javascript",
        quiz: [
          {
            question: "What is the primary benefit of storing standard intervals inside a React useRef variable rather than a standard component let variable?",
            options: [
              "useRef variables cause the component to trigger immediate visual re-renders",
              "useRef values persist across full component render cycles without resetting",
              "useRef values cannot be modified during execution",
              "useRef values are automatically synchronized with database collections"
            ],
            correctIndex: 1,
            explanation: "useRef stores values that survive multiple browser re-renders without re-initializing, making it the perfect choice to reference timers, intervals, and local socket links."
          }
        ]
      }
    ]
  },
  {
    id: "mod_node",
    title: "Node.js & Express API Backend",
    description: "Create scalable backends, routing, dynamic middleware design, JWT auth, input validation, and secure RESTful systems.",
    category: "backend",
    lessons: [
      {
        id: "node_1",
        title: "API Routing Architecture & Authorization Headers",
        duration: "35 mins",
        xpValue: 200,
        content: `### API Architecture & Endpoint Security

Building modern microservices with Node and Express requires strict architectural patterns to process incoming requests securely and return precise structural JSON bodies.

#### Middleware Sequences in Express
1. **JSON Parser Middleware**: Parses incoming payloads using \`express.json()\`.
2. **Auth Header Guards**: Scans headers for \`Authorization: Bearer <JWT>\`.
3. **Route Handlers**: Directs sanitised payloads to core system controllers.

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/api/secure-profile', (req, res) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    res.json({ status: 'Authorized', secretPayload: 'L4_EXAM_PREP_V1' });
  } else {
    res.sendStatus(403);
  }
});
\`\`\`
`,
        initialCode: `// Mock an Express Request-Response payload stream
const req = {
  headers: {
    authorization: "Bearer EXAM_TOKEN_SECRET"
  }
};

const authHeader = req.headers.authorization;
if (authHeader && authHeader.startsWith("Bearer ")) {
  const token = authHeader.split(" ")[1];
  console.log("Token Extracted Successfully: " + token);
} else {
  console.log("Unauthorized: Missing Bearer Token");
}
`,
        language: "javascript",
        quiz: [
          {
            question: "In Express.js, what is the role of the next() call inside a custom authorization middleware function?",
            options: [
              "It directly closes the HTTP connection and releases raw socket listeners",
              "It commands Express to execute the next middleware or request handler in the stack chain",
              "It performs a redirect to the home screen route",
              "It logs security incidents to database tables"
            ],
            correctIndex: 1,
            explanation: "Calling next() tells Express to hand over processing to the subsequent middleware or controller action. If omitted, the request hangs permanently."
          }
        ]
      }
    ]
  },
  {
    id: "mod_java",
    title: "Java Object-Oriented Programming (OOPS)",
    description: "Classes, objects, structural inheritance, abstract definitions, polymorphism, interfaces, and exception processing in Java.",
    category: "backend",
    lessons: [
      {
        id: "java_1",
        title: "Polymorphism & Constructor Chains in Java",
        duration: "30 mins",
        xpValue: 180,
        content: `### Polymorphism & Inherited Java Systems

Java is a strongly-typed Object-Oriented Programming language. A critical L4 objective is master OOP concepts, particularly **Polymorphism** and **Abstract Overloading**.

#### Key Concept Blueprint:
- **Polymorphism**: The ability of an object to take on many forms. This occurs when a parent class reference is used to refer to a child class object.
- **Constructor Chaining**: Triggering parent constructors hierarchically via Java's \`super()\` statement.

\`\`\`java
public class Developer {
    String name;
    public Developer(String name) {
        this.name = name;
    }
    public void writeCode() {
        System.out.println(name + " edits general system files.");
    }
}

public class FullStackDeveloper extends Developer {
    public FullStackDeveloper(String name) {
        super(name);
    }
    @Override
    public void writeCode() {
        System.out.println(name + " compiles robust TypeScript and SQL.");
    }
}
\`\`\`
`,
        initialCode: `// Java Simulation: Try designing an overloaded constructor logic!
class CodeCompiler {
    public void run() {
        System.out.println("Compiling default configuration...");
    }
    // Implement an overloaded 'run' method that accept files count!
}
`,
        language: "java",
        quiz: [
          {
            question: "In Java, what is the key difference between Method Overloading and Method Overriding?",
            options: [
              "Overloading occurs when two methods have identical signatures and return types in separate projects",
              "Overriding represents runtime dynamic polymorphism within inheritance hierarchies, while Overloading is compile-time resolution with different parameter blueprints",
              "Java only supports Overloading for numbers and numerical structures",
              "Overriding restricts access modifiers to Private exclusively"
            ],
            correctIndex: 1,
            explanation: "Method Overriding allows a subclass to provide a specific implementation of a method that is already defined by its parent class at runtime. Overloading is when multiple methods have the same name but different argument parameters."
          }
        ]
      }
    ]
  },
  {
    id: "mod_db",
    title: "Relational SQL Data Schemas",
    description: "Designing Entity-Relationship structures, normalizations, relational join techniques, aggregate math, indexing strategies.",
    category: "backend",
    lessons: [
      {
        id: "sql_1",
        title: "Relational Queries, SELECT Joins, and Index Optimizers",
        duration: "25 mins",
        xpValue: 150,
        content: `### Relational Database Engineering (SQL)

Term 3 engineers must write efficient, high-performance structured database queries. Let's study how **INNER JOIN** and **LEFT JOIN** combine attributes from related tables.

#### Database Tables Schema Overview
Suppose we have a **Students** table and an **Assignments** table, linked together on \`student_id\`.

\`\`\`sql
-- Retreive student portfolios joined with scores
SELECT s.name, a.title, a.score
FROM Students s
INNER JOIN Assignments a ON s.student_id = a.student_id
WHERE a.score >= 80;
\`\`\`
`,
        initialCode: `-- SQL Playground Compiler Sandbox
-- Run or edit SQL selection statements
SELECT name, level, score FROM student_records 
JOIN gradebooks ON student_records.auth_id = gradebooks.student_id
WHERE score >= 85;
`,
        language: "sql",
        quiz: [
          {
            question: "Which of the following describes the key function of SQL indexes?",
            options: [
              "They securely encrypt columns with high-security pass-phrases",
              "They dramatically speed up the retrieval rate of rows from table structures by providing lookup binary trees",
              "They make databases auto-generate relational foreign primary key indices",
              "They enforce zero NULL validation parameters automatically"
            ],
            correctIndex: 1,
            explanation: "Indexes speed up data queries by indexing columns (often into B-Trees), preventing the database engine from having to perform slow, full-table scans of entire datasets."
          }
        ]
      }
    ]
  }
];

export interface AssignmentRecord {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  marks: number | null; // null if unsubmitted
  status: 'pending' | 'submitted' | 'graded';
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'excused';
}

export const MockAssignmentRecords: AssignmentRecord[] = [
  { id: "a_1", title: "React State Management Project", course: "React Development", dueDate: "2026-06-18", marks: 95, status: 'graded' },
  { id: "a_2", title: "Express REST Endpoints Middleware Guard", course: "Node.js Backend", dueDate: "2026-06-25", marks: null, status: 'pending' },
  { id: "a_3", title: "SQL Schema Design & Normalization Exam", course: "MongoDB & Relational Database", dueDate: "2026-06-12", marks: 88, status: 'graded' },
  { id: "a_4", title: "Java OOP Overriding and Inheritance lab", course: "Java Software Engineering", dueDate: "2026-06-30", marks: null, status: 'pending' }
];

export const MockAttendanceRecords: AttendanceRecord[] = [
  { date: "2026-06-05", status: "present" },
  { date: "2026-06-06", status: "present" },
  { date: "2026-06-08", status: "present" },
  { date: "2026-06-09", status: "present" },
  { date: "2026-06-10", status: "present" },
  { date: "2026-06-11", status: "present" }
];
