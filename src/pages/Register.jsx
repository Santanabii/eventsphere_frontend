import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff, Ticket } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '', username: '', password: '',
    phone_number: '', role: 'attendee'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        Object.values(errors).forEach(msg => toast.error(Array.isArray(msg) ? msg[0] : msg))
      } else {
        toast.error('Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <div
        className="orb w-96 h-96 top-1/3 right-1/4"
        style={{ background: 'color-mix(in srgb, var(--color-accent) 14%, transparent)' }}
      />
      <div
        className="orb w-72 h-72 bottom-1/4 left-1/4"
        style={{ background: 'color-mix(in srgb, var(--color-accent) 8%, transparent)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Ticket size={20} className="text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-text">EventSphere</span>
          </Link>
          <h1 className="font-display font-bold text-4xl text-text mt-8">Create account</h1>
          <p className="text-text-secondary mt-2 text-base">Join Kenya's hybrid event platform</p>
        </div>

        <div className="glass rounded-2xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">

            <fieldset>
              <legend className="field-label">I am a...</legend>
              <div className="grid grid-cols-2 gap-3">
                {['attendee', 'organiser'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    aria-pressed={form.role === role}
                    className={`py-4 rounded-xl border text-sm font-medium capitalize transition-all ${
                      form.role === role
                        ? 'border-accent bg-accent/10 text-accent-hover shadow-lg shadow-accent/5'
                        : 'border-border text-text-secondary hover:border-border-strong hover:text-text'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="username" className="field-label">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="username"
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="johndoe"
                  required
                  className="input pl-12 py-3.5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="field-label">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="input pl-12 py-3.5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-phone" className="field-label">Phone number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="reg-phone"
                  type="tel"
                  value={form.phone_number}
                  onChange={e => setForm({ ...form, phone_number: e.target.value })}
                  placeholder="0712345678"
                  className="input pl-12 py-3.5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="field-label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  required
                  className="input pl-12 pr-12 py-3.5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4.5 text-[16px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-hover hover:text-text transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}