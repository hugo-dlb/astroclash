import { Navigate, createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Planets } from "./pages/Planets";
import { Planet } from "./pages/Planet";
import { PlanetLayout } from "./pages/PlanetLayout";
import { Ranking } from "./pages/Ranking";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Galaxy } from "./pages/Galaxy/Galaxy";
import { Attack } from "./pages/Attack/Attack";
import { Messages } from "./pages/Messages";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" />,
    },
    {
        path: "login",
        element: <Login />,
    },
    {
        path: "register",
        element: <Register />,
    },
    {
        path: "planets",
        element: (
            <ProtectedRoute>
                <PlanetLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Planets />,
            },
            {
                path: ":planetUid",
                children: [
                    {
                        index: true,
                        element: <Planet />,
                    },
                    {
                        path: "galaxy",
                        element: <Galaxy />,
                    },
                    {
                        path: "attack",
                        element: <Attack />,
                    },
                ],
            },
        ],
    },
    {
        path: "ranking",
        element: (
            <ProtectedRoute>
                <Ranking />
            </ProtectedRoute>
        ),
    },
    {
        path: "messages",
        element: (
            <ProtectedRoute>
                <Messages />
            </ProtectedRoute>
        ),
    },
    {
        path: "*",
        element: <Navigate to="/login" />,
    },
]);
