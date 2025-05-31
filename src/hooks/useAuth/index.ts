import { useState, useEffect } from 'react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // TODO: Implement actual authentication logic
    // This is a placeholder that simulates a logged-in user
    setAuthState({
      user: {
        uid: '1',
        email: 'user@example.com',
        displayName: 'John Doe',
        photoURL: null,
      },
      loading: false,
      error: null,
    });
  }, []);

  return authState;
}; 