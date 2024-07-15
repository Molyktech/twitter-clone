export const QUERY_KEY = {
  user: "authUser",
  posts: "posts",
  suggestedUsers: "suggestedUsers",
  notifications: "notifications",
};

export const API_ENDPOINT = {
  POSTS: {
    ALL: "/api/posts",
    CREATE: "/api/posts/create",
    DELETE: (postId: string) => `/api/posts/${postId}`,
    LIKED: "/api/posts/likes",
    COMMENT: (postId: string) => `/api/posts/comment/${postId}`,
    USER_POSTS: "/api/posts/user-post",
    FOLLOWING_POSTS: "/api/posts/following-post",
    LIKE_UNLIKE: (postId: string) => `/api/posts/like/${postId}`,
  },
  USERS: {
    SUGGESTED: "/api/users/suggested",
    FOLLOW: (userId: string) => `/api/users/follow/${userId}`,
  },
  NOTIFICATIONS: {
    ALL: "/api/notifications",
    SINGLE: (notificationId: string) => `/api/notifications/${notificationId}`,
  },
};
export const FORMATTED_DATE = "1h";