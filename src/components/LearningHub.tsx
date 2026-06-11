import React, { useState } from 'react';
import { CourseModulesList, CourseModule, Lesson } from '../types';
import { Play, Check, HelpCircle, Trophy, BookOpen, Clock, Lightbulb, Keyboard, Info } from 'lucide-react';

interface LearningHubProps {
  onLoadLessonCode: (code: string, language: 'javascript' | 'html' | 'java' | 'sql') => void;
  onAddXp: (amount: number) => void;
}

export default function LearningHub({ onLoadLessonCode, onAddXp }: LearningHubProps) {
  const [selectedModule, setSelectedModule] = useState<CourseModule>(CourseModulesList[0]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(CourseModulesList[0].lessons[0]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const handleSelectModule = (mod: CourseModule) => {
    setSelectedModule(mod);
    setSelectedLesson(mod.lessons[0]);
  };

  const handleSelectLesson = (less: Lesson) => {
    setSelectedLesson(less);
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    const key = `${selectedLesson.id}_${questionIndex}`;
    if (quizSubmitted[key]) return; // locked if submitted
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="learning-workspace">
      {/* Module lists bar */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Course Navigation Cards */}
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
                onClick={() => handleSelectModule(mod)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col gap-1 ${
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
            Unit Syllabus Units
          </span>

          <div className="space-y-2">
            {selectedModule.lessons.map((less) => (
              <button
                key={less.id}
                onClick={() => handleSelectLesson(less)}
                className={`w-full text-left p-2.5 rounded border transition-all flex items-center justify-between ${
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
                    <span className="text-xs font-semibold text-slate-300 block truncate">{less.title}</span>
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
              {/* Parse and render our markdown content inline nicely */}
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
                      let optionStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';
                      
                      if (idSelected) {
                        if (isSubmitted) {
                          optionStyle = isCorrect 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                            : 'bg-red-500/10 border-red-500/40 text-red-400';
                        } else {
                          optionStyle = 'bg-sky-500/10 border-sky-500/40 text-sky-400';
                        }
                      } else if (isSubmitted && oi === q.correctIndex) {
                        // Highlight true option post submission
                        optionStyle = 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400';
                      }

                      return (
                        <button
                          key={oi}
                          onClick={() => handleSelectOption(qi, oi)}
                          disabled={isSubmitted}
                          className={`w-full text-left p-2.5 rounded border ${optionStyle} transition-all text-xs font-medium flex items-center justify-between`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && oi === q.correctIndex && (
                            <Check size={14} className="text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submission and reviews */}
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
                      <span className="text-[10px] text-slate-500 italic">Select option above and submit for score valuation!</span>
                    )}

                    {!isSubmitted && (
                      <button
                        onClick={() => handleSubmitQuiz(qi)}
                        className="px-4 py-1.5 bg-sky-505 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-xs font-semibold font-mono"
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
  );
}
