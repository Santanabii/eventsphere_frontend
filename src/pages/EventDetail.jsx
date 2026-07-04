import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Ticket, Users, ArrowLeft, Phone } from 'lucide-react'
import Navbar from '../components/Navbar'
import { eventsAPI, ticketsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function EventDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedTier, setSelectedTier] = useState(null)
  const [phone, setPhone] = useState('')
  const [purchasing, setPurchasing] = useState(false)
  const [polling, setPolling] = useState(false)

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsAPI.detail(id).then(r => r.data)
  })

  const handlePurchase = async () => {
    if (!user) { navigate('/login'); return }
    if (!selectedTier) { toast.error('Please select a ticket tier'); return }
    if (!phone) { toast.error('Please enter your M-Pesa phone number'); return }

    setPurchasing(true)
    try {
      const res = await ticketsAPI.purchase({
        tier_id: selectedTier.id,
        phone_number: phone
      })
      toast.success('STK Push sent! Enter your M-Pesa PIN')
      pollPaymentStatus(res.data.checkout_request_id)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed')
    } finally {
      setPurchasing(false)
    }
  }

  const pollPaymentStatus = (checkoutReqId) => {
    setPolling(true)
    const interval = setInterval(async () => {
      try {
        const res = await ticketsAPI.paymentStatus(checkoutReqId)
        if (res.data.status === 'completed') {
          clearInterval(interval)
          setPolling(false)
          toast.success('Payment confirmed! Check your email for your ticket.')
          navigate('/my-tickets')
        } else if (res.data.status === 'failed' || res.data.status === 'cancelled') {
          clearInterval(interval)
          setPolling(false)
          toast.error('Payment failed or cancelled')
        }
      } catch {
        clearInterval(interval)
        setPolling(false)
      }
    }, 3000)
    setTimeout(() => { clearInterval(interval); setPolling(false) }, 120000)
  }

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-KE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('en-KE', {
    hour: '2-digit', minute: '2-digit'
  })

  if (isLoading) return <div className="min-h-screen bg-bg flex items-center justify-center"><div className="spinner" /></div>
  if (!event) return <div className="min-h-screen bg-bg flex items-center justify-center"><p className="text-text-secondary text-lg">Event not found</p></div>

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-96 md:h-[440px]" style={{ marginTop: 'var(--nav-height)' }}>
        {event.banner_image ? (
          <img src={event.banner_image} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2.5 glass px-5 py-3 rounded-full text-sm text-text hover:border-accent transition-all hover:shadow-lg"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        
        <div className="absolute bottom-8 left-6 md:left-12 max-w-3xl">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className={`badge badge-success capitalize`}>{event.status}</span>
            {event.resale_allowed && (
              <span className="badge badge-accent">Resale enabled</span>
            )}
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-text leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Event Info */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="space-y-5 mb-12">
                <div className="flex items-start gap-5 text-text-secondary">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar size={20} className="text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-text font-medium text-lg">{formatDate(event.date)}</p>
                    <p className="text-sm text-text-muted">{formatTime(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 text-text-secondary">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={20} className="text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-text font-medium text-lg">{event.venue}</p>
                    <p className="text-sm text-text-muted">Venue</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 text-text-secondary">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users size={20} className="text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-text font-medium text-lg">Organised by {event.organiser_name}</p>
                    <p className="text-sm text-text-muted">Organiser</p>
                  </div>
                </div>
              </div>

              <div className="card p-8 md:p-10">
                <h3 className="font-display font-semibold text-2xl text-text mb-5">About this event</h3>
                <p className="text-text-secondary leading-relaxed text-[16px] whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Ticket Purchase Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="glass rounded-2xl p-8 md:p-10 sticky"
              style={{ top: 'calc(var(--nav-height) + 32px)' }}
            >
              <h3 className="font-display font-semibold text-2xl text-text mb-8 flex items-center gap-3">
                <Ticket size={22} className="text-accent" />
                Get tickets
              </h3>

              <div className="space-y-3 mb-8">
                {event.tiers?.length > 0 ? event.tiers.map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier)}
                    className={`w-full p-5 rounded-xl border text-left transition-all ${
                      selectedTier?.id === tier.id
                        ? 'border-accent bg-accent/10 shadow-lg shadow-accent/5'
                        : 'border-border hover:border-border-strong hover:bg-surface'
                    } ${!tier.is_available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!tier.is_available}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-text text-[15px]">{tier.name}</p>
                        <p className="text-xs text-text-muted mt-1">
                          {tier.quantity_remaining} remaining
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-2xl text-text">
                          KES {parseFloat(tier.price).toLocaleString()}
                        </p>
                        {!tier.is_available && (
                          <p className="text-xs text-danger mt-1">Unavailable</p>
                        )}
                      </div>
                    </div>
                  </button>
                )) : (
                  <p className="text-text-muted text-sm text-center py-10">No tickets available yet</p>
                )}
              </div>

              {selectedTier && (
                <div className="mb-8">
                  <label htmlFor="phone" className="field-label">M-Pesa phone number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="0712345678"
                      className="input pl-11 py-3.5"
                    />
                  </div>
                </div>
              )}

              {polling ? (
                <div className="text-center py-8">
                  <div className="spinner mx-auto mb-4" />
                  <p className="text-sm text-text-secondary">Waiting for payment confirmation...</p>
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={!selectedTier || purchasing}
                  className="btn-primary w-full py-4.5 text-[16px]"
                >
                  {purchasing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending STK Push...
                    </span>
                  ) : selectedTier
                    ? `Pay KES ${parseFloat(selectedTier.price).toLocaleString()} via M-Pesa`
                    : 'Select a tier'
                  }
                </button>
              )}

              {!user && (
                <p className="text-center text-text-muted text-sm mt-5">
                  <button onClick={() => navigate('/login')} className="text-accent-hover hover:text-text underline font-medium">
                    Sign in
                  </button>
                  {' '}to purchase tickets
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}