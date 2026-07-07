import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Ticket, ShoppingBag, QrCode, BarChart3, Shield, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EventCard from '../components/EventCard'
import { eventsAPI } from '../services/api'
import { useQuery } from '@tanstack/react-query'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

const features = [
  { icon: <Ticket size={22} />, title: 'Official ticketing', desc: 'Buy directly from organisers with guaranteed authenticity and instant QR delivery to your inbox.' },
  { icon: <ShoppingBag size={22} />, title: 'Safe resale', desc: "Can't attend? List safely. Organisers set price caps so resale never becomes scalping." },
  { icon: <QrCode size={22} />, title: 'QR check-in', desc: 'Fast gate entry with unique signed QR codes. Works on any mobile browser, offline included.' },
  { icon: <Zap size={22} />, title: 'M-Pesa payments', desc: "Pay with M-Pesa STK Push — no cards, no friction, just enter your PIN and you're in." },
  { icon: <BarChart3 size={22} />, title: 'Live analytics', desc: 'Real-time organiser dashboards: sales, revenue breakdowns, and gate check-in rates, live.' },
  { icon: <Shield size={22} />, title: 'Fraud protected', desc: 'Atomic QR transfer — old codes die the instant a resale completes. Zero double entries.' },
]

export default function Landing() {
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsAPI.list().then((r) => r.data),
  })

  const published = events?.filter((e) => e.status === 'published').slice(0, 3) || []

  return (
    <div className="bg-zinc-950">
      <Navbar />

      {/* Hero — pt-40 clears the fixed h-20 navbar with plenty of room to spare */}
      <section className="relative overflow-hidden pt-40 pb-28 px-6">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[100px] -top-32 -left-32 pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] -bottom-20 -right-20 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="inline-flex items-center gap-2.5 badge badge-violet mb-9 text-[13px] px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Kenya's hybrid ticket marketplace
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="font-display font-bold text-[clamp(40px,7vw,88px)] leading-[1.05] tracking-tight mb-7">
            <span className="text-zinc-100 block">Experience events,</span>
            <span className="text-violet-400 block">without the friction</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-lg text-zinc-400 max-w-lg mx-auto mb-11 leading-relaxed">
            Buy, sell, and discover event tickets with M-Pesa payments,
            instant QR codes, and a fraud-proof resale marketplace.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex flex-wrap justify-center gap-3 mb-24">
            <Link to="/events">
              <button className="btn-primary text-[15px] px-8 py-3.5">
                Explore events <ArrowRight size={17} />
              </button>
            </Link>
            <Link to="/register">
              <button className="btn-ghost text-[15px] px-8 py-3.5">Create account</button>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="inline-grid grid-cols-3 gap-14">
            {[
              { v: '10K+', l: 'Tickets sold' },
              { v: '500+', l: 'Events hosted' },
              { v: '50K+', l: 'Happy fans' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-display font-bold text-3xl text-zinc-100">{s.v}</p>
                <p className="text-[13px] text-zinc-500 mt-1.5">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="divider" />

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-16">
            <span className="eyebrow">Why EventSphere</span>
            <h2 className="font-display font-bold text-[clamp(30px,4vw,48px)] text-zinc-100 tracking-tight">
              Everything you need, nothing you don't
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.4}
                className="card p-8">
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-[17px] text-zinc-100 mb-2">{f.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {published.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <span className="eyebrow">Happening soon</span>
                <h2 className="font-display font-bold text-[clamp(26px,3.5vw,40px)] text-zinc-100 tracking-tight">
                  Upcoming events
                </h2>
              </div>
              <Link to="/events">
                <button className="btn-ghost py-2.5 px-5 text-sm flex items-center gap-2">
                  View all <ArrowRight size={15} />
                </button>
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {published.map((event, i) => (
                <motion.div key={event.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.4}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="divider" />

      {/* CTA */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute w-[440px] h-[440px] rounded-full bg-violet-600/12 blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-2xl mx-auto relative text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="eyebrow">Join thousands</span>
            <h2 className="font-display font-bold text-[clamp(28px,4vw,48px)] text-zinc-100 tracking-tight leading-tight mb-5">
              Ready to experience something amazing?
            </h2>
            <p className="text-zinc-400 mb-10">
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

      <Footer />
    </div>
  )
}