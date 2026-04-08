import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppState.jsx'
import Toasts from './Toasts.jsx'
import ChatWidget from './chat/ChatWidget.jsx'
import '../styles/shell.css'

function Icon({ name }) {
  const map = {
    dashboard: '▣',
    students: '👥',
    reports: '📄',
    insights: '✨',
    settings: '⚙️',
  }
  return <span className="ic" aria-hidden="true">{map[name] || '•'}</span>
}

export default function Shell() {
  const { session, logout } = useApp()
  const nav = useNavigate()

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">
          <div className="logo">PP</div>
          <div className="brandText">
            <div className="brandName">PerformancePulse</div>
            <div className="brandTag">Student Analytics & Reports</div>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/" end className={({isActive}) => `navItem ${isActive ? 'active' : ''}`}>
            <Icon name="dashboard" /> Dashboard
          </NavLink>
          <NavLink to="/students" className={({isActive}) => `navItem ${isActive ? 'active' : ''}`}>
            <Icon name="students" /> Students
          </NavLink>
          <NavLink to="/reports" className={({isActive}) => `navItem ${isActive ? 'active' : ''}`}>
            <Icon name="reports" /> Reports
          </NavLink>
          <NavLink to="/insights" className={({isActive}) => `navItem ${isActive ? 'active' : ''}`}>
            <Icon name="insights" /> Insights
          </NavLink>
          <NavLink to="/settings" className={({isActive}) => `navItem ${isActive ? 'active' : ''}`}>
            <Icon name="settings" /> Settings
          </NavLink>
        </nav>

        <div className="sideFooter">
          <div className="userCard">
            <div className="avatar">{(session.user?.name || 'U').slice(0,1).toUpperCase()}</div>
            <div className="userMeta">
              <div className="userName">{session.user?.name}</div>
              <div className="userRole">{session.role === 'admin' ? 'Admin (Teacher)' : 'User (Student)'}</div>
            </div>
          </div>
          <button
            className="btn ghost"
            onClick={() => { logout(); nav('/login', { replace: true }) }}
            title="Logout"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumb">
            <span className="dot" />
            <span>FSAD-PS29</span>
            <span className="sep">/</span>
            <span className="muted">{session.role === 'admin' ? 'Admin Console' : 'Student View'}</span>
          </div>
          <div className="topbarRight">
            <div className="pill">Live DB Connected</div>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>

      <Toasts />
      <ChatWidget />
    </div>
  )
}
