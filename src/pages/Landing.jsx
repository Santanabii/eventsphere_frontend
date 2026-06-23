import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Ticket, ShoppingBag, QrCode, BarChart3, Shield, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import { eventsAPI } from '../services/api'
import { useQuery } from '@tanstack/react-query'
import EventCard from '../components/EventCard'

export default function Landing() {
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsAPI.list().then(r => r.data)
  })

  const publishedEvents = events?.filter(e => e.status === 'published').slice(0, 3) || []

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#F97316]/20 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#A855F7]/10 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#7C3AED]/40 text-sm text-[#A855F7] mb-8"
          >
            <span className="w-2 h-2 bg-[#F97316] rounded-full animate-pulse" />
            Kenya's #1 Hybrid Ticket Marketplace
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-6"
          >
            <span className="text-white">Experience</span>
            <br />
            <span className="gradient-text">Events</span>
            <br />
            <span className="text-white">Differently</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-[#A0A0B8] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Buy, sell, and discover event tickets with M-Pesa payments, instant QR codes, and a safe resale marketplace.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/events">
              <button className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                Explore Events
                <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/register">
              <button className="flex items-center gap-2 px-8 py-4 rounded-full border border-[#2A2A4A] text-white hover:border-[#7C3AED] transition-all text-base font-semibold">
                Create Account
              </button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '10K+', label: 'Tickets Sold' },
              { value: '500+', label: 'Events' },
              { value: '50K+', label: 'Happy Fans' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black gradient-text">{stat.value}</p>
                <p className="text-sm text-[#A0A0B8] mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#2A2A4A] rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#7C3AED] rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">Why EventSphere</span>
          <h2 className="text-5xl font-black mt-3 text-white">Everything You Need</h2>
          <p className="text-[#A0A0B8] mt-4 max-w-xl mx-auto">One platform for buying, selling, and managing event tickets across Kenya</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Ticket size={28} />,
              title: 'Official Ticketing',
              desc: 'Buy tickets directly from organisers with guaranteed authenticity and instant QR code delivery.',
              color: '#7C3AED'
            },
            {
              icon: <ShoppingBag size={28} />,
              title: 'Safe Resale',
              desc: 'Can\'t make it? List your ticket safely. Organisers set price caps to prevent scalping.',
              color: '#F97316'
            },
            {
              icon: <QrCode size={28} />,
              title: 'QR Check-in',
              desc: 'Lightning-fast gate entry with unique QR codes. Works offline on any mobile device.',
              color: '#7C3AED'
            },
            {
              icon: <Zap size={28} />,
              title: 'M-Pesa Payments',
              desc: 'Pay instantly with M-Pesa STK Push. No cards, no hassle — just enter your PIN.',
              color: '#F97316'
            },
            {
              icon: <BarChart3 size={28} />,
              title: 'Live Analytics',
              desc: 'Organisers get real-time dashboards showing sales, revenue, and check-in rates.',
              color: '#7C3AED'
            },
            {
              icon: <Shield size={28} />,
              title: 'Fraud Protected',
              desc: 'Atomic ownership transfer means old QR codes are instantly invalidated on resale.',
              color: '#F97316'
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-[#A0A0B8] text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Events Section */}
      {publishedEvents.length > 0 && (
        <section className="py-24 bg-[#13132B]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">Happening Soon</span>
                <h2 className="text-4xl font-black text-white mt-2">Upcoming Events</h2>
              </div>
              <Link to="/events">
                <button className="flex items-center gap-2 text-[#A855F7] hover:text-white transition-colors text-sm font-medium">
                  View All
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/20 to-[#F97316]/20" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Experience
              <br />
              <span className="gradient-text">Something Amazing?</span>
            </h2>
            <p className="text-[#A0A0B8] text-xl mb-10">
              Join thousands of event-goers across Kenya
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <button className="btn-primary text-base px-8 py-4">
                  Get Started Free
                </button>
              </Link>
              <Link to="/events">
                <button className="btn-orange text-base px-8 py-4">
                  Browse Events
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#13132B] border-t border-[#2A2A4A] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center">
                <Ticket size={16} className="text-white" />
              </div>
              <span className="text-xl font-black gradient-text">EventSphere</span>
            </div>
            <p className="text-[#A0A0B8] text-sm">© 2026 EventSphere. All rights reserved.</p>
            <div className="flex gap-6 text-[#A0A0B8] text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}