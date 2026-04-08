import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/pages.css'

export default function NotFound() {
  return (
    <div className="centerPage">
      <div className="centerCard">
        <div className="big">404</div>
        <div className="pageTitle">Page not found</div>
        <div className="pageSub">The page you are looking for does not exist.</div>
        <Link to="/" className="btn primary">Go to Dashboard</Link>
      </div>
    </div>
  )
}
