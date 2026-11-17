export const API = {
  auth: {
    root: "/api/auth",
    login: "/login",
    register: "/register",
  },

  destinations: {
    root: "/api/destinations",
    me: "/me",
  }
} as const;
