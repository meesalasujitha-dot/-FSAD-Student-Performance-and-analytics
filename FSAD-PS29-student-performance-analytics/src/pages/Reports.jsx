import React, { useMemo, useState } from 'react'
import { useApp } from '../state/AppState.jsx'
import Card from '../components/ui/Card.jsx'
import { exportCSV } from '../utils/data.js'
import '../styles/pages.css'

export default function Reports() {
  const { data, session, toast } = useApp()
  const [q, setQ] = useState('')
  const [risk, setRisk] = useState('All')

  const rows = useMemo(() => {
    let r = [...data.reports]
    if (session.role === 'student') {
      // Student view: show top matches by name; fallback to first item for demo
      const me = session.user?.name?.toLowerCase() || ''
      const match = r.filter(x => x.name.toLowerCase().includes(me))
      r = match.length ? match : r.slice(0, 1)
    }
    const qq = q.trim().toLowerCase()
    if (qq) r = r.filter(x =>
      x.name.toLowerCase().includes(qq) ||
      x.id.toLowerCase().includes(qq) ||
      x.department.toLowerCase().includes(qq)
    )
    if (risk !== 'All') r = r.filter(x => x.risk === risk)
    return r
  }, [data.reports, q, risk, session.role, session.user])

  const download = () => {
    if (!rows.length) {
      toast({ title:'Nothing to export', message:'No rows in the current filter.', tone:'danger' })
      return
    }
    exportCSV('student_reports.csv', rows)
    toast({ title:'Export started', message:'CSV file is downloading.', tone:'success' })
  }

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="pageTitle">Reports</div>
          <div className="pageSub">Generate and export performance reports with recommendations.</div>
        </div>
        <div className="pageActions">
          <button className="btn primary" onClick={download}>Export CSV</button>
        </div>
      </div>

      <Card
        title={session.role === 'student' ? 'My performance report' : 'Student reports'}
        subtitle="Filter and review performance with actionable recommendations"
        right={
          <div className="filters">
            <input className="search" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search..." />
            <select value={risk} onChange={(e)=>setRisk(e.target.value)}>
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        }
      >
        <div className="table">
          <div className="tHead">
            <div>ID</div><div>Name</div><div>Dept</div><div>Overall</div><div>Attendance</div><div>Risk</div><div>Recommendation</div>
          </div>
          {rows.map(r => (
            <div className="tRow" key={r.id}>
              <div className="mono">{r.id}</div>
              <div className="strong">{r.name}</div>
              <div className="muted">{r.department}</div>
              <div className="mono">{r.overall}%</div>
              <div className="mono">{r.attendance}%</div>
              <div><span className={`badge ${r.risk.toLowerCase()}`}>{r.risk}</span></div>
              <div className="muted">{r.recommendation}</div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="empty">
              <div className="emptyTitle">No data</div>
              <div className="emptySub">Try removing filters.</div>
            </div>
          )}
        </div>
      </Card>

      <div className="grid two">
        <Card title="Report templates" subtitle="Common formats">
          <div className="list">
            <div className="listItem">
              <div className="liTitle">Class summary</div>
              <div className="liSub">Average, grade distribution, at-risk count</div>
            </div>
            <div className="listItem">
              <div className="liTitle">Student profile</div>
              <div className="liSub">Subject-wise scores, attendance, recommendations</div>
            </div>
            <div className="listItem">
              <div className="liTitle">Intervention plan</div>
              <div className="liSub">Mentoring schedule + weekly targets</div>
            </div>
          </div>
        </Card>

        <Card title="Sharing tips" subtitle="How educators use reports">
          <div className="callouts">
            <div className="callout">
              <div className="callTitle">Parent updates</div>
              <div className="callText">Share CSV/PDF snapshots monthly with clear goals.</div>
            </div>
            <div className="callout">
              <div className="callTitle">Mentor review</div>
              <div className="callText">Discuss High Risk students weekly and track improvements.</div>
            </div>
            <div className="callout">
              <div className="callTitle">Actionable steps</div>
              <div className="callText">Convert recommendations into measurable tasks.</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
