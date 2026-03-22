import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthPage from "./features/auth/pages/AuthPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/register",
    element: <AuthPage />,
  },
]);
