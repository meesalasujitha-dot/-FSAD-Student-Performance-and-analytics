import React, { useMemo, useState } from 'react'
import { useApp } from '../state/AppState.jsx'
import Card from '../components/ui/Card.jsx'
import MiniBar from '../components/ui/MiniBar.jsx'
import { scoreToBand } from '../utils/data.js'
import '../styles/pages.css'

export default function Insights() {
  const { data, session } = useApp()
  const [focus, setFocus] = useState('All')

  const insights = useMemo(() => {
    const students = data.students
    const subjects = Object.keys(students[0]?.scores || {})
    const subjectAverages = subjects.map(sub => {
      const avg = Math.round(students.reduce((s, st) => s + (st.scores[sub] || 0), 0) / Math.max(1, students.length))
      return { subject: sub, avg, band: scoreToBand(avg) }
    }).sort((a,b)=>a.avg-b.avg)

    const riskBuckets = ['High','Medium','Low'].map(r => ({
      risk: r,
      count: students.filter(s => s.risk === r).length,
      hint: r === 'High' ? 'Immediate attention' : r === 'Medium' ? 'Monitor & support' : 'On track'
    }))

    return { subjectAverages, riskBuckets }
  }, [data.students])

  const rows = useMemo(() => {
    let s = [...data.students]
    if (session.role === 'student') {
      const me = session.user?.name?.toLowerCase() || ''
      const match = s.filter(x => x.name.toLowerCase().includes(me))
      s = match.length ? match : s.slice(0, 1)
    }
    if (focus !== 'All') s = s.filter(x => x.risk === focus)
    return s.sort((a,b)=>a.overall-b.overall).slice(0, 6)
  }, [data.students, focus, session.role, session.user])

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="pageTitle">Insights</div>
          <div className="pageSub">Find patterns, weak subjects, and next-best actions.</div>
        </div>
        <div className="pageActions">
          <select value={focus} onChange={(e)=>setFocus(e.target.value)}>
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <div className="grid two">
        <Card title="Subject trends" subtitle="Average class performance by subject">
          <div className="miniBars">
            {insights.subjectAverages.map(s => (
              <div key={s.subject} className="trendRow">
                <MiniBar label={s.subject} value={s.avg} />
                <span className="tag soft">{s.band}</span>
              </div>
            ))}
          </div>
          <div className="muted small">
            Tip: Focus first on the lowest-average subjects for the biggest improvement.
          </div>
        </Card>

        <Card title="Risk buckets" subtitle="Who needs attention right now">
          <div className="bucketGrid">
            {insights.riskBuckets.map(b => (
              <div key={b.risk} className="bucket">
                <div className={`badge ${b.risk.toLowerCase()}`}>{b.risk}</div>
                <div className="bucketCount">{b.count}</div>
                <div className="muted">{b.hint}</div>
              </div>
            ))}
          </div>

          <div className="callouts">
            <div className="callout">
              <div className="callTitle">Action plan</div>
              <div className="callText">Create weekly goals for Medium/High risk students and review progress.</div>
            </div>
          </div>
        </Card>
      </div>

      <Card title={session.role === 'student' ? 'My improvement areas' : 'Lowest performers'} subtitle="Students with lowest overall score (based on filter)">
        <div className="table cols6">
          <div className="tHead">
            <div>ID</div><div>Name</div><div>Overall</div><div>Attendance</div><div>Weak subjects</div><div>Next step</div>
          </div>
          {rows.map(s => {
            const weak = Object.entries(s.scores).sort((a,b)=>a[1]-b[1]).slice(0,2).map(([k,v])=>`${k} (${v}%)`)
            const step = s.risk === 'High'
              ? 'Mentor weekly + attendance plan'
              : s.risk === 'Medium'
                ? 'Daily practice + quizzes'
                : 'Advanced tasks + consistency'
            return (
              <div className="tRow" key={s.id}>
                <div className="mono">{s.id}</div>
                <div className="strong">{s.name}</div>
                <div className="mono">{s.overall}%</div>
                <div className="mono">{s.attendance}%</div>
                <div className="muted">{weak.join(', ')}</div>
                <div><span className="tag">{step}</span></div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
