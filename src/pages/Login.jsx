import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Logo from '../components/Logo'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.username}!`)
      if (user.role === 'organiser') navigate('/organiser/dashboard')
      else if (user.role === 'staff') navigate('/scan')
      else navigate('/events')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A18] flex items-center justify-center px-6 pt-20">
      <Link
        to="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-sm text-[#8888AA] hover:text-[#F0F0FF] transition-colors z-10"
      >
        <ArrowLeft size={16} />
        Back to home
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md py-16">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <Logo />
          </Link>
          <h1 className="font-display font-bold text-2xl text-[#F0F0FF] mt-6">Welcome back</h1>
          <p className="text-[#8888AA] mt-1.5 text-sm">Sign in to your account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="field-label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E96]" />
                <input
                  id="email" type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" required
                  className="input input-icon-l"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="field-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E96]" />
                <input
                  id="password" type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required
                  className="input input-icon-l input-icon-r"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E6E96] hover:text-[#F0F0FF] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-[15px]">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-[#8888AA] text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#A855F7] hover:text-[#F0F0FF] transition-colors font-medium">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}