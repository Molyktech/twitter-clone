import { useEffect, useState } from "react";
import { useCookie } from "./useCookie";

export const useAuth = () => {
  const cookie = useCookie();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    setToken(cookie);
  }, [cookie]);
  if (token) {
    return token;
  }
  return null;
};
