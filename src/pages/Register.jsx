import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Logo from '../components/Logo'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', username: '', password: '', phone_number: '', role: 'attendee' })
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
      if (errors) Object.values(errors).forEach(msg => toast.error(Array.isArray(msg) ? msg[0] : msg))
      else toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A18] flex items-center justify-center px-6 pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md py-16">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <Logo />
          </Link>
          <h1 className="font-display font-bold text-2xl text-[#F0F0FF] mt-6">Create account</h1>
          <p className="text-[#8888AA] mt-1.5 text-sm">Join Kenya's hybrid event platform</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <fieldset>
              <legend className="field-label">I am a...</legend>
              <div className="grid grid-cols-3 gap-3">
                {['attendee', 'organiser', 'staff'].map(role => (
                  <button
                    key={role} type="button" onClick={() => setForm({ ...form, role })}
                    aria-pressed={form.role === role}
                    className={`py-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                      form.role === role
                        ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-[#A855F7]'
                        : 'border-[#2A2A5A] text-[#8888AA] hover:border-[#3D3D75]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              {form.role === 'staff' && (
                <p className="text-xs text-[#8888AA] mt-2.5">
                  Staff accounts are for gate-entry ticket scanning.
                </p>
              )}
            </fieldset>

            <div>
              <label htmlFor="username" className="field-label">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E96]" />
                <input
                  id="username" type="text" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="johndoe" required className="input input-icon-l"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="field-label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E96]" />
                <input
                  id="reg-email" type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" required className="input input-icon-l"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-phone" className="field-label">Phone number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E96]" />
                <input
                  id="reg-phone" type="tel" value={form.phone_number}
                  onChange={e => setForm({ ...form, phone_number: e.target.value })}
                  placeholder="0712345678" className="input input-icon-l"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="field-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E96]" />
                <input
                  id="reg-password" type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters" required
                  className="input input-icon-l input-icon-r"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E6E96] hover:text-[#F0F0FF]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-[15px]">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-center text-[#8888AA] text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#A855F7] hover:text-[#F0F0FF] transition-colors font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}