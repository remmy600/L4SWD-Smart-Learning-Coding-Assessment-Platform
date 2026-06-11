import React, { useState, useEffect } from 'react';
import { SampleForumTopics, ForumTopic } from '../types';
import { Users, MessagesSquare, FolderPlus, Send, MessageSquare, Tag, Plus, Check, RefreshCw, Layers } from 'lucide-react';

export default function CollaborationHub() {
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>(SampleForumTopics);
  const [activeTopic, setActiveTopic] = useState<ForumTopic | null>(null);
  
  // Real-time chat simulation states
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<{ author: string; text: string; time: string; self?: boolean }[]>([
    { author: "Aline Uwase", text: "Are we submitting the SQL query assignment tonight or tomorrow?", time: "10:15 AM" },
    { author: "Patrick Ishimwe", text: "Deadline is June 12 according to the platform, guys. Best double-check the Joins logic.", time: "10:18 AM" },
    { author: "Erick Mugisha (Teacher)", text: "Ensure your schemas satisfy 3rd Normal Form (3NF) requirements. I won't accept duplicated key sets.", time: "10:25 AM" }
  ]);
  const [simulatedClassmateIsTyping, setSimulatedClassmateIsTyping] = useState<boolean>(false);

  // Forums reply action
  const [forumReplyInput, setForumReplyInput] = useState<string>('');

  // Study group repositories mock list
  const [studyRepos, setStudyRepos] = useState([
    { id: 1, name: "l4-express-auth-check", owner: "TOXIC CODERKILLER", contributors: 3, lastUpdated: "5 mins ago" },
    { id: 2, name: "java-overriding-polymorphs", owner: "BYTE_CRUSHER", contributors: 2, lastUpdated: "2 hours ago" },
    { id: 3, name: "react-19-actions-playground", owner: "SHADOW_CODE", contributors: 4, lastUpdated: "1 day ago" }
  ]);
  const [newRepoName, setNewRepoName] = useState('');

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = {
      author: "Remmy (TOXIC CODERKILLER)",
      text: chatInput,
      time: "Today",
      self: true
    };
    setChatMessages([...chatMessages, userMsg]);
    setChatInput('');

    // Trigger classmate simulation reaction
    setSimulatedClassmateIsTyping(true);
    setTimeout(() => {
      setSimulatedClassmateIsTyping(false);
      const responses = [
        "Let's write a database schema test in SQL Query runner!",
        "Perfect. I loaded your code block into my IDE, it compiles clean.",
        "That actions Paradigm in React 19 is incredibly smooth.",
        "I'm launching my Pomodoro timer in FocusGuard, let's log 45 minutes of deep session studying!",
        "Teacher Eric, does our JWT token authorization middleware require RSA cryptographs?",
        "Don't forget to back up your database schemas into JSON records before Term 3 locks."
      ];
      const randomMsg = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [
        ...prev,
        {
          author: ["Aline Uwase", "Patrick Ishimwe", "Diana Keza"][Math.floor(Math.random() * 3)],
          text: randomMsg,
          time: "Just now"
        }
      ]);
    }, 2000);
  };

  const handlePostForumReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forumReplyInput.trim() || !activeTopic) return;
    
    const updatedReplies = [
      ...activeTopic.repliesList,
      {
        author: "Remmy (TOXIC CODERKILLER)",
        authorRole: "Full-Stack Developer",
        content: forumReplyInput,
        time: "Just now"
      }
    ];

    const updatedTopics = forumTopics.map((topic) => {
      if (topic.id === activeTopic.id) {
        return {
          ...topic,
          replies: topic.replies + 1,
          repliesList: updatedReplies
        };
      }
      return topic;
    });

    setForumTopics(updatedTopics);
    setActiveTopic({
      ...activeTopic,
      replies: activeTopic.replies + 1,
      repliesList: updatedReplies
    });
    setForumReplyInput('');
  };

  const handleRegisterRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;
    const newRepoItem = {
      id: Date.now(),
      name: newRepoName.toLowerCase().replace(/\s+/g, '-'),
      owner: "TOXIC CODERKILLER",
      contributors: 1,
      lastUpdated: "Just now"
    };
    setStudyRepos([newRepoItem, ...studyRepos]);
    setNewRepoName('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="collaboration-workspace">
      {/* Discussion forums matrix on left */}
      <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 min-h-[480px]">
        <div className="flex justify-between items-center border-b border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-sky-400" size={18} />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Discussion Forums Roster
            </h4>
          </div>

          {activeTopic && (
            <button
              onClick={() => setActiveTopic(null)}
              className="text-sky-400 hover:text-sky-300 text-xs font-mono uppercase"
            >
              ← Back to List
            </button>
          )}
        </div>

        {activeTopic ? (
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-2">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                <div className="flex wrap justify-between text-[10px] font-mono text-slate-500">
                  <span>Author: {activeTopic.author}</span>
                  <span>Replies: {activeTopic.replies} • Views: {activeTopic.views}</span>
                </div>
                <h5 className="text-sm font-bold text-slate-200">{activeTopic.title}</h5>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{activeTopic.content}</p>
              </div>

              {/* Replies logs list */}
              <div className="space-y-2 pl-3 border-l-2 border-slate-800">
                {activeTopic.repliesList.map((rep, ri) => (
                  <div key={ri} className="bg-slate-950/40 p-3 rounded-lg border border-slate-855 text-xs text-slate-300">
                    <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
                      <span className="font-semibold text-sky-400">{rep.author} {rep.authorRole && `(${rep.authorRole})`}</span>
                      <span>{rep.time}</span>
                    </div>
                    <p className="font-sans leading-relaxed text-slate-400">{rep.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handlePostForumReply} className="flex gap-2 pt-3 border-t border-slate-850">
              <input
                type="text"
                placeholder="Write helpful response inside conversation thread..."
                value={forumReplyInput}
                onChange={(e) => setForumReplyInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-300 text-xs outline-none"
              />
              <button
                type="submit"
                className="px-4.5 py-2 bg-sky-505 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-xs font-semibold font-mono uppercase shrink-0"
              >
                Post Reply
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-3">
            {forumTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className="w-full text-left bg-slate-950/40 hover:bg-slate-950 p-3.5 rounded-xl border border-transparent hover:border-slate-800 transition-all flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono w-full">
                  <span>Created by {topic.author}</span>
                  <span>{topic.replies} Replies • {topic.views} Views</span>
                </div>
                <h5 className="text-xs font-bold text-slate-200 group-hover:text-sky-400">{topic.title}</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2">{topic.content}</p>
                <div className="flex gap-1.5">
                  {topic.tags.map(t => (
                    <span key={t} className="text-[9px] font-mono text-purple-400 uppercase bg-purple-500/5 border border-purple-500/10 px-1 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Realtime Classroom chat on right */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col h-[350px] justify-between">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
            <MessagesSquare className="text-purple-400 animate-pulse" size={18} />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              L4 Term 3 Group Chat
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs pr-1" id="group-chat-scroller">
            {chatMessages.map((msg, mi) => (
              <div
                key={mi}
                className={`max-w-[85%] rounded-lg p-2.5 ${
                  msg.self
                    ? 'bg-sky-500/15 border border-sky-500/20 text-sky-300 ml-auto'
                    : 'bg-slate-950 border border-slate-850 text-slate-300'
                }`}
              >
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
                  <span className={msg.self ? 'text-sky-400 font-bold' : 'text-purple-400 font-semibold'}>{msg.author}</span>
                  <span>{msg.time}</span>
                </div>
                <p className="font-sans leading-relaxed">{msg.text}</p>
              </div>
            ))}
            
            {simulatedClassmateIsTyping && (
              <div className="text-[10px] text-slate-500 italic flex items-center gap-1">
                <RefreshCw className="animate-spin" size={10} />
                <span>Classmate is typing active responses...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendChatMessage} className="flex gap-2 bg-slate-950 p-1 rounded border border-slate-800">
            <input
              type="text"
              placeholder="Compile chat message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-transparent px-2.5 py-1 text-slate-300 font-sans text-xs outline-none"
            />
            <button
              type="submit"
              className="p-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded transition-colors cursor-pointer"
            >
              <Send size={12} />
            </button>
          </form>
        </div>

        {/* Study group repositories sharing tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
          <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2">
            <FolderPlus className="text-sky-400" size={18} />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
              Study Group Repository Repos
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {studyRepos.map((repo) => (
              <div key={repo.id} className="bg-slate-950 p-2 text-slate-350 rounded border border-slate-850 flex justify-between items-center text-[11px]">
                <div>
                  <span className="text-slate-200 block truncate max-w-[180px]">/ {repo.name}</span>
                  <span className="text-[9px] text-slate-500">Sync Owner: {repo.owner}</span>
                </div>
                <span className="text-[10px] text-purple-400 px-1 rounded leading-none shrink-0 border border-purple-500/10 bg-purple-500/5">
                  {repo.contributors} developers
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleRegisterRepo} className="flex gap-2 pt-2 border-t border-slate-850">
            <input
              type="text"
              placeholder="Register shared team repo (e.g. express-jwt)"
              value={newRepoName}
              onChange={(e) => setNewRepoName(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-300 text-xs outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold"
            >
              Add repo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
