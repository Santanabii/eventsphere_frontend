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

    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    })

    scanner.render(
      async (decodedText) => {
        scanner.clear()
        setScanning(false)
        try {
          const res = await ticketsAPI.scan({ qr_token: decodedText })
          setResult(res.data)
        } catch (err) {
          setResult({
            result: 'invalid',
            message: err.response?.data?.message || 'Scan failed'
          })
        }
      },
      (error) => console.warn(error)
    )

    scannerRef.current = scanner
    return () => scanner.clear().catch(() => {})
  }, [scanning])

  const reset = () => {
    setResult(null)
    setScanning(true)
  }

  const resultConfig = {
    valid: {
      icon: <CheckCircle size={64} />,
      className: 'text-success',
      border: 'border-success/30',
      title: 'Valid ticket',
      bg: 'bg-success/5'
    },
    used: {
      icon: <AlertCircle size={64} />,
      className: 'text-warning',
      border: 'border-warning/30',
      title: 'Already used',
      bg: 'bg-warning/5'
    },
    invalid: {
      icon: <XCircle size={64} />,
      className: 'text-danger',
      border: 'border-danger/30',
      title: 'Invalid ticket',
      bg: 'bg-danger/5'
    }
  }

  const config = result ? resultConfig[result.result] : null

  return (
    <div className="page">
      <Navbar />

      <div className="container max-w-lg pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-10">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <QrCode size={32} className="text-accent" />
            </div>
            <h1 className="font-display font-bold text-3xl text-text">Gate scanner</h1>
            <p className="text-text-secondary mt-2">Scan attendee QR codes for entry</p>
          </div>

          {scanning && !result && (
            <div className="glass rounded-2xl overflow-hidden border border-border">
              <div id="qr-reader" className="w-full" />
            </div>
          )}

          {result && config && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`glass rounded-2xl p-8 border ${config.border} ${config.bg}`}
            >
              <div className={`flex justify-center mb-4 ${config.className}`}>
                {config.icon}
              </div>
              <h2 className="font-display font-bold text-2xl text-text mb-4">{config.title}</h2>

              {result.owner && (
                <div className="space-y-2 mb-6 text-left bg-bg-soft rounded-xl p-5 border border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Attendee</span>
                    <span className="text-text font-medium">{result.owner}</span>
                  </div>
                  {result.tier && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Tier</span>
                      <span className="text-text font-medium">{result.tier}</span>
                    </div>
                  )}
                  {result.event && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Event</span>
                      <span className="text-text font-medium">{result.event}</span>
                    </div>
                  )}
                  {result.message && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Status</span>
                      <span className="text-text font-medium">{result.message}</span>
                    </div>
                  )}
                </div>
              )}

              <button onClick={reset} className="btn-primary w-full py-3.5 text-[15px]">
                Scan next ticket
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}