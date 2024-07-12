import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

// import { useAuth } from "../../hooks /auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "../../models";
import { SuccessResponse } from "../../models/type/auth";

interface GuestGuardProps {
  children: ReactNode;
}

const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
  // const token = useAuth();
  const { data: authUser } = useQuery<IUser | SuccessResponse>({
    queryKey: ["authUser"],
  });

  if (authUser) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default GuestGuard;
