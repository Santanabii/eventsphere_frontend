import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { eventsAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function CreateEvent() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', venue: '',
    date: '', status: 'draft',
    resale_allowed: true, resale_price_cap: 150
  })
  const [banner, setBanner] = useState(null)
  const [tiers, setTiers] = useState([
    { name: '', price: '', quantity: '', sale_start: '', sale_end: '' }
  ])

  const addTier = () => setTiers([...tiers, { name: '', price: '', quantity: '', sale_start: '', sale_end: '' }])
  const removeTier = (i) => setTiers(tiers.filter((_, idx) => idx !== i))
  const updateTier = (i, field, value) => {
    const updated = [...tiers]
    updated[i][field] = value
    setTiers(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      if (banner) formData.append('banner_image', banner)

      const eventRes = await eventsAPI.create(formData)
      const eventId = eventRes.data.id

      for (const tier of tiers) {
        if (tier.name && tier.price && tier.quantity) {
          await eventsAPI.createTier(eventId, tier)
        }
      }

      toast.success('Event created successfully!')
      navigate('/organiser/dashboard')
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(e => toast.error(e))
      else toast.error('Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Navbar />

      <div className="container max-w-2xl pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors mb-8 text-sm"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </button>

          <div className="mb-8">
            <span className="eyebrow">Organiser</span>
            <h1 className="font-display font-bold text-3xl text-text">Create new event</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="glass rounded-2xl p-6 space-y-5">
              <h2 className="font-display font-semibold text-text">Event details</h2>

              <div>
                <label htmlFor="title" className="field-label">Event title *</label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Afro Night Nairobi 2026"
                  required
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="description" className="field-label">Description *</label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Tell people about your event..."
                  required
                  rows={4}
                  className="input resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="venue" className="field-label">Venue *</label>
                  <input
                    id="venue"
                    type="text"
                    value={form.venue}
                    onChange={e => setForm({ ...form, venue: e.target.value })}
                    placeholder="e.g. KICC Nairobi"
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="date" className="field-label">Date & time *</label>
                  <input
                    id="date"
                    type="datetime-local"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="banner" className="field-label">Banner image</label>
                <input
                  id="banner"
                  type="file"
                  accept="image/*"
                  onChange={e => setBanner(e.target.files[0])}
                  className="input file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-accent file:text-white"
                />
              </div>

              <div>
                <label htmlFor="status" className="field-label">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="input"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-display font-semibold text-text">Resale settings</h2>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text text-sm font-medium">Allow ticket resale</p>
                  <p className="text-xs text-text-muted mt-0.5">Let attendees resell their tickets</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.resale_allowed}
                  onClick={() => setForm({ ...form, resale_allowed: !form.resale_allowed })}
                  className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                    form.resale_allowed ? 'bg-accent' : 'bg-border-strong'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                    form.resale_allowed ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              {form.resale_allowed && (
                <div>
                  <label htmlFor="cap" className="field-label">Max resale price cap (% of face value)</label>
                  <input
                    id="cap"
                    type="number"
                    value={form.resale_price_cap}
                    onChange={e => setForm({ ...form, resale_price_cap: e.target.value })}
                    min="100"
                    max="500"
                    className="input"
                  />
                  <p className="text-xs text-text-muted mt-1.5">
                    e.g. 150 means max resale price is 150% of original price
                  </p>
                </div>
              )}
            </div>

            <div className="glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-text">Ticket tiers</h2>
                <button
                  type="button"
                  onClick={addTier}
                  className="flex items-center gap-1 text-sm text-accent-hover hover:text-text transition-colors"
                >
                  <Plus size={16} />
                  Add tier
                </button>
              </div>

              {tiers.map((tier, i) => (
                <div key={i} className="bg-bg-soft rounded-xl p-4 space-y-3 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent-hover">Tier {i + 1}</span>
                    {tiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTier(i)}
                        aria-label={`Remove tier ${i + 1}`}
                        className="text-danger hover:opacity-80 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={tier.name}
                      onChange={e => updateTier(i, 'name', e.target.value)}
                      placeholder="e.g. VIP"
                      aria-label={`Tier ${i + 1} name`}
                      className="input py-2.5 text-sm"
                    />
                    <input
                      type="number"
                      value={tier.price}
                      onChange={e => updateTier(i, 'price', e.target.value)}
                      placeholder="Price (KES)"
                      aria-label={`Tier ${i + 1} price`}
                      className="input py-2.5 text-sm"
                    />
                    <input
                      type="number"
                      value={tier.quantity}
                      onChange={e => updateTier(i, 'quantity', e.target.value)}
                      placeholder="Quantity"
                      aria-label={`Tier ${i + 1} quantity`}
                      className="input py-2.5 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Sale start</label>
                      <input
                        type="datetime-local"
                        value={tier.sale_start}
                        onChange={e => updateTier(i, 'sale_start', e.target.value)}
                        className="input py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Sale end</label>
                      <input
                        type="datetime-local"
                        value={tier.sale_end}
                        onChange={e => updateTier(i, 'sale_end', e.target.value)}
                        className="input py-2.5 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-[15px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating event...
                </span>
              ) : 'Create event'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}