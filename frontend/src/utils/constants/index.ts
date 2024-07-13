export const QUERY_KEY = {
  user: "authUser",
  posts: "posts",
  suggestedUsers: "suggestedUsers",
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
    LIKE_UNLIKE: (postId: string) => `/api/posts/like-unlike/${postId}`,
  },
  USERS: {
    SUGGESTED: "/api/users/suggested",
  },
};
export const FORMATTED_DATE = "1h";