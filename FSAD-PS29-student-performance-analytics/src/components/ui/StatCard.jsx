import React from 'react'
import Card from './Card.jsx'

export default function StatCard({ label, value, hint, icon='•' }) {
  return (
    <Card className="statCard" title={label} right={<div className="statIcon" aria-hidden="true">{icon}</div>}>
      <div className="statValue">{value}</div>
      <div className="statHint">{hint}</div>
    </Card>
  )
}
