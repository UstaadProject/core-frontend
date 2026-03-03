import { authFetch } from '@/services/api/authFetch';

export interface OnboardingPreferences {
  skills: string[];
  experience: string;
  goal: string;
  time: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  difficulty?: string;
  topic?: string;
}

export interface GeneratedQuiz {
  total_questions: number;
  questions: QuizQuestion[];
}

export interface UserSettings {
  emailNotifications: boolean;
  weeklyDigest: boolean;
  productUpdates: boolean;
  reminderNotifications: boolean;
  theme: string;
}

export interface UserProfileMeta {
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
}

export interface CurrentUserResponse {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  onboarded: boolean;
  preferences: OnboardingPreferences;
  profile: UserProfileMeta;
  settings: UserSettings;
}

const parseJson = async (response: Response) => {
  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json?.success) {
    throw new Error(json?.error?.message || 'Request failed');
  }
  return json;
};

export const registerUser = async (name: string) => {
  const response = await authFetch('/users/register', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return parseJson(response);
};

export const createSession = async () => {
  const response = await authFetch('/users/session', { method: 'POST' });
  const json = await parseJson(response);
  return json.data as {
    onboarded: boolean;
    user: {
      name: string;
      onboarded: boolean;
    };
  };
};

export const generateOnboardingQuiz = async (
  preferences: OnboardingPreferences
) => {
  const response = await authFetch('/onboarding/quiz/generate', {
    method: 'POST',
    body: JSON.stringify(preferences),
  });

  const json = await parseJson(response);
  return json.data.quiz as GeneratedQuiz;
};

export const submitOnboardingQuiz = async (answers: Record<string, string>) => {
  const response = await authFetch('/onboarding/quiz/submit', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
  const json = await parseJson(response);
  return json.data;
};

export const completeOnboarding = async (
  preferences: OnboardingPreferences
) => {
  const response = await authFetch('/onboarding/complete', {
    method: 'POST',
    body: JSON.stringify(preferences),
  });
  const json = await parseJson(response);
  return json.data;
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await authFetch('/users/me', { method: 'GET' });
  const json = await parseJson(response);
  return json.data as CurrentUserResponse;
};

export const updateCurrentUserProfile = async (payload: {
  name?: string;
  profile?: Partial<UserProfileMeta>;
}) => {
  const response = await authFetch('/users/me/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  const json = await parseJson(response);
  return json.data as CurrentUserResponse;
};

export const updateCurrentUserSettings = async (
  settings: Partial<UserSettings>
) => {
  const response = await authFetch('/users/me/settings', {
    method: 'PATCH',
    body: JSON.stringify({ settings }),
  });
  const json = await parseJson(response);
  return json.data as { settings: UserSettings };
};
