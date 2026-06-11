import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Shield, AlertTriangle, Sparkles, Check, CheckCircle2, Lock, Unlock, BarChart3, HelpCircle, Flame } from 'lucide-react';

interface FocusGuardProps {
  onAddXp: (amount: number) => void;
}

export default function FocusGuard({ onAddXp }: FocusGuardProps) {
  const [timerSeconds, setTimerSeconds] = useState<number>(1500); // 25 mins
  const [isActive, setIsActive] = useState<boolean>(false);
  const [presetDuration, setPresetDuration] = useState<number>(1500);
  
  // Website blocker state
  const [blockUrl, setBlockUrl] = useState<string>('');
  const [blockedDomains, setBlockedDomains] = useState<string[]>(['facebook.com', 'youtube.com', 'tiktok.com']);
  const [simulatedAttempt, setSimulatedAttempt] = useState<string>('');
  const [attemptBlockAlert, setAttemptBlockAlert] = useState<boolean>(false);

  // App Lock Simulator
  const [appLocks, setAppLocks] = useState<Record<string, boolean>>({
    WhatsApp: true,
    Instagram: true,
    Discord: false,
    VSCode: false
  });

  // Focus score & reports
  const [focusScore, setFocusScore] = useState<number>(85);
  const [minutesFocusedTotal, setMinutesFocusedTotal] = useState<number>(120);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            onAddXp(200); // Award significant XP on completion
            alert("FocusGuard Session Complete! +200 XP Granted.");
            setMinutesFocusedTotal(m => m + Math.round(presetDuration / 60));
            setFocusScore(s => Math.min(s + 5, 100));
            return presetDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, presetDuration]);

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setTimerSeconds(presetDuration);
  };

  const selectPreset = (seconds: number) => {
    setIsActive(false);
    setPresetDuration(seconds);
    setTimerSeconds(seconds);
  };

  const handleAddBlockedDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockUrl.trim()) return;
    const cleanUrl = blockUrl.replace(/https?:\/\/|www\./g, '').trim().toLowerCase();
    if (cleanUrl && !blockedDomains.includes(cleanUrl)) {
      setBlockedDomains([...blockedDomains, cleanUrl]);
    }
    setBlockUrl('');
  };

  const handleRemoveBlockedDomain = (domain: string) => {
    setBlockedDomains(blockedDomains.filter(d => d !== domain));
  };

  const handleSimulateBrowse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedAttempt.trim()) return;
    const target = simulatedAttempt.toLowerCase().trim();
    const isBlocked = blockedDomains.some(d => target.includes(d));
    if (isBlocked) {
      setAttemptBlockAlert(true);
      setFocusScore(s => Math.max(s - 8, 0)); // deduct focus score for distraction!
    } else {
      setAttemptBlockAlert(false);
      alert(`Simulation: Navigation permitted to ${simulatedAttempt}`);
    }
    setSimulatedAttempt('');
  };

  const toggleAppLock = (app: string) => {
    setAppLocks({
      ...appLocks,
      [app]: !appLocks[app]
    });
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="focus-guard-layout">
      {/* High impact Pomodoro Timer */}
      <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden justify-between min-h-[400px]">
        {/* Absolute visuals */}
        <div className="absolute top-0 right-0 p-8 text-slate-800/10 -mr-6 -mt-6">
          <Shield size={256} />
        </div>

        <div className="flex items-center justify-between border-b border-slate-850 pb-4">
          <div className="flex items-center gap-2 relative">
            <Shield className="text-emerald-400" size={20} />
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-200">
              FocusGuard Engine Active
            </h3>
          </div>

          <div className="flex gap-1.5 z-10">
            {[{ label: '25m', sec: 1500 }, { label: '45m', sec: 2700 }, { label: '15m Break', sec: 900 }].map((p, pi) => (
              <button
                key={pi}
                onClick={() => selectPreset(p.sec)}
                className={`px-3 py-1 font-mono text-[10px] uppercase font-bold rounded border ${
                  presetDuration === p.sec
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Big circular clock style layout */}
        <div className="my-8 z-10 select-none flex flex-col items-center">
          <div className="relative flex items-center justify-center w-52 h-52 bg-slate-950 border border-slate-800/80 rounded-full shadow-inner shadow-emerald-500/5">
            <span className="font-mono text-5xl font-black text-slate-100 tracking-tighter">
              {formatTime(timerSeconds)}
            </span>
            <div className={`absolute inset-3 border-2 rounded-full border-dashed transition-all duration-1000 ${
              isActive ? 'animate-spin border-emerald-500/30' : 'border-slate-800'
            }`} />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mt-3 font-semibold">
            {isActive ? 'Deep study session running...' : 'Compiling focus modules...'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex gap-4 z-10 w-full md:max-w-md mx-auto">
          <button
            onClick={handleToggleTimer}
            className={`flex-1 py-3 px-5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-950 shadow-md ${
              isActive 
                ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-500/10' 
                : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/10'
            }`}
          >
            {isActive ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            {isActive ? 'Hold Active Guard' : 'Engage FocusGuard'}
          </button>
          
          <button
            onClick={handleResetTimer}
            className="px-5 py-3 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono font-bold uppercase transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Stats sidebar */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Dynamic Focus score card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-850 pb-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              FocusScore Analytics
            </h4>
            <Flame size={16} className="text-amber-500 animate-pulse" />
          </div>

          <div className="grid grid-cols-2 gap-3 h-[180px]_info">
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850/60 text-center flex flex-col justify-center">
              <span className="font-mono text-3xl font-black text-sky-400 block">{focusScore}%</span>
              <span className="text-[9px] uppercase font-mono font-semibold text-slate-500 text-center tracking-wider block mt-1">Focus Score Ratio</span>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850/60 text-center flex flex-col justify-center">
              <span className="font-mono text-3xl font-black text-purple-400 block">{minutesFocusedTotal}m</span>
              <span className="text-[9px] uppercase font-mono font-semibold text-slate-500 text-center tracking-wider block mt-1">Hours Logged Total</span>
            </div>
          </div>

          <p className="text-[10px] font-sans text-slate-400 leading-relaxed italic bg-slate-950 p-2.5 rounded border border-slate-850">
            • AI Study suggestion: You perform best between 9 AM and 11 AM when completing Backend REST API compilations. Keep distractors locked!
          </p>
        </div>
      </div>

      {/* Website distractor blockers */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
          <Shield className="text-rose-500" size={18} />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Intelligent Website Distraction Blocker
          </h4>
        </div>

        <div className="space-y-3">
          {attemptBlockAlert && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 flex items-start gap-2 animate-bounce">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="block font-mono uppercase font-bold">FocusGuard Active Restriction</strong>
                This domain is strictly blacklisted into your cognitive cache. Focus on your Java OOPS models!
              </div>
            </div>
          )}

          <form onSubmit={handleSimulateBrowse} className="flex gap-2 bg-slate-950 border border-slate-800 rounded p-1">
            <input
              type="text"
              placeholder="Test browser navigation (e.g. www.youtube.com)"
              value={simulatedAttempt}
              onChange={(e) => setSimulatedAttempt(e.target.value)}
              className="flex-1 bg-transparent px-2.5 py-1.5 font-sans text-xs text-slate-300 outline-none"
            />
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 font-mono font-bold text-[10px] uppercase text-slate-300 px-3 py-1.5 rounded transition-colors"
            >
              Verify Lock
            </button>
          </form>

          {/* List blocked items */}
          <div className="flex flex-wrap gap-2 pt-2">
            {blockedDomains.map((d, di) => (
              <span key={di} className="px-2.5 py-1 bg-slate-950 text-slate-400 text-xs rounded border border-slate-850 flex items-center gap-1.5 font-mono">
                <span>{d}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBlockedDomain(d)}
                  className="text-slate-600 hover:text-red-400 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddBlockedDomain} className="flex gap-2 pt-3 border-t border-slate-850">
            <input
              type="text"
              placeholder="Add blacklisted address (e.g. linkedin.com)"
              value={blockUrl}
              onChange={(e) => setBlockUrl(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-sans text-xs outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-rose-500 hover:bg-rose-450 text-slate-950 font-mono font-bold uppercase text-xs rounded transition-colors cursor-pointer"
            >
              Blacklist
            </button>
          </form>
        </div>
      </div>

      {/* Simulated App lock configuration toggle screen */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
          <Lock className="text-purple-400" size={18} />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Cognitive App Locker Simulator
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(appLocks).map(([app, isLocked]) => (
            <button
              key={app}
              onClick={() => toggleAppLock(app)}
              className={`p-3.5 rounded-lg border transition-all text-left flex items-center justify-between ${
                isLocked
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                  : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:bg-slate-950/70'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200">{app}</span>
                <span className="text-[9px] font-mono uppercase text-slate-500 mt-1">Status: {isLocked ? 'Locked' : 'Unlocked'}</span>
              </div>
              <div>
                {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
              </div>
            </button>
          ))}
        </div>

        <div className="text-[10px] font-mono text-slate-500 text-center tracking-wide pt-2 border-t border-slate-850">
          * Application lockers simulate background interceptors shutting down phone alerts.
        </div>
      </div>
    </div>
  );
}
