import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Calendar, MapPin, Tag, TrendingUp, TrendingDown, Phone, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import { marketplaceAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Marketplace() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [buyingListing, setBuyingListing] = useState(null)
  const [phone, setPhone] = useState('')
  const [purchasing, setPurchasing] = useState(false)
  const [polling, setPolling] = useState(false)

  const { data: listings, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: () => marketplaceAPI.listings().then(r => r.data)
  })

  useEffect(() => {
    if (!buyingListing) return
    const onKey = (e) => { if (e.key === 'Escape') { setBuyingListing(null); setPhone('') } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [buyingListing])

  const handlePurchase = async () => {
    if (!user) { navigate('/login'); return }
    if (!phone) { toast.error('Enter your M-Pesa number'); return }
    setPurchasing(true)
    try {
      const res = await marketplaceAPI.purchaseListing(buyingListing.id, { phone_number: phone })
      toast.success('STK Push sent! Enter your M-Pesa PIN')
      pollStatus(res.data.checkout_request_id)
      setBuyingListing(null)
      setPhone('')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Purchase failed')
    } finally {
      setPurchasing(false)
    }
  }

  const pollStatus = (checkoutId) => {
    setPolling(true)
    const interval = setInterval(async () => {
      try {
        const res = await marketplaceAPI.paymentStatus(checkoutId)
        if (res.data.status === 'completed') {
          clearInterval(interval)
          setPolling(false)
          toast.success('Ticket transferred! Check My Tickets.')
          navigate('/my-tickets')
        } else if (['failed', 'cancelled'].includes(res.data.status)) {
          clearInterval(interval)
          setPolling(false)
          toast.error('Payment failed')
        }
      } catch {
        clearInterval(interval)
        setPolling(false)
      }
    }, 3000)
    setTimeout(() => { clearInterval(interval); setPolling(false) }, 120000)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className="page">
      <Navbar />

      <div className="container pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="eyebrow">Secondary market</span>
          <h1 className="font-display font-bold text-4xl text-text">Ticket marketplace</h1>
          <p className="text-text-secondary mt-2">Buy resale tickets safely — all transfers are verified and fraud-protected</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mb-12 max-w-lg mx-auto">
          {[
            { label: 'Active listings', value: listings?.length || 0 },
            { label: 'Safe transfers', value: '100%' },
            { label: 'Platform fee', value: '10%' },
          ].map((s, i) => (
            <div key={i} className="card p-4 text-center">
              <p className="font-display font-bold text-xl text-text">{s.value}</p>
              <p className="text-xs text-text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-48" />
            ))}
          </div>
        ) : listings?.length === 0 ? (
          <div className="text-center py-20 card">
            <ShoppingBag size={40} className="text-text-muted mx-auto mb-4" />
            <p className="text-lg font-medium text-text">No listings yet</p>
            <p className="text-text-muted mt-1">Be the first to list a ticket for resale</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((listing, i) => {
              const above = parseFloat(listing.asking_price) > parseFloat(listing.original_price)
              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card p-6 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <h3 className="font-display font-semibold text-text text-lg line-clamp-1">{listing.event_title}</h3>
                    <span className="badge badge-accent whitespace-nowrap">{listing.tier_name}</span>
                  </div>

                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Calendar size={13} className="text-text-muted" />
                      {formatDate(listing.event_date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <MapPin size={13} className="text-text-muted" />
                      {listing.event_venue}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Tag size={13} className="text-text-muted" />
                      Original: KES {parseFloat(listing.original_price).toLocaleString()}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-muted">Asking price</p>
                      <p className="font-display font-bold text-lg text-text">
                        KES {parseFloat(listing.asking_price).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {above
                          ? <TrendingUp size={11} className="text-warning" />
                          : <TrendingDown size={11} className="text-success" />}
                        <span className={`text-xs ${above ? 'text-warning' : 'text-success'}`}>
                          {above ? 'Above' : 'Below'} face value
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!user) { navigate('/login'); return }
                        setBuyingListing(listing)
                      }}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Buy now
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {buyingListing && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="buy-modal-title"
            onClick={() => { setBuyingListing(null); setPhone('') }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="glass rounded-2xl p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 id="buy-modal-title" className="font-display font-semibold text-lg text-text">Complete purchase</h3>
                <button
                  onClick={() => { setBuyingListing(null); setPhone('') }}
                  aria-label="Close"
                  className="text-text-muted hover:text-text"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="card p-4 mb-6">
                <p className="font-medium text-text">{buyingListing.event_title}</p>
                <p className="text-sm text-text-secondary">{buyingListing.tier_name} · {buyingListing.event_venue}</p>
                <p className="font-display font-bold text-lg text-text mt-2">
                  KES {parseFloat(buyingListing.asking_price).toLocaleString()}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Platform fee (10%): KES {(parseFloat(buyingListing.asking_price) * 0.1).toLocaleString()}
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="buy-phone" className="field-label">M-Pesa phone number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    id="buy-phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="0712345678"
                    className="input pl-11"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setBuyingListing(null); setPhone('') }}
                  className="btn-ghost flex-1 py-3 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || !phone}
                  className="btn-primary flex-1 py-3 text-sm"
                >
                  {purchasing ? 'Processing...' : 'Pay via M-Pesa'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {polling && (
        <div className="fixed bottom-6 right-6 glass rounded-xl p-4 flex items-center gap-3 z-50">
          <div className="spinner" style={{ width: 18, height: 18 }} />
          <p className="text-sm text-text">Waiting for payment...</p>
        </div>
      )}
    </div>
  )
}