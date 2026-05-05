// Mock Client API Types and Interfaces

export interface DifficultyInfo {
  key: string;
  label: string;
  description: string;
  allowed_personas: string[];
  allowed_projects: string[];
}

export interface CatalogueResponse {
  difficulties: DifficultyInfo[];
  projects: Record<string, string>;
  personas: Record<string, string>;
}

export interface SessionSnapshot {
  session_id: string;
  module: string;
  difficulty: string;
  project: string;
  persona: string;
  status: "active" | "evaluating" | "done" | "cancelled";
  phase: string;
  turns: number;
  satisfaction: number;
}

export interface StartSessionRequest {
  module: string;
  difficulty: string;
  project: string;
  persona: string;
}

export interface StartSessionResponse {
  session: SessionSnapshot;
  opening_message: string;
}

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  session: SessionSnapshot;
  reply: string;
}

export interface ScoreItem {
  label: string;
  score: number;
}

export interface TurnAnalysis {
  turn_number: number;
  message: string;
  rating: "poor" | "average" | "good";
  analysis: string;
}

export interface FeedbackResponse {
  session: SessionSnapshot;
  overall: string;
  summary: string;
  scores: ScoreItem[];
  takeaways: string[];
  turn_analysis: TurnAnalysis[];
  unlocks_next_difficulty: boolean;
}

export interface SessionStateResponse {
  session: SessionSnapshot;
  history: Array<{
    turn: number;
    message: string;
    reply: string;
  }>;
}

export interface HealthResponse {
  status: string;
  active_sessions: number;
  ollama_url: string;
  model: string;
  rag?: {
    ready: boolean;
    indexed_chunks?: number;
  };
}
