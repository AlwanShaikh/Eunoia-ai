"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const PROFILE_STORAGE_KEY = "eunoia_profile";

export interface ProfileData {
  avatar: string;
  fullName: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  statusMessage: string;
}

export const defaultProfile: ProfileData = {
  avatar: "",
  fullName: "Ava",
  username: "ava_reflect",
  email: "ava@eunoia.app",
  bio: "Your experience is tuned for privacy, pacing, and thoughtful interaction.",
  location: "",
  statusMessage: "Reflective mode",
};

interface ProfileContextValue {
  profile: ProfileData;
  updateProfile: (data: ProfileData) => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ProfileData;
        setProfile(parsed);
      } catch {
        // fall back to defaults
      }
    }
    setLoaded(true);
  }, []);

  const updateProfile = useCallback((data: ProfileData) => {
    setProfile(data);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
  }, []);

  // Don't render children until loaded to avoid hydration mismatch
  if (!loaded) {
    return null;
  }

  return <ProfileContext.Provider value={{ profile, updateProfile }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}