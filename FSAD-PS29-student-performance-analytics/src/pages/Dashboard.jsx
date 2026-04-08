import React from 'react'
import { useApp } from '../state/AppState.jsx'
import Card from '../components/ui/Card.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import MiniBar from '../components/ui/MiniBar.jsx'
import { formatDate } from '../utils/data.js'
import '../styles/pages.css'

export default function Dashboard() {
  const { data, session } = useApp()
  const { summary, students } = data

  const latest = [...students].sort((a,b)=> (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0,5)

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="pageTitle">Dashboard</div>
          <div className="pageSub">
            Quick view of performance, attendance, and risk indicators.
          </div>
        </div>
        <div className="pageActions">
          <div className="pill soft">{session.role === 'admin' ? 'Admin view' : 'Student view'}</div>
        </div>
      </div>

      <div className="grid stats">
        <StatCard label="Students" value={summary.total} hint="Active records" icon="👥" />
        <StatCard label="Avg. Score" value={`${summary.avgOverall}%`} hint="Overall performance" icon="📈" />
        <StatCard label="Avg. Attendance" value={`${summary.avgAttendance}%`} hint="Last 30 days" icon="🗓️" />
        <StatCard label="High Risk" value={summary.atRisk} hint="Needs attention" icon="⚠️" />
      </div>

      <div className="grid two">
        <Card title="Grade distribution" subtitle="Counts by grade">
          <div className="chipsRow">
            {Object.entries(summary.byGrade).map(([g, n]) => (
              <div key={g} className="chipStat">
                <div className="chipStatK">{g}</div>
                <div className="chipStatV">{n}</div>
              </div>
            ))}
          </div>

          <div className="miniBars">
            {Object.entries(summary.byGrade).map(([g, n]) => (
              <MiniBar key={g} label={`Grade ${g}`} value={Math.round((n / Math.max(1, summary.total)) * 100)} />
            ))}
          </div>
        </Card>

        <Card
          title="Department overview"
          subtitle="Students by department"
          right={<div className="tag">Auto-updated</div>}
        >
          <div className="deptGrid">
            {Object.entries(summary.byDept).map(([d, n]) => (
              <div key={d} className="deptCard">
                <div className="deptName">{d}</div>
                <div className="deptCount">{n}</div>
                <div className="deptHint">students</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid two">
        <Card title="Recently updated" subtitle="Latest student activity">
          <div className="table cols5">
            <div className="tHead">
              <div>ID</div><div>Name</div><div>Overall</div><div>Risk</div><div>Updated</div>
            </div>
            {latest.map(s => (
              <div className="tRow" key={s.id}>
                <div className="mono">{s.id}</div>
                <div>{s.name}</div>
                <div className="mono">{s.overall}%</div>
                <div><span className={`badge ${s.risk.toLowerCase()}`}>{s.risk}</span></div>
                <div className="muted">{formatDate(s.updatedAt)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="What to do next" subtitle="Actionable suggestions">
          <div className="callouts">
            <div className="callout">
              <div className="callTitle">Identify weak areas</div>
              <div className="callText">Use <b>Insights</b> to find low-scoring subjects and get recommended actions.</div>
            </div>
            <div className="callout">
              <div className="callTitle">Export reports</div>
              <div className="callText">Go to <b>Reports</b> → Export CSV for sharing with mentors or parents.</div>
            </div>
            <div className="callout">
              <div className="callTitle">Support at-risk students</div>
              <div className="callText">Filter by <b>High Risk</b> and schedule mentoring sessions.</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
