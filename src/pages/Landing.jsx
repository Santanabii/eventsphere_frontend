import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Ticket, ShoppingBag, QrCode, BarChart3, Shield, Zap, Calendar, MapPin } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
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
    <div className="bg-[#0A0A18]">
      <Navbar />

      {/* Hero — pt-40 clears the fixed h-20 navbar with plenty of room to spare */}
      <section className="relative overflow-hidden pt-40 pb-28 px-6">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#7C3AED]/15 blur-[100px] -top-32 -left-32 pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#7C3AED]/10 blur-[100px] -bottom-20 -right-20 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="inline-flex items-center gap-2.5 badge badge-violet mb-9 text-[13px] px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
            Kenya's hybrid ticket marketplace
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="font-display font-bold text-[clamp(40px,7vw,88px)] leading-[1.05] tracking-tight mb-7">
            <span className="text-[#F0F0FF] block">Experience events,</span>
            <span className="text-[#A855F7] block">without the friction</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-lg text-[#8888AA] max-w-lg mx-auto mb-11 leading-relaxed">
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
                <p className="font-display font-bold text-3xl text-[#F0F0FF]">{s.v}</p>
                <p className="text-[13px] text-[#6E6E96] mt-1.5">{s.l}</p>
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
            <h2 className="font-display font-bold text-[clamp(30px,4vw,48px)] text-[#F0F0FF] tracking-tight">
              Everything you need, nothing you don't
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.4}
                className="card p-8">
                <div className="w-11 h-11 rounded-xl bg-[#7C3AED]/10 text-[#A855F7] flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-[17px] text-[#F0F0FF] mb-2">{f.title}</h3>
                <p className="text-[#8888AA] leading-relaxed text-sm">{f.desc}</p>
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
                <h2 className="font-display font-bold text-[clamp(26px,3.5vw,40px)] text-[#F0F0FF] tracking-tight">
                  Upcoming events
                </h2>
              </div>
              <Link to="/events">
                <button className="btn-ghost py-2.5 px-5 text-sm flex items-center gap-2">
                  View all <ArrowRight size={15} />
                </button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Featured — the first upcoming event, given real visual weight */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="md:col-span-2">
                <Link to={`/events/${published[0].id}`} className="group block h-full">
                  <div className="glass-card relative rounded-2xl overflow-hidden h-[420px] md:h-full">
                    {published[0].banner_image ? (
                      <img
                        src={published[0].banner_image}
                        alt={published[0].title}
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#16163A]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A18] via-[#0A0A18]/70 to-transparent" />

                    <div className="relative h-full p-8 md:p-10 flex flex-col justify-end">
                      <span className="inline-flex w-fit items-center badge badge-violet mb-4">Featured event</span>
                      <h3 className="font-display font-bold text-2xl md:text-3xl text-[#F0F0FF] mb-3">
                        {published[0].title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#8888AA] mb-6">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {new Date(published[0].date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {published[0].venue}
                        </span>
                      </div>
                      <span className="w-fit inline-flex items-center gap-2 text-sm font-medium text-[#F0F0FF] group-hover:text-[#A855F7] transition-colors">
                        Discover tickets <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Side stack — next two events, compact */}
              <div className="flex flex-col gap-6">
                {published.slice(1, 3).map((event, i) => (
                  <motion.div key={event.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.4}
                    className="flex-1">
                    <Link to={`/events/${event.id}`} className="group block h-full">
                      <div className="card h-full p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
                            <Ticket size={18} className="text-[#A855F7]" />
                          </div>
                          {event.resale_allowed && <span className="badge badge-orange">Resale</span>}
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-[#F0F0FF] mb-2 line-clamp-1 group-hover:text-[#A855F7] transition-colors">
                            {event.title}
                          </h4>
                          <p className="text-[#8888AA] text-sm line-clamp-1">
                            {event.venue} · {new Date(event.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="divider" />

      {/* CTA */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute w-[440px] h-[440px] rounded-full bg-[#7C3AED]/12 blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-2xl mx-auto relative text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="eyebrow">Join thousands</span>
            <h2 className="font-display font-bold text-[clamp(28px,4vw,48px)] text-[#F0F0FF] tracking-tight leading-tight mb-5">
              Ready to experience something amazing?
            </h2>
            <p className="text-[#8888AA] mb-10">
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