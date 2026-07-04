import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
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
    <div className="page">
      <Navbar />

      <div className="container pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="eyebrow">Discover</span>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-text mb-3">All events</h1>
          <p className="text-text-secondary text-lg">Find your next unforgettable experience</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events or venues..."
              className="input pl-12 py-3.5"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'published'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-7 py-3.5 rounded-xl text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-accent text-white shadow-lg shadow-accent/25'
                    : 'bg-surface border border-border text-text-secondary hover:border-border-strong hover:text-text'
                }`}
              >
                {f === 'all' ? 'All' : 'Published'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container pb-24">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-[340px]" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 card">
            <div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-6">
              <Search size={36} className="text-text-muted" />
            </div>
            <p className="text-text text-2xl font-medium">No events found</p>
            <p className="text-text-muted mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}