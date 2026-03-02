import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseOptions,
  FirebaseError,
} from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

export const signUpWithEmail = async ({
  name,
  email,
  password,
}: SignUpPayload) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (name.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() });
  }

  return credential.user;
};

export const signInWithEmail = async ({ email, password }: SignInPayload) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const getCurrentUserIdToken = async (forceRefresh = false) => {
  if (!auth.currentUser) {
    return null;
  }

  return auth.currentUser.getIdToken(forceRefresh);
};

export const getFirebaseAuthErrorMessage = (error: unknown) => {
  if (!(error instanceof FirebaseError)) {
    return 'Something went wrong. Please try again.';
  }

  const firebaseError = error as FirebaseError;

  switch (firebaseError.code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return firebaseError.message || 'Authentication failed.';
  }
};
