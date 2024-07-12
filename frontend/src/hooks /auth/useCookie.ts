import { useState, useEffect } from "react";

export const useCookie = () => {
  const [cookieValue, setCookieValue] = useState<string | null>(null);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    setCookieValue(cookie ? cookie.split("=")[1] : null);
  }, []);

  return cookieValue;
};
