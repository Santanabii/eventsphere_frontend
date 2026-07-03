import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Ticket, LogOut, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/marketplace', label: 'Marketplace' },
    ...(user?.role === 'organiser' ? [{ to: '/organiser/dashboard', label: 'Dashboard' }] : []),
    ...(user?.role === 'staff' ? [{ to: '/scan', label: 'Scanner' }] : []),
    ...(user?.role === 'attendee' ? [{ to: '/my-tickets', label: 'My Tickets' }] : []),
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-border' : 'bg-transparent'
      }`}
      style={{ height: 'var(--nav-height)' }}
    >
      <div className="container h-full flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
            <Ticket size={16} className="text-white" />
          </div>
          <span className="text-xl font-display font-bold text-text tracking-tight">
            EventSphere
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-[14px] transition-all ${
                isActive(link.to) 
                  ? 'text-text font-semibold border-b-2 border-accent pb-1' 
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-surface border border-border">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <User size={13} className="text-white" />
                </div>
                <span className="text-sm text-text font-medium">{user.username}</span>
                <span className="text-xs text-text-muted capitalize bg-bg-soft px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors p-2 rounded-lg hover:bg-surface"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-ghost py-2.5 px-6 text-sm">Log in</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary py-2.5 px-6 text-sm">Get started</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-text p-2 rounded-lg hover:bg-surface transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden glass border-t border-border">
          <div className="container py-8 flex flex-col gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[15px] transition-colors ${
                  isActive(link.to) ? 'text-text font-semibold' : 'text-text-secondary hover:text-text'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="divider" />
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors"
              >
                <LogOut size={15} />
                Log out
              </button>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="flex-1">
                  <button className="btn-ghost w-full py-3 text-sm">Log in</button>
                </Link>
                <Link to="/register" className="flex-1">
                  <button className="btn-primary w-full py-3 text-sm">Get started</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}