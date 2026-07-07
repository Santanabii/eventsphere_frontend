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
      const res = await ticketsAPI.purchase({ tier_id: selectedTier.id, phone_number: phone })
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
          clearInterval(interval); setPolling(false)
          toast.success('Payment confirmed! Check your email for your ticket.')
          navigate('/my-tickets')
        } else if (res.data.status === 'failed' || res.data.status === 'cancelled') {
          clearInterval(interval); setPolling(false)
          toast.error('Payment failed or cancelled')
        }
      } catch {
        clearInterval(interval); setPolling(false)
      }
    }, 3000)
    setTimeout(() => { clearInterval(interval); setPolling(false) }, 120000)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const formatTime = (d) => new Date(d).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })

  if (isLoading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="spinner" />
    </div>
  )

  if (!event) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <p className="text-zinc-400">Event not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* mt-20 = the navbar's fixed height, so the banner sits directly below it */}
      <div className="relative h-72 md:h-80 mt-20">
        {event.banner_image ? (
          <img src={event.banner_image} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-zinc-100 hover:border-violet-500 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="badge badge-green capitalize">{event.status}</span>
                {event.resale_allowed && <span className="badge badge-violet">Resale enabled</span>}
              </div>

              <h1 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 mb-6">{event.title}</h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-zinc-400">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-zinc-100 font-medium">{formatDate(event.date)}</p>
                    <p className="text-sm">{formatTime(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-zinc-100 font-medium">{event.venue}</p>
                    <p className="text-sm">Venue</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-zinc-100 font-medium">Organised by {event.organiser_name}</p>
                    <p className="text-sm">Organiser</p>
                  </div>
                </div>
              </div>

              <div className="card p-7">
                <h3 className="font-display font-semibold text-lg text-zinc-100 mb-3">About this event</h3>
                <p className="text-zinc-400 leading-relaxed">{event.description}</p>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="glass rounded-2xl p-7 sticky top-28">
              <h3 className="font-display font-semibold text-lg text-zinc-100 mb-6 flex items-center gap-2">
                <Ticket size={18} className="text-violet-400" /> Get tickets
              </h3>

              <div className="space-y-3 mb-6">
                {event.tiers?.length > 0 ? event.tiers.map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier)}
                    className={`w-full p-4 rounded-xl border text-left transition-colors ${
                      selectedTier?.id === tier.id ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-800 hover:border-zinc-700'
                    } ${!tier.is_available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!tier.is_available}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-zinc-100">{tier.name}</p>
                        <p className="text-xs text-zinc-500 mt-1">{tier.quantity_remaining} remaining</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-semibold text-zinc-100">
                          KES {parseFloat(tier.price).toLocaleString()}
                        </p>
                        {!tier.is_available && <p className="text-xs text-red-400 mt-1">Unavailable</p>}
                      </div>
                    </div>
                  </button>
                )) : (
                  <p className="text-zinc-500 text-sm text-center py-4">No tickets available yet</p>
                )}
              </div>

              {selectedTier && (
                <div className="mb-5">
                  <label htmlFor="phone" className="field-label">M-Pesa phone number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      id="phone" type="tel" value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="0712345678"
                      className="input input-icon-l"
                    />
                  </div>
                </div>
              )}

              {polling ? (
                <div className="text-center py-4">
                  <div className="spinner mx-auto mb-2" />
                  <p className="text-sm text-zinc-400">Waiting for payment confirmation...</p>
                </div>
              ) : (
                <button onClick={handlePurchase} disabled={!selectedTier || purchasing} className="btn-primary w-full py-3">
                  {purchasing ? 'Sending STK Push...' : selectedTier
                    ? `Pay KES ${parseFloat(selectedTier.price).toLocaleString()} via M-Pesa`
                    : 'Select a tier'}
                </button>
              )}

              {!user && (
                <p className="text-center text-zinc-500 text-xs mt-3">
                  <button onClick={() => navigate('/login')} className="text-violet-400 underline">Sign in</button>
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