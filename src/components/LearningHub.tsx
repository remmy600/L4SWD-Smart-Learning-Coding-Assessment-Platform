import React, { useState, useEffect } from 'react';
import { CourseModulesList, CourseModule, Lesson } from '../types';
import { 
  Play, Check, HelpCircle, Trophy, BookOpen, Clock, Lightbulb, 
  Keyboard, Info, Plus, ChevronRight, Send, AlertTriangle, Database, CheckSquare, RefreshCw
} from 'lucide-react';

interface LearningHubProps {
  onLoadLessonCode: (code: string, language: 'javascript' | 'html' | 'java' | 'sql') => void;
  onAddXp: (amount: number) => void;
  token: string | null;
  currentUser: any;
}

export default function LearningHub({ onLoadLessonCode, onAddXp, token, currentUser }: LearningHubProps) {
  // Navigation states
  const [activeSubTab, setActiveSubTab] = useState<'tutorial' | 'exams'>('tutorial');
  
  // Tutorial States
  const [selectedModule, setSelectedModule] = useState<CourseModule>(CourseModulesList[0]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(CourseModulesList[0].lessons[0]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Database Exams States
  const [dbExams, setDbExams] = useState<any[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState<boolean>(false);
  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number | null>(null);
  const [examTimeLeft, setExamTimeLeft] = useState<number>(0);
  const [examTimerId, setExamTimerId] = useState<any>(null);

  // Teacher Exam Creator States
  const [isCreatingExam, setIsCreatingExam] = useState<boolean>(false);
  const [newExamTitle, setNewExamTitle] = useState<string>('');
  const [newExamCourse, setNewExamCourse] = useState<string>('React Development');
  const [newExamDuration, setNewExamDuration] = useState<number>(15);
  const [newQuestions, setNewQuestions] = useState<any[]>([
    {
      question: 'Identify the characteristic of pure functions in advanced scope design.',
      options: [
        'They modify global workspace parent parameters',
        'They always return the identical output for matching input arguments and generate zero side effects',
        'They execute asynchronous triggers before compiling',
        'They require an active MongoDB connection'
      ],
      correctIndex: 1,
      explanation: 'Pure functions operate within local bounds, never altering outer execution contexts, which ensures zero side effects.'
    }
  ]);

  useEffect(() => {
    if (activeSubTab === 'exams') {
      fetchExamsFromDB();
    }
  }, [activeSubTab]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (examTimerId) clearInterval(examTimerId);
    };
  }, [examTimerId]);

  const fetchExamsFromDB = async () => {
    setIsLoadingExams(true);
    try {
      const resp = await fetch("/api/exams");
      if (resp.ok) {
        const data = await resp.json();
        setDbExams(data);
      }
    } catch (err) {
      console.error("Failed fetching database exams list:", err);
    } finally {
      setIsLoadingExams(false);
    }
  };

  // Static Quizzes
  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    const key = `${selectedLesson.id}_${questionIndex}`;
    if (quizSubmitted[key]) return;
    setQuizAnswers({
      ...quizAnswers,
      [key]: optionIndex
    });
  };

  const handleSubmitQuiz = (questionIndex: number) => {
    const key = `${selectedLesson.id}_${questionIndex}`;
    const selected = quizAnswers[key];
    if (selected === undefined) {
      alert("Please select an answer option first!");
      return;
    }
    
    setQuizSubmitted({
      ...quizSubmitted,
      [key]: true
    });

    const isCorrect = selected === selectedLesson.quiz[questionIndex].correctIndex;
    if (isCorrect) {
      onAddXp(selectedLesson.xpValue);
      if (!completedLessons.includes(selectedLesson.id)) {
        setCompletedLessons([...completedLessons, selectedLesson.id]);
      }
    }
  };

  // DB Exam Handlers
  const handleStartExam = (exam: any) => {
    setActiveExam(exam);
    setExamAnswers({});
    setExamSubmitted(false);
    setExamScore(null);
    setExamTimeLeft(exam.durationMins * 60);

    // Initializer timer countdown
    if (examTimerId) clearInterval(examTimerId);
    const tmId = setInterval(() => {
      setExamTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(tmId);
          // Auto submit
          handleAutoSubmitExam(exam);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setExamTimerId(tmId);
  };

  const handleSelectExamOption = (questionIdx: number, optionIdx: number) => {
    if (examSubmitted) return;
    setExamAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleAutoSubmitExam = async (examToSubmit: any) => {
    if (examTimerId) clearInterval(examTimerId);
    setExamSubmitted(true);
    
    const questions = examToSubmit.questions;
    let correctCount = 0;
    
    questions.forEach((q: any, idx: number) => {
      if (examAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const finalPct = Math.round((correctCount / questions.length) * 100);
    const xpReward = Math.max(50, correctCount * 120); // 120 XP per correct database node

    setExamScore(finalPct);

    // POST exam submission to node API server
    if (token) {
      try {
        await fetch("/api/exams/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            examId: examToSubmit.id,
            score: finalPct,
            xpEarned: xpReward
          })
        });
        onAddXp(xpReward);
        alert(`Assessment completed! Score: ${finalPct}%. Added +${xpReward} XP verified on Atlas.`);
      } catch (err) {
        console.error("Failed persisting exam results to database:", err);
      }
    }
  };

  // Teacher Exam creator handlers
  const handleAddQuestionField = () => {
    setNewQuestions([
      ...newQuestions,
      {
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: ''
      }
    ]);
  };

  const handleQuestionChange = (qIdx: number, field: string, value: any) => {
    const updated = [...newQuestions];
    updated[qIdx][field] = value;
    setNewQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    const updated = [...newQuestions];
    updated[qIdx].options[optIdx] = value;
    setNewQuestions(updated);
  };

  const handlePublishDbExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim() || !newExamCourse.trim()) {
      alert("Please specify exam title and syllabus course parameters.");
      return;
    }

    // Verify questions fields
    let invalid = false;
    newQuestions.forEach((q) => {
      if (!q.question.trim() || q.options.some((o: string) => !o.trim())) {
        invalid = true;
      }
    });

    if (invalid) {
      alert("All question queries and option lines must contain descriptive strings.");
      return;
    }

    try {
      const resp = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newExamTitle.trim(),
          course: newExamCourse,
          durationMins: newExamDuration,
          questions: newQuestions
        })
      });

      if (resp.ok) {
        alert("Exam published and uploaded to MongoDB Atlas collection!");
        setIsCreatingExam(false);
        setNewExamTitle('');
        setNewQuestions([{
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          explanation: ''
        }]);
        fetchExamsFromDB();
      } else {
        const errData = await resp.json();
        alert(`Failed to save: ${errData.error}`);
      }
    } catch (err) {
      alert("Server synchronization failure. Confirm backend container states.");
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Subtabs selectors */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveSubTab('tutorial')}
          className={`px-4 py-2.5 font-mono text-xs uppercase font-extrabold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'tutorial' 
              ? 'border-sky-500 text-sky-450 text-sky-400 bg-sky-500/5' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🎓 Interactive Tutorial Syllabus
        </button>
        <button
          onClick={() => setActiveSubTab('exams')}
          className={`px-4 py-2.5 font-mono text-xs uppercase font-extrabold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'exams' 
              ? 'border-emerald-500 text-emerald-450 text-emerald-400 bg-emerald-500/5' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          📂 Standard Database Exams (Atlas DB)
        </button>
      </div>

      {activeSubTab === 'tutorial' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="learning-workspace">
          {/* Module lists bar */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <BookOpen className="text-sky-400" size={18} />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  L4 Syllabuses Modules
                </h4>
              </div>

              <div className="space-y-2">
                {CourseModulesList.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModule(mod);
                      setSelectedLesson(mod.lessons[0]);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col gap-1 cursor-pointer ${
                      selectedModule.id === mod.id
                        ? 'bg-sky-500/10 border-sky-500/30'
                        : 'border-transparent bg-slate-950/40 hover:bg-slate-950/80'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                        mod.category === 'frontend' ? 'bg-sky-500/10 text-sky-400' : 'bg-purple-500/10 text-purple-400'
                      }`}>
                        {mod.category === 'frontend' ? 'Frontend' : 'Backend'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {mod.lessons.length} Modules Unit
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-200 mt-1">{mod.title}</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed truncate w-full">{mod.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Lesson Submodule Tracker */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex-1">
              <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 block mb-3">
                Syllabus Lessons
              </span>

              <div className="space-y-2">
                {selectedModule.lessons.map((less) => (
                  <button
                    key={less.id}
                    onClick={() => setSelectedLesson(less)}
                    className={`w-full text-left p-2.5 rounded border transition-all flex items-center justify-between cursor-pointer ${
                      selectedLesson.id === less.id
                        ? 'bg-slate-950 border-slate-700'
                        : 'border-transparent bg-transparent hover:bg-slate-950/45'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full ${
                        completedLessons.includes(less.id) ? 'bg-emerald-400 shadow-glow' : 'bg-slate-600'
                      }`} />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-350 text-slate-300 block truncate">{less.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                          <Clock size={10} /> {less.duration}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded shrink-0">
                      +{less.xpValue} XP
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main lecture container */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col min-h-[450px]">
              {/* Header */}
              <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <span className="text-[10px] font-mono text-sky-400 uppercase font-bold tracking-widest block mb-0.5">
                    ACTIVE LESSON
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{selectedLesson.title}</h3>
                </div>

                {selectedLesson.initialCode && (
                  <button
                    onClick={() => onLoadLessonCode(selectedLesson.initialCode!, selectedLesson.language || 'javascript')}
                    className="flex items-center gap-1.5 px-4.5 py-2 bg-sky-500 hover:bg-sky-450 text-slate-950 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-sky-500/10"
                  >
                    <Keyboard size={13} />
                    Load In IDE Workspace
                  </button>
                )}
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 overflow-y-auto max-h-[350px] space-y-4 text-slate-300 border-b border-slate-800" id="lesson-instruction-panel">
                <div className="prose prose-invert prose-xs max-w-none text-xs leading-relaxed space-y-4">
                  {selectedLesson.content.split('\n\n').map((para, pi) => {
                    if (para.startsWith('###')) {
                      return <h4 key={pi} className="text-sm font-bold text-slate-100 uppercase font-mono pt-2">{para.replace('###', '').trim()}</h4>;
                    }
                    if (para.startsWith('####')) {
                      return <h5 key={pi} className="text-xs font-bold text-sky-400 uppercase font-mono pt-1">{para.replace('####', '').trim()}</h5>;
                    }
                    if (para.startsWith('-')) {
                      return (
                        <ul key={pi} className="list-disc list-inside space-y-1 pl-2 font-sans">
                          {para.split('\n').map((item, ii) => (
                            <li key={ii} className="text-slate-300">{item.replace('-', '').trim()}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (para.startsWith('```')) {
                      const cleanedCode = para.replace(/```javascript|```java|```sql|```/g, '').trim();
                      return (
                        <pre key={pi} className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[11px] text-slate-300 overflow-x-auto">
                          <code>{cleanedCode}</code>
                        </pre>
                      );
                    }
                    return <p key={pi} className="font-sans text-slate-300">{para}</p>;
                  })}
                </div>
              </div>

              {/* Multiple choice quiz wrapper */}
              <div className="p-6 bg-slate-950/45 space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-amber-400" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Lesson Conceptual Quiz Verification
                  </span>
                </div>

                {selectedLesson.quiz.map((q, qi) => {
                  const quizKey = `${selectedLesson.id}_${qi}`;
                  const selectedIdx = quizAnswers[quizKey];
                  const isSubmitted = quizSubmitted[quizKey];
                  const isCorrect = selectedIdx === q.correctIndex;

                  return (
                    <div key={qi} className="bg-slate-950 border border-slate-850 rounded-xl p-4.5 space-y-3">
                      <h6 className="text-xs font-semibold text-slate-200">{q.question}</h6>

                      <div className="space-y-2">
                        {q.options.map((opt, oi) => {
                          const idSelected = selectedIdx === oi;
                          let optionStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850';
                          
                          if (idSelected) {
                            if (isSubmitted) {
                              optionStyle = isCorrect 
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                                : 'bg-red-500/10 border-red-500/40 text-red-400';
                            } else {
                              optionStyle = 'bg-sky-500/10 border-sky-500/40 text-sky-400';
                            }
                          } else if (isSubmitted && oi === q.correctIndex) {
                            optionStyle = 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400';
                          }

                          return (
                            <button
                              key={oi}
                              disabled={isSubmitted}
                              onClick={() => handleSelectOption(qi, oi)}
                              className={`w-full text-left p-2.5 rounded border ${optionStyle} transition-all text-xs font-medium flex items-center justify-between cursor-pointer`}
                            >
                              <span>{opt}</span>
                              {isSubmitted && oi === q.correctIndex && (
                                <Check size={14} className="text-emerald-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        {isSubmitted ? (
                          <div className="flex items-start gap-1.5 p-2 bg-slate-900/60 rounded text-[10px] text-slate-400 border border-slate-800">
                            <Info size={11} className="text-yellow-400 shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-slate-300 uppercase font-mono block mb-0.5">Explanation:</strong>
                              {q.explanation}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Select option above and verify correct solutions!</span>
                        )}

                        {!isSubmitted && (
                          <button
                            onClick={() => handleSubmitQuiz(qi)}
                            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-705 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-[#0ea5e9] hover:text-sky-350 text-xs font-semibold font-mono border border-slate-700 cursor-pointer"
                          >
                            Verify Correctness
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // EXAMS CENTER OR PUBLISHER SCREEN
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            
            {/* Database status and totals */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Database className="text-emerald-400 animate-pulse" size={16} />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">Live Assessment Nodes</span>
                </div>
                <button 
                  onClick={fetchExamsFromDB}
                  className="p-1 hover:bg-slate-850 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <RefreshCw size={12} className={isLoadingExams ? "animate-spin" : ""} />
                </button>
              </div>

              {currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin') && (
                <button
                  onClick={() => setIsCreatingExam(!isCreatingExam)}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded font-bold text-xs uppercase font-mono flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>{isCreatingExam ? "Close Exam Drafter" : "Publish Atlas Exam"}</span>
                </button>
              )}

              <div className="space-y-2 mt-4">
                {isLoadingExams ? (
                  <div className="py-8 text-center font-mono text-xs text-slate-500">Querying Atlas Cluster...</div>
                ) : dbExams.length === 0 ? (
                  <div className="py-8 text-center text-slate-550 border border-dashed border-slate-800 rounded-lg text-xs leading-relaxed p-4">
                    No active DB assessments generated. Teacher credentials may author on-demand nodes!
                  </div>
                ) : (
                  dbExams.map((ex: any) => (
                    <button
                      key={ex.id}
                      onClick={() => handleStartExam(ex)}
                      className={`w-full text-left p-3.5 rounded-lg border transition-all flex flex-col gap-1 cursor-pointer ${
                        activeExam?.id === ex.id 
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' 
                          : 'bg-slate-950/50 border-transparent hover:border-slate-800 text-slate-300'
                      }`}
                    >
                      <h5 className="text-xs font-bold text-slate-200 block truncate">{ex.title}</h5>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2">
                        <span>Course: {ex.course}</span>
                        <span>Time Limits: {ex.durationMins} mins</span>
                      </div>
                      <div className="text-[9px] text-slate-500 italic mt-1 text-right">Drafted by faculty: {ex.createdBy}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {isCreatingExam ? (
              // TEACHER EXAM CREATOR VIEW
              <form onSubmit={handlePublishDbExam} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 uppercase font-mono text-emerald-400">Database Exam Builder</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-sans leading-relaxed">Generated nodes persist immediately inside the MongoDB Atlas primary collection.</p>
                  </div>
                  <Database size={16} className="text-emerald-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">Assessment Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Terms III MCQ Final"
                      value={newExamTitle}
                      onChange={(e) => setNewExamTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-300 outline-none"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">Course Syllabus</label>
                    <select
                      value={newExamCourse}
                      onChange={(e) => setNewExamCourse(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-300 outline-none"
                    >
                      <option>React Development</option>
                      <option>Node.js Backend</option>
                      <option>Java Software Engineering</option>
                      <option>MongoDB & Relational Database</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">Period (Mins)</label>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={newExamDuration}
                      onChange={(e) => setNewExamDuration(parseInt(e.target.value) || 15)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-300 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-850">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Assigned Questions List</span>
                    <button
                      type="button"
                      onClick={handleAddQuestionField}
                      className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded text-[10px] font-mono text-emerald-400 font-bold block cursor-pointer"
                    >
                      + Add Question
                    </button>
                  </div>

                  {newQuestions.map((q, qi) => (
                    <div key={qi} className="bg-slate-950 border border-slate-850 rounded-lg p-4.5 space-y-3 relative">
                      <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400">Question #{qi + 1}</span>
                        {newQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setNewQuestions(newQuestions.filter((_, i) => i !== qi))}
                            className="text-[9px] font-mono text-rose-500 font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Question Description</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. What is the Big O runtime profile of dual binary indexed queries?"
                          value={q.question}
                          onChange={(e) => handleQuestionChange(qi, 'question', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-350 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                        {q.options.map((opt: string, oi: number) => (
                          <div key={oi} className="space-y-1">
                            <label className="text-[8px] font-mono text-slate-500 uppercase font-bold block">Option {String.fromCharCode(65 + oi)}</label>
                            <input
                              type="text"
                              required
                              placeholder={`Option Line Content`}
                              value={opt}
                              onChange={(e) => handleOptionChange(qi, oi, e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-350 outline-none"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-1">Correct Answer Index</label>
                          <select
                            value={q.correctIndex}
                            onChange={(e) => handleQuestionChange(qi, 'correctIndex', parseInt(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-350 outline-none font-mono"
                          >
                            <option value={0}>Option A (Index 0)</option>
                            <option value={1}>Option B (Index 1)</option>
                            <option value={2}>Option C (Index 2)</option>
                            <option value={3}>Option D (Index 3)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-1">Academic Explanation Explainer</label>
                          <input
                            type="text"
                            required
                            placeholder="Explanation post validation submission..."
                            value={q.explanation}
                            onChange={(e) => handleQuestionChange(qi, 'explanation', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-350 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded font-bold text-xs uppercase font-mono tracking-widest cursor-pointer mt-4"
                >
                  Publish & Write To MongoDB Collection
                </button>
              </form>
            ) : activeExam ? (
              // STUDENT ACTIVE EXAM TAKING SHELL
              <div className="bg-slate-900 border border-slate-850 rounded-xl p-6 shadow-xl space-y-6">
                <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-widest block mb-0.5">
                      ACTIVE SECURE SESSION EXAM
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">{activeExam.title}</h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
                    <Clock size={12} className="animate-pulse" />
                    <span className="font-mono text-xs font-black">{formatTimer(examTimeLeft)}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {activeExam.questions.map((q: any, qi: number) => {
                    const selOpt = examAnswers[qi];
                    
                    return (
                      <div key={qi} className="bg-slate-950 border border-slate-850 p-4.5 rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <h6 className="text-xs font-semibold text-slate-200">
                            {qi + 1}. {q.question}
                          </h6>
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt: string, oi: number) => {
                            const isChosen = selOpt === oi;
                            let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850';

                            if (isChosen) {
                              if (examSubmitted) {
                                style = oi === q.correctIndex 
                                  ? 'bg-emerald-500/15 border-emerald-500/45 text-emerald-400 font-extrabold'
                                  : 'bg-rose-500/15 border-rose-500/40 text-rose-400';
                              } else {
                                style = 'bg-sky-500/15 border-sky-500/45 text-sky-450 text-sky-400';
                              }
                            } else if (examSubmitted && oi === q.correctIndex) {
                              style = 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400';
                            }

                            return (
                              <button
                                key={oi}
                                disabled={examSubmitted}
                                onClick={() => handleSelectExamOption(qi, oi)}
                                className={`w-full text-left p-2.5 rounded border ${style} text-xs font-medium flex items-center justify-between cursor-pointer transition-all`}
                              >
                                <span>{opt}</span>
                                {examSubmitted && oi === q.correctIndex && (
                                  <Check size={14} className="text-emerald-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {examSubmitted && (
                          <div className="p-3 bg-slate-900 border border-slate-850 text-[10px] text-slate-400 rounded-lg">
                            <span className="font-mono text-emerald-400 font-bold block mb-1">Explanation Explanation:</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!examSubmitted ? (
                  <button
                    onClick={() => {
                      if (confirm("Verify all questions are finalized. Submit answers to database?")) {
                        handleAutoSubmitExam(activeExam);
                      }
                    }}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded font-bold font-mono text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                  >
                    Commit Exam & Update Database Logs
                  </button>
                ) : (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center space-y-2">
                    <span className="text-xs text-slate-350 text-slate-300 block">Assessment committed and results successfully synchronized on Atlas collections.</span>
                    <button
                      onClick={() => setActiveExam(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono uppercase font-bold rounded"
                    >
                      Return to exams list
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // DEFAULT EMPTY OR SCOREBOARD OVERVIEW
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl text-center space-y-4 flex flex-col justify-center items-center min-h-[350px]">
                <Database size={40} className="text-slate-650 text-slate-600 block mb-2" />
                <h4 className="text-xs uppercase font-mono font-black text-slate-300">Continuous Assessment Engine</h4>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Select any direct dynamic exam available on the left sidebar pane. These assessments sync scores to your profile records.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
