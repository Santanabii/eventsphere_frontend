import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { CheckCircle, XCircle, AlertCircle, QrCode } from 'lucide-react'
import Navbar from '../components/Navbar'
import { ticketsAPI } from '../services/api'

export default function Scanner() {
  const [result, setResult] = useState(null)
  const [scanning, setScanning] = useState(true)
  const scannerRef = useRef(null)

  useEffect(() => {
    if (!scanning) return
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 250, height: 250 } })

    scanner.render(
      async (decodedText) => {
        scanner.clear()
        setScanning(false)
        try {
          const res = await ticketsAPI.scan({ qr_token: decodedText })
          setResult(res.data)
        } catch (err) {
          setResult({ result: 'invalid', message: err.response?.data?.message || 'Scan failed' })
        }
      },
      (error) => console.warn(error)
    )

    scannerRef.current = scanner
    return () => scanner.clear().catch(() => {})
  }, [scanning])

  const reset = () => { setResult(null); setScanning(true) }

  const resultConfig = {
    valid:   { icon: <CheckCircle size={56} />, className: 'text-emerald-400', border: 'border-emerald-500/30', title: 'Valid ticket' },
    used:    { icon: <AlertCircle size={56} />, className: 'text-amber-400',   border: 'border-amber-500/30',   title: 'Already used' },
    invalid: { icon: <XCircle size={56} />,     className: 'text-red-400',     border: 'border-red-500/30',     title: 'Invalid ticket' },
  }

  const config = result ? resultConfig[result.result] : null

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-24 px-6">
      <Navbar />

      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <QrCode size={28} className="text-violet-400" />
            </div>
            <h1 className="font-display font-bold text-3xl text-zinc-100">Gate scanner</h1>
            <p className="text-zinc-400 mt-1.5">Scan attendee QR codes for entry</p>
          </div>

          {scanning && !result && (
            <div className="card overflow-hidden">
              <div id="qr-reader" className="w-full" />
            </div>
          )}

          {result && config && (
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              className={`card p-8 border ${config.border}`}>
              <div className={`flex justify-center mb-4 ${config.className}`}>{config.icon}</div>
              <h2 className="font-display font-bold text-xl text-zinc-100 mb-4">{config.title}</h2>

              {result.owner && (
                <div className="space-y-2 mb-6 text-left bg-zinc-950 rounded-xl p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Attendee</span>
                    <span className="text-zinc-100 font-medium">{result.owner}</span>
                  </div>
                  {result.tier && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Tier</span>
                      <span className="text-zinc-100 font-medium">{result.tier}</span>
                    </div>
                  )}
                  {result.event && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Event</span>
                      <span className="text-zinc-100 font-medium">{result.event}</span>
                    </div>
                  )}
                  {result.message && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Status</span>
                      <span className="text-zinc-100 font-medium">{result.message}</span>
                    </div>
                  )}
                </div>
              )}

              <button onClick={reset} className="btn-primary w-full">Scan next ticket</button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}