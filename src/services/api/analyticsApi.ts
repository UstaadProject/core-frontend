import { authFetch } from '@/services/api/authFetch';

export interface WeakArea {
  topic: string;
  module: string;
  proficiencyLevel: number;
  difficulty: string;
  hoursSpent: number;
  missedQuestions: number;
}

export interface RecommendedTopic {
  topic: string;
  module: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  difficulty: string;
}

export interface RecommendedProject {
  id: string;
  title: string;
  description: string;
  relevantSkills: string[];
  difficulty: string;
  estimatedDuration: number;
  reason: string;
}

export interface UserAnalytics {
  user: {
    name: string;
    email: string;
  };
  overview: {
    totalXP: number;
    streakDays: number;
    hoursLearned: number;
    modulesCompleted: number;
    topicsCompleted: number;
    currentLevel: string;
    averageProficiency: number;
  };
  learningProgress: {
    overallProgress: number;
    moduleProgress: Array<{
      moduleName: string;
      completed: number;
      total: number;
      progress: number;
    }>;
  };
  performanceMetrics: {
    averageQuizScore: number;
    completionRate: number;
    consistencyScore: number;
    engagementScore: number;
  };
  weakAreas: WeakArea[];
  recommendedTopics: RecommendedTopic[];
  recommendedProjects: RecommendedProject[];
  strengths: string[];
  insights: string[];
}

export async function getUserAnalytics(): Promise<UserAnalytics> {
  const response = await authFetch('/learning/analytics', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(response.statusText || 'Failed to fetch analytics');
  }

  const json = await response.json();

  // Extract data from the response wrapper
  if (json.data) {
    return json.data;
  }

  // Fallback if response structure is different
  return json;
}
