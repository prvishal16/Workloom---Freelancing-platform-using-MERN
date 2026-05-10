import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./context/AuthContext";

import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RoleGuard from "./routes/RoleGuard";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import HomeFeed from "./pages/HomeFeed";
import ProjectDetail from "./pages/ProjectDetail";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import CreateProject from "./pages/CreateProject";
import ViewProposals from "./pages/ViewProposals";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import FindWorkPage from "./pages/FindWorkPage.jsx";
import SearchResultsPage from "./pages/SearchResultsPage.jsx";
import MessagesPage from './pages/MessagesPage';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user?.role === "client") return <Navigate to="/client" replace />;
  if (user?.role === "freelancer") return <Navigate to="/freelancer" replace />;
  return <Navigate to="/login" replace />; 
};

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          
          <Route path="/home" element={<HomeFeed />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />

          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/client" element={<RoleGuard allow={['client']}><ClientDashboard /></RoleGuard>} />
          <Route path="/freelancer" element={<RoleGuard allow={['freelancer']}><FreelancerDashboard /></RoleGuard>} />
          <Route path="/project/new" element={<RoleGuard allow={['client']}><CreateProject /></RoleGuard>} />
          <Route path="/project/:projectId/proposals" element={<RoleGuard allow={['client']}><ViewProposals /></RoleGuard>} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/find-work" element={<FindWorkPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:conversationId" element={<MessagesPage />} />

        </Route>
        
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default App;

