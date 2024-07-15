export const QUERY_KEY = {
  user: "authUser",
  posts: "posts",
  suggestedUsers: "suggestedUsers",
  notifications: "notifications",
  profile: "profile",
};

export const API_ENDPOINT = {
  POSTS: {
    ALL: "/api/posts",
    CREATE: "/api/posts/create",
    DELETE: (postId: string) => `/api/posts/${postId}`,
    LIKED: (userId: string) => `/api/posts/likes/${userId}`,
    COMMENT: (postId: string) => `/api/posts/comment/${postId}`,
    USER_POSTS: (userName: string) => `/api/posts/user-post/${userName}`,
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
  PROFILE: {
    USER: (username: string) => `/api/users/profile/${username}`,
  },
};
export const FORMATTED_DATE = "1h";