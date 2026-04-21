import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  // this will get rid of the flickering effect
  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={isSignedIn ? <Navigate to="/dashboard" /> : <HomePage />} />
        <Route path="/auth" element={isSignedIn ? <Navigate to="/dashboard" /> : <AuthPage />} />

        {/* Public content routes */}
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problem/:id" element={<ProblemPage />} />
        <Route path="/session/:id" element={<SessionPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to="/auth" />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
