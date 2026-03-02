import { getCurrentUserIdToken } from '@/services/firebase/firebase';

const API_BASE_URL =
  import.meta.env.VITE_SERVER == 'local'
    ? import.meta.env.VITE_API_BASE_URL_LOCAL
    : import.meta.env.VITE_API_BASE_URL_PROD;

export const getAuthToken = async () => {
  return getCurrentUserIdToken();
};

export const getFirebaseTokenHeader = async () => {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }

  return token;
};

interface AuthFetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export const authFetch = async (
  path: string,
  options: AuthFetchOptions = {}
) => {
  const { requireAuth = true, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);

  if (requireAuth) {
    const firebaseTokenHeader = await getFirebaseTokenHeader();

    if (!firebaseTokenHeader) {
      throw new Error('User is not authenticated.');
    }

    requestHeaders.set('firebase-token', firebaseTokenHeader);
  }

  if (
    !requestHeaders.has('Content-Type') &&
    rest.body &&
    !(rest.body instanceof FormData)
  ) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });
};
