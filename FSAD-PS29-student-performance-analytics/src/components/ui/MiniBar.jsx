import React from 'react'
import '../../styles/charts.css'

export default function MiniBar({ value=0, max=100, label }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / (max || 1)) * 100)))
  return (
    <div className="miniBar">
      <div className="miniBarTop">
        <span className="miniBarLabel">{label}</span>
        <span className="miniBarVal">{value}%</span>
      </div>
      <div className="miniBarTrack">
        <div className="miniBarFill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
