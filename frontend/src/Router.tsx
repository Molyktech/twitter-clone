import React from "react";
import { RouteObject } from "react-router-dom";

import BaseLayout from "./layout/Base";
import ProtectedRoute from "./components/common/ProtectedRoute";
import GuestGuard from "./components/common/GuestGuard";

const HomePage = React.lazy(() => import("./pages/home/Home"));
const SignUpPage = React.lazy(() => import("./pages/auth/signup/SignUp"));
const LoginPage = React.lazy(() => import("./pages/auth/login/Login"));
const NotificationsPage = React.lazy(
  () => import("./pages/notification/Notification")
);
const ProfilePage = React.lazy(() => import("./pages/profile/Profile"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <BaseLayout>
          <HomePage />
        </BaseLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: "/signup",
    element: (
      <GuestGuard>
        <SignUpPage />
      </GuestGuard>
    ),
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <BaseLayout>
          <NotificationsPage />
        </BaseLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/:userName",
    element: (
      <ProtectedRoute>
        <BaseLayout>
          <ProfilePage />
        </BaseLayout>
      </ProtectedRoute>
    ),
  },
];

export default routes;
