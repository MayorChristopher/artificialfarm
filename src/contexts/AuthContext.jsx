import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

// Utility to clear all Supabase-related auth keys from localStorage
function clearSupabaseAuthStorage() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith('sb-'))
    .forEach((key) => localStorage.removeItem(key));
}

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  // Try to load cached profile from localStorage for instant UI
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('afa_profile');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  // Loader UI removed as requested; site will render immediately

  // Fetch and set user profile
  const fetchProfile = async (user) => {
    if (!user) {
      setProfile(null);
      setIsAdmin(false);
      localStorage.removeItem('afa_profile');
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error || !data) {
        console.warn('[Auth] Profile fetch error:', error?.message, 'Profile data:', data);
        setProfile(null);
        setIsAdmin(false);
        localStorage.removeItem('afa_profile');
        return null;
      }
      setProfile(data);
      setIsAdmin(data.role === 'admin');
      localStorage.setItem('afa_profile', JSON.stringify(data));
      return data;
    } catch (err) {
      console.error('[Auth] Exception in fetchProfile:', err);
      setProfile(null);
      setIsAdmin(false);
      localStorage.removeItem('afa_profile');
      return null;
    }
  };

  // Expose a method to force refresh the profile from the database
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  // Initial session restoration + auth change listener
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        setUser(null);
        setSession(null);
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const currentUser = data.session.user;
      setUser(currentUser);
      setSession(data.session);
      // Don't await fetchProfile here, let the next effect handle it
      setLoading(false);
    };

    initializeAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setLoading(true);
        if (newSession?.user) {
          setUser(newSession.user);
          setSession(newSession);
          // Don't await fetchProfile here, let the next effect handle it
        } else {
          setUser(null);
          setSession(null);
          setProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  // Always fetch profile if user is set but profile is missing or if user changes
  useEffect(() => {
    // If user changes, or if profile is missing, fetch profile
    if (user && (!profile || profile.id !== user.id) && !loading) {
      fetchProfile(user);
    }
  }, [user, profile, loading]);

  // Auth Actions
  const signUp = async (name, email, phone, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone,
          role: 'student',
          provider: 'email',
        },
        emailRedirectTo: `${window.location.origin}/verify`,
      },
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'Something went wrong',
      });
      return { user: null, error };
    }

    // After successful sign up, insert a profile row
    if (data?.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          full_name: name,
          phone: phone,
          role: 'student',
          provider: 'email',
          avatar_url: null,
          progress: { certificates: 0, hoursLearned: 0 },
        },
      ]);
      if (profileError) {
        toast({
          variant: 'destructive',
          title: 'Profile Creation Failed',
          description: profileError.message || 'Could not create user profile.',
        });
      }
    }

    return { user: data?.user, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid credentials',
      });
    }

    return { data, error };
  };

  const signInWithOAuth = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Social Login Failed',
        description: error.message || 'OAuth error occurred',
      });
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      clearSupabaseAuthStorage();
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Sign Out Failed',
        description: err.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  // Expose values and actions
  const value = useMemo(() => ({
    user,
    session,
    profile,
    isAdmin,
    isAuthenticated: !!user,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    refreshProfile, // <-- expose refreshProfile
  }), [user, session, profile, isAdmin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
