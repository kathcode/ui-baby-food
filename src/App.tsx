import { Container } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

import RecipesPage from "./pages/RecipesPage";

import HomePage from "./pages/HomePage";

import ReportPage from "./pages/ReportPage";
import ChecklistPage from "./pages/ChecklistPage";
import {
  AuthenticateWithRedirectCallback,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import DashboardPage from "./features/dashboard/DashboardPage";
import LogPage from "./pages/LogPage";
import SideBar from "./components/ui/SideBar";

// Simple guard
function RequireAuth({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
}

export default function App() {
  const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <RequireAuth>
        <SideBar>
          <Container sx={{ pt: 9 }}>{children}</Container>
        </SideBar>
      </RequireAuth>
    );
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AuthWrapper>
              <HomePage />
            </AuthWrapper>
          }
        />

        <Route
          path="/dashboard"
          element={
            <AuthWrapper>
              <DashboardPage />
            </AuthWrapper>
          }
        />

        <Route
          path="/log"
          element={
            <AuthWrapper>
              <LogPage />
            </AuthWrapper>
          }
        />

        <Route
          path="/recipes"
          element={
            <AuthWrapper>
              <RecipesPage />
            </AuthWrapper>
          }
        />

        <Route
          path="/checklist"
          element={
            <AuthWrapper>
              <ChecklistPage />
            </AuthWrapper>
          }
        />

        <Route
          path="/report"
          element={
            <AuthWrapper>
              <ReportPage />
            </AuthWrapper>
          }
        />
        {/* Public auth routes */}
        <Route path="/sign-in/*" element={<SignIn signUpUrl="/sign-up" />} />
        <Route path="/sign-up/*" element={<SignUp signInUrl="/sign-in" />} />
        <Route
          path="/sso-callback"
          element={<AuthenticateWithRedirectCallback />}
        />
      </Routes>
    </>
  );
}
