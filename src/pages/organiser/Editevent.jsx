import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { eventsAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({
    title: '', description: '', venue: '', date: '', status: 'draft',
    resale_allowed: true, resale_price_cap: 150
  })
  const [existingBannerUrl, setExistingBannerUrl] = useState(null)
  const [newBanner, setNewBanner] = useState(null)

  // Existing tiers (already saved, have a real id) vs new ones being added in this session
  const [existingTiers, setExistingTiers] = useState([])
  const [newTiers, setNewTiers] = useState([])
  const [savingTierId, setSavingTierId] = useState(null)

  useEffect(() => {
    eventsAPI.detail(id).then(res => {
      const event = res.data
      setForm({
        title: event.title,
        description: event.description,
        venue: event.venue,
        // datetime-local inputs need "YYYY-MM-DDTHH:MM" with no timezone suffix
        date: event.date ? event.date.slice(0, 16) : '',
        status: event.status,
        resale_allowed: event.resale_allowed,
        resale_price_cap: event.resale_price_cap,
      })
      setExistingBannerUrl(event.banner_image || null)
      setExistingTiers((event.tiers || []).map(t => ({
        ...t,
        sale_start: t.sale_start ? t.sale_start.slice(0, 16) : '',
        sale_end: t.sale_end ? t.sale_end.slice(0, 16) : '',
      })))
    }).catch(() => {
      toast.error('Could not load this event')
      navigate('/organiser/dashboard')
    }).finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      // Only attach a new image if the organiser actually picked one —
      // omitting the field entirely leaves the existing banner untouched.
      if (newBanner) formData.append('banner_image', newBanner)

      await eventsAPI.update(id, formData)
      toast.success('Event updated')
      navigate('/organiser/dashboard')
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(e => toast.error(e))
      else toast.error('Failed to update event')
    } finally {
      setLoading(false)
    }
  }

  const updateExistingTier = (i, field, value) => {
    const updated = [...existingTiers]
    updated[i][field] = value
    setExistingTiers(updated)
  }

  const saveExistingTier = async (tier) => {
    setSavingTierId(tier.id)
    try {
      await eventsAPI.updateTier(id, tier.id, {
        name: tier.name,
        price: tier.price,
        quantity: tier.quantity,
        sale_start: tier.sale_start,
        sale_end: tier.sale_end,
      })
      toast.success(`"${tier.name}" tier updated`)
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(e => toast.error(e))
      else toast.error('Failed to update tier')
    } finally {
      setSavingTierId(null)
    }
  }

  const deleteExistingTier = async (tierId, name) => {
    if (!window.confirm(`Delete the "${name}" tier? This can't be undone.`)) return
    try {
      await eventsAPI.deleteTier(id, tierId)
      setExistingTiers(existingTiers.filter(t => t.id !== tierId))
      toast.success('Tier deleted')
    } catch {
      toast.error('Failed to delete tier — it may already have tickets sold against it')
    }
  }

  const addNewTierRow = () => setNewTiers([...newTiers, { name: '', price: '', quantity: '', sale_start: '', sale_end: '' }])
  const removeNewTierRow = (i) => setNewTiers(newTiers.filter((_, idx) => idx !== i))
  const updateNewTier = (i, field, value) => {
    const updated = [...newTiers]
    updated[i][field] = value
    setNewTiers(updated)
  }

  const saveNewTier = async (tier, i) => {
    if (!tier.name || !tier.price || !tier.quantity || !tier.sale_start || !tier.sale_end) {
      toast.error('Fill in all fields for this tier before saving')
      return
    }
    try {
      const res = await eventsAPI.createTier(id, tier)
      setExistingTiers([...existingTiers, { ...res.data, sale_start: tier.sale_start, sale_end: tier.sale_end }])
      removeNewTierRow(i)
      toast.success(`"${tier.name}" tier added`)
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(e => toast.error(e))
      else toast.error('Failed to add tier')
    }
  }

  if (fetching) return (
    <div className="min-h-screen bg-[#0A0A18] flex items-center justify-center">
      <div className="spinner" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0A0A18] pt-32 pb-24 px-6">
      <Navbar />

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate('/organiser/dashboard')} className="flex items-center gap-2 text-[#8888AA] hover:text-[#F0F0FF] transition-colors mb-8 text-sm">
            <ArrowLeft size={16} /> Back to dashboard
          </button>

          <div className="mb-8">
            <span className="eyebrow">Organiser</span>
            <h1 className="font-display font-bold text-3xl text-[#F0F0FF]">Edit event</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="card p-7 space-y-5">
              <h2 className="font-display font-semibold text-[#F0F0FF]">Event details</h2>

              <div>
                <label htmlFor="title" className="field-label">Event title *</label>
                <input id="title" type="text" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required className="input" />
              </div>

              <div>
                <label htmlFor="description" className="field-label">Description *</label>
                <textarea id="description" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required rows={4} className="input resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="venue" className="field-label">Venue *</label>
                  <input id="venue" type="text" value={form.venue}
                    onChange={e => setForm({ ...form, venue: e.target.value })}
                    required className="input" />
                </div>
                <div>
                  <label htmlFor="date" className="field-label">Date & time *</label>
                  <input id="date" type="datetime-local" value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    required className="input" />
                </div>
              </div>

              {existingBannerUrl && !newBanner && (
                <div>
                  <p className="field-label">Current banner</p>
                  <img src={existingBannerUrl} alt="" className="w-full h-40 object-cover rounded-xl border border-[#2A2A5A]" />
                </div>
              )}

              <div>
                <label htmlFor="banner" className="field-label">
                  {existingBannerUrl ? 'Replace banner image' : 'Banner image'}
                </label>
                <input id="banner" type="file" accept="image/*"
                  onChange={e => setNewBanner(e.target.files[0])}
                  className="input file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-[#7C3AED] file:text-white" />
              </div>

              <div>
                <label htmlFor="status" className="field-label">Status</label>
                <select id="status" value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="input">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="card p-7 space-y-4">
              <h2 className="font-display font-semibold text-[#F0F0FF]">Resale settings</h2>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#F0F0FF] text-sm font-medium">Allow ticket resale</p>
                  <p className="text-xs text-[#6E6E96] mt-0.5">Let attendees resell their tickets</p>
                </div>
                <button type="button" role="switch" aria-checked={form.resale_allowed}
                  onClick={() => setForm({ ...form, resale_allowed: !form.resale_allowed })}
                  className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${form.resale_allowed ? 'bg-[#7C3AED]' : 'bg-[#3D3D75]'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${form.resale_allowed ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              {form.resale_allowed && (
                <div>
                  <label htmlFor="cap" className="field-label">Max resale price cap (% of face value)</label>
                  <input id="cap" type="number" value={form.resale_price_cap}
                    onChange={e => setForm({ ...form, resale_price_cap: e.target.value })}
                    min="100" max="500" className="input" />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-[15px]">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : 'Save changes'}
            </button>
          </form>

          {/* Tiers are managed separately from the main form — each tier is its
              own backend record, saved independently rather than bundled into
              the PUT /api/events/{id}/ request. */}
          <div className="card p-7 space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-[#F0F0FF]">Ticket tiers</h2>
              <button type="button" onClick={addNewTierRow} className="flex items-center gap-1 text-sm text-[#A855F7] hover:text-[#F0F0FF] transition-colors">
                <Plus size={16} /> Add tier
              </button>
            </div>

            {existingTiers.length === 0 && newTiers.length === 0 && (
              <p className="text-[#6E6E96] text-sm">No tiers yet — add one below.</p>
            )}

            {existingTiers.map((tier, i) => (
              <div key={tier.id} className="bg-[#0A0A18] rounded-xl p-4 space-y-3 border border-[#2A2A5A]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#A855F7]">{tier.name || `Tier ${i + 1}`}</span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => saveExistingTier(tier)} disabled={savingTierId === tier.id}
                      className="flex items-center gap-1 text-xs text-[#8888AA] hover:text-[#F0F0FF] transition-colors">
                      <Save size={14} /> {savingTierId === tier.id ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => deleteExistingTier(tier.id, tier.name)} aria-label={`Delete ${tier.name}`}
                      className="text-red-400 hover:opacity-80 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <input type="text" value={tier.name} onChange={e => updateExistingTier(i, 'name', e.target.value)}
                    placeholder="Name" className="input py-2.5 text-sm" />
                  <input type="number" value={tier.price} onChange={e => updateExistingTier(i, 'price', e.target.value)}
                    placeholder="Price (KES)" className="input py-2.5 text-sm" />
                  <input type="number" value={tier.quantity} onChange={e => updateExistingTier(i, 'quantity', e.target.value)}
                    placeholder="Quantity" className="input py-2.5 text-sm" />
                </div>
                <p className="text-xs text-[#6E6E96]">
                  {tier.quantity_sold || 0} sold · {tier.quantity_remaining ?? '—'} remaining
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#6E6E96] mb-1 block">Sale start</label>
                    <input type="datetime-local" value={tier.sale_start} onChange={e => updateExistingTier(i, 'sale_start', e.target.value)} className="input py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-[#6E6E96] mb-1 block">Sale end</label>
                    <input type="datetime-local" value={tier.sale_end} onChange={e => updateExistingTier(i, 'sale_end', e.target.value)} className="input py-2.5 text-sm" />
                  </div>
                </div>
              </div>
            ))}

            {newTiers.map((tier, i) => (
              <div key={`new-${i}`} className="bg-[#0A0A18] rounded-xl p-4 space-y-3 border border-[#7C3AED]/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#A855F7]">New tier</span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => saveNewTier(tier, i)}
                      className="flex items-center gap-1 text-xs text-[#8888AA] hover:text-[#F0F0FF] transition-colors">
                      <Save size={14} /> Save
                    </button>
                    <button type="button" onClick={() => removeNewTierRow(i)} aria-label="Remove this new tier"
                      className="text-red-400 hover:opacity-80 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <input type="text" value={tier.name} onChange={e => updateNewTier(i, 'name', e.target.value)}
                    placeholder="e.g. VIP" className="input py-2.5 text-sm" />
                  <input type="number" value={tier.price} onChange={e => updateNewTier(i, 'price', e.target.value)}
                    placeholder="Price (KES)" className="input py-2.5 text-sm" />
                  <input type="number" value={tier.quantity} onChange={e => updateNewTier(i, 'quantity', e.target.value)}
                    placeholder="Quantity" className="input py-2.5 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#6E6E96] mb-1 block">Sale start</label>
                    <input type="datetime-local" value={tier.sale_start} onChange={e => updateNewTier(i, 'sale_start', e.target.value)} className="input py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-[#6E6E96] mb-1 block">Sale end</label>
                    <input type="datetime-local" value={tier.sale_end} onChange={e => updateNewTier(i, 'sale_end', e.target.value)} className="input py-2.5 text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}