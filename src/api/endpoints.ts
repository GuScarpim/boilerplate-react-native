export const API_ENDPOINTS = {
  // Example endpoints
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  POSTS: '/posts',
  POST_BY_ID: (id: string) => `/posts/${id}`,
} as const;

