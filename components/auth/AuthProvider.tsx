'use client';

/**
 * AuthProvider Component
 * Manages Firebase authentication state and provides auth context
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { getAuthInstance } from '@/lib/firebase/clientConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthInstance();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Create session cookie when user signs in
      if (user) {
        try {
          const idToken = await user.getIdToken();
          
          // Call API route to create session cookie
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          });
        } catch (error) {
          console.error('Error creating session:', error);
        }
      } else {
        // Delete session cookie when user signs out
        try {
          await fetch('/api/auth/session', {
            method: 'DELETE',
          });
        } catch (error) {
          console.error('Error deleting session:', error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
