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

  const statusBadge = {
    published: 'badge-success',
    draft: 'badge-warning',
    closed: 'badge-muted',
  }

  return (
    <div className="page">
      <Navbar />

      <div className="container pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-16 flex-wrap gap-4"
        >
          <div>
            <span className="eyebrow">Organiser</span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-text mb-2">
              Welcome back, {user?.username}
            </h1>
            <p className="text-text-secondary text-lg">Manage your events and track performance</p>
          </div>
          <Link to="/organiser/create-event">
            <button className="btn-primary flex items-center gap-2.5 px-8 py-4">
              <Plus size={20} />
              New event
            </button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Total events', value: totalEvents, icon: <Ticket size={22} /> },
            { label: 'Published', value: publishedEvents, icon: <Eye size={22} /> },
            { label: 'Drafts', value: draftEvents, icon: <Edit size={22} /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-6 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent-hover flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <p className="font-display font-bold text-3xl text-text">{stat.value}</p>
              <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Events List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-2xl text-text">Your events</h2>
            {events?.length > 0 && (
              <span className="text-sm text-text-muted">{events.length} total</span>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-28" />
              ))}
            </div>
          ) : events?.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-6">
                <Ticket size={48} className="text-text-muted" />
              </div>
              <p className="text-2xl font-medium text-text">No events yet</p>
              <p className="text-text-muted mt-2 mb-8">Create your first event to get started</p>
              <Link to="/organiser/create-event">
                <button className="btn-primary">Create event</button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card p-5 flex items-center justify-between gap-4 flex-wrap hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* Event Info */}
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-surface border border-border flex-shrink-0 overflow-hidden">
                      {event.banner_image ? (
                        <img 
                          src={event.banner_image} 
                          alt={event.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface">
                          <Ticket size={24} className="text-text-muted" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-text text-lg truncate">{event.title}</h3>
                      <p className="text-sm text-text-secondary truncate flex items-center gap-2">
                        {event.venue}
                        <span className="w-1 h-1 rounded-full bg-text-muted" />
                        {new Date(event.date).toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    <span className={`badge capitalize text-[10px] ${statusBadge[event.status] || 'badge-muted'}`}>
                      {event.status}
                    </span>
                    <span className="text-xs text-text-muted bg-bg-soft px-3 py-1 rounded-full">
                      {event.tiers?.length || 0} tiers
                    </span>
                    <Link to={`/organiser/analytics/${event.id}`}>
                      <button 
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent/10 text-accent-hover hover:bg-accent/20 transition-all text-sm font-medium"
                        aria-label={`View analytics for ${event.title}`}
                      >
                        <BarChart3 size={15} />
                        <span className="hidden sm:inline">Analytics</span>
                      </button>
                    </Link>
                    <Link to={`/events/${event.id}`}>
                      <button 
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface border border-border text-text-secondary hover:text-text hover:border-accent/30 transition-all text-sm"
                        aria-label={`View ${event.title}`}
                      >
                        <Eye size={15} />
                        <span className="hidden sm:inline">View</span>
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