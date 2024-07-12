import { IUser } from "../models";
import { SuccessResponse } from "../models/type/auth";

const USER_LOCAL_STORAGE_KEY = "APP_X_USER";

export function saveUser(user: IUser | SuccessResponse): void {
  localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
}

export function getUser(): IUser | null {
  const user = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
}

export function removeUser(): void {
  console.log("remove user");
  localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
  console.log("remove user", getUser());
}
