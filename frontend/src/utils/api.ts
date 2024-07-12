import { IPost } from "../models";
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
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    // console.error(JSON.stringify(data, null, 2));
    // return Promise.reject(data);
    throw new Error(data.error);
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
