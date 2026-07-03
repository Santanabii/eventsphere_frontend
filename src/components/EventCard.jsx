import { Link } from 'react-router-dom'
import { Calendar, MapPin, Ticket, ArrowUpRight } from 'lucide-react'

export default function EventCard({ event }) {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-KE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  const lowestPrice =
    event.tiers?.length > 0
      ? Math.min(...event.tiers.map((t) => parseFloat(t.price)))
      : null

  const statusBadge = event.status === 'published' ? 'badge-success' : 'badge-warning'

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <article className="card overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Banner */}
        <div className="relative h-52 overflow-hidden bg-surface flex-shrink-0">
          {event.banner_image ? (
            <img
              src={event.banner_image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface">
              <Ticket size={40} className="text-text-muted" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`badge ${statusBadge} capitalize text-xs`}>{event.status}</span>
            {event.resale_allowed && (
              <span className="badge badge-accent text-xs">Resale</span>
            )}
          </div>

          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-bg/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-border">
            <ArrowUpRight size={14} className="text-text" />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-[17px] font-display font-semibold text-text group-hover:text-accent-hover transition-colors line-clamp-1 mb-3">
            {event.title}
          </h3>

          <div className="space-y-2.5 flex-1">
            <div className="flex items-center gap-2.5 text-sm text-text-secondary">
              <Calendar size={14} className="text-text-muted flex-shrink-0" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-text-secondary">
              <MapPin size={14} className="text-text-muted flex-shrink-0" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          </div>

          <div className="flex items-end justify-between mt-5 pt-4 border-t border-border">
            {lowestPrice !== null ? (
              <div>
                <p className="text-xs text-text-muted mb-0.5">From</p>
                <p className="text-xl font-display font-bold text-text">
                  KES {lowestPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-text-muted">No tiers yet</p>
            )}
            <div className="flex items-center gap-1.5 text-xs text-text-muted bg-bg-soft px-3 py-1.5 rounded-full">
              <Ticket size={12} />
              {event.tiers?.length || 0} tiers
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}