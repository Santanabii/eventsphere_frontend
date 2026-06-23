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
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center px-6 py-12">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-[#7C3AED]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-[#F97316]/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center">
              <Ticket size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black gradient-text">EventSphere</span>
          </Link>
          <h1 className="text-3xl font-black text-white mt-6">Create Account</h1>
          <p className="text-[#A0A0B8] mt-2">Join Kenya's #1 event platform</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role selector */}
            <div>
              <label className="text-sm text-[#A0A0B8] mb-2 block">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {['attendee', 'organiser'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={`py-3 rounded-xl border text-sm font-semibold capitalize transition-all ${
                      form.role === role
                        ? 'border-[#7C3AED] bg-[#7C3AED]/20 text-[#A855F7]'
                        : 'border-[#2A2A4A] text-[#A0A0B8] hover:border-[#7C3AED]/50'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="text-sm text-[#A0A0B8] mb-2 block">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B8]" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="johndoe"
                  required
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#A0A0B8] focus:outline-none focus:border-[#7C3AED] transition-colors text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-[#A0A0B8] mb-2 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B8]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#A0A0B8] focus:outline-none focus:border-[#7C3AED] transition-colors text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-[#A0A0B8] mb-2 block">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B8]" />
                <input
                  type="tel"
                  value={form.phone_number}
                  onChange={e => setForm({ ...form, phone_number: e.target.value })}
                  placeholder="0712345678"
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#A0A0B8] focus:outline-none focus:border-[#7C3AED] transition-colors text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-[#A0A0B8] mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full bg-[#0D0D1A] border border-[#2A2A4A] rounded-xl pl-11 pr-11 py-3 text-white placeholder-[#A0A0B8] focus:outline-none focus:border-[#7C3AED] transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0B8] hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-[#A0A0B8] text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#A855F7] hover:text-white transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}