import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import Dashboard from "../features/chat/pages/Dashboard";

const routes = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/verify-email",
        element: <VerifyEmail />
    }
]);

export default routes;