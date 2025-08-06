import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "@/lib/axios";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: true,

      fetchUser: async () => {
        try {
          const res = await axios.get("/api/auth/me");
          set({ user: res.data.user, loading: false });
        } catch (err) {
          console.log("Fetch user error", err);
          set({ user: null, loading: false });
        }
      },

      setUser: (user) => set({ user, loading: false }),

      logout: async () => {
        try {
          await axios.post("/api/auth/logout");
        } catch (err) {
          console.log("Logout error", err);
        }
        set({ user: null, loading: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
