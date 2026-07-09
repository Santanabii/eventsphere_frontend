import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, BarChart3, Ticket, Eye, Edit } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { eventsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  const { data: events, isLoading } = useQuery({
    queryKey: ['organiser-events'],
    queryFn: () => eventsAPI.list().then(r => r.data)
  })

  const totalEvents = events?.length || 0
  const publishedEvents = events?.filter(e => e.status === 'published').length || 0
  const draftEvents = events?.filter(e => e.status === 'draft').length || 0

  const statusBadge = { published: 'badge-green', draft: 'badge-orange', closed: 'badge-muted' }

  return (
    <div className="min-h-screen bg-[#0A0A18] pt-32 pb-24 px-6">
      <Navbar />

      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="eyebrow">Organiser</span>
            <h1 className="font-display font-bold text-3xl text-[#F0F0FF]">Welcome, {user?.username}</h1>
            <p className="text-[#8888AA] mt-1">Manage your events and track performance</p>
          </div>
          <Link to="/organiser/create-event">
            <button className="btn-primary flex items-center gap-2">
              <Plus size={18} /> New event
            </button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-3 gap-5 mb-10">
          {[
            { label: 'Total events', value: totalEvents, icon: <Ticket size={18} /> },
            { label: 'Published', value: publishedEvents, icon: <Eye size={18} /> },
            { label: 'Drafts', value: draftEvents, icon: <Edit size={18} /> },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-6">
              <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/10 text-[#A855F7] flex items-center justify-center mb-4">{stat.icon}</div>
              <p className="font-display font-bold text-2xl text-[#F0F0FF]">{stat.value}</p>
              <p className="text-sm text-[#8888AA] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="font-display font-semibold text-xl text-[#F0F0FF] mb-6">Your events</h2>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20" />)}
            </div>
          ) : events?.length === 0 ? (
            <div className="card p-12 text-center">
              <Ticket size={40} className="text-[#54547A] mx-auto mb-4" />
              <p className="text-lg font-medium text-[#F0F0FF]">No events yet</p>
              <p className="text-[#6E6E96] mt-1 mb-6">Create your first event to get started</p>
              <Link to="/organiser/create-event"><button className="btn-primary">Create event</button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="card p-6 flex items-center justify-between gap-6 flex-wrap">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#16163A] border border-[#2A2A5A] flex-shrink-0 overflow-hidden">
                      {event.banner_image ? (
                        <img src={event.banner_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Ticket size={18} className="text-[#54547A]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-[#F0F0FF] truncate">{event.title}</h3>
                      <p className="text-sm text-[#8888AA] truncate">{event.venue}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`badge capitalize ${statusBadge[event.status] || 'badge-muted'}`}>{event.status}</span>
                    <span className="text-xs text-[#6E6E96]">{event.tiers?.length || 0} tiers</span>
                    <Link to={`/organiser/analytics/${event.id}`}>
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#7C3AED]/10 text-[#A855F7] hover:bg-[#7C3AED]/15 transition-colors text-sm">
                        <BarChart3 size={14} /> Analytics
                      </button>
                    </Link>
                    <Link to={`/events/${event.id}`}>
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#16163A] border border-[#2A2A5A] text-[#8888AA] hover:text-[#F0F0FF] transition-colors text-sm">
                        <Eye size={14} /> View
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}