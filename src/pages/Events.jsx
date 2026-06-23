import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import Navbar from '../components/Navbar'
import EventCard from '../components/EventCard'
import { eventsAPI } from '../services/api'

export default function Events() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsAPI.list().then(r => r.data)
  })

  const filtered = events?.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || e.status === filter
    return matchSearch && matchFilter
  }) || []

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">Discover</span>
          <h1 className="text-5xl font-black text-white mt-2">All Events</h1>
          <p className="text-[#A0A0B8] mt-3">Find your next unforgettable experience</p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B8]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events or venues..."
              className="w-full bg-[#1A1A35] border border-[#2A2A4A] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#A0A0B8] focus:outline-none focus:border-[#7C3AED] transition-colors text-sm"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'published'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-[#7C3AED] text-white'
                    : 'bg-[#1A1A35] border border-[#2A2A4A] text-[#A0A0B8] hover:border-[#7C3AED]'
                }`}
              >
                {f === 'all' ? 'All' : 'Published'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-72 animate-pulse bg-[#1A1A35]" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#1A1A35] flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-[#A0A0B8]" />
            </div>
            <p className="text-[#A0A0B8] text-lg">No events found</p>
            <p className="text-[#A0A0B8] text-sm mt-2">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  )
}