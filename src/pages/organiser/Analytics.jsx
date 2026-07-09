import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, DollarSign, Ticket, TrendingUp, Wifi } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { analyticsAPI } from '../../services/api'
import { useEffect, useRef, useState } from 'react'

export default function Analytics() {
  const { id } = useParams()
  const wsRef = useRef(null)
  const [liveData, setLiveData] = useState(null)

  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics', id],
    queryFn: () => analyticsAPI.eventStats(id).then(r => r.data),
    refetchInterval: 30000
  })

  useEffect(() => {
    const wsUrl = `${import.meta.env.VITE_API_URL?.replace('https', 'wss').replace('http', 'ws')}/ws/analytics/${id}/`
    wsRef.current = new WebSocket(wsUrl)
    wsRef.current.onmessage = (e) => setLiveData(JSON.parse(e.data))
    return () => wsRef.current?.close()
  }, [id])

  const displayData = liveData || stats

  if (isLoading) return (
    <div className="min-h-screen bg-[#0A0A18] flex items-center justify-center">
      <div className="spinner" />
    </div>
  )

  const tooltipStyle = { backgroundColor: '#16163A', border: '1px solid #3D3D75', borderRadius: '10px', color: '#F0F0FF', fontSize: '13px' }

  return (
    <div className="min-h-screen bg-[#0A0A18] pt-32 pb-24 px-6">
      <Navbar />

      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="eyebrow">Live dashboard</span>
              <h1 className="font-display font-bold text-3xl text-[#F0F0FF]">{displayData?.event_title}</h1>
            </div>
            <div className="flex items-center gap-2 card px-4 py-2 rounded-full">
              <Wifi size={14} className="text-emerald-400" />
              <span className="text-sm text-emerald-400">Live</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { label: 'Total sold', value: displayData?.total_sold || 0, sub: `of ${displayData?.total_capacity || 0}`, icon: <Ticket size={18} /> },
              { label: 'Revenue', value: `KES ${(displayData?.total_revenue || 0).toLocaleString()}`, sub: 'Total earnings', icon: <DollarSign size={18} /> },
              { label: 'Checked in', value: displayData?.checked_in || 0, sub: `of ${displayData?.total_sold || 0} sold`, icon: <Users size={18} /> },
              { label: 'Check-in rate', value: `${displayData?.checkin_rate || 0}%`, sub: 'Gate entry rate', icon: <TrendingUp size={18} /> },
            ].map((metric, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-6">
                <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/10 text-[#A855F7] flex items-center justify-center mb-4">{metric.icon}</div>
                <p className="font-display font-bold text-2xl text-[#F0F0FF]">{metric.value}</p>
                <p className="text-xs text-[#8888AA] mt-1">{metric.label}</p>
                <p className="text-xs text-[#6E6E96]">{metric.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-display font-semibold text-[#F0F0FF] mb-6">Revenue by tier</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={displayData?.tier_breakdown || []}>
                  <XAxis dataKey="name" tick={{ fill: '#8888AA', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8888AA', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(124,58,237,0.08)' }} />
                  <Bar dataKey="revenue" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-6">
              <h3 className="font-display font-semibold text-[#F0F0FF] mb-6">Sold vs remaining</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={displayData?.tier_breakdown || []}>
                  <XAxis dataKey="name" tick={{ fill: '#8888AA', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8888AA', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(124,58,237,0.08)' }} />
                  <Bar dataKey="sold" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Sold" />
                  <Bar dataKey="remaining" fill="#F97316" radius={[4, 4, 0, 0]} name="Remaining" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card mt-6 overflow-hidden">
            <div className="p-6 border-b border-[#2A2A5A]">
              <h3 className="font-display font-semibold text-[#F0F0FF]">Tier breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A2A5A]">
                    {['Tier', 'Price', 'Quantity', 'Sold', 'Remaining', 'Revenue'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs text-[#6E6E96] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayData?.tier_breakdown?.map((tier, i) => (
                    <tr key={i} className="border-b border-[#2A2A5A] hover:bg-[#16163A]/50 transition-colors">
                      <td className="px-6 py-4 text-[#F0F0FF] font-medium">{tier.name}</td>
                      <td className="px-6 py-4 text-[#8888AA]">KES {tier.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-[#8888AA]">{tier.quantity}</td>
                      <td className="px-6 py-4 text-[#F0F0FF] font-medium">{tier.sold}</td>
                      <td className="px-6 py-4 text-[#8888AA]">{tier.remaining}</td>
                      <td className="px-6 py-4 text-[#F0F0FF] font-semibold">KES {tier.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}