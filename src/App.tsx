import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Shield, Award, BookOpen, Clock, Code2, Sparkles, 
  Settings, LogOut, Flame, Compass, ChevronRight, User, GraduationCap, 
  BarChart3, Users, Play, Database, CheckSquare
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
  
  // Dynamic student state metrics
  const [studentXp, setStudentXp] = useState<number>(14250);
  const [studentStreak, setStudentStreak] = useState<number>(27);

  // Cross-component communication state
  const [preloadCode, setPreloadCode] = useState<string>('');
  const [preloadLanguage, setPreloadLanguage] = useState<'javascript' | 'html' | 'java' | 'sql'>('javascript');

  const handleLoadLessonCode = (code: string, language: 'javascript' | 'html' | 'java' | 'sql') => {
    setPreloadCode(code);
    setPreloadLanguage(language);
    setActiveTab('ide'); // Route instantly
  };

  const incrementXp = (amount: number) => {
    setStudentXp(p => p + amount);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between pt-5 shrink-0" id="dashboard-outer-chrome">
        <div>
          {/* Logo Brand / Developer Profile Info */}
          <div className="px-5 mb-6 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
                <Terminal size={20} />
              </span>
              <h1 className="font-display text-sm font-black tracking-tight text-white uppercase select-none">
                L4SWD Engine
              </h1>
            </div>
            
            <div className="mt-4 bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=128&h=128" 
                alt="Profile Avatar" 
                className="w-10 h-10 rounded-lg object-cover border border-slate-700"
              />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-mono text-purple-400 font-bold block leading-none">TOXIC CODERKILLER</span>
                <span className="text-[11px] font-bold text-slate-200 block truncate mt-1">Remmy Nsanzimana</span>
                <span className="text-[9px] text-slate-500 font-mono block">L4 SWD • Term 3</span>
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

        {/* Sync/Status Footer inside drawer */}
        <div className="p-4 border-t border-slate-800 text-slate-500 font-mono text-[9px] uppercase space-y-2">
          <div className="flex items-center justify-between">
            <span>Server status:</span>
            <span className="text-emerald-400 font-bold">• Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Telemetry:</span>
            <span>Aistudio-Ready</span>
          </div>
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
              <span className="font-mono text-[9px] text-slate-500 uppercase">XP Collected</span>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-lg px-3 border border-slate-800">
              <Flame className="text-amber-500 w-4 h-4 animate-pulse" />
              <span className="font-mono text-xs font-extrabold text-slate-100">{studentStreak}d</span>
              <span className="font-mono text-[9px] text-slate-500 uppercase">Streak count</span>
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
                      Welcome, Remmy Nsanzimana
                    </h2>
                    <p className="text-xs text-slate-300 max-w-lg leading-relaxed font-sans">
                      Your current learning average stands in absolute parameters of excellence. Master functional OOPS and relational schemas models below to lock in certification metrics.
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
                <LearningHub onLoadLessonCode={handleLoadLessonCode} onAddXp={incrementXp} />
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
