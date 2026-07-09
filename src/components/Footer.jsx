import { Link } from 'react-router-dom'
import { Globe, Mail, MessageCircle } from 'lucide-react'
import Logo from './Logo'

const productLinks = [
  { label: 'Browse events', to: '/events' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'My tickets', to: '/my-tickets' },
  { label: 'Create an event', to: '/organiser/create-event' },
]

const companyLinks = ['About', 'Contact', 'Careers']
const legalLinks = ['Privacy policy', 'Terms of service', 'Refund policy']
const socials = [Globe, Mail, MessageCircle]

export default function Footer() {
  return (
    <footer className="border-t border-[#16163A]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 mb-14">

          <div>
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <Logo size={30} textSize="text-base" />
            </Link>
            <p className="text-[#8888AA] text-sm leading-relaxed mt-4 max-w-xs">
              Kenya's hybrid ticket marketplace — buy, sell, and discover
              events with M-Pesa payments and fraud-proof resale.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-9 h-9 rounded-lg bg-[#16163A] border border-[#2A2A5A] flex items-center justify-center text-[#8888AA] hover:text-[#F0F0FF] hover:border-[#3D3D75] transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[#F0F0FF] text-sm font-semibold mb-4">Product</p>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-[#8888AA] hover:text-[#F0F0FF] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[#F0F0FF] text-sm font-semibold mb-4">Company</p>
            <ul className="space-y-3">
              {companyLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-[#8888AA] hover:text-[#F0F0FF] transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[#F0F0FF] text-sm font-semibold mb-4">Legal</p>
            <ul className="space-y-3">
              {legalLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-[#8888AA] hover:text-[#F0F0FF] transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-[#6E6E96]">© {new Date().getFullYear()} EventSphere. All rights reserved.</p>
          <p className="text-sm text-[#6E6E96]">Made in Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  )
}