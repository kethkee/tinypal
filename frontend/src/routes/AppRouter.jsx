import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import Onboarding from "../pages/Onboarding";
import Planner from "../pages/Planner";
import VerifyEmail from "../pages/VerifyEmail";
import CheckEmail from "../pages/CheckEmail";
function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>

                            <Dashboard />

                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/onboarding"
                    element={
                        <ProtectedRoute>
                            <Onboarding />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/planner"
                    element={<ProtectedRoute><Planner /></ProtectedRoute>}
                />
                <Route
  path="/verify-email/:userId/:token"
  element={<VerifyEmail />}
/>

<Route
  path="/check-email"
  element={<CheckEmail />}
/>

            </Routes>

        </BrowserRouter>

    );

}

export default AppRouter;
