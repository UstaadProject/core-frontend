import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  MessageCircle,
  Target,
  Send,
  Loader,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import {
  getCatalogue,
  startSession,
  sendMessage,
  endSession,
  deleteSession,
} from "@/services/api/mockClientApi";
import type {
  CatalogueResponse,
  DifficultyInfo,
  SessionSnapshot,
  SendMessageResponse,
  FeedbackResponse,
} from "@/services/api/mockClient.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

type ViewState = "setup" | "chat" | "feedback" | "loading" | "error";

// ─── Component ────────────────────────────────────────────────────────────────

export function MockClientInteraction() {
  // State: Setup
  const [catalogue, setCatalogue] = useState<CatalogueResponse | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedPersona, setSelectedPersona] = useState<string>("");

  // State: Session
  const [session, setSession] = useState<SessionSnapshot | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State: Feedback
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);

  // State: UI
  const [viewState, setViewState] = useState<ViewState>("setup");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Load catalogue on mount ───────────────────────────────────────────────

  useEffect(() => {
    async function loadCatalogue() {
      try {
        const cat = await getCatalogue();
        if (!cat || !cat.difficulties || cat.difficulties.length === 0) {
          setError("No scenarios available");
          setViewState("error");
          return;
        }
        setCatalogue(cat);
        setSelectedDifficulty(cat.difficulties[0].key);
      } catch (err: any) {
        setError(`Failed to load scenarios: ${err.message}`);
        setViewState("error");
      }
    }

    loadCatalogue();
  }, []);

  // ─── Auto-scroll to latest message ─────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Get available projects and personas for selected difficulty ───────────

  const currentDifficultyInfo = useMemo<DifficultyInfo | undefined>(() => {
    if (!catalogue?.difficulties) return undefined;
    return catalogue.difficulties.find((d) => d.key === selectedDifficulty);
  }, [catalogue, selectedDifficulty]);

  useEffect(() => {
    if (currentDifficultyInfo && currentDifficultyInfo.allowed_projects.length > 0) {
      setSelectedProject(currentDifficultyInfo.allowed_projects[0]);
    }
  }, [currentDifficultyInfo]);

  useEffect(() => {
    if (currentDifficultyInfo && currentDifficultyInfo.allowed_personas.length > 0) {
      setSelectedPersona(currentDifficultyInfo.allowed_personas[0]);
    }
  }, [currentDifficultyInfo]);

  // ─── Start session ────────────────────────────────────────────────────────

  const handleStartSession = useCallback(async () => {
    if (!selectedDifficulty || !selectedProject || !selectedPersona) {
      setError("Please select a difficulty, project, and persona");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await startSession({
        module: "webdev",
        difficulty: selectedDifficulty,
        project: selectedProject,
        persona: selectedPersona,
      });

      setSession(response.session);
      setMessages([
        {
          role: "assistant",
          content: response.opening_message,
          timestamp: Date.now(),
        },
      ]);
      setViewState("chat");
      setInputValue("");
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err: any) {
      setError(`Failed to start session: ${err.message}`);
      setViewState("error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDifficulty, selectedProject, selectedPersona]);

  // ─── Send message ─────────────────────────────────────────────────────────

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !session || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: Date.now() },
    ]);
    setIsLoading(true);
    setError(null);

    try {
      const response: SendMessageResponse = await sendMessage(
        session.session_id,
        { message: userMessage }
      );

      setSession(response.session);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply, timestamp: Date.now() },
      ]);
    } catch (err: any) {
      setError(`Failed to send message: ${err.message}`);
      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [inputValue, session, isLoading]);

  // ─── End session and get feedback ──────────────────────────────────────────

  const handleEndSession = useCallback(async () => {
    if (!session || messages.length < 3) {
      setError("Have at least 2 exchanges before ending the session");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await endSession(session.session_id);
      setFeedback(response);
      setViewState("feedback");
    } catch (err: any) {
      setError(`Failed to end session: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [session, messages]);

  // ─── Reset and go back to setup ───────────────────────────────────────────

  const handleReset = useCallback(async () => {
    if (session) {
      try {
        await deleteSession(session.session_id);
      } catch (err) {
        // Silently fail
      }
    }

    setSession(null);
    setMessages([]);
    setFeedback(null);
    setInputValue("");
    setError(null);
    setViewState("setup");
    setSelectedDifficulty(
      catalogue?.difficulties[0]?.key || selectedDifficulty
    );
  }, [session, catalogue, selectedDifficulty]);

  // ─── Render: Loading catalogue ─────────────────────────────────────────────

  if (!catalogue) {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-sm p-8 flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading scenarios...</p>
        </div>
      </div>
    );
  }

  // ─── Render: Setup screen ─────────────────────────────────────────────────

  if (viewState === "setup") {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        {/* Left: Scenario selector */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-6 max-h-screen overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">Scenario Picker</h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Choose a difficulty level, project type, and client persona to practice
              your discovery conversation.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-4">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Difficulty selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Difficulty</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {catalogue.difficulties.map((diff) => (
                <button
                  key={diff.key}
                  onClick={() => {
                    setSelectedDifficulty(diff.key);
                    setError(null);
                  }}
                  className={`rounded-lg border p-3 text-left text-sm transition-all ${
                    selectedDifficulty === diff.key
                      ? "border-primary bg-primary/10 font-semibold text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="font-semibold">{diff.label}</div>
                  <div className="text-xs opacity-75 mt-1">{diff.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Project selector */}
          {currentDifficultyInfo && (
            <div className="space-y-3">
              <label className="text-sm font-semibold">Project Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentDifficultyInfo.allowed_projects.map((proj) => (
                  <button
                    key={proj}
                    onClick={() => {
                      setSelectedProject(proj);
                      setError(null);
                    }}
                    className={`rounded-lg border p-3 text-left text-sm transition-all ${
                      selectedProject === proj
                        ? "border-primary bg-primary/10 font-semibold text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{catalogue.projects[proj] || proj}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Persona selector */}
          {currentDifficultyInfo && (
            <div className="space-y-3">
              <label className="text-sm font-semibold">Client Persona</label>
              <div className="space-y-2">
                {currentDifficultyInfo.allowed_personas.map((persona) => (
                  <button
                    key={persona}
                    onClick={() => {
                      setSelectedPersona(persona);
                      setError(null);
                    }}
                    className={`w-full rounded-lg border p-3 text-left text-sm transition-all ${
                      selectedPersona === persona
                        ? "border-primary bg-primary/10 font-semibold text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {catalogue.personas[persona] || persona}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleStartSession}
            disabled={isLoading || !selectedDifficulty || !selectedProject || !selectedPersona}
            className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Starting...
              </div>
            ) : (
              "Start Practice Session"
            )}
          </button>
        </div>

        {/* Right: Info panel */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">About This Practice</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Simulate realistic client conversations to improve your discovery process.
              Practice asking the right questions to understand scope, budget, and timeline.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: MessageCircle,
                title: "Realistic Dialogue",
                desc: "AI-powered client responses based on selected persona",
              },
              {
                icon: Target,
                title: "Guided Success",
                desc: "Clear criteria to guide your questioning strategy",
              },
              {
                icon: TrendingUp,
                title: "Detailed Feedback",
                desc: "Structured analysis of your discovery performance",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-3">
                  <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Chat screen ──────────────────────────────────────────────────

  if (viewState === "chat") {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="text-xl font-bold">{selectedProject.toUpperCase()}</h3>
            <p className="text-sm text-muted-foreground">
              {currentDifficultyInfo?.label} • {catalogue.personas[selectedPersona] || selectedPersona}
            </p>
          </div>
          <div className="text-xs font-mono bg-secondary px-3 py-2 rounded-lg">
            Turns: {messages.length - 1}
          </div>
        </div>

        {/* Messages */}
        <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-4 h-96 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary text-foreground rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary text-foreground px-4 py-2 rounded-lg text-sm">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {/* Info: Satisfaction */}
        {session && (
          <div className="rounded-lg border border-border bg-secondary/50 p-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Client Satisfaction</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, session.satisfaction))}%` }}
                />
              </div>
              <span className="text-xs font-mono">{session.satisfaction}%</span>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                handleSendMessage();
              }
            }}
            placeholder="Type your response..."
            disabled={isLoading}
            maxLength={2000}
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="rounded-lg bg-primary text-primary-foreground p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleEndSession}
            disabled={messages.length < 3 || isLoading}
            className="flex-1 rounded-lg border border-primary text-primary py-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
          >
            End & Get Feedback
          </button>
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="px-4 rounded-lg border border-border text-foreground py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ─── Render: Feedback screen ──────────────────────────────────────────────

  if (viewState === "feedback" && feedback) {
    return (
      <div className="space-y-6">
        {/* Overall feedback */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Session Complete</h2>
              <p className="text-sm text-muted-foreground mt-1">{feedback.summary}</p>
            </div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feedback.scores.map((score) => (
              <div
                key={score.label}
                className="rounded-lg border border-border bg-secondary/50 p-4 text-center space-y-2"
              >
                <div className="text-sm font-semibold text-muted-foreground">
                  {score.label}
                </div>
                <div className="text-3xl font-bold text-primary">{score.score}</div>
              </div>
            ))}
          </div>

          {/* Takeaways */}
          {feedback.takeaways.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Key Takeaways</h3>
              <ul className="space-y-2">
                {feedback.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unlocks */}
          {feedback.unlocks_next_difficulty && (
            <div className="rounded-lg border border-success/50 bg-success/10 p-4">
              <p className="text-sm font-semibold text-success">
                ✓ You've unlocked the next difficulty level!
              </p>
            </div>
          )}
        </div>

        {/* Turn-by-turn analysis */}
        {feedback.turn_analysis.length > 0 && (
          <div className="rounded-2xl border border-border bg-card shadow-sm p-8 space-y-4">
            <h3 className="text-lg font-bold">Turn Analysis</h3>
            <div className="space-y-3">
              {feedback.turn_analysis.map((analysis) => (
                <div
                  key={analysis.turn_number}
                  className="rounded-lg border border-border p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Turn {analysis.turn_number}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        analysis.rating === "poor"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-streak/15 text-streak"
                      }`}
                    >
                      {analysis.rating.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm italic text-muted-foreground">"{analysis.message}"</p>
                  <p className="text-sm">{analysis.analysis}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90 transition-colors"
          >
            Try Another Scenario
          </button>
        </div>
      </div>
    );
  }

  // ─── Render: Error screen ─────────────────────────────────────────────────

  if (viewState === "error") {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-sm p-8 flex flex-col items-center justify-center min-h-96 gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
        <button
          onClick={handleReset}
          className="rounded-lg bg-primary text-primary-foreground px-6 py-2 font-semibold hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
}
