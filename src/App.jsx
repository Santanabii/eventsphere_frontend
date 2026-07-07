import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Landing from './pages/Landing'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import MyTickets from './pages/MyTickets'
import Marketplace from './pages/Marketplace'
import Dashboard from './pages/organiser/Dashboard'
import CreateEvent from './pages/organiser/CreateEvent'
import Analytics from './pages/organiser/Analytics'
import Scanner from './pages/Scanner'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="spinner" />
    </div>
  )
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/" />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/my-tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/organiser/dashboard" element={<ProtectedRoute role="organiser"><Dashboard /></ProtectedRoute>} />
      <Route path="/organiser/create-event" element={<ProtectedRoute role="organiser"><CreateEvent /></ProtectedRoute>} />
      <Route path="/organiser/analytics/:id" element={<ProtectedRoute role="organiser"><Analytics /></ProtectedRoute>} />
      <Route path="/scan" element={<ProtectedRoute role="staff"><Scanner /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}