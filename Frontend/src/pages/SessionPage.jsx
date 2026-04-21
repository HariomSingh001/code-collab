import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Loader2,
  LogOut,
  Clock,
  Users,
  BookOpen,
  Lightbulb,
  ShieldCheck,
  Send,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

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

  // Chat
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  // Video placeholders
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  // Right panel tab
  const [activeTab, setActiveTab] = useState("video");

  // Initialize session from URL param
  useEffect(() => {
    const allProblems = Object.values(PROBLEMS);
    // Try to find problem by session id pattern, or pick a random one
    const problem = allProblems.find((p) => id?.includes(p.id)) || allProblems[0];

    const mockSession = {
      _id: id,
      problem: problem.title,
      problemId: problem.id,
      difficulty: problem.difficulty.toLowerCase(),
      status: "active",
      host: {
        name: user?.email?.split("@")[0] || "You",
        email: user?.email || "user@codest.dev",
      },
      participant: null,
      createdAt: new Date().toISOString(),
    };

    setSession(mockSession);
    setCode(problem.starterCode.javascript);
    setLoading(false);

    // Add a welcome message
    setMessages([
      {
        id: "system-1",
        sender: "system",
        text: `Session started! Problem: ${problem.title} (${problem.difficulty})`,
        time: new Date(),
      },
    ]);
  }, [id, user]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
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

  const normalizeOutput = (output) => {
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          .replace(/\s*,\s*/g, ",")
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

        setMessages((prev) => [
          ...prev,
          {
            id: `system-${Date.now()}`,
            sender: "system",
            text: `${session.host.name} solved the problem! All tests passed.`,
            time: new Date(),
          },
        ]);
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else if (!result.success) {
      toast.error("Code execution failed!");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: session?.host?.name || "You",
        text: chatInput.trim(),
        time: new Date(),
        isOwn: true,
      },
    ]);
    setChatInput("");
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

        <div className="flex items-center gap-4">
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
                    {/* Description */}
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

                    {/* Examples */}
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

                    {/* Constraints */}
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

              {/* Code editor */}
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
                  /* Video call panel */
                  <div className="h-full flex flex-col">
                    <div className="flex-1 p-4 grid grid-rows-2 gap-3">
                      {/* Host video */}
                      <div className="rounded-xl bg-base-300 border border-base-content/10 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                        <div className="text-center z-10">
                          <div className="size-16 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center mx-auto mb-3">
                            <span className="text-2xl font-bold text-primary-content">
                              {session?.host?.name?.[0]?.toUpperCase() || "Y"}
                            </span>
                          </div>
                          <p className="font-semibold">{session?.host?.name || "You"}</p>
                          <p className="text-xs text-base-content/50">Host</p>
                        </div>
                        {!videoEnabled && (
                          <div className="absolute inset-0 bg-base-300 flex items-center justify-center">
                            <VideoOff className="size-8 text-base-content/30" />
                          </div>
                        )}
                      </div>

                      {/* Participant video */}
                      <div className="rounded-xl bg-base-300 border border-base-content/10 flex items-center justify-center border-dashed">
                        <div className="text-center">
                          <div className="size-16 rounded-full bg-base-content/10 grid place-items-center mx-auto mb-3">
                            <Users className="size-7 text-base-content/30" />
                          </div>
                          <p className="text-sm text-base-content/50">Waiting for participant...</p>
                          <p className="text-xs text-base-content/40 mt-1">
                            Share session link to invite
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Video controls */}
                    <div className="flex items-center justify-center gap-3 py-3 px-4 bg-base-100 border-t border-base-content/10">
                      <button
                        onClick={() => setMicEnabled(!micEnabled)}
                        className={`btn btn-circle btn-sm ${
                          micEnabled ? "btn-ghost" : "btn-error"
                        }`}
                        title={micEnabled ? "Mute mic" : "Unmute mic"}
                      >
                        {micEnabled ? <Mic className="size-4" /> : <MicOff className="size-4" />}
                      </button>
                      <button
                        onClick={() => setVideoEnabled(!videoEnabled)}
                        className={`btn btn-circle btn-sm ${
                          videoEnabled ? "btn-ghost" : "btn-error"
                        }`}
                        title={videoEnabled ? "Turn off camera" : "Turn on camera"}
                      >
                        {videoEnabled ? (
                          <Video className="size-4" />
                        ) : (
                          <VideoOff className="size-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab("chat")}
                        className="btn btn-circle btn-sm btn-ghost"
                        title="Open chat"
                      >
                        <MessageSquare className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Chat panel */
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`${
                            msg.sender === "system"
                              ? "text-center"
                              : msg.isOwn
                              ? "flex justify-end"
                              : "flex justify-start"
                          }`}
                        >
                          {msg.sender === "system" ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-content/5 text-xs text-base-content/50">
                              <div className="size-1.5 rounded-full bg-primary" />
                              {msg.text}
                            </div>
                          ) : (
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                                msg.isOwn
                                  ? "bg-primary text-primary-content rounded-br-sm"
                                  : "bg-base-100 border border-base-content/10 rounded-bl-sm"
                              }`}
                            >
                              {!msg.isOwn && (
                                <p className="text-xs font-semibold mb-0.5 opacity-70">
                                  {msg.sender}
                                </p>
                              )}
                              <p className="text-sm">{msg.text}</p>
                              <p
                                className={`text-[10px] mt-1 ${
                                  msg.isOwn ? "text-primary-content/50" : "text-base-content/40"
                                }`}
                              >
                                {msg.time.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat input */}
                    <form
                      onSubmit={handleSendMessage}
                      className="flex items-center gap-2 p-3 bg-base-100 border-t border-base-content/10"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a message..."
                        className="input input-sm input-bordered flex-1"
                      />
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm btn-circle"
                        disabled={!chatInput.trim()}
                      >
                        <Send className="size-4" />
                      </button>
                    </form>
                  </div>
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
