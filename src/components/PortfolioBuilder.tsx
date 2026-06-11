import React, { useState } from 'react';
import { InitialDeveloperProfile, DeveloperProfile, Project, Certificate } from '../types';
import { Briefcase, GraduationCap, Github, Globe, FileDown, Plus, Trash2, Award, ClipboardCheck, Sparkles } from 'lucide-react';

export default function PortfolioBuilder() {
  const [profile, setProfile] = useState<DeveloperProfile>(InitialDeveloperProfile);
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);

  // New project states
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTags, setProjTags] = useState('');
  const [projGit, setProjGit] = useState('');
  const [projDemo, setProjDemo] = useState('');

  // Add project item
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projDesc.trim()) {
      alert("Please provide the project title and a brief description.");
      return;
    }
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      title: projTitle,
      description: projDesc,
      tags: projTags.split(',').map(t => t.trim()).filter(t => t.length > 0),
      githubUrl: projGit || 'https://github.com',
      liveUrl: projDemo || undefined
    };
    setProfile({
      ...profile,
      projects: [...profile.projects, newProj]
    });
    setProjTitle('');
    setProjDesc('');
    setProjTags('');
    setProjGit('');
    setProjDemo('');
  };

  const handleDeleteProject = (id: string) => {
    setProfile({
      ...profile,
      projects: profile.projects.filter(p => p.id !== id)
    });
  };

  const triggerBrowserPrint = () => {
    // Toggles print state, sleeps briefly and calls window.print()
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 500);
  };

  if (isPrintMode) {
    return (
      <div className="bg-white text-slate-900 p-8 max-w-4xl mx-auto space-y-8 font-sans" id="print-sheet-root">
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase text-slate-950">{profile.name}</h1>
            <h2 className="text-lg font-bold text-sky-700 tracking-wide uppercase font-mono">{profile.role}</h2>
            <p className="text-sm text-slate-500 font-mono mt-1">{profile.level} • Nickname: {profile.nickname}</p>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            Generated via L4SWD Smart Platform<br/>
            Date: 2026-06-11
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 font-mono">Professional Profile</h3>
          <p className="text-sm text-slate-650 leading-relaxed font-sans">{profile.bio}</p>
        </div>

        {/* Skills section print */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 font-mono">Technical Expertise</h3>
          <div className="grid grid-cols-2 gap-4">
            {profile.skills.map((s, si) => (
              <div key={si} className="flex justify-between items-center text-xs border-b border-dashed border-slate-200 pb-1">
                <span className="font-semibold text-slate-800">{s.name}</span>
                <span className="font-mono font-bold text-sky-700">{s.level}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects section print */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 font-mono">Key Developed Projects</h3>
          <div className="space-y-4">
            {profile.projects.map((p) => (
              <div key={p.id} className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                  <span className="text-xs font-mono text-slate-500">{p.tags.join(' / ')}</span>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed font-sans">{p.description}</p>
                <div className="flex gap-4 text-[10px] font-mono text-sky-700 pt-1">
                  <span>Git repo: {p.githubUrl}</span>
                  {p.liveUrl && <span>Deployment: {p.liveUrl}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates print */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 font-mono">Credentials & Accreditations</h3>
          <div className="grid grid-cols-2 gap-4">
            {profile.certificates.map((c) => (
              <div key={c.id} className="text-xs">
                <h4 className="font-bold text-slate-850">{c.title}</h4>
                <p className="text-slate-500">{c.issuer} • {c.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-400 border-t border-slate-200 pt-6 font-mono font-semibold uppercase">
          • Verified developer profile under terms of Term 3 Assessment Regulations •
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="portfolio-workspace">
      {/* Visual profile summary info card */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-center pb-6">
          <div className="h-24 bg-gradient-to-r from-sky-600 to-purple-800" />
          
          <div className="-mt-12 px-4">
            <img
              src={profile.avatarUrl}
              alt="Avatar Profile"
              className="w-24 h-24 rounded-full mx-auto border-4 border-slate-900 shadow-xl object-cover"
            />
            <h3 className="text-base font-extrabold text-slate-100 mt-3">{profile.name}</h3>
            <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-widest block">{profile.role}</span>
            <div className="mt-1.5 inline-block bg-slate-950 border border-slate-800 text-[10px] text-slate-400 px-3 py-1 rounded-full font-mono">
              {profile.level}
            </div>
            
            <p className="text-xs text-slate-400 mt-4 leading-relaxed px-2 font-sans">
              " {profile.bio} "
            </p>
          </div>

          <div className="mt-6 border-t border-slate-850 px-5 pt-4">
            <button
              onClick={triggerBrowserPrint}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-sky-400 border border-sky-500/20 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <FileDown size={14} />
              Export PDF Portfolio
            </button>
          </div>
        </div>

        {/* Skill visual progress grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Award className="text-purple-400" size={16} />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Validated Competencies
            </h4>
          </div>

          <div className="space-y-3_p space-y-3">
            {profile.skills.map((s, si) => (
              <div key={si} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">{s.name}</span>
                  <span className="font-mono text-[10px] text-sky-400 font-bold">{s.level}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500" style={{ width: `${s.level}%` }} />
                </div>
                <span className="text-[9px] text-slate-500 font-mono uppercase">{s.category} check</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main projects adding form & certificate archives */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Project builder panels */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="text-sky-400" size={18} />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Project Catalog Builder
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.projects.map((p) => (
              <div key={p.id} className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <h5 className="text-sm font-bold text-slate-200">{p.title}</h5>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                      title="Remove Project item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{p.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tags.map(t => (
                      <span key={t} className="text-[9px] font-mono uppercase bg-slate-900 px-1.5 py-0.5 rounded text-sky-400 border border-slate-850">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-end items-center border-t border-slate-900 mt-4 pt-3 text-slate-400">
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1 font-mono text-[10px] uppercase"
                  >
                    <Github size={12} />
                    Repo
                  </a>
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors flex items-center gap-1 font-mono text-[10px] uppercase"
                    >
                      <Globe size={12} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add project panel */}
          <form onSubmit={handleAddProject} className="border-t border-slate-850 pt-4 space-y-3">
            <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 block">
              Integrate New Project Chapter
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Project Title (e.g. UML Blueprint Scanner)"
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-sans text-xs outline-none"
              />
              <input
                type="text"
                placeholder="Tech Tags Split by comma (e.g. React, D3, Express)"
                value={projTags}
                onChange={(e) => setProjTags(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-sans text-xs outline-none"
              />
            </div>

            <textarea
              placeholder="State clear project objectives, database interactions or AI implementations..."
              value={projDesc}
              onChange={(e) => setProjDesc(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-300 font-sans text-xs outline-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Repository link (e.g. github.com/toxic/repo)"
                value={projGit}
                onChange={(e) => setProjGit(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-sans text-xs outline-none"
              />
              <input
                type="text"
                placeholder="Hosting domain url (Optional)"
                value={projDemo}
                onChange={(e) => setProjDemo(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-sans text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold uppercase text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              Register Project Record
            </button>
          </form>
        </div>

        {/* Certificates catalogs modules */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
            <ClipboardCheck className="text-purple-400" size={18} />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Certificates & Credentials Board
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.certificates.map((c) => (
              <div key={c.id} className="bg-slate-950 border border-slate-850 rounded-lg p-3.5 flex items-start gap-3">
                <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg shrink-0">
                  <Award size={18} />
                </span>
                <div className="min-w-0 font-sans">
                  <h5 className="text-xs font-bold text-slate-250 truncate">{c.title}</h5>
                  <p className="text-[10px] text-slate-400 font-medium">{c.issuer}</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-1">Granted: {c.date} • ID: {c.credentialId || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
