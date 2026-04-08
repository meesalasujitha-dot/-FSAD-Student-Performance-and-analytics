import React, { useEffect } from 'react'
import { useApp } from '../state/AppState.jsx'
import '../styles/toasts.css'

export default function Toasts() {
  const { ui, dismissToast } = useApp()

  useEffect(() => {
    const timers = ui.toasts.map(t =>
      setTimeout(() => dismissToast(t.id), 3200)
    )
    return () => timers.forEach(clearTimeout)
  }, [ui.toasts, dismissToast])

  return (
    <div className="toasts" aria-live="polite" aria-relevant="additions">
      {ui.toasts.map(t => (
        <div key={t.id} className={`toast ${t.tone || 'neutral'}`}>
          <div className="toastHead">
            <div className="toastTitle">{t.title || 'Update'}</div>
            <button className="toastX" onClick={() => dismissToast(t.id)} aria-label="Dismiss">✕</button>
          </div>
          <div className="toastMsg">{t.message}</div>
        </div>
      ))}
    </div>
  )
}
