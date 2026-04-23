import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch the user's profile (role, household_id, etc.)
  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    }
    return data;
  }

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data, error }) => {
      if (!isMounted) return;

      if (error) {
        console.error("Error getting session:", error.message);
        setLoading(false);
        return;
      }

      const currentSession = data.session ?? null;
      setSession(currentSession);

      if (currentSession?.user) {
        const profileData = await fetchProfile(currentSession.user.id);
        if (isMounted) setProfile(profileData);
      }

      if (isMounted) setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);

      if (newSession?.user) {
        const profileData = await fetchProfile(newSession.user.id);
        if (isMounted) setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // helper to check role
  function hasRole(role) {
    return profile?.role === role;
  }

  // helper to check if user has one of several roles
  function hasAnyRole(roles) {
    return roles.includes(profile?.role);
  }

  async function refreshProfile() {
    if (session?.user) {
      const profileData = await fetchProfile(session.user.id);
      setProfile(profileData);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        hasRole,
        hasAnyRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}