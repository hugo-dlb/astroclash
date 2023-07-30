import { Navigate, createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { Planets } from "./pages/Planets.tsx";
import { Planet } from "./pages/Planet.tsx";
import { PlanetLayout } from "./pages/PlanetLayout.tsx";
import { Ranking } from "./pages/Ranking.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Galaxy } from "./pages/Galaxy/Galaxy.tsx";
import { Attack } from "./pages/Attack/Attack.tsx";

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
        path: "*",
        element: <Navigate to="/login" />,
    },
]);
