import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Tag, DollarSign, ShoppingBag } from 'lucide-react'
import Navbar from '../components/Navbar'
import { marketplaceAPI } from '../services/api'

const statusBadge = {
  open: 'badge-violet',
  sold: 'badge-green',
  cancelled: 'badge-muted',
}

export default function MyListings() {
  const { data: listings, isLoading } = useQuery({
    queryKey: ['my-listings'],
    queryFn: () => marketplaceAPI.myListings().then(r => r.data)
  })

  const formatDate = (d) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

  const soldListings = listings?.filter(l => l.status === 'sold') || []
  const openCount = listings?.filter(l => l.status === 'open').length || 0

  // Real net profit — seller_payout is asking_price minus the 10% platform
  // fee, computed backend-side from the actual ResaleOrder. Not asking_price
  // minus original_price, which would overstate profit by the fee amount.
  const totalProfit = soldListings.reduce((sum, l) => {
    if (l.seller_payout == null) return sum
    return sum + (parseFloat(l.seller_payout) - parseFloat(l.original_price))
  }, 0)

  return (
    <div className="min-h-screen bg-[#0A0A18] pt-32 pb-24 px-6">
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-10">
            <span className="eyebrow">Your resale activity</span>
            <h1 className="font-display font-bold text-3xl text-[#F0F0FF]">My listings</h1>
            <p className="text-[#8888AA] mt-1">Track what you've listed, sold, and earned</p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="card p-5">
              <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center mb-3">
                <Tag size={16} className="text-[#A855F7]" />
              </div>
              <p className="font-display font-bold text-2xl text-[#F0F0FF]">{openCount}</p>
              <p className="text-xs text-[#8888AA] mt-1">Open listings</p>
            </div>
            <div className="card p-5">
              <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center mb-3">
                <ShoppingBag size={16} className="text-[#A855F7]" />
              </div>
              <p className="font-display font-bold text-2xl text-[#F0F0FF]">{soldListings.length}</p>
              <p className="text-xs text-[#8888AA] mt-1">Tickets sold</p>
            </div>
            <div className="card p-5">
              <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center mb-3">
                <DollarSign size={16} className="text-[#A855F7]" />
              </div>
              <p className={`font-display font-bold text-2xl ${totalProfit >= 0 ? 'text-[#F0F0FF]' : 'text-red-400'}`}>
                {totalProfit >= 0 ? '+' : ''}KES {totalProfit.toLocaleString()}
              </p>
              <p className="text-xs text-[#8888AA] mt-1">Total net profit</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24" />)}
            </div>
          ) : listings?.length === 0 ? (
            <div className="text-center py-20 card">
              <Tag size={40} className="text-[#54547A] mx-auto mb-4" />
              <p className="text-lg font-medium text-[#F0F0FF]">No listings yet</p>
              <p className="text-[#6E6E96] mt-1">List a ticket for resale from My Tickets to see it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((listing) => {
                const original = parseFloat(listing.original_price)
                const asking = parseFloat(listing.asking_price)
                const isSold = listing.status === 'sold'
                const payout = listing.seller_payout != null ? parseFloat(listing.seller_payout) : null
                const fee = listing.platform_fee != null ? parseFloat(listing.platform_fee) : null
                const profit = payout != null ? payout - original : null

                return (
                  <motion.div key={listing.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="card p-5 flex items-center justify-between gap-6 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-medium text-[#F0F0FF] truncate">{listing.event_title}</h3>
                        <span className={`badge capitalize ${statusBadge[listing.status] || 'badge-muted'}`}>{listing.status}</span>
                      </div>
                      <p className="text-sm text-[#8888AA]">
                        {listing.tier_name} · Listed {formatDate(listing.listed_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-8 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-[#6E6E96]">Original price</p>
                        <p className="text-sm text-[#8888AA]">KES {original.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#6E6E96]">Asking price</p>
                        <p className="font-medium text-[#F0F0FF]">KES {asking.toLocaleString()}</p>
                      </div>

                      {isSold && payout != null && (
                        <>
                          <div className="text-right">
                            <p className="text-xs text-[#6E6E96]">Payout (after {fee != null ? `KES ${fee.toLocaleString()}` : '10%'} fee)</p>
                            <p className="font-medium text-[#F0F0FF]">KES {payout.toLocaleString()}</p>
                          </div>
                          <div className="text-right min-w-[90px]">
                            <p className="text-xs text-[#6E6E96]">Net profit</p>
                            <div className={`flex items-center justify-end gap-1 font-display font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {profit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              {profit >= 0 ? '+' : ''}KES {profit.toLocaleString()}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}