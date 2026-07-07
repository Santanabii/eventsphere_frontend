import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, LogOut, User } from 'lucide-react'
import toast from 'react-hot-toast'
import Logo from './Logo'


export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

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
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm transition-colors ${
                isActive(link.to) ? 'text-zinc-100 font-medium' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                  <User size={12} className="text-white" />
                </div>
                <span className="text-sm text-zinc-100 font-medium">{user.username}</span>
                <span className="text-xs text-zinc-500 capitalize">· {user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors px-2"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-ghost py-2 px-5 text-sm">Log in</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary py-2 px-5 text-sm">Get started</button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-zinc-100 p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-5">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[15px] ${isActive(link.to) ? 'text-zinc-100 font-medium' : 'text-zinc-400'}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="divider" />
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-zinc-400">
                <LogOut size={15} />
                Log out
              </button>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="flex-1">
                  <button className="btn-ghost w-full py-2.5 text-sm">Log in</button>
                </Link>
                <Link to="/register" className="flex-1">
                  <button className="btn-primary w-full py-2.5 text-sm">Get started</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}