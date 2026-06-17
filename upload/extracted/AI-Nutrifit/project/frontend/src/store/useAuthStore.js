import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true, // Starts true so App.jsx shows the loading spinner on initial load

  checkAuth: async () => {
    try {
      const baseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${baseUrl}/user/profile`, {
        method: "GET",
        credentials: "include",
        cache: "no-store", // <--- THIS IS THE FIX. It completely disables browser caching for this request.
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        set({ user: userData, isAuthenticated: true, isCheckingAuth: false });
      } else {
        set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
  logout: async () => {
    try {
      set({ isCheckingAuth: true });

      // FIX 1: Added the exact same fallback URL used in checkAuth
      const baseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      // Hits your backend to clear the secure cookie
      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout network request failed:", error);
    } finally {
      // FIX 2: Moved this into a 'finally' block.
      // Now, even if the backend fetch fails, the frontend ALWAYS clears the user state.
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
}));

export default useAuthStore;
