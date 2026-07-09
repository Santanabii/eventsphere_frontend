import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, Calendar, MapPin, QrCode, Tag, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import { ticketsAPI, marketplaceAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function MyTickets() {
  const queryClient = useQueryClient()
  const [listingTicket, setListingTicket] = useState(null)
  const [askingPrice, setAskingPrice] = useState('')

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['my-tickets'],
    queryFn: () => ticketsAPI.myTickets().then(r => r.data)
  })

  useEffect(() => {
    if (!listingTicket) return
    const onKey = (e) => { if (e.key === 'Escape') setListingTicket(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [listingTicket])

  const { mutate: createListing, isPending: listing } = useMutation({
    mutationFn: (data) => marketplaceAPI.createListing(data),
    onSuccess: () => {
      toast.success('Ticket listed for resale!')
      queryClient.invalidateQueries(['my-tickets'])
      setListingTicket(null); setAskingPrice('')
    },
    onError: (err) => {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(e => toast.error(e))
      else toast.error('Failed to create listing')
    }
  })

  const statusBadge = { active: 'badge-green', listed: 'badge-orange', used: 'badge-muted', transferred: 'badge-violet' }
  const formatDate = (d) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#0A0A18] pt-32 pb-24 px-6">
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-10">
            <span className="eyebrow">Your collection</span>
            <h1 className="font-display font-bold text-3xl text-[#F0F0FF]">My tickets</h1>
            <p className="text-[#8888AA] mt-1">{tickets?.length || 0} ticket{tickets?.length !== 1 ? 's' : ''}</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32" />)}
            </div>
          ) : tickets?.length === 0 ? (
            <div className="text-center py-20 card">
              <Ticket size={40} className="text-[#54547A] mx-auto mb-4" />
              <p className="text-lg font-medium text-[#F0F0FF]">No tickets yet</p>
              <p className="text-[#6E6E96] mt-1">Purchase tickets to events to see them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket, i) => (
                <motion.div key={ticket.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="card p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="font-display font-semibold text-lg text-[#F0F0FF]">{ticket.event_title}</h3>
                      <span className={`badge capitalize ${statusBadge[ticket.status] || 'badge-muted'}`}>{ticket.status}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-[#8888AA]">
                        <Calendar size={14} className="text-[#6E6E96]" /> {formatDate(ticket.event_date)}
                      </div>
                      <div className="flex items-center gap-2 text-[#8888AA]">
                        <MapPin size={14} className="text-[#6E6E96]" /> {ticket.event_venue}
                      </div>
                      <div className="flex items-center gap-2 text-[#8888AA]">
                        <Ticket size={14} className="text-[#6E6E96]" /> {ticket.tier_name}
                      </div>
                      <div className="flex items-center gap-2 text-[#8888AA]">
                        <Tag size={14} className="text-[#6E6E96]" /> KES {parseFloat(ticket.purchase_price).toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <QrCode size={14} className="text-[#6E6E96]" />
                      <code className="text-xs text-[#8888AA] bg-[#0A0A18] px-3 py-1 rounded-lg">{ticket.qr_token}</code>
                    </div>
                  </div>

                  {ticket.status === 'active' && (
                    <div className="flex md:flex-col gap-3 justify-end">
                      <button onClick={() => setListingTicket(ticket)} className="btn-orange text-sm py-2 px-4 whitespace-nowrap">
                        List for resale
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {listingTicket && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-6"
            role="dialog" aria-modal="true" aria-labelledby="list-modal-title"
            onClick={() => setListingTicket(null)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="card p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 id="list-modal-title" className="font-display font-semibold text-lg text-[#F0F0FF]">List for resale</h3>
                <button onClick={() => setListingTicket(null)} aria-label="Close" className="text-[#6E6E96] hover:text-[#F0F0FF]">
                  <X size={18} />
                </button>
              </div>

              <div className="bg-[#0A0A18] border border-[#2A2A5A] rounded-xl p-4 mb-6">
                <p className="font-medium text-[#F0F0FF]">{listingTicket.event_title}</p>
                <p className="text-sm text-[#8888AA] mt-1">{listingTicket.tier_name}</p>
                <p className="text-sm text-[#8888AA]">Original price: KES {parseFloat(listingTicket.purchase_price).toLocaleString()}</p>
              </div>

              <div className="mb-6">
                <label htmlFor="asking-price" className="field-label">Asking price (KES)</label>
                <input
                  id="asking-price" type="number" value={askingPrice}
                  onChange={e => setAskingPrice(e.target.value)}
                  placeholder="e.g. 600" className="input"
                />
                <p className="text-xs text-[#6E6E96] mt-2">Price cap applies — check event resale rules</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setListingTicket(null)} className="btn-ghost flex-1 py-3 text-sm">Cancel</button>
                <button
                  onClick={() => createListing({ ticket_id: listingTicket.id, asking_price: askingPrice })}
                  disabled={!askingPrice || listing}
                  className="btn-primary flex-1 py-3 text-sm"
                >
                  {listing ? 'Listing...' : 'List ticket'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}