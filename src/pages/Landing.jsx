import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Ticket, ShoppingBag, QrCode, BarChart3, Shield, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import EventCard from '../components/EventCard'
import { eventsAPI } from '../services/api'
import { useQuery } from '@tanstack/react-query'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Landing() {
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsAPI.list().then((r) => r.data),
  })

  const published = events?.filter((e) => e.status === 'published').slice(0, 3) || []

  const features = [
    { icon: <Ticket size={22} />, title: 'Official ticketing', desc: 'Buy directly from organisers with guaranteed authenticity and instant QR delivery to your inbox.' },
    { icon: <ShoppingBag size={22} />, title: 'Safe resale', desc: "Can't attend? List safely. Organisers set price caps so resale never becomes scalping." },
    { icon: <QrCode size={22} />, title: 'QR check-in', desc: 'Fast gate entry with unique signed QR codes. Works on any mobile browser, offline included.' },
    { icon: <Zap size={22} />, title: 'M-Pesa payments', desc: "Pay with M-Pesa STK Push — no cards, no friction, just enter your PIN and you're in." },
    { icon: <BarChart3 size={22} />, title: 'Live analytics', desc: 'Real-time organiser dashboards: sales, revenue breakdowns, and gate check-in rates, live.' },
    { icon: <Shield size={22} />, title: 'Fraud protected', desc: 'Atomic QR transfer — old codes die the instant a resale completes. Zero double entries.' },
  ]

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden pt-8">
        <div
          className="orb w-[600px] h-[600px] top-[-180px] left-[-180px]"
          style={{ background: 'color-mix(in srgb, var(--color-accent) 22%, transparent)' }}
        />
        <div
          className="orb w-[500px] h-[500px] bottom-[-140px] right-[-140px]"
          style={{ background: 'color-mix(in srgb, var(--color-accent) 12%, transparent)' }}
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-text) 1px,transparent 1px),linear-gradient(90deg,var(--color-text) 1px,transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="container relative z-10 py-20 text-center">
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="inline-flex items-center gap-2.5 badge badge-accent mb-10 text-[13px] px-5 py-2.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Kenya's hybrid ticket marketplace
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="font-display font-bold text-[clamp(48px,8vw,96px)] leading-[1.02] tracking-[-0.03em] mb-8"
          >
            <span className="text-text block">Experience events,</span>
            <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent block">
              without the friction
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-lg text-text-secondary max-w-xl mx-auto mb-12 leading-relaxed"
          >
            Buy, sell, and discover event tickets with M-Pesa payments,
            instant QR codes, and a fraud-proof resale marketplace.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/events">
              <button className="btn-primary text-[15px] px-10 py-4">
                Explore events
                <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/register">
              <button className="btn-ghost text-[15px] px-10 py-4">Create account</button>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="mt-28 inline-grid grid-cols-3 gap-16"
          >
            {[
              { v: '10K+', l: 'Tickets sold' },
              { v: '500+', l: 'Events hosted' },
              { v: '50K+', l: 'Happy fans' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-display font-bold text-4xl text-text">{s.v}</p>
                <p className="text-sm text-text-muted mt-2 tracking-wide">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Features ── */}
      <section className="section">
        <div className="container">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="eyebrow">Why EventSphere</span>
            <h2 className="font-display font-bold text-[clamp(36px,5vw,52px)] text-text tracking-tight leading-tight">
              Everything you need, <br className="hidden sm:block" />
              nothing you don't
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.1}
                className="card p-8 hover:transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent-hover flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-[18px] text-text mb-2">{f.title}</h3>
                <p className="text-text-secondary leading-relaxed text-[14px]">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Upcoming Events ── */}
      {published.length > 0 && (
        <section className="section">
          <div className="container">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <span className="eyebrow">Happening soon</span>
                <h2 className="font-display font-bold text-[clamp(32px,4.5vw,44px)] text-text tracking-tight">
                  Upcoming events
                </h2>
              </div>
              <Link to="/events">
                <button className="btn-ghost py-2.5 px-6 text-sm flex items-center gap-2">
                  View all
                  <ArrowRight size={15} />
                </button>
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {published.map((event, i) => (
                <motion.div
                  key={event.id}
                  variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.1}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="divider" />

      {/* ── CTA ── */}
      <section className="section relative overflow-hidden">
        <div
          className="orb w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'color-mix(in srgb, var(--color-accent) 14%, transparent)' }}
        />
        <div className="container relative z-10 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="eyebrow">Join thousands</span>
            <h2 className="font-display font-bold text-[clamp(36px,5vw,56px)] text-text tracking-tight leading-tight mb-6">
              Ready to experience something amazing?
            </h2>
            <p className="text-text-secondary mb-12 max-w-lg mx-auto">
              Join the community of event-goers and organisers across Kenya.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <button className="btn-primary text-[15px] px-10 py-4">Get started free</button>
              </Link>
              <Link to="/events">
                <button className="btn-ghost text-[15px] px-10 py-4">Browse events</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Ticket size={14} className="text-white" />
              </div>
              <span className="font-display font-bold text-text text-lg">EventSphere</span>
            </Link>
            <p className="text-sm text-text-muted">© 2026 EventSphere. All rights reserved.</p>
            <div className="flex gap-8 text-sm text-text-muted">
              <a href="#" className="hover:text-text transition-colors">Privacy</a>
              <a href="#" className="hover:text-text transition-colors">Terms</a>
              <Link to="/events" className="hover:text-text transition-colors">Events</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}