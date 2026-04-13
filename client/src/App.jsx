import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SidebarLayout from "./components/SidebarLayout";
import ScrollToTop from "./components/ScrollToTop";
import DashboardPage from "./pages/DashboardPage";
import CodingPage from "./pages/CodingPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import LoginPage from "./pages/LoginPage";
import QuizPage from "./pages/QuizPage";
import SignupPage from "./pages/SignupPage";
import StudyPlanPage from "./pages/StudyPlanPage";

const App = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="coding" element={<CodingPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="study-plan" element={<StudyPlanPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

export default App;
