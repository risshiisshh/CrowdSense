import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Camera, Layers, Compass, X, AlertTriangle, RotateCcw } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'

type CameraState = 'idle' | 'requesting' | 'active' | 'denied' | 'unavailable'

const AR_OVERLAYS = [
  { emoji: '🍔', label: 'Burger Blvd', dist: '50m →', color: '#F59E0B', top: '15%', left: '10%' },
  { emoji: '🚪', label: 'Gate 3',      dist: '30m ↑', color: '#10B981', top: '22%', right: '10%' },
  { emoji: '🧻', label: 'Restrooms',   dist: '25m ↓', color: '#3B82F6', bottom: '30%', left: '18%' },
  { emoji: '🍛', label: 'Spice Route', dist: '80m →', color: '#8B5CF6', top: '40%', right: '8%' },
]

export default function ARPreviewPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraState, setCameraState] = useState<CameraState>('idle')
  const [overlaysVisible, setOverlaysVisible] = useState(false)

  // Start camera feed
  const startCamera = useCallback(async () => {
    setCameraState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraState('active')
      // Show overlays after short delay for dramatic effect
      setTimeout(() => setOverlaysVisible(true), 600)
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied')
      } else {
        setCameraState('unavailable')
      }
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    setOverlaysVisible(false)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraState('idle')
  }, [])

  // Cleanup on unmount
  useEffect(() => () => { stopCamera() }, [stopCamera])

  return (
    <PageWrapper>
      <div className="pt-5 pb-2 page-header">
        <h1 className="font-display text-4xl text-gradient-amber tracking-wide">AR PREVIEW</h1>
        <p className="text-sm font-body mt-1" style={{ color: 'var(--text-muted)' }}>
          Augmented reality stadium view
        </p>
      </div>

      {/* AR Viewport */}
      <div
        className="mt-3 rounded-2xl overflow-hidden relative"
        style={{
          height: 360,
          background: cameraState === 'active' ? '#000' : 'var(--surface-2)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Live camera feed */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: cameraState === 'active' ? 'block' : 'none' }}
          playsInline
          muted
          autoPlay
        />

        {/* Corner brackets — always shown */}
        {['top-4 left-4 border-t-2 border-l-2', 'top-4 right-4 border-t-2 border-r-2',
          'bottom-4 left-4 border-b-2 border-l-2', 'bottom-4 right-4 border-b-2 border-r-2'].map((cls, i) => (
          <div key={i} className={`absolute w-8 h-8 ${cls} pointer-events-none z-10`}
            style={{ borderColor: '#F59E0B', opacity: cameraState === 'active' ? 1 : 0.5 }} />
        ))}

        {/* Center crosshair */}
        {cameraState === 'active' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ border: '1.5px solid rgba(245,158,11,0.6)' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#F59E0B', animation: 'pulseDot 1.4s ease-in-out infinite' }} />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-14 h-px"
                style={{ background: 'rgba(245,158,11,0.3)' }} />
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-px h-14"
                style={{ background: 'rgba(245,158,11,0.3)', marginLeft: '-0.5px' }} />
            </div>
          </div>
        )}

        {/* AR Overlay labels */}
        {cameraState === 'active' && AR_OVERLAYS.map((item, i) => (
          <div
            key={i}
            className="absolute z-20 px-2.5 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm"
            style={{
              top: item.top, left: item.left, right: (item as any).right, bottom: (item as any).bottom,
              background: `${item.color}22`,
              border: `1px solid ${item.color}55`,
              color: item.color,
              opacity: overlaysVisible ? 1 : 0,
              transform: overlaysVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity 0.4s ease ${i * 0.12}s, transform 0.4s ease ${i * 0.12}s`,
            }}
          >
            {item.emoji} {item.label} · {item.dist}
          </div>
        ))}

        {/* Placeholder — idle */}
        {cameraState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Camera size={28} style={{ color: '#F59E0B' }} />
            </div>
            <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Camera not active
            </p>
            <p className="text-xs text-center px-8" style={{ color: 'var(--text-muted)' }}>
              Enable camera to see AR overlays superimposed on the live stadium view
            </p>
          </div>
        )}

        {/* Requesting */}
        {cameraState === 'requesting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>Requesting camera access…</p>
          </div>
        )}

        {/* Denied */}
        {cameraState === 'denied' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)' }}>
              <AlertTriangle size={24} style={{ color: '#FF6B6B' }} />
            </div>
            <p className="font-body font-semibold text-sm" style={{ color: '#FF6B6B' }}>Camera access denied</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Please allow camera access in your browser settings, then try again.
            </p>
            <button
              onClick={() => setCameraState('idle')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold mt-1"
              style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', color: '#FF6B6B' }}
            >
              <RotateCcw size={12} /> Try Again
            </button>
          </div>
        )}

        {/* Active — stop button */}
        {cameraState === 'active' && (
          <button
            onClick={stopCamera}
            className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <X size={14} color="#fff" />
          </button>
        )}

        {/* Scan line — active only */}
        {cameraState === 'active' && (
          <div className="absolute inset-x-0 h-px z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)',
              animation: 'scanLine 2.5s linear infinite',
            }} />
        )}

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none z-10"
          style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.5))' }} />
      </div>

      {/* Enable / status button */}
      <div className="mt-4">
        {cameraState === 'idle' || cameraState === 'denied' ? (
          <button
            id="enable-ar-camera-btn"
            onClick={startCamera}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-body font-semibold text-sm hover-glow"
            style={{ background: '#F59E0B', color: '#08090D', boxShadow: '0 0 24px rgba(245,158,11,0.3)' }}
          >
            <Camera size={16} />
            Enable Camera for AR
          </button>
        ) : cameraState === 'active' ? (
          <button
            onClick={stopCamera}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-body font-semibold text-sm hover-glow-coral"
            style={{ background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)', color: '#FF6B6B' }}
          >
            <X size={16} /> Stop Camera
          </button>
        ) : null}
      </div>

      {/* AR features list */}
      <div className="mt-6">
        <p className="text-xs font-body font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          AR Features
        </p>
        <div className="grid grid-cols-1 gap-3 stagger-children">
          {[
            { icon: <Layers size={18} />,  title: 'Crowd Overlay',     sub: 'See crowd density superimposed over real view', color: '#F59E0B', available: true },
            { icon: <Compass size={18} />, title: 'Navigation Arrows', sub: 'Follow AR arrows to reach destinations',         color: '#10B981', available: true },
            { icon: <Camera size={18} />,  title: '3D Seat View',      sub: 'Full 360° preview of your seat perspective',     color: '#8B5CF6', available: false },
          ].map(({ icon, title, sub, color, available }) => (
            <div key={title} className="surface-card p-4 flex items-center gap-4 hover-glow">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, color }}>
                {icon}
              </div>
              <div className="flex-1">
                <p className="font-body font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>
              </div>
              {available ? (
                <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>Active</span>
              ) : (
                <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                  style={{ background: 'var(--surface-3)', color: 'var(--text-muted)' }}>Soon</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </PageWrapper>
  )
}
