import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Ticket, LogOut, User, LayoutDashboard, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#2A2A4A]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center">
            <Ticket size={16} className="text-white" />
          </div>
          <span className="text-xl font-black gradient-text">EventSphere</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/events"
            className={`text-sm font-medium transition-colors ${isActive('/events') ? 'text-[#A855F7]' : 'text-[#A0A0B8] hover:text-white'}`}
          >
            Events
          </Link>
          <Link
            to="/marketplace"
            className={`text-sm font-medium transition-colors ${isActive('/marketplace') ? 'text-[#A855F7]' : 'text-[#A0A0B8] hover:text-white'}`}
          >
            Marketplace
          </Link>
          {user?.role === 'organiser' && (
            <Link
              to="/organiser/dashboard"
              className={`text-sm font-medium transition-colors ${isActive('/organiser/dashboard') ? 'text-[#A855F7]' : 'text-[#A0A0B8] hover:text-white'}`}
            >
              Dashboard
            </Link>
          )}
          {user?.role === 'staff' && (
            <Link
              to="/scan"
              className={`text-sm font-medium transition-colors ${isActive('/scan') ? 'text-[#A855F7]' : 'text-[#A0A0B8] hover:text-white'}`}
            >
              Scanner
            </Link>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'attendee' && (
                <Link to="/my-tickets">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#A0A0B8] hover:text-white transition-colors">
                    <Ticket size={16} />
                    My Tickets
                  </button>
                </Link>
              )}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A35] rounded-full border border-[#2A2A4A]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center">
                  <User size={12} className="text-white" />
                </div>
                <span className="text-sm text-white">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[#A0A0B8] hover:text-white transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="px-5 py-2 text-sm text-[#A0A0B8] hover:text-white transition-colors font-medium">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="btn-primary text-sm py-2 px-5">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#13132B] border-t border-[#2A2A4A] px-6 py-4 flex flex-col gap-4">
          <Link to="/events" className="text-[#A0A0B8] hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Events</Link>
          <Link to="/marketplace" className="text-[#A0A0B8] hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Marketplace</Link>
          {user?.role === 'organiser' && (
            <Link to="/organiser/dashboard" className="text-[#A0A0B8] hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
          {user?.role === 'attendee' && (
            <Link to="/my-tickets" className="text-[#A0A0B8] hover:text-white text-sm" onClick={() => setMenuOpen(false)}>My Tickets</Link>
          )}
          {user?.role === 'staff' && (
            <Link to="/scan" className="text-[#A0A0B8] hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Scanner</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="text-left text-[#F97316] text-sm">Logout</button>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="text-sm text-[#A0A0B8]">Login</button>
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <button className="btn-primary text-sm py-2 px-4">Get Started</button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}