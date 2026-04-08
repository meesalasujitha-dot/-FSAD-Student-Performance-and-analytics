import React from 'react'
import '../../styles/ui.css'

export default function Card({ title, subtitle, right, children, className='' }) {
  return (
    <section className={`card ${className}`}>
      {(title || right) && (
        <header className="cardHead">
          <div>
            {title && <div className="cardTitle">{title}</div>}
            {subtitle && <div className="cardSub">{subtitle}</div>}
          </div>
          {right && <div className="cardRight">{right}</div>}
        </header>
      )}
      <div className="cardBody">{children}</div>
    </section>
  )
}
