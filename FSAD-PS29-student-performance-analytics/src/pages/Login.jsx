import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppState.jsx'
import '../styles/login.css'

export default function Login() {
  const { login } = useApp()
  const nav = useNavigate()
  const [email, setEmail] = useState('aarav@example.com')
  const [password, setPassword] = useState('password123')
  const [role, setRole] = useState('student')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const success = await login(role, email, password)
    setIsLoading(false)
    if (success) {
       nav('/', { replace: true })
    }
  }

  return (
    <div className="loginWrap">
      <div className="loginCard">
        <div className="loginBrand">
          <div className="logoBig">PP</div>
          <div>
            <div className="loginTitle">PerformancePulse</div>
            <div className="loginSub">Student Performance Analytics & Reporting</div>
          </div>
        </div>

        <form className="loginForm" onSubmit={onSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="field">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="admin">Teacher / Admin</option>
            </select>
          </div>

          <button className="btn primary full" type="submit" disabled={isLoading}>
             {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="loginHint">
            Select "Teacher / Admin" to manage students or "Student" to view your own stats.
          </div>
        </form>

        <div className="loginFooter">
          <span>FSAD-PS29 • 2026</span>
          <span className="dotSep">•</span>
          <span className="muted">Clean UI • Reports • Insights</span>
        </div>
      </div>

      <div className="loginSide">
        <div className="glass">
          <div className="h1">Track progress. Identify gaps. Improve outcomes.</div>
          <div className="p">
            Build reports and insights from performance data—attendance, assessments,
            subject scores, and trends—so educators can take faster action.
          </div>

          <div className="bullets">
            <div className="b"><span className="bI">✓</span> Role-based experience (Admin / Student)</div>
            <div className="b"><span className="bI">✓</span> Search, sort, filters + export (CSV)</div>
            <div className="b"><span className="bI">✓</span> Recommendations and risk detection</div>
          </div>
        </div>
      </div>
    </div>
  )
}
