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

    wsRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data)
      setLiveData(data)
    }

    return () => wsRef.current?.close()
  }, [id])

  const displayData = liveData || stats

  if (isLoading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="spinner" />
    </div>
  )

  const tooltipStyle = {
    backgroundColor: '#131319',
    border: '1px solid #2A2A36',
    borderRadius: '10px',
    color: '#EDEDF2',
    fontSize: '13px'
  }

  return (
    <div className="page">
      <Navbar />

      <div className="container pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="eyebrow">Live dashboard</span>
              <h1 className="font-display font-bold text-3xl text-text">{displayData?.event_title}</h1>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <Wifi size={14} className="text-success" />
              <span className="text-sm text-success">Live</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { label: 'Total sold', value: displayData?.total_sold || 0, sub: `of ${displayData?.total_capacity || 0}`, icon: <Ticket size={18} /> },
              { label: 'Revenue', value: `KES ${(displayData?.total_revenue || 0).toLocaleString()}`, sub: 'Total earnings', icon: <DollarSign size={18} /> },
              { label: 'Checked in', value: displayData?.checked_in || 0, sub: `of ${displayData?.total_sold || 0} sold`, icon: <Users size={18} /> },
              { label: 'Check-in rate', value: `${displayData?.checkin_rate || 0}%`, sub: 'Gate entry rate', icon: <TrendingUp size={18} /> },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card p-5"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent-hover flex items-center justify-center mb-4">
                  {metric.icon}
                </div>
                <p className="font-display font-bold text-2xl text-text">{metric.value}</p>
                <p className="text-xs text-text-secondary mt-1">{metric.label}</p>
                <p className="text-xs text-text-muted">{metric.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="card p-6">
              <h3 className="font-display font-semibold text-text mb-6">Revenue by tier</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={displayData?.tier_breakdown || []}>
                  <XAxis dataKey="name" tick={{ fill: '#8E8E9C', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8E8E9C', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(139,124,246,0.06)' }} />
                  <Bar dataKey="revenue" fill="#8B7CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-6">
              <h3 className="font-display font-semibold text-text mb-6">Sold vs remaining</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={displayData?.tier_breakdown || []}>
                  <XAxis dataKey="name" tick={{ fill: '#8E8E9C', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8E8E9C', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(139,124,246,0.06)' }} />
                  <Bar dataKey="sold" fill="#8B7CF6" radius={[4, 4, 0, 0]} name="Sold" />
                  <Bar dataKey="remaining" fill="#2A2A36" radius={[4, 4, 0, 0]} name="Remaining" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card mt-5 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-display font-semibold text-text">Tier breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Tier', 'Price', 'Quantity', 'Sold', 'Remaining', 'Revenue'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs text-text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayData?.tier_breakdown?.map((tier, i) => (
                    <tr key={i} className="border-b border-border hover:bg-surface-hover transition-colors">
                      <td className="px-6 py-4 text-text font-medium">{tier.name}</td>
                      <td className="px-6 py-4 text-text-secondary">KES {tier.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-text-secondary">{tier.quantity}</td>
                      <td className="px-6 py-4 text-text font-medium">{tier.sold}</td>
                      <td className="px-6 py-4 text-text-secondary">{tier.remaining}</td>
                      <td className="px-6 py-4 text-text font-semibold">KES {tier.revenue.toLocaleString()}</td>
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