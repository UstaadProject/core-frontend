import { authFetch } from '@/services/api/authFetch';

export interface ModuleInfo {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  difficulty: string;
  topicsCount: number;
  completedTopicsCount: number;
}

export interface LearningPathData {
  level: string;
  status: string;
  currentModule: string;
  currentModuleProgress: number;
  completedModules: number;
  totalModules: number;
  modules: ModuleInfo[];
}

export interface DashboardStats {
  user: {
    name: string;
    email: string;
  };
  gamification: {
    xp: number;
    streakDays: number;
    achievements: string[];
  };
  stats: {
    coursesEnrolled: number;
    inProgress: number;
    hoursLearned: number;
    skillsMastered: number;
  };
  learningPath: LearningPathData;
}

export interface FullModule {
  id: string;
  title: string;
  difficulty: string;
  topics: string[];
  completedTopics?: string[];
  status: 'pending' | 'in-progress' | 'completed';
}

export interface FullLearningPath {
  learningPath: {
    level: string;
    status: string;
    currentModule: string;
    currentTopic: string;
    modules: FullModule[];
  };
  gamification: {
    xp: number;
    streakDays: number;
    achievements: string[];
    stats: {
      coursesEnrolled: number;
      hoursLearned: number;
      skillsMastered: number;
    };
  };
}

export interface TopicContent {
  module: string;
  topic: string;
  difficulty: string;
  explanation: string;
  code_examples: string[];
  common_mistakes: string[];
  best_practices: string[];
  practice_tasks: string[];
  assignments: string[];
  mini_project: string;
}

export interface CompleteTopicResponse {
  xpEarned: number;
  moduleCompleted: boolean;
  message: string;
}

export interface TutorMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  email: string;
  streakDays: number;
  xp: number;
  hoursLearned: number;
  skillsMastered: number;
  modulesCompleted: number;
}

export interface ResumeProject {
  title: string;
  bullet_points: string[];
  tech_stack: string[];
}

export interface ResumeData {
  profile: {
    name: string;
    email: string;
    level: string;
    goals: string;
    skills: string[];
  };
  summary: string;
  projects: ResumeProject[];
  achievements: string[];
}

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeResumeData = (data: unknown): ResumeData => {
  const raw = (data ?? {}) as Record<string, unknown>;
  const profileRaw =
    raw.profile && typeof raw.profile === 'object'
      ? (raw.profile as Record<string, unknown>)
      : {};

  const projectsRaw = Array.isArray(raw.projects) ? raw.projects : [];
  const projects: ResumeProject[] = projectsRaw.map((item, index) => {
    const project =
      item && typeof item === 'object' ? (item as Record<string, unknown>) : {};

    const title =
      typeof project.title === 'string' && project.title.trim().length > 0
        ? project.title.trim()
        : `Project ${index + 1}`;

    const bullet_points = toStringArray(project.bullet_points);
    const tech_stack = toStringArray(project.tech_stack);

    return {
      title,
      bullet_points,
      tech_stack,
    };
  });

  return {
    profile: {
      name:
        typeof profileRaw.name === 'string' ? profileRaw.name : 'Learner Name',
      email: typeof profileRaw.email === 'string' ? profileRaw.email : '',
      level:
        typeof profileRaw.level === 'string' ? profileRaw.level : 'Beginner',
      goals: typeof profileRaw.goals === 'string' ? profileRaw.goals : '',
      skills: toStringArray(profileRaw.skills),
    },
    summary: typeof raw.summary === 'string' ? raw.summary : '',
    projects,
    achievements: toStringArray(raw.achievements),
  };
};

export interface AchievementItem {
  key: string;
  title: string;
  description: string;
  badge: string;
  unlocked?: boolean;
  unlockedAt?: string;
}

const parseJson = async (response: Response) => {
  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json?.success) {
    throw new Error(json?.error?.message || 'Request failed');
  }
  return json;
};

// Get dashboard stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await authFetch('/learning/dashboard-stats', {
    method: 'GET',
  });
  const json = await parseJson(response);
  return json.data;
};

// Get full learning path with all modules and topics
export const getLearningPath = async (): Promise<FullLearningPath> => {
  const response = await authFetch('/learning/path', {
    method: 'GET',
  });
  const json = await parseJson(response);
  return json.data;
};

// Get topic content (will generate if not exists)
export const getTopicContent = async (
  moduleId: string,
  topic: string
): Promise<TopicContent> => {
  const response = await authFetch('/learning/topic-content', {
    method: 'POST',
    body: JSON.stringify({ moduleId, topic }),
  });
  const json = await parseJson(response);
  return json.data;
};

// Mark topic as completed
export const completeTopic = async (
  moduleId: string,
  topic: string
): Promise<CompleteTopicResponse> => {
  const response = await authFetch('/learning/complete-topic', {
    method: 'POST',
    body: JSON.stringify({ moduleId, topic }),
  });
  const json = await parseJson(response);
  return json.data;
};

// Ask AI tutor
export const askTutor = async (question: string): Promise<TutorMessage> => {
  const response = await authFetch('/learning/ask-tutor', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
  const json = await parseJson(response);
  return json.data;
};

// Update daily streak
export const updateStreak = async (): Promise<{
  streakDays: number;
  xpEarned: number;
}> => {
  const response = await authFetch('/learning/update-streak', {
    method: 'POST',
  });
  const json = await parseJson(response);
  return json.data;
};

// Get recommended resources
export const getResources = async () => {
  const response = await authFetch('/learning/resources', {
    method: 'GET',
  });
  const json = await parseJson(response);
  return json.data;
};

export const getLeaderboard = async (): Promise<LeaderboardUser[]> => {
  const response = await authFetch('/learning/leaderboard', {
    method: 'GET',
  });
  const json = await parseJson(response);
  return json.data.users;
};

export const buildResume = async (options?: {
  regenerate?: boolean;
}): Promise<ResumeData> => {
  const shouldRegenerate = options?.regenerate === true;
  const response = await authFetch(
    `/learning/resume${shouldRegenerate ? '?regenerate=true' : ''}`,
    {
      method: 'GET',
    }
  );
  const json = await parseJson(response);
  return normalizeResumeData(json.data);
};

export const submitLearningFeedbackAndReplan = async (payload: {
  feedbackType: 'too_easy' | 'too_difficult' | 'already_know' | 'just_right';
  moduleId: string;
  topic?: string;
}) => {
  const response = await authFetch('/learning/feedback-replan', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const json = await parseJson(response);
  return json.data as {
    feedbackType: string;
    aiFeedback: Record<string, unknown>;
    aiReplanApplied: boolean;
    learningPath: {
      modules: FullModule[];
      currentModule: string;
    };
  };
};

export const getAchievements = async () => {
  const response = await authFetch('/learning/achievements', {
    method: 'GET',
  });
  const json = await parseJson(response);
  return json.data as {
    unlocked: AchievementItem[];
    available: AchievementItem[];
  };
};
