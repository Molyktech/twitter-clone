import {
  ICreatePost,
  IFollowResponse,
  IPost,
  IPostSuccessResponse,
  IUser,
} from "../models";
import { API_ENDPOINT } from "./constants";
import { storage } from "./storage";

export async function handleApiResponse(response: Response) {
  try {
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(data.error || "Something went wrong");
  } catch (error) {
    if (response.status === 413) {
      throw new Error("Image too large");
    } else {
      throw new Error(error as string);
    }
  }
}

export function getUserProfile(): Promise<{ user: IUser | undefined }> {
  return fetch("/auth/me", {
    headers: {
      Authorization: storage.getToken(),
    },
  }).then(handleApiResponse);
}

export function getPosts(url: string): Promise<IPost[]> {
  return fetch(url).then(handleApiResponse);
}

export function deletePost(postId: string): Promise<{ message: string }> {
  return fetch(API_ENDPOINT.POSTS.DELETE(postId), {
    method: "DELETE",
  }).then(handleApiResponse);
}

export function createPost({
  text,
  image,
}: ICreatePost): Promise<IPostSuccessResponse> {
  return fetch(API_ENDPOINT.POSTS.CREATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, image }),
  }).then(handleApiResponse);
}

export function followUnfollowUser(userId: string): Promise<IFollowResponse> {
  return fetch(API_ENDPOINT.USERS.FOLLOW(userId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(handleApiResponse);
}

export function getSuggestedUsers(): Promise<IUser[]> {
  return fetch(API_ENDPOINT.USERS.SUGGESTED).then(handleApiResponse);
}
export const getPostEndpoint = (feedType: string) => {
  switch (feedType) {
    case "forYou":
      return "/api/posts";
    case "following":
      return "/api/posts/following-post";
    default:
      return "/api/posts";
  }
};

export const likeUnlikePost = (postId: string) => {
  return fetch(API_ENDPOINT.POSTS.LIKE_UNLIKE(postId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(handleApiResponse);
};


export const commentOnPost = (postId: string, text: string) => {
  return fetch(API_ENDPOINT.POSTS.COMMENT(postId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  }).then(handleApiResponse);
};

export const getAllNotifications = () => {
  return fetch(API_ENDPOINT.NOTIFICATIONS.ALL).then(handleApiResponse);
};

export const deleteAllNotifications = () => {
  return fetch(API_ENDPOINT.NOTIFICATIONS.ALL, {
    method: "DELETE",
  }).then(handleApiResponse);
};

export const deleteSingleNotification = (notificationId: string) => {
  return fetch(API_ENDPOINT.NOTIFICATIONS.SINGLE(notificationId), {
    method: "DELETE",
  }).then(handleApiResponse);
};