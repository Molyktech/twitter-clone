import { ICreatePost, IPost, IPostSuccessResponse } from "../models";
import { API_ENDPOINT } from "./constants";
import { storage } from "./storage";

export interface AuthResponse {
  user: User;
  jwt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export async function handleApiResponse(response: Response) {
  try {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      // return Promise.reject(data);
      throw new Error(data.error || "Something went wrong");
    }
  } catch (error) {
    if (response.status === 413) {
      throw new Error("Image too large");
    } else {
      throw new Error(error as string);
    }
  }
}

export function getUserProfile(): Promise<{ user: User | undefined }> {
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
