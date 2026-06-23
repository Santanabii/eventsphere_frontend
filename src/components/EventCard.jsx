import { Link } from 'react-router-dom'
import { Calendar, MapPin, Ticket } from 'lucide-react'

export default function EventCard({ event }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-KE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const lowestPrice = event.tiers?.length > 0
    ? Math.min(...event.tiers.map(t => parseFloat(t.price)))
    : null

  return (
    <Link to={`/events/${event.id}`}>
      <div className="card group cursor-pointer overflow-hidden">
        {/* Banner Image */}
        <div className="relative h-48 bg-gradient-to-br from-[#7C3AED] to-[#F97316] overflow-hidden">
          {event.banner_image ? (
            <img
              src={event.banner_image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Ticket size={48} className="text-white/30" />
            </div>
          )}
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              event.status === 'published'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {event.status}
            </span>
          </div>
          {/* Resale Badge */}
          {event.resale_allowed && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F97316]/20 text-[#FB923C] border border-[#F97316]/30">
                Resale ✓
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-white group-hover:text-[#A855F7] transition-colors line-clamp-1">
            {event.title}
          </h3>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-[#A0A0B8] text-sm">
              <Calendar size={14} className="text-[#7C3AED]" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-[#A0A0B8] text-sm">
              <MapPin size={14} className="text-[#F97316]" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              {lowestPrice !== null ? (
                <div>
                  <span className="text-xs text-[#A0A0B8]">From</span>
                  <p className="text-lg font-bold gradient-text">
                    KES {lowestPrice.toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[#A0A0B8]">No tiers yet</p>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#A0A0B8]">
              <Ticket size={12} />
              <span>{event.tiers?.length || 0} tiers</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}