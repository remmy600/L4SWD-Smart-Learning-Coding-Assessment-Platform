import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Shield, Award, BookOpen, Clock, Code2, Sparkles, 
  Settings, LogOut, Flame, Compass, ChevronRight, User, GraduationCap, 
  BarChart3, Users, Play, Database, CheckSquare, Key, RefreshCw, AlertCircle
} from 'lucide-react';

import DeveloperHub from './components/DeveloperHub';
import AICommandCenter from './components/AICommandCenter';
import LearningHub from './components/LearningHub';
import PortfolioBuilder from './components/PortfolioBuilder';
import FocusGuard from './components/FocusGuard';
import AnalyticsDash from './components/AnalyticsDash';
import CollaborationHub from './components/CollaborationHub';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Real authentication states (JWT)
  const [token, setToken] = useState<string | null>(localStorage.getItem("l4_auth_token"));
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  
  // Registration & login Form inputs
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  const [authUsername, setAuthUsername] = useState<string>('');
  const [authName, setAuthName] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authRole, setAuthRole] = useState<'student' | 'teacher'>('student');
  const [authError, setAuthError] = useState<string>('');

  // MongoDB active diagnostic states
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string; mongoUriConfigured: boolean }>({
    connected: false,
    message: 'Reviewing platform dependencies...',
    mongoUriConfigured: false
  });
  const [customMongoUri, setCustomMongoUri] = useState<string>('');
  const [isConnectingDb, setIsConnectingDb] = useState<boolean>(false);

  // Dynamic state metrics synchronized with the backend user profile
  const [studentXp, setStudentXp] = useState<number>(0);
  const [studentStreak, setStudentStreak] = useState<number>(0);

  // Cross-component communication state
  const [preloadCode, setPreloadCode] = useState<string>('');
  const [preloadLanguage, setPreloadLanguage] = useState<'javascript' | 'html' | 'java' | 'sql'>('javascript');

  // Trigger base diagnostics and session checks on mount
  useEffect(() => {
    checkDatabaseStatus();
    verifyExistingSession();
  }, [token]);

  const checkDatabaseStatus = async () => {
    try {
      const resp = await fetch("/api/database/status");
      const data = await resp.json();
      setDbStatus(data);
    } catch (err) {
      console.error("Database tracking error:", err);
      setDbStatus({
        connected: false,
        message: "Offline local environment tracking active.",
        mongoUriConfigured: false
      });
    }
  };

  const handleManualConnectAtlas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMongoUri.trim()) return;
    setIsConnectingDb(true);
    setDbStatus(prev => ({ ...prev, message: "Handshaking with Mongo cluster..." }));
    
    try {
      const resp = await fetch("/api/database/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mongodbUri: customMongoUri.trim() })
      });
      const data = await resp.json();
      if (data.success) {
        setDbStatus({
          connected: true,
          message: data.message,
          mongoUriConfigured: true
        });
        alert("MongoDB Atlas Connection successfully verified and synced!");
        setCustomMongoUri('');
      } else {
        alert(`Failed to handshake: ${data.error}`);
        checkDatabaseStatus();
      }
    } catch (err) {
      alert("Network checkpoint timeout or socket breach. Check credentials.");
      checkDatabaseStatus();
    } finally {
      setIsConnectingDb(false);
    }
  };

  const verifyExistingSession = async () => {
    const savedToken = localStorage.getItem("l4_auth_token");
    if (!savedToken) {
      setAuthLoading(false);
      return;
    }

    try {
      const resp = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${savedToken}` }
      });
      if (resp.ok) {
        const user = await resp.json();
        setCurrentUser(user);
        setStudentXp(user.xp);
        setStudentStreak(user.streak);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error("Session restore error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authUsername.trim() || !authPassword.trim() || (!isLoginView && !authName.trim())) {
      setAuthError('All credentials fields are required.');
      return;
    }

    const payload = isLoginView 
      ? { username: authUsername.trim(), password: authPassword.trim() }
      : { username: authUsername.trim(), name: authName.trim(), password: authPassword.trim(), role: authRole };

    const endpoint = isLoginView ? "/api/auth/login" : "/api/auth/register";

    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      
      if (resp.ok) {
        localStorage.setItem("l4_auth_token", data.token);
        setToken(data.token);
        setCurrentUser(data.user);
        setStudentXp(data.user.xp);
        setStudentStreak(data.user.streak);
        
        // Clear credential buffers safely
        setAuthUsername('');
        setAuthPassword('');
        setAuthName('');
        setAuthError('');
      } else {
        setAuthError(data.error || "Authentication rejected.");
      }
    } catch (err) {
      setAuthError("Failed reaching authorisation server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("l4_auth_token");
    setToken(null);
    setCurrentUser(null);
  };

  const handleDemoLogin = async (demoUsername: string) => {
    setAuthError('');
    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: demoUsername, password: "password123" })
      });
      const data = await resp.json();
      if (resp.ok) {
        localStorage.setItem("l4_auth_token", data.token);
        setToken(data.token);
        setCurrentUser(data.user);
        setStudentXp(data.user.xp);
        setStudentStreak(data.user.streak);
        setAuthError('');
      } else {
        setAuthError(data.error || "Demo handshake rejected.");
      }
    } catch (err) {
      setAuthError("Auth endpoints currently offline. Compile server.");
    }
  };

  const handleLoadLessonCode = (code: string, language: 'javascript' | 'html' | 'java' | 'sql') => {
    setPreloadCode(code);
    setPreloadLanguage(language);
    setActiveTab('ide'); // Route instantly
  };

  const incrementXp = async (amount: number) => {
    const nextXp = studentXp + amount;
    setStudentXp(nextXp);
    
    // Attempt automatic real-time sync with database
    if (token && currentUser) {
      try {
        await fetch("/api/exams/submit", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            examId: "academic_xp_award",
            score: 100,
            xpEarned: amount
          })
        });
      } catch (err) {
        console.error("Failed syncing XP adjustment to DB:", err);
      }
    }
  };

  // Render fullpage pre-boot animation while restoring tokens
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center gap-4 text-slate-300 font-mono">
        <RefreshCw className="animate-spin text-sky-400" size={36} />
        <span className="text-xs tracking-widest uppercase">Initializing Secure Security Gateways...</span>
      </div>
    );
  }

  // FORCE LOGIN GUARD BLOCK (JWT and MongoDB status connection console)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
        
        {/* Abstract Background Accents */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none" />

        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 z-10">
          
          {/* Left Panel: Real-time DB Conn Status & Configuration */}
          <div className="md:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="text-sky-400" size={20} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">Database Diagnostics</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                dbStatus.connected 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                  : 'bg-amber-500/5 border-amber-500/20 text-amber-300'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${dbStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
                  <span className="font-mono text-xs uppercase font-extrabold">
                    {dbStatus.connected ? 'Atlas Connected' : 'Replica Fallback Active'}
                  </span>
                </div>
                <p className="font-sans text-[11px] leading-relaxed opacity-90 mt-1.5">{dbStatus.message}</p>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                The ecosystem synchronizes parameters seamlessly with standard Local JSON fail-safes so it remains responsive even without environmental variables configuration.
              </p>
            </div>

            <form onSubmit={handleManualConnectAtlas} className="space-y-2.5 pt-4 border-t border-slate-850">
              <label className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Connect MongoDB Atlas Client</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="mongodb+srv://admin:pass@cluster..."
                  value={customMongoUri}
                  onChange={(e) => setCustomMongoUri(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-slate-300 text-xs font-mono outline-none focus:border-slate-700"
                />
                <button
                  type="submit"
                  disabled={isConnectingDb}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-850 text-slate-200 hover:text-white rounded text-xs font-semibold font-mono uppercase tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isConnectingDb ? (
                    <>
                      <RefreshCw className="animate-spin" size={12} />
                      <span>Negotiating Socket...</span>
                    </>
                  ) : (
                    <>
                      <Database size={12} />
                      <span>Verify Atlas String</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Panel: JWT Auth Guard Box */}
          <div className="md:col-span-7 bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-slate-850 pb-4 mb-6">
                <div>
                  <h1 className="font-display text-lg font-black tracking-tight text-white uppercase">
                    L4SWD Secure Portal
                  </h1>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">TERMS III CRYPTOGRAPHIC GATEWAY</p>
                </div>
                <span className="p-2 bg-sky-500/10 text-sky-400 rounded-xl">
                  <Key size={20} />
                </span>
              </div>

              {authError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2 mb-4">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Quick logins buttons */}
              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Click For Express Demo Validation</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDemoLogin('toxic_coderkiller')}
                    className="p-3 bg-slate-950 hover:bg-slate-850 border border-sky-500/10 hover:border-sky-500/30 text-left rounded-lg transition-all"
                  >
                    <span className="text-xs font-bold text-sky-400 block font-mono">Student Account</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5 mt-1">Remmy Nsanzimana</span>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('teacher_eric')}
                    className="p-3 bg-slate-950 hover:bg-slate-850 border border-purple-500/10 hover:border-purple-500/30 text-left rounded-lg transition-all"
                  >
                    <span className="text-xs font-bold text-purple-400 block font-mono">Teacher Account</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5 mt-1">Erick Mugisha</span>
                  </button>
                </div>
              </div>

              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-slate-850 h-[1px]" />
                <span className="relative bg-slate-900 px-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold">Or Create Dynamic Node</span>
              </div>

              {/* Login/Signup form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {!isLoginView && (
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">Developer Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Remmy Nsanzimana"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-slate-300 text-xs outline-none focus:border-slate-700"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">Username / Nickname</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. toxic_coderkiller"
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-slate-350 text-xs font-mono outline-none focus:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-slate-350 text-xs outline-none focus:border-slate-700"
                  />
                </div>

                {!isLoginView && (
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">Governance Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['student', 'teacher'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setAuthRole(r)}
                          className={`py-2 text-xs uppercase font-mono font-bold rounded border ${
                            authRole === r 
                              ? 'bg-sky-505 bg-sky-500/10 text-sky-400 border-sky-450 border-sky-500/30' 
                              : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-350'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded font-bold font-mono text-xs uppercase tracking-wider transition-all mt-4 cursor-pointer shadow-lg shadow-sky-500/10"
                >
                  {isLoginView ? 'Authorize Session' : 'Register Secure Profile'}
                </button>
              </form>
            </div>

            <div className="pt-6 border-t border-slate-850 text-center font-mono text-[10px]">
              <span className="text-slate-500">
                {isLoginView ? "Don't have a secure workspace identifier yet?" : "Already registered as dynamic node?"}
              </span>
              <button
                onClick={() => {
                  setIsLoginView(!isLoginView);
                  setAuthError('');
                }}
                className="text-sky-400 hover:text-sky-300 font-bold ml-1.5 transition-colors uppercase"
              >
                {isLoginView ? 'Create Account' : 'Authenticate Session'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD AUTHENTICATED PLATFORM SHELL
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between pt-5 shrink-0" id="dashboard-outer-chrome">
        <div>
          {/* Logo Brand / Developer Profile Info */}
          <div className="px-5 mb-6 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg animate-pulse-subtle">
                <Terminal size={20} />
              </span>
              <h1 className="font-display text-sm font-black tracking-tight text-white uppercase select-none">
                L4SWD Engine
              </h1>
            </div>
            
            <div className="mt-4 bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl flex items-center gap-3">
              <img 
                src={currentUser.role === 'teacher' 
                  ? "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=128&h=128" 
                  : "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=128&h=128"} 
                alt="Profile Avatar" 
                className="w-10 h-10 rounded-lg object-cover border border-slate-700"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase font-mono text-purple-400 font-bold block leading-none truncate mb-1">
                  {currentUser.username}
                </span>
                <span className="text-[11px] font-bold text-slate-200 block truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                  Role: {currentUser.role}
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5 px-3">
            <span className="px-3 text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold block mb-2">Workspace Matrix</span>
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase font-mono transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-sky-500/15 text-sky-400 border-l-2 border-sky-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass size={14} className={activeTab === 'dashboard' ? 'text-sky-400' : 'text-slate-400'} />
                <span>Control Base</span>
              </div>
            </button>

            <button
              onClick={() => {
                setPreloadCode(''); // Clear loaded values
                setActiveTab('ide');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase font-mono transition-colors cursor-pointer ${
                activeTab === 'ide'
                  ? 'bg-sky-500/15 text-sky-400 border-l-2 border-sky-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Code2 size={14} className={activeTab === 'ide' ? 'text-sky-400' : 'text-slate-400'} />
                <span>Playground IDE</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase font-mono transition-colors cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-sky-500/15 text-sky-400 border-l-2 border-sky-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles size={14} className={activeTab === 'ai' ? 'text-sky-400' : 'text-slate-400'} />
                <span>AI Specialists</span>
              </div>
              <span className="text-[8px] font-mono bg-purple-500/15 text-purple-400 border border-purple-500/20 px-1 rounded">GEMINI</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase font-mono transition-colors cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-sky-500/15 text-sky-400 border-l-2 border-sky-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen size={14} className={activeTab === 'courses' ? 'text-sky-400' : 'text-slate-400'} />
                <span>Lior Syllabus</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase font-mono transition-colors cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-sky-500/15 text-sky-400 border-l-2 border-sky-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award size={14} className={activeTab === 'portfolio' ? 'text-sky-400' : 'text-slate-400'} />
                <span>Portfolio Architect</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('focus')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase font-mono transition-colors cursor-pointer ${
                activeTab === 'focus'
                  ? 'bg-sky-500/15 text-sky-400 border-l-2 border-sky-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield size={14} className={activeTab === 'focus' ? 'text-sky-400' : 'text-slate-400'} />
                <span>FocusGuard Mode</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase font-mono transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-sky-500/15 text-sky-400 border-l-2 border-sky-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 size={14} className={activeTab === 'analytics' ? 'text-sky-400' : 'text-slate-400'} />
                <span>Governance board</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('collaboration')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase font-mono transition-colors cursor-pointer ${
                activeTab === 'collaboration'
                  ? 'bg-sky-500/15 text-sky-400 border-l-2 border-sky-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={14} className={activeTab === 'collaboration' ? 'text-sky-400' : 'text-slate-400'} />
                <span>Collab Base</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sync/Status Footer inside drawer with Actionable Logout */}
        <div className="p-4 border-t border-slate-800 text-slate-500 font-mono text-[9px] uppercase space-y-3">
          <div className="flex items-center justify-between">
            <span>Server status:</span>
            <span className="text-emerald-400 font-bold">• Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span>DB Line:</span>
            <span className={dbStatus.connected ? "text-emerald-400 font-bold" : "text-amber-450 font-bold text-amber-500"}>
              {dbStatus.connected ? "Atlas Real" : "Replica"}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full mt-2 py-1.5 bg-slate-950 hover:bg-rose-500/10 border border-slate-850 hover:border-rose-500/20 text-slate-400 hover:text-rose-400 rounded text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <LogOut size={10} />
            <span>Close Session</span>
          </button>
        </div>
      </aside>

      {/* Main Container Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        
        {/* Global Hub Header Section */}
        <header className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between" id="dashboard-outer-chrome">
          <div className="flex items-center gap-2.5">
            <span className="p-1 px-3 bg-slate-950 font-mono text-[10px] text-slate-400 border border-slate-800 rounded uppercase">
              L4SWD SMART PLATFORM
            </span>
            <span className="text-slate-500 font-mono text-xs">/ {activeTab} console</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Gamified metric totals */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-lg px-3 border border-slate-800">
              <TrophyIcon className="text-amber-400 w-4 h-4" />
              <span className="font-mono text-xs font-extrabold text-slate-100">{studentXp}</span>
              <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">XP Collected</span>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-lg px-3 border border-slate-800">
              <Flame className="text-amber-500 w-4 h-4 animate-pulse" />
              <span className="font-mono text-xs font-extrabold text-slate-100">{studentStreak}d</span>
              <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">Streak count</span>
            </div>
          </div>
        </header>

        {/* Interactive Workspace Views Wrapper */}
        <div className="p-6 flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Hero Greeting Panel */}
                <div className="bg-gradient-to-r from-sky-900 to-slate-900 border border-sky-500/10 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2 relative z-10">
                    <span className="text-[10px] font-mono uppercase font-bold text-sky-400 tracking-wider">
                      TERMS LEVEL III PERFORMANCE INDEX
                    </span>
                    <h2 className="text-xl font-bold font-display uppercase text-white tracking-tight">
                      Welcome, {currentUser.name}
                    </h2>
                    <p className="text-xs text-slate-300 max-w-lg leading-relaxed font-sans">
                      Your profile session represents verified full stack credentials synced to the {dbStatus.connected ? "MongoDB Atlas primary cluster" : "local filesystem replica model"}. Engage in exams or compile OOPS configurations below.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer shadow-lg shadow-sky-500/10 z-10 shrink-0"
                  >
                    <span>Enter active Syllabuses</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Main shortcut links cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab('ide')}
                    className="text-left bg-slate-900 border border-slate-850 hover:bg-slate-850 p-4 rounded-xl shadow transition-all hover:-translate-y-0.5"
                  >
                    <span className="p-2 bg-sky-500/10 text-sky-400 rounded-lg inline-block mb-3.5"><Code2 size={18} /></span>
                    <h4 className="text-xs font-bold uppercase tracking-wide text-slate-200 font-mono">IDE SANDBOX</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-sans leading-relaxed">Runs sandboxed javascript scripts, java classes compiles and interactive SQL tables.</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('ai')}
                    className="text-left bg-slate-900 border border-slate-850 hover:bg-slate-850 p-4 rounded-xl shadow transition-all hover:-translate-y-0.5"
                  >
                    <span className="p-2 bg-amber-500/10 text-amber-500 rounded-lg inline-block mb-3.5"><Sparkles size={18} /></span>
                    <h4 className="text-xs font-bold uppercase tracking-wide text-slate-200 font-mono">SPEC GENERATORS</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-sans leading-relaxed">AI architectural plans, Mermaid UML maps, detailed ERDs, and exam guides.</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('focus')}
                    className="text-left bg-slate-900 border border-slate-850 hover:bg-slate-850 p-4 rounded-xl shadow transition-all hover:-translate-y-0.5"
                  >
                    <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg inline-block mb-3.5"><Shield size={18} /></span>
                    <h4 className="text-xs font-bold uppercase tracking-wide text-slate-200 font-mono">FOCUSGUARD MODE</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-sans leading-relaxed">Adjustable Pomodoro study counters, web blockers trackers and lock simulations.</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="text-left bg-slate-900 border border-slate-850 hover:bg-slate-850 p-4 rounded-xl shadow transition-all hover:-translate-y-0.5"
                  >
                    <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg inline-block mb-3.5"><BarChart3 size={18} /></span>
                    <h4 className="text-xs font-bold uppercase tracking-wide text-slate-200 font-mono">GOVERNANCE ROSTER</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-sans leading-relaxed">Interactively toggle Student parent and teacher administrative grade terminals.</p>
                  </button>
                </div>

                {/* Tasks lists and leaderboard metrics split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Task checklist */}
                  <div className="lg:col-span-12 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2.5">
                      <CheckSquare className="text-sky-400" size={16} />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                        Operational Tasks Checklists
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 font-sans text-xs">
                      {[{ title: "Execute asynchronous microtask sequence inside JS Playground", tab: "ide" },
                        { title: "Generate an AI relational database schema using Gemini command engine", tab: "ai" },
                        { title: "Verify Java OOP subclasses constructors override lessons and complete quizzes", tab: "courses" },
                        { title: "Review report card attendance logs in Parent Hub portal", tab: "analytics" }
                      ].map((task, ti) => (
                        <button
                          key={ti}
                          onClick={() => setActiveTab(task.tab)}
                          className="w-full text-left bg-slate-950 hover:bg-slate-850 p-3.5 rounded-lg border border-slate-850 hover:border-slate-750 transition-all flex items-center justify-between gap-3 text-slate-300 font-medium"
                        >
                          <span>{task.title}</span>
                          <span className="text-[9px] font-mono text-sky-450 uppercase shrink-0 bg-sky-500/5 px-2 py-0.5 rounded border border-sky-500/10">Go</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ide' && (
              <motion.div
                key="ide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DeveloperHub initialCode={preloadCode} initialLanguage={preloadLanguage} />
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AICommandCenter />
              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <LearningHub onLoadLessonCode={handleLoadLessonCode} onAddXp={incrementXp} token={token} currentUser={currentUser} />
              </motion.div>
            )}

            {activeTab === 'portfolio' && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <PortfolioBuilder />
              </motion.div>
            )}

            {activeTab === 'focus' && (
              <motion.div
                key="focus"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <FocusGuard onAddXp={incrementXp} />
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AnalyticsDash xp={studentXp} />
              </motion.div>
            )}

            {activeTab === 'collaboration' && (
              <motion.div
                key="collaboration"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CollaborationHub />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
      <path d="M12 2a6 6 0 0 0-6 6v1c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4V8a6 6 0 0 0-6-6z" />
    </svg>
  );
}
