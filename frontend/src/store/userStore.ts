import { create } from "zustand";
import { getProfile, updateProfile, uploadAvatar } from "@/api/user";
import type { ProfileData } from "@/api/user";
import { useAuthStore } from "./authStore";

interface UserState {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  setProfile: (profile: ProfileData) => void;
  updateUser: (data: { name?: string; bio?: string }) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const profile = await getProfile();
      set({ profile, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  setProfile: (profile) => set({ profile }),

  updateUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await updateProfile(data);
      if (response.success) {
        // Update both stores to ensure UI consistency
        const updatedProfile = { ...get().profile, ...response.user } as ProfileData;
        set({ profile: updatedProfile, loading: false });
        
        useAuthStore.getState().setUser({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
        });
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateAvatar: async (file) => {
    set({ loading: true, error: null });
    try {
      const response = await uploadAvatar(file);
      if (response.success) {
        // Update both stores for immediate UI feedback
        const updatedProfile = { ...get().profile, ...response.user } as ProfileData;
        set({ profile: updatedProfile, loading: false });

        useAuthStore.getState().setUser({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
        });
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
