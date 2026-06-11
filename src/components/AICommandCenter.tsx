import React, { useState } from 'react';
import { Cpu, RotateCcw, Copy, Check, Terminal, ExternalLink, Sparkles, Code2, AlertTriangle, Play, HelpCircle, FileText, Briefcase, GraduationCap, LayoutGrid } from 'lucide-react';

export default function AICommandCenter() {
  const [activeTab, setActiveTab] = useState<'assistant' | 'designers' | 'academic' | 'career'>('assistant');
  const [promptType, setPromptType] = useState<string>('explain');
  const [inputValue, setInputValue] = useState<string>('');
  const [outputResult, setOutputResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerAI = async () => {
    if (!inputValue.trim()) {
      alert("Please provide some specifications or code first!");
      return;
    }
    setIsLoading(true);
    setOutputResult('');
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: promptType,
          prompt: inputValue,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setOutputResult(`### Authorization Secret Required\n\n${data.error}`);
      } else {
        setOutputResult(data.result);
      }
    } catch (err: any) {
      setOutputResult(`### Communication Failure\n\nFailed to deliver request to server instance. Detail: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (type: string, placeholderCode: string) => {
    setPromptType(type);
    setInputValue(placeholderCode);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="ai-center-layout">
      {/* Category selector */}
      <div className="xl:col-span-3 flex flex-col gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-2">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Sparkles className="text-amber-400" size={18} />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              AI Command Matrix
            </h4>
          </div>

          <button
            onClick={() => { setActiveTab('assistant'); setPromptType('explain'); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold uppercase font-mono flex items-center gap-2 transition-all ${
              activeTab === 'assistant'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Code2 size={14} />
            Code Assistant
          </button>

          <button
            onClick={() => { setActiveTab('designers'); setPromptType('database'); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold uppercase font-mono flex items-center gap-2 transition-all ${
              activeTab === 'designers'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <LayoutGrid size={14} />
            Architecture Tools
          </button>

          <button
            onClick={() => { setActiveTab('academic'); setPromptType('exam'); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold uppercase font-mono flex items-center gap-2 transition-all ${
              activeTab === 'academic'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <GraduationCap size={14} />
            Assess & Learning
          </button>

          <button
            onClick={() => { setActiveTab('career'); setPromptType('career'); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold uppercase font-mono flex items-center gap-2 transition-all ${
              activeTab === 'career'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Briefcase size={14} />
            Career Coach
          </button>
        </div>

        {/* Preset quick actions list */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-3 flex-1">
          <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 block">
            System Helper Presets
          </span>

          {activeTab === 'assistant' && (
            <div className="space-y-2">
              <button
                onClick={() => loadPreset('explain', '// Paste complicated JS routine\nfunction trace(arr) {\n  return arr.reduce((acc, curr) => {\n    acc[curr] = (acc[curr] || 0) + 1;\n    return acc;\n  }, {});\n}')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 p-2 rounded border border-slate-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-semibold text-amber-400 text-xs">Explain Code Logic</span>
                <span className="text-slate-400 text-[10px]">Deconstruct reducer closure mechanics.</span>
              </button>

              <button
                onClick={() => loadPreset('bug', 'function findSum(arr) {\n  for(let i=0; i<=arr.length; i++) {\n    if(arr[i] === undefined) return sum;\n    sum += arr[i];\n  }\n}')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 p-2 rounded border border-slate-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-semibold text-rose-400 text-xs">Bug Detection & Fix</span>
                <span className="text-slate-400 text-[10px]">Spot uninitialized counters & boundaries.</span>
              </button>

              <button
                onClick={() => loadPreset('optimize', 'function hasDuplicates(arr) {\n  for(let i=0; i<arr.length; i++) {\n    for(let j=i+1; j<arr.length; j++) {\n      if(arr[i] === arr[j]) return true;\n    }\n  }\n  return false;\n}')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 p-2 rounded border border-slate-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-semibold text-emerald-400 text-xs">Optimize Big-O Complexity</span>
                <span className="text-slate-400 text-[10px]">Refactor O(N²) nested iterations into O(N) Sets.</span>
              </button>
            </div>
          )}

          {activeTab === 'designers' && (
            <div className="space-y-2">
              <button
                onClick={() => loadPreset('database', 'I need a schema mapping dynamic team workspaces with columns for owner_ids, team boards logs, multi-client comments, and permission locks.')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 p-2 rounded border border-slate-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-semibold text-sky-400 text-xs">AI Database Schema</span>
                <span className="text-slate-400 text-[10px]">Design relational normalized structures.</span>
              </button>

              <button
                onClick={() => loadPreset('uml', 'Design a student assignment lifecycle showing states: DRAFT -> TRANSFERRED -> GRADED. State diagram.')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 p-2 rounded border border-slate-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-semibold text-purple-400 text-xs">Mermaid UML Builder</span>
                <span className="text-slate-400 text-[10px]">Generate renderable block timelines.</span>
              </button>

              <button
                onClick={() => loadPreset('api', 'I need detailed endpoints for CRUD actions handling a local focus timer logging tool, returning weekly averages.')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 p-2 rounded border border-slate-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-semibold text-amber-500 text-xs">REST API Specification</span>
                <span className="text-slate-400 text-[10px]">Build Express endpoint routes maps.</span>
              </button>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-2">
              <button
                onClick={() => loadPreset('exam', 'Express.js query parameter filters & custom middleware authorization scopes.')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 p-2 rounded border border-slate-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-semibold text-yellow-500 text-xs">AI Assessment Maker</span>
                <span className="text-slate-400 text-[10px]">Build test sets matching syllabus.</span>
              </button>

              <button
                onClick={() => loadPreset('project', 'A fully functional local Web Sandbox mimicking container files management with Express.')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 p-2 rounded border border-slate-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-semibold text-cyan-400 text-xs">AI Project Scaffolder</span>
                <span className="text-slate-400 text-[10px]">Formulate files hierarchies structure.</span>
              </button>

              <button
                onClick={() => loadPreset('logbook', 'A 5-day sequence implementing robust JWT authentication filters, tracking database seeds and error codes.')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 p-2 rounded border border-slate-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-semibold text-teal-400 text-xs">AI Internship Logbook</span>
                <span className="text-slate-400 text-[10px]">Write detailed engineering dairy notes.</span>
              </button>
            </div>
          )}

          {activeTab === 'career' && (
            <div className="space-y-2">
              <button
                onClick={() => loadPreset('career', 'Create a clean, impactful resume layout for Remmy Nsanzimana matching "TOXIC CODERKILLER" including skills, certificates, and L4 projects.')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 p-2 rounded border border-slate-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-semibold text-violet-400 text-xs">AI CV & Resume Builder</span>
                <span className="text-slate-400 text-[10px]">Generate standard software engineer CVs.</span>
              </button>

              <button
                onClick={() => loadPreset('career', 'I am preparing for a junior Java & REST API developer interview. Give me 3 hard technical questions and mock optimal responses.')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 p-2 rounded border border-slate-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-semibold text-fuchsia-400 text-xs">Interview Coach</span>
                <span className="text-slate-400 text-[10px]">Conduct custom algorithmic drilling.</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Console and workspace */}
      <div className="xl:col-span-9 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[500px] shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 bg-amber-500/10 text-amber-500 rounded font-mono text-[10px] font-bold uppercase">
                Active: {promptType}
              </span>
              <span className="hidden md:inline text-xs text-slate-400">
                Directly proxying request via server-side Gemini 3.5 Models
              </span>
            </div>

            <button
              onClick={() => { setInputValue(''); setOutputResult(''); }}
              className="text-slate-500 hover:text-slate-300 font-mono text-[10px] flex items-center gap-1 uppercase"
            >
              <RotateCcw size={11} />
              Reset Console
            </button>
          </div>

          <div className="p-5 flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono font-semibold text-slate-400 uppercase">
                Input context specs or source code:
              </label>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={6}
                className="w-full bg-slate-950 text-slate-150 font-mono text-xs rounded-lg p-3 outline-none border border-slate-800 focus:border-slate-700 resize-none leading-relaxed"
                placeholder="Select a preset tool from the sidebar or write context instructions..."
              />
            </div>

            <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-mono">
                Model: <span className="text-sky-400">gemini-3.5-flash</span> (optimized runtime)
              </span>
              <button
                onClick={handleTriggerAI}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold font-mono transition-all uppercase cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Cpu className="animate-spin" size={14} />
                    Processing Pipeline...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Invoke AI Action
                  </>
                )}
              </button>
            </div>

            {/* Generated output block */}
            <div className="flex-1 flex flex-col min-h-[250px] bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center px-3 py-2 bg-slate-900 border-b border-slate-850">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <Terminal size={12} className="text-amber-500" />
                  Execution Result Response
                </span>
                {outputResult && (
                  <button
                    onClick={handleCopy}
                    className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                    title="Copy Text to Clipboard"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>

              <div className="flex-1 p-4 overflow-y-auto max-h-[350px] font-sans text-sm text-slate-300 space-y-3 leading-relaxed" id="ai-response-display">
                {isLoading ? (
                  <div className="h-full flex flex-col justify-center items-center py-12 text-center text-slate-500 space-y-2">
                    <Cpu className="animate-spin text-amber-500" size={32} />
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-400">Analyzing schema variables</span>
                    <p className="text-xs text-slate-500 max-w-sm">Generating normalized structures, UML sequences, or refactored functions...</p>
                  </div>
                ) : outputResult ? (
                  <div className="whitespace-pre-wrap font-mono text-xs text-slate-200">
                    {outputResult}
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center py-12 text-slate-500 italic text-xs text-center">
                    AI generation sequences pending. Trigger actions to inspect payload details.
                    <div className="text-[10px] text-slate-600 mt-2 font-mono">SERVER INTERFACE ACTIVE • ENCRYPTED PROXIES READY</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
