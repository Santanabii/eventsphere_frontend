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
      <article className="card overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
        {/* Banner */}
        <div className="relative h-56 overflow-hidden bg-surface flex-shrink-0">
          {event.banner_image ? (
            <img
              src={event.banner_image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface">
              <Ticket size={48} className="text-text-muted" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`badge ${statusBadge} text-[10px]`}>{event.status}</span>
            {event.resale_allowed && (
              <span className="badge badge-accent text-[10px]">Resale</span>
            )}
          </div>

          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-bg/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-border">
            <ArrowUpRight size={14} className="text-text" />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-[18px] font-display font-semibold text-text group-hover:text-accent-hover transition-colors line-clamp-1 mb-3">
            {event.title}
          </h3>

          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <Calendar size={15} className="text-text-muted flex-shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <MapPin size={15} className="text-text-muted flex-shrink-0" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          </div>

          <div className="flex items-end justify-between mt-5 pt-4 border-t border-border">
            {lowestPrice !== null ? (
              <div>
                <p className="text-xs text-text-muted mb-0.5 font-medium uppercase tracking-wider">From</p>
                <p className="text-xl font-display font-bold text-text">
                  KES {lowestPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-text-muted">No tiers yet</p>
            )}
            <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-soft px-3.5 py-1.5 rounded-full">
              <Ticket size={13} />
              <span>{event.tiers?.length || 0} tiers</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}