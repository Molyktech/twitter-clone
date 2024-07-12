import React, { PropsWithChildren, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../hooks /auth/useUser";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { authUser } = useUser();
  const location = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>();
  console.log(
    "protected route",
    authUser,
    location.pathname,
    requestedLocation
  );
  if (!authUser) {
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
    }
    return <Navigate to="/login" replace />;
  }

  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
