import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook } from 'lucide-react'
import Logo from './Logo'

const productLinks = [
  { label: 'Browse events', to: '/events' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'My tickets', to: '/my-tickets' },
  { label: 'Create an event', to: '/organiser/create-event' },
]

const companyLinks = ['About', 'Contact', 'Careers']
const legalLinks = ['Privacy policy', 'Terms of service', 'Refund policy']

const socials = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'X (Twitter)' },
  { icon: Facebook, label: 'Facebook' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container py-16">
        <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 mb-14">

          {/* Brand column */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <Logo size={30} textClassName="text-base" />
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mt-4 max-w-xs">
              Kenya's hybrid ticket marketplace — buy, sell, and discover
              events with M-Pesa payments and fraud-proof resale.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-text hover:border-border-strong transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-text text-sm font-semibold mb-4">Product</p>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-text-secondary hover:text-text transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-text text-sm font-semibold mb-4">Company</p>
            <ul className="space-y-3">
              {companyLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-text-secondary hover:text-text transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-text text-sm font-semibold mb-4">Legal</p>
            <ul className="space-y-3">
              {legalLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-text-secondary hover:text-text transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} EventSphere. All rights reserved.
          </p>
          <p className="text-sm text-text-muted">Made in Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  )
}