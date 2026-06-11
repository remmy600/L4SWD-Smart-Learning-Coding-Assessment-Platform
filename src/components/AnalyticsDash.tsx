import React, { useState } from 'react';
import { SampleLeaderboard, MockAssignmentRecords, MockAttendanceRecords, AssignmentRecord, AttendanceRecord } from '../types';
import { BarChart3, ShieldAlert, GraduationCap, Users, User, Key, Database, RefreshCcw, Landmark, BookOpen, Clock, Activity, Download, Plus, Star } from 'lucide-react';

interface AnalyticsDashProps {
  xp: number;
}

export default function AnalyticsDash({ xp }: AnalyticsDashProps) {
  const [activeRole, setActiveRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const [gradedAssignments, setGradedAssignments] = useState<AssignmentRecord[]>(MockAssignmentRecords);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MockAttendanceRecords);

  // Security parameters
  const [jwtToken, setJwtToken] = useState<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidV9yZW1teSIsIm5pY2tuYW1lIjoiVE9YSUMgQ09ERVJLSUxMRVIiLCJyb2xlIjoiRGV2ZWxvcGVyIiwibGV2ZWwiOiJMNCIsImV4cCI6MTgwMTI0OTk5OX0.e3VpZGVudGlmeS1jb2Rlcl9zaWduYXR1cmVfa2V5fQ==');
  const [jwtPayload, setJwtPayload] = useState<string>('{\n  "userId": "u_remmy",\n  "nickname": "TOXIC CODERKILLER",\n  "role": "Full-Stack Developer",\n  "level": "L4 Software Engineering",\n  "term": 3\n}');
  const [is2faActive, setIs2faActive] = useState<boolean>(true);
  const [logMessages, setLogMessages] = useState<string[]>([
    "2026-06-11 08:12:05 - AUTH: JWT Token successfully validated for session 'u_remmy'",
    "2026-06-11 09:05:14 - DB: Synced 4 student grading rows under relational SQLite scope",
    "2026-06-11 11:30:22 - FOCUSGUARD: Session engaged. Restricting distractor domains."
  ]);

  // Teacher actions
  const [newScoreTitle, setNewScoreTitle] = useState('');
  const [newScoreCourse, setNewScoreCourse] = useState('React Development');
  const [newScoreMarks, setNewScoreMarks] = useState('');

  const handleRegisterScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScoreTitle.trim() || !newScoreMarks.trim()) return;
    const newRecord: AssignmentRecord = {
      id: `a_${Date.now()}`,
      title: newScoreTitle,
      course: newScoreCourse,
      dueDate: "2026-06-11",
      marks: parseInt(newScoreMarks),
      status: 'graded'
    };
    setGradedAssignments([newRecord, ...gradedAssignments]);
    setNewScoreTitle('');
    setNewScoreMarks('');
    
    // Add activity log
    setLogMessages([
      `2026-06-11 12:00:00 - TEACHER: Added score validation for ${newScoreTitle} (${newScoreMarks}%)`,
      ...logMessages
    ]);
  };

  const handleDataBackup = () => {
    const backupState = {
      timestamp: "2026-06-11T03:00:00Z",
      graded_records: gradedAssignments,
      attendance_records: attendance,
      profile_xp: xp
    };
    const jsonStr = JSON.stringify(backupState, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'L4_SWD_Smart_Backup_2026.json';
    link.click();
    
    setLogMessages([
      "2026-06-11 12:05:00 - SECURITY: Relational encrypted database state successfully exported to local storage.",
      ...logMessages
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="analytics-portal">
      {/* Role and secure switcher */}
      <div className="lg:col-span-12 flex flex-wrap gap-4 items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-sky-400" size={20} />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            L4 School Governance Hub
          </h3>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['student', 'teacher', 'parent'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-4.5 py-1.5 font-mono text-xs uppercase font-bold rounded-lg transition-all ${
                activeRole === role
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {role} View
            </button>
          ))}
        </div>
      </div>

      {/* Main role workspaces */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {activeRole === 'student' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Cognitive Academic Forecasts
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                Term 3 predicted average: 92.4%
              </span>
            </div>

            {/* Simulated progress meters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Java OOPS Level</span>
                <span className="font-mono text-2xl font-black text-sky-400 mt-2 block">94%</span>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-3 border border-slate-900">
                  <div className="bg-sky-500 h-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">React Architecture</span>
                <span className="font-mono text-2xl font-black text-purple-400 mt-2 block">88%</span>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-3 border border-slate-900">
                  <div className="bg-purple-500 h-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">RESTful Backend Routing</span>
                <span className="font-mono text-2xl font-black text-amber-500 mt-2 block">90%</span>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-3 border border-slate-900">
                  <div className="bg-amber-500 h-full" style={{ width: '90%' }} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 block">Active Grades Portfolio</span>
              <div className="bg-slate-950 rounded-xl border border-slate-850 overflow-hidden font-mono text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-850 font-semibold">
                      <th className="p-3">Course Specification</th>
                      <th className="p-3">Topic Task</th>
                      <th className="p-3 text-right">Acquired Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradedAssignments.map((a) => (
                      <tr key={a.id} className="border-b border-slate-950 hover:bg-slate-900/40">
                        <td className="p-3 text-slate-200">{a.course}</td>
                        <td className="p-3 text-slate-400">{a.title}</td>
                        <td className="p-3 text-right text-emerald-400 font-bold">{a.marks !== null ? `${a.marks}%` : 'Pending Submit'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeRole === 'teacher' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 border-b border-slate-850 pb-2">
              Teacher Marks Ledger Authorization
            </h4>

            <form onSubmit={handleRegisterScore} className="bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-3">
              <span className="text-[10px] font-mono uppercase font-bold text-sky-400 block">Register Gradebook Score entry</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Task Header"
                  value={newScoreTitle}
                  onChange={(e) => setNewScoreTitle(e.target.value)}
                  className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-slate-300 font-sans text-xs outline-none focus:border-slate-700"
                />
                <select
                  value={newScoreCourse}
                  onChange={(e) => setNewScoreCourse(e.target.value)}
                  className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-slate-300 font-sans text-xs outline-none focus:border-slate-700"
                >
                  <option value="React Development">React Development</option>
                  <option value="Node.js Backend">Node.js Backend</option>
                  <option value="Java Software Engineering">Java Software Engineering</option>
                  <option value="MongoDB & Relational Database">Database Relational</option>
                </select>
                <input
                  type="number"
                  placeholder="Acquired Marks %"
                  value={newScoreMarks}
                  onChange={(e) => setNewScoreMarks(e.target.value)}
                  className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-slate-300 font-sans text-xs outline-none focus:border-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold uppercase text-xs rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                Authorize Grade Record
              </button>
            </form>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 block">Grade roster list</span>
              <div className="space-y-2">
                {SampleLeaderboard.map((student) => (
                  <div key={student.rank} className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-300 text-xs block">{student.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono font-semibold">Username: {student.nickname} • {student.level}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-sky-400 font-bold block text-xs">{student.xp} XP total</span>
                      <span className="text-[9px] text-slate-600 block">Rank: {student.rank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeRole === 'parent' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6 animate-fade-in">
            <div className="border-b border-slate-850 pb-2 flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Authorized Parent Access Terminal
              </span>
              <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[9px] font-mono rounded font-bold">
                Student: Remmy Nsanzimana
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-3">
                <span className="text-[10px] uppercase font-bold text-purple-400 block">Term 3 Assessment Attendance Compliance</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-900 p-2.5 rounded text-center">
                    <span className="text-slate-500 block text-[9px]">COMPLIANCE</span>
                    <span className="text-sm font-bold text-emerald-400 block mt-1">100% Verified</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded text-center">
                    <span className="text-slate-500 block text-[9px]">RECORDS COUNT</span>
                    <span className="text-sm font-bold text-slate-200 block mt-1">36 Total Sessions</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded text-center">
                    <span className="text-slate-500 block text-[9px]">PRESENT RATIO</span>
                    <span className="text-sm font-bold text-slate-300 block mt-1">36 Active Logs</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded text-center">
                    <span className="text-slate-500 block text-[9px]">ABSENT LOGS</span>
                    <span className="text-sm font-bold text-rose-450 block mt-1">0 Absent</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase text-slate-500 block">Registrar Academic Remarks</span>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 leading-relaxed font-sans text-xs text-slate-400 space-y-2">
                  <p>
                    " Remmy continues to show excellent practical outputs, particularly inside advanced JavaScript structures, Event loop sequences and custom Express middleware controllers. He demonstrates deep persistence when constructing sandboxed environments. "
                  </p>
                  <span className="text-[10px] font-mono text-slate-500 text-right block">— Ms. Eric Mugisha, Faculty of Software Engineering Coordinator</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security & Token decoder console sidebar */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Key size={14} className="text-amber-500" />
              Relational DB Security
            </h4>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase text-slate-500 font-semibold">Decrypted JWT Claims</span>
              </div>
              <textarea
                value={jwtPayload}
                onChange={(e) => setJwtPayload(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-850 p-2 rounded text-[11px] text-emerald-400 font-mono outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-850">
              <span className="text-[10px] text-slate-400 font-semibold">Dynamic 2FA Enabled</span>
              <button
                onClick={() => {
                  setIs2faActive(!is2faActive);
                  setLogMessages([
                    `2026-06-11 12:10:00 - SECURITY: Dynamic 2FA permissions ${!is2faActive ? 'enabled' : 'disabled'}.`,
                    ...logMessages
                  ]);
                }}
                className={`px-3 py-1 font-mono text-[10px] rounded font-bold uppercase ${
                  is2faActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {is2faActive ? 'Active' : 'Deactivated'}
              </button>
            </div>

            <button
              onClick={handleDataBackup}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-sky-400 font-bold uppercase tracking-wider text-[11px] rounded border border-sky-500/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Database size={12} />
              JSON DB State Backup
            </button>
          </div>
        </div>

        {/* Security / System logs monitor */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3 flex-1">
          <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 block">
            Security & Governance Logs
          </span>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[9px] text-slate-400 space-y-2 max-h-[140px] overflow-y-auto" id="security-system-logs">
            {logMessages.map((log, li) => (
              <div key={li} className="border-b border-slate-900 pb-1.5 block">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
