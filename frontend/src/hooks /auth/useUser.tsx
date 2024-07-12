import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { QUERY_KEY } from "../../utils/constants";
import * as userLocalStorage from "../../utils/user.storage";
import { IUser } from "../../models";

async function getUser(): Promise<IUser> {
  try {
    const response = await fetch(`/api/auth/get-user/`);
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error);

    return data;
  } catch (error) {
    throw error as Error;
  }
}

interface IUseUser {
  authUser: IUser | null;
  isLoading: boolean;
}

export function useUser(): IUseUser {
  const { data: authUser, isLoading } = useQuery<IUser | null>({
    queryKey: [QUERY_KEY.user],
    queryFn: getUser,
    retry: false,
    initialData: userLocalStorage.getUser,
  });

  useEffect(() => {
    if (!authUser) userLocalStorage.removeUser();
    else userLocalStorage.saveUser(authUser);
  }, [authUser]);

  return {
    authUser: authUser ?? null,
    isLoading,
  };
}
