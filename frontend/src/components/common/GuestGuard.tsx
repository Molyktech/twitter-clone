import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../hooks /auth/useAuth";

interface GuestGuardProps {
  children: ReactNode;
}

const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
  const token = useAuth();

  if (token) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default GuestGuard;
