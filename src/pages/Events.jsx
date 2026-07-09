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
    <div className="min-h-screen bg-[#0A0A18] pt-32 pb-24 px-6">
      <Navbar />

      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="eyebrow">Discover</span>
          <h1 className="font-display font-bold text-3xl text-[#F0F0FF]">All events</h1>
          <p className="text-[#8888AA] mt-2">Find your next unforgettable experience</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-14">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E96]" />
            <label htmlFor="event-search" className="sr-only">Search events or venues</label>
            <input
              id="event-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events or venues..."
              className="input input-icon-l"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'published'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-[#7C3AED] text-white'
                    : 'bg-[#16163A] border border-[#2A2A5A] text-[#8888AA] hover:border-[#3D3D75]'
                }`}
              >
                {f === 'all' ? 'All' : 'Published'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-72" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#16163A] border border-[#2A2A5A] flex items-center justify-center mx-auto mb-4">
              <Search size={26} className="text-[#6E6E96]" />
            </div>
            <p className="text-[#F0F0FF] text-lg font-medium">No events found</p>
            <p className="text-[#6E6E96] text-sm mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  )
}