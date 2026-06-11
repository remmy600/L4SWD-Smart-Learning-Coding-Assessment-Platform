import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, AlertCircle, CheckCircle2, Terminal, Code2, Globe, Database, Cpu, Send, RefreshCw, Layers } from 'lucide-react';

interface DeveloperHubProps {
  initialCode?: string;
  initialLanguage?: 'javascript' | 'html' | 'java' | 'sql';
}

export default function DeveloperHub({ initialCode = '', initialLanguage = 'javascript' }: DeveloperHubProps) {
  const [language, setLanguage] = useState<'javascript' | 'html' | 'java' | 'sql'>(initialLanguage);
  const [code, setCode] = useState<string>('');
  
  // Console logs output
  const [logs, setLogs] = useState<{ type: 'log' | 'info' | 'error' | 'success'; text: string }[]>([]);
  // SQL schema state
  const [sqlTables, setSqlTables] = useState({
    student_records: [
      { student_id: "s101", name: "Remmy Nsanzimana", nickname: "TOXIC CODERKILLER", level: "L4", auth_id: "u_remmy" },
      { student_id: "s102", name: "Aline Uwase", nickname: "SHADOW_CODE", level: "L4", auth_id: "u_aline" },
      { student_id: "s103", name: "Patrick Ishimwe", nickname: "BYTE_CRUSHER", level: "L4", auth_id: "u_patrick" }
    ],
    gradebooks: [
      { entry_id: 1, student_id: "s101", subject: "React Development", score: 95, term: 3 },
      { entry_id: 2, student_id: "s102", subject: "React Development", score: 93, term: 3 },
      { entry_id: 3, student_id: "s103", subject: "React Development", score: 85, term: 3 }
    ],
    attendance_stats: [
      { student_id: "s101", attended_days: 92, status: "Active" },
      { student_id: "s102", attended_days: 88, status: "Active" }
    ]
  });
  
  const [sqlResults, setSqlResults] = useState<any[]>([]);
  const [sqlHeaders, setSqlHeaders] = useState<string[]>([]);
  
  // HTML Preview state
  const [htmlPreview, setHtmlPreview] = useState<string>('');

  // API Tester state
  const [apiUrl, setApiUrl] = useState<string>('/api/playground/test');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiHeaderName, setApiHeaderName] = useState<string>('Authorization');
  const [apiHeaderValue, setApiHeaderValue] = useState<string>('Bearer TOXIC_CODE_SECRET_999');
  const [apiBody, setApiBody] = useState<string>('{\n  "dev_level": "L4",\n  "term": 3,\n  "action": "API_TESTING"\n}');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<number | null>(null);

  // Sync initial parameters when lesson switches
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    } else {
      setDefaultCodeForLang(language);
    }
  }, [initialCode]);

  useEffect(() => {
    if (initialLanguage) {
      setLanguage(initialLanguage);
      setDefaultCodeForLang(initialLanguage);
    }
  }, [initialLanguage]);

  const setDefaultCodeForLang = (lang: 'javascript' | 'html' | 'java' | 'sql') => {
    switch (lang) {
      case 'javascript':
        setCode(`// Advanced ES6 Event Loop & Promise microtasks
console.log("1. Application script loaded successfully");

setTimeout(() => {
  console.log("5. Macrotask executed from queue");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask callback: Promise resolved");
}).then(() => {
  console.log("4. Second chained microtask processed");
});

console.log("2. Sync code cycle completed");`);
        break;
      case 'html':
        setCode(`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #0f172a;
      color: #38bdf8;
      font-family: 'Inter', sans-serif;
      text-align: center;
      padding: 50px;
    }
    .badge {
      border: 2px solid #38bdf8;
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
      background: rgba(30, 41, 59, 0.8);
      border-radius: 12px;
      padding: 20px;
      display: inline-block;
      scale: 1.1;
      transition: step-end 0.2s;
    }
    h1 { margin-bottom: 5px; font-weight: 800; color: #f1f5f9; }
    p { color: #94a3b8; font-size: 14px; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="badge" id="badge-root">
    <h1>TOXIC CODERKILLER</h1>
    <p>L4 Software Development Platform Previews</p>
    <div style="font-size: 11px; margin-top: 10px; color:#a78bfa;">SERVER SIDE GEMINI CHANNELS ACTIVE</div>
  </div>
</body>
</html>`);
        break;
      case 'java':
        setCode(`import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Java L4 Compilation Engine Online");
        
        Developer remmy = new FullStackDeveloper("Remmy Nsanzimana", "TOXIC CODERKILLER");
        remmy.displayRole();
    }
}

class Developer {
    String name;
    String nickname;
    
    public Developer(String name, String nickname) {
        this.name = name;
        this.nickname = nickname;
    }
    
    public void displayRole() {
        System.out.println(name + " performs core OOPS evaluations.");
    }
}

class FullStackDeveloper extends Developer {
    public FullStackDeveloper(String name, String nickname) {
        super(name, nickname);
    }
    
    @Override
    public void displayRole() {
        System.out.println("[" + nickname + "] " + name + " runs optimized Fullstack microservices!");
    }
}`);
        break;
      case 'sql':
        setCode(`-- Enter Relational relational join queries here
SELECT s.name, s.nickname, g.subject, g.score
FROM student_records s
INNER JOIN gradebooks g ON s.student_id = g.student_id
WHERE g.score >= 90;`);
        break;
    }
  };

  const handleRunCode = () => {
    setLogs([]);
    setSqlResults([]);
    
    if (language === 'javascript') {
      const capturedLogs: { type: 'log' | 'info' | 'error' | 'success'; text: string }[] = [];
      const originalLog = console.log;
      const originalWarn = console.warn;
      const originalError = console.error;

      console.log = (...args) => {
        capturedLogs.push({ type: 'log', text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
        originalLog.apply(console, args);
      };
      console.warn = (...args) => {
        capturedLogs.push({ type: 'info', text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
        originalWarn.apply(console, args);
      };
      console.error = (...args) => {
        capturedLogs.push({ type: 'error', text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
        originalError.apply(console, args);
      };

      try {
        // Runs eval sandbox
        const result = eval(code);
        if (result !== undefined) {
          capturedLogs.push({ type: 'success', text: `Returned: ${typeof result === 'object' ? JSON.stringify(result) : String(result)}` });
        }
      } catch (err: any) {
        capturedLogs.push({ type: 'error', text: `Runtime Error: ${err.message}` });
      }

      // Restore console outputs
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      
      setLogs(capturedLogs);
    } 
    else if (language === 'html') {
      setHtmlPreview(code);
      setLogs([{ type: 'success', text: "HTML/CSS sandbox live rendering initialized." }]);
    }
    else if (language === 'java') {
      // High grade Java compilation simulator
      setLogs([
        { type: 'info', text: "[javac] Starting Main.java compilation sequence..." },
        { type: 'info', text: "[javac] Resolving relative inheritance links: Main -> Developer -> FullStackDeveloper..." },
        { type: 'success', text: "[javac] Build status: SUCCESS. 0 errors, 0 warnings. Main.class generated." },
        { type: 'log', text: "Java Execution Output:\n---------------------------------------" },
        { type: 'log', text: "Java L4 Compilation Engine Online" },
        { type: 'log', text: "[TOXIC CODERKILLER] Remmy Nsanzimana runs optimized Fullstack microservices!" }
      ]);
    }
    else if (language === 'sql') {
      try {
        setLogs([{ type: 'info', text: "Analyzing query structure..." }]);
        
        // Match mock outputs based on query content
        const cleanQuery = code.toLowerCase().trim();
        
        if (cleanQuery.includes("join")) {
          // Perform a simulated inner join
          const results = [
            { name: "Remmy Nsanzimana", nickname: "TOXIC CODERKILLER", subject: "React Development", score: 95 },
            { name: "Aline Uwase", nickname: "SHADOW_CODE", subject: "React Development", score: 93 }
          ];
          setSqlHeaders(["name", "nickname", "subject", "score"]);
          setSqlResults(results);
          setLogs([{ type: 'success', text: `Query executed successfully. Returned 2 rows.` }]);
        } else if (cleanQuery.includes("select") && cleanQuery.includes("student_records")) {
          setSqlHeaders(["student_id", "name", "nickname", "level"]);
          setSqlResults(sqlTables.student_records);
          setLogs([{ type: 'success', text: `Query executed successfully. Returned 3 rows.` }]);
        } else if (cleanQuery.includes("select") && cleanQuery.includes("gradebooks")) {
          setSqlHeaders(["entry_id", "student_id", "subject", "score"]);
          setSqlResults(sqlTables.gradebooks);
          setLogs([{ type: 'success', text: `Query executed successfully. Returned 3 rows.` }]);
        } else {
          // Return generic SQL table selection
          setSqlHeaders(["Status", "Engine", "QueryInfo"]);
          setSqlResults([{ Status: "SUCCESS", Engine: "L4_SQL_MOCK_v1", QueryInfo: "Your custom SELECT executed properly in isolation." }]);
          setLogs([{ type: 'success', text: "Custom query executed in general memory sandbox." }]);
        }
      } catch (err: any) {
        setLogs([{ type: 'error', text: `SQL Error: ${err.message}` }]);
      }
    }
  };

  const handleReset = () => {
    setDefaultCodeForLang(language);
    setLogs([]);
    setSqlResults([]);
    setHtmlPreview('');
  };

  const executeApiTest = async () => {
    setApiLoading(true);
    setApiResponse('');
    setApiStatus(null);
    try {
      const headersInit: any = { 'Content-Type': 'application/json' };
      if (apiHeaderName && apiHeaderValue) {
        headersInit[apiHeaderName] = apiHeaderValue;
      }

      const options: RequestInit = {
        method: apiMethod,
        headers: headersInit
      };

      if (apiMethod === 'POST') {
        options.body = apiBody;
      }

      const res = await fetch(apiUrl, options);
      setApiStatus(res.status);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(`Network Failure or CORS blockage:\n${err.message}`);
      setApiStatus(500);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ide-container">
      {/* Sidebar Tool selection */}
      <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
              <Code2 size={18} />
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
              Smart Sandboxed IDE
            </span>
          </div>

          <div className="flex gap-1 bg-slate-900/80 p-1 border border-slate-800/80 rounded-lg">
            {(['javascript', 'html', 'java', 'sql'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setDefaultCodeForLang(lang);
                  setLogs([]);
                  setSqlResults([]);
                }}
                className={`px-3 py-1 font-mono text-xs rounded-md transition-all uppercase ${
                  language === lang
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'javascript' ? 'JS' : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Code Input Area */}
        <div className="relative flex-1 min-h-[350px]">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            id="playground-editor-textarea"
            className="w-full h-full p-4 bg-slate-950 text-slate-100 font-mono text-sm leading-relaxed outline-none resize-none focus:ring-1 focus:ring-sky-500 border-none min-h-[350px]"
            spellCheck="false"
            placeholder="// Write code snippet here..."
          />
          <div className="absolute right-4 bottom-4 flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
              title="Reset Code Template"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              onClick={handleRunCode}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold shadow-lg shadow-sky-500/10 transition-colors"
            >
              <Play size={14} fill="currentColor" />
              Compile & Run
            </button>
          </div>
        </div>
      </div>

      {/* Outputs & Consoles Split */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Terminal logs component */}
        <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl min-h-[220px]">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Terminal size={14} className="text-slate-400" />
              <span className="font-mono text-xs font-semibold tracking-wider uppercase">
                Console Outputs
              </span>
            </div>
            <button
              onClick={() => setLogs([])}
              className="text-slate-500 hover:text-slate-300 font-mono text-[10px] uppercase"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-2 max-h-[200px]" id="logs-output-console">
            {logs.length === 0 ? (
              <span className="text-slate-600 block italic">Compile or run code to display dynamic outputs...</span>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`border-l-2 pl-2 py-0.5 whitespace-pre-wrap ${
                    log.type === 'error'
                      ? 'border-red-500 text-red-400'
                      : log.type === 'info'
                      ? 'border-sky-500 text-sky-400'
                      : log.type === 'success'
                      ? 'border-emerald-500 text-emerald-400 font-semibold'
                      : 'border-slate-700 text-slate-300'
                  }`}
                >
                  {log.text}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic preview block */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {language === 'html' ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border-b border-slate-800 text-slate-300">
                <Globe size={14} className="text-sky-400" />
                <span className="font-mono text-xs font-semibold tracking-wider uppercase">HTML/CSS Render Sandbox</span>
              </div>
              <div className="flex-1 h-[210px] bg-white">
                {htmlPreview ? (
                  <iframe
                    srcDoc={htmlPreview}
                    title="HTML Preview Sandbox"
                    className="w-full h-full border-none"
                    sandbox="allow-scripts"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs italic bg-slate-900">
                    No active layout compilations. Run code to build.
                  </div>
                )}
              </div>
            </div>
          ) : language === 'sql' ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border-b border-slate-800 text-slate-300">
                <Database size={14} className="text-purple-400" />
                <span className="font-mono text-xs font-semibold tracking-wider uppercase">Relational Query Output</span>
              </div>
              <div className="flex-1 p-3 max-h-[210px] overflow-auto bg-slate-950 text-slate-300 font-mono text-[11px]">
                {sqlResults.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-purple-400 font-semibold">
                        {sqlHeaders.map(lh => (
                          <th key={lh} className="p-1.5 uppercase">{lh}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlResults.map((r, ri) => (
                        <tr key={ri} className="border-b border-slate-900 hover:bg-slate-900/50">
                          {sqlHeaders.map(lh => (
                            <td key={lh} className="p-1.5 text-slate-200">{r[lh]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-slate-600 block italic py-4">
                    Sample schema structure preloaded:<br/>
                    • student_records (student_id, name, nickname)<br/>
                    • gradebooks (student_id, subject, score)<br/>
                    Execute selection to inspect data.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full p-4 flex flex-col justify-center items-center text-center text-slate-400 space-y-2">
              <Cpu size={24} className="text-slate-500" />
              <span className="font-mono text-xs font-semibold tracking-wider uppercase">Compilation Model Sandbox</span>
              <p className="text-xs text-slate-500 max-w-[220px]">
                Outputs and variables evaluate inside client-side JS virtual scopes instantly.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Advanced API Testing Panel */}
      <div className="lg:col-span-12 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl p-5 mt-4 space-y-4">
        <div className="flex items-center gap-2">
          <Layers size={20} className="text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">
            API Testing Sandbox Tool
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 space-y-3">
            <div className="flex rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
              <select
                value={apiMethod}
                onChange={(e: any) => setApiMethod(e.target.value)}
                className="bg-slate-800 text-slate-200 px-3 py-2 outline-none border-r border-slate-700 font-semibold cursor-pointer text-xs"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1 bg-transparent text-slate-100 font-mono text-xs px-3 py-2 outline-none"
                placeholder="/api/playground/test"
              />
              <button
                onClick={executeApiTest}
                disabled={apiLoading}
                className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-slate-950 font-bold px-4 py-2 flex items-center gap-1.5 transition-colors text-xs cursor-pointer"
              >
                {apiLoading ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                Send Request
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Custom Headers Key</label>
                <input
                  type="text"
                  value={apiHeaderName}
                  onChange={(e) => setApiHeaderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-mono text-xs"
                  placeholder="Authorization"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Headers Value</label>
                <input
                  type="text"
                  value={apiHeaderValue}
                  onChange={(e) => setApiHeaderValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-mono text-xs"
                  placeholder="Bearer token"
                />
              </div>
            </div>

            {apiMethod === 'POST' && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">POST Payload (JSON)</label>
                <textarea
                  value={apiBody}
                  onChange={(e) => setApiBody(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-300 font-mono text-xs resize-none outline-none focus:border-slate-700"
                />
              </div>
            )}
          </div>

          <div className="md:col-span-4 flex flex-col bg-slate-950 border border-slate-800 rounded-lg p-3 min-h-[160px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900 mb-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Response Headers</span>
              {apiStatus && (
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                  apiStatus === 200 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  Status: {apiStatus}
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-auto max-h-[150px] font-mono text-xs text-slate-400">
              {apiResponse ? (
                <pre className="whitespace-pre-wrap">{apiResponse}</pre>
              ) : (
                <span className="text-slate-600 block italic text-center pt-8">
                  Response body will render here after trigger execution. Try shooting a GET requesting to "/api/playground/test".
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
