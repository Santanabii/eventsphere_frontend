import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Ticket, ShoppingBag, QrCode, BarChart3, Shield, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import EventCard from '../components/EventCard'
import { eventsAPI } from '../services/api'
import { useQuery } from '@tanstack/react-query'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
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

      {/* ── Hero — the one place we spend the accent boldly ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="orb w-[560px] h-[560px] top-[-140px] left-[-120px]"
          style={{ background: 'color-mix(in srgb, var(--color-accent) 22%, transparent)' }}
        />
        <div
          className="orb w-[420px] h-[420px] bottom-[-100px] right-[-100px]"
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

        <div className="container relative z-10 py-32 text-center">
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="inline-flex items-center gap-2.5 badge badge-accent mb-9 text-[13px] px-4 py-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Kenya's hybrid ticket marketplace
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="font-display font-bold text-[clamp(44px,7vw,96px)] leading-[0.98] tracking-[-0.03em] mb-7"
          >
            <span className="text-text block">Experience events,</span>
            <span className="text-accent block">without the friction</span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-lg text-text-secondary max-w-lg mx-auto mb-11 leading-relaxed"
          >
            Buy, sell, and discover event tickets with M-Pesa payments,
            instant QR codes, and a fraud-proof resale marketplace.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link to="/events">
              <button className="btn-primary text-[15px] px-8 py-3.5">
                Explore events
                <ArrowRight size={17} />
              </button>
            </Link>
            <Link to="/register">
              <button className="btn-ghost text-[15px] px-8 py-3.5">Create account</button>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="mt-24 inline-grid grid-cols-3 gap-14"
          >
            {[
              { v: '10K+', l: 'Tickets sold' },
              { v: '500+', l: 'Events hosted' },
              { v: '50K+', l: 'Happy fans' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-display font-bold text-3xl text-text">{s.v}</p>
                <p className="text-[13px] text-text-muted mt-1.5 tracking-wide">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Features — quiet, uniform, no repeated gradients ── */}
      <section className="section">
        <div className="container">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="eyebrow">Why EventSphere</span>
            <h2 className="font-display font-bold text-[clamp(32px,4.5vw,52px)] text-text tracking-tight leading-tight">
              Everything you need, nothing you don't
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.4}
                className="card p-7"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent-hover flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-[17px] text-text mb-2">{f.title}</h3>
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
                <h2 className="font-display font-bold text-[clamp(28px,4vw,44px)] text-text tracking-tight">
                  Upcoming events
                </h2>
              </div>
              <Link to="/events">
                <button className="btn-ghost py-2.5 px-5 text-sm flex items-center gap-2">
                  View all
                  <ArrowRight size={15} />
                </button>
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {published.map((event, i) => (
                <motion.div
                  key={event.id}
                  variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.4}
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
          className="orb w-[440px] h-[440px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'color-mix(in srgb, var(--color-accent) 14%, transparent)' }}
        />
        <div className="container relative z-10 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="eyebrow">Join thousands</span>
            <h2 className="font-display font-bold text-[clamp(32px,4.5vw,56px)] text-text tracking-tight leading-tight mb-5">
              Ready to experience something amazing?
            </h2>
            <p className="text-text-secondary mb-10 max-w-md mx-auto">
              Join the community of event-goers and organisers across Kenya.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <button className="btn-primary text-[15px] px-8 py-3.5">Get started free</button>
              </Link>
              <Link to="/events">
                <button className="btn-ghost text-[15px] px-8 py-3.5">Browse events</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                <Ticket size={13} className="text-white" />
              </div>
              <span className="font-display font-bold text-text">EventSphere</span>
            </Link>
            <p className="text-sm text-text-muted">© 2026 EventSphere. All rights reserved.</p>
            <div className="flex gap-7 text-sm text-text-muted">
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