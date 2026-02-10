'use client';

/**
 * AuthProvider Component
 * Manages Supabase authentication state and provides auth context
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/clientConfig';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Check if user has retailer role
      const userRole = session?.user?.user_metadata?.role;
      if (session && userRole && userRole !== 'retailer') {
        // Wrong platform - sign out immediately
        supabase.auth.signOut();
        setUser(null);
        router.push('/login');
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Check if user has retailer role
      const userRole = session?.user?.user_metadata?.role;
      if (session && userRole && userRole !== 'retailer') {
        // Wrong platform - sign out immediately
        await supabase.auth.signOut();
        setUser(null);
        router.push('/login');
      } else {
        setUser(session?.user ?? null);
      }
      
      // Only handle session cookies for sign out event
      // Sign in is handled manually in login page to avoid race conditions
      if (event === 'SIGNED_OUT') {
        try {
          await fetch('/api/auth/session', {
            method: 'DELETE',
          });
        } catch (error) {
          console.error('Error deleting session:', error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
