import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './views/pages/LandingPage'
import LoginPage from './views/pages/LoginPage'
import SignupPage from './views/pages/SignupPage'
import ForgotPasswordPage from './views/pages/ForgotPasswordPage'
import DashboardPage from './views/pages/DashboardPage'
import PostRidePage from './views/pages/PostRidePage'
import ProfilePage from './views/pages/ProfilePage'
import MyRidesPage from './views/pages/MyRidesPage'
import RideDetailsPage from './views/pages/RideDetailsPage'
import { useAuth } from './controllers/useAuth'

/**
 * ProtectedRoute — redirects unauthenticated users to login.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-[#2563EB] rounded-full animate-spin" />
    </div>
  )
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgotpassword" element={<ForgotPasswordPage />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/post-ride" element={
        <ProtectedRoute><PostRidePage /></ProtectedRoute>
      } />
      <Route path="/my-rides" element={
        <ProtectedRoute><MyRidesPage /></ProtectedRoute>
      } />
      <Route path="/rides/:id" element={
        <ProtectedRoute><RideDetailsPage /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><ProfilePage /></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
