import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";
import { useSessionChat } from "../hooks/useSessionChat";
import Navbar from "../components/Navbar";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import VideoPanel from "../components/VideoPanel";
import ChatPanel from "../components/ChatPanel";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Loader2,
  LogOut,
  Clock,
  Users,
  BookOpen,
  Lightbulb,
  ShieldCheck,
  Monitor,
  MessageSquare,
  Link2,
  Copy,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const userName = user?.email?.split("@")[0] || "Guest";

  // Session state
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Code editor state
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Timer
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Right panel tab
  const [activeTab, setActiveTab] = useState("video");

  // Invite link
  const [copied, setCopied] = useState(false);

  // Real-time chat via Supabase Realtime Broadcast
  const { messages, sendMessage, addSystemMessage, isConnected: chatConnected } =
    useSessionChat(id, userName);

  // Initialize session from URL param
  useEffect(() => {
    const allProblems = Object.values(PROBLEMS);
    const problem = allProblems.find((p) => id?.includes(p.id)) || allProblems[0];

    const sessionData = {
      _id: id,
      problem: problem.title,
      problemId: problem.id,
      difficulty: problem.difficulty.toLowerCase(),
      status: "active",
      host: { name: userName, email: user?.email || "guest@codest.dev" },
      participant: null,
      createdAt: new Date().toISOString(),
    };

    setSession(sessionData);
    setCode(problem.starterCode.javascript);
    setLoading(false);
  }, [id, user]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const problemData = session?.problemId ? PROBLEMS[session.problemId] : null;

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(problemData?.starterCode?.[newLang] || "");
    setOutput(null);
  };

  const normalizeOutput = (out) => {
    return out
      .trim()
      .split("\n")
      .map((line) =>
        line.trim().replace(/\[\s+/g, "[").replace(/\s+\]/g, "]").replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    if (result.success && problemData) {
      const expectedOutput = problemData.expectedOutput[selectedLanguage];
      const normalizedActual = normalizeOutput(result.output);
      const normalizedExpected = normalizeOutput(expectedOutput);

      if (normalizedActual === normalizedExpected) {
        confetti({ particleCount: 80, spread: 250, origin: { x: 0.2, y: 0.6 } });
        confetti({ particleCount: 80, spread: 250, origin: { x: 0.8, y: 0.6 } });
        toast.success("All tests passed! Great job!");
        addSystemMessage(`${userName} solved the problem! All tests passed.`);
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else if (!result.success) {
      toast.error("Code execution failed!");
    }
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session?")) {
      clearInterval(timerRef.current);
      toast.success("Session ended");
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-100">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      {/* Session status bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-base-200 border-b border-base-content/10 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-success animate-pulse" />
            <span className="font-semibold">{session?.problem}</span>
          </div>
          <span className={`badge badge-sm ${getDifficultyBadgeClass(session?.difficulty)}`}>
            {session?.difficulty?.charAt(0).toUpperCase() + session?.difficulty?.slice(1)}
          </span>
          <div className="flex items-center gap-1.5 text-base-content/60">
            <Users className="size-3.5" />
            <span>{session?.participant ? "2/2" : "1/2"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              toast.success("Session link copied! Share it to invite someone.");
              setTimeout(() => setCopied(false), 2000);
            }}
            className="btn btn-ghost btn-xs gap-1.5 text-primary"
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? "Copied!" : "Invite"}
          </button>
          <div className="flex items-center gap-1.5 font-mono text-base-content/70">
            <Clock className="size-3.5" />
            <span>{formatTime(elapsed)}</span>
          </div>
          <button onClick={handleEndSession} className="btn btn-error btn-xs gap-1.5">
            <LogOut className="size-3" />
            End Session
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL — Problem + Code Editor + Output */}
          <Panel defaultSize={60} minSize={35}>
            <PanelGroup direction="vertical">
              {/* Problem description */}
              <Panel defaultSize={40} minSize={15}>
                <div className="h-full overflow-y-auto bg-base-200/50">
                  <div className="p-5 bg-base-100 border-b border-base-content/10">
                    <h2 className="text-xl font-bold">{problemData?.title}</h2>
                    <p className="text-sm text-base-content/60 mt-1">{problemData?.category}</p>
                    <p className="text-xs text-base-content/50 mt-2">
                      Host: {session?.host?.name} &bull;{" "}
                      {session?.participant ? "2" : "1"}/2 participants
                    </p>
                  </div>

                  <div className="p-5 space-y-4">
                    {problemData?.description && (
                      <div className="rounded-xl bg-base-100 border border-base-content/10 p-4">
                        <h3 className="flex items-center gap-2 font-bold mb-2">
                          <BookOpen className="size-4 text-primary" />
                          Description
                        </h3>
                        <p className="text-sm text-base-content/80 leading-relaxed">
                          {problemData.description.text}
                        </p>
                        {problemData.description.notes?.map((note, idx) => (
                          <p key={idx} className="text-sm text-base-content/80 mt-2">
                            {note}
                          </p>
                        ))}
                      </div>
                    )}

                    {problemData?.examples && (
                      <div className="rounded-xl bg-base-100 border border-base-content/10 p-4">
                        <h3 className="flex items-center gap-2 font-bold mb-3">
                          <Lightbulb className="size-4 text-secondary" />
                          Examples
                        </h3>
                        <div className="space-y-3">
                          {problemData.examples.map((ex, idx) => (
                            <div key={idx} className="bg-base-200 rounded-lg p-3 font-mono text-xs space-y-1">
                              <div className="flex gap-2">
                                <span className="text-primary font-bold min-w-[55px]">Input:</span>
                                <span>{ex.input}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-success font-bold min-w-[55px]">Output:</span>
                                <span>{ex.output}</span>
                              </div>
                              {ex.explanation && (
                                <div className="pt-1.5 border-t border-base-content/10 mt-1.5 font-sans text-xs text-base-content/60">
                                  <span className="font-semibold">Explanation:</span> {ex.explanation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {problemData?.constraints && (
                      <div className="rounded-xl bg-base-100 border border-base-content/10 p-4">
                        <h3 className="flex items-center gap-2 font-bold mb-2">
                          <ShieldCheck className="size-4 text-warning" />
                          Constraints
                        </h3>
                        <ul className="space-y-1">
                          {problemData.constraints.map((c, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs">
                              <span className="text-primary mt-0.5">•</span>
                              <code className="bg-base-200 px-1.5 py-0.5 rounded">{c}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1.5 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Code editor + Output */}
              <Panel defaultSize={40} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-1.5 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT PANEL — Video + Chat */}
          <Panel defaultSize={40} minSize={25}>
            <div className="h-full flex flex-col bg-base-200">
              {/* Tab switcher */}
              <div className="flex border-b border-base-content/10 bg-base-100">
                <button
                  onClick={() => setActiveTab("video")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    activeTab === "video"
                      ? "text-primary border-b-2 border-primary"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  <Monitor className="size-4" />
                  Video Call
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    activeTab === "chat"
                      ? "text-primary border-b-2 border-primary"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  <MessageSquare className="size-4" />
                  Chat
                  {messages.length > 0 && (
                    <span className="badge badge-xs badge-primary">{messages.length}</span>
                  )}
                </button>
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === "video" ? (
                  <VideoPanel sessionId={id} userName={userName} />
                ) : (
                  <ChatPanel
                    messages={messages}
                    onSendMessage={sendMessage}
                    isConnected={chatConnected}
                  />
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;
