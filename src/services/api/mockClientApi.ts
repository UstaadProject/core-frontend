import axios from "axios";
import type {
  CatalogueResponse,
  StartSessionRequest,
  StartSessionResponse,
  SendMessageRequest,
  SendMessageResponse,
  FeedbackResponse,
  SessionStateResponse,
  HealthResponse,
} from "./mockClient.types";

// Mock client API base URL (through Express backend)
const API_BASE = "/api/mock-client";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MockClientApiError {
  status: number;
  message: string;
}

// ─── Catalogue & Metadata ─────────────────────────────────────────────────────

/**
 * Get all available scenarios, difficulties, projects, and personas
 */
export async function getCatalogue(): Promise<CatalogueResponse> {
  try {
    const response = await apiClient.get<CatalogueResponse>("/catalogue");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * Get list of available Ollama models
 */
export async function getAvailableModels(): Promise<{ models: string[] }> {
  try {
    const response = await apiClient.get<{ models: string[] }>("/models");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * Get health status of the mock client service
 */
export async function getHealth(): Promise<HealthResponse> {
  try {
    const response = await apiClient.get<HealthResponse>("/health");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

// ─── Session Management ───────────────────────────────────────────────────────

/**
 * Start a new mock client session
 */
export async function startSession(
  request: StartSessionRequest
): Promise<StartSessionResponse> {
  try {
    const response = await apiClient.post<StartSessionResponse>(
      "/session/start",
      request
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * Send a message in an active session and get client response
 */
export async function sendMessage(
  sessionId: string,
  request: SendMessageRequest
): Promise<SendMessageResponse> {
  try {
    const response = await apiClient.post<SendMessageResponse>(
      `/session/${sessionId}/message`,
      request
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * End a session and get feedback
 */
export async function endSession(
  sessionId: string
): Promise<FeedbackResponse> {
  try {
    const response = await apiClient.post<FeedbackResponse>(
      `/session/${sessionId}/end`,
      {}
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * Get current session state (for reconnection)
 */
export async function getSessionState(
  sessionId: string
): Promise<SessionStateResponse> {
  try {
    const response = await apiClient.get<SessionStateResponse>(
      `/session/${sessionId}`
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * Delete/cancel a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await apiClient.delete(`/session/${sessionId}`);
  } catch (error) {
    throw handleError(error);
  }
}

// ─── Error Handling ───────────────────────────────────────────────────────────

function handleError(error: any): MockClientApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message ||
      "An error occurred";
    return { status, message };
  }

  return {
    status: 500,
    message: error instanceof Error ? error.message : "An unknown error occurred",
  };
}

export default apiClient;
