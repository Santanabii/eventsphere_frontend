import { Link } from 'react-router-dom'
import { Calendar, MapPin, Ticket, ArrowUpRight } from 'lucide-react'

export default function EventCard({ event }) {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-KE', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    })

  const lowestPrice =
    event.tiers?.length > 0
      ? Math.min(...event.tiers.map((t) => parseFloat(t.price)))
      : null

  const statusBadge = event.status === 'published' ? 'badge-green' : 'badge-amber'

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <article className="card overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden bg-zinc-900 flex-shrink-0">
          {event.banner_image ? (
            <img
              src={event.banner_image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Ticket size={40} className="text-zinc-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`badge ${statusBadge} capitalize`}>{event.status}</span>
            {event.resale_allowed && <span className="badge badge-violet">Resale</span>}
          </div>

          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={13} className="text-zinc-100" />
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-[17px] font-display font-semibold text-zinc-100 group-hover:text-violet-400 transition-colors line-clamp-1 mb-4">
            {event.title}
          </h3>

          <div className="space-y-2.5 flex-1">
            <div className="flex items-center gap-2.5 text-sm text-zinc-400">
              <Calendar size={14} className="text-zinc-500 flex-shrink-0" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-zinc-400">
              <MapPin size={14} className="text-zinc-500 flex-shrink-0" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          </div>

          <div className="flex items-end justify-between mt-5 pt-5 border-t border-zinc-800">
            {lowestPrice !== null ? (
              <div>
                <p className="text-xs text-zinc-500 mb-0.5">From</p>
                <p className="text-lg font-display font-bold text-zinc-100">
                  KES {lowestPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No tiers yet</p>
            )}
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Ticket size={12} />
              {event.tiers?.length || 0} tiers
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}