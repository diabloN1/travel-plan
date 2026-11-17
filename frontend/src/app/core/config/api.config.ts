export const API = {
  auth: {
    root: '/api/auth',
    login: '/login',
    register: '/register',
  },

  user: {
    root: '/api/users',
    me: '/me',
  },

  destinations: {
    root: '/api/destinations',
    me: '/me',
  },
} as const;
