import React, { useMemo, useState } from 'react'
import { useApp } from '../state/AppState.jsx'
import Card from '../components/ui/Card.jsx'
import Modal from '../components/ui/Modal.jsx'
import { riskLabel } from '../utils/data.js'
import '../styles/pages.css'

function Input({ label, ...props }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input {...props} />
    </div>
  )
}

export default function Students() {
  const { data, session, upsertStudent, deleteStudent, toast } = useApp()
  const [q, setQ] = useState('')
  const [risk, setRisk] = useState('All')
  const [sort, setSort] = useState('updated')
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(null)

  const canEdit = session.role === 'admin'

  const filtered = useMemo(() => {
    let rows = [...data.students]
    const qq = q.trim().toLowerCase()
    if (qq) rows = rows.filter(s =>
      s.name.toLowerCase().includes(qq) ||
      s.id.toLowerCase().includes(qq) ||
      s.department.toLowerCase().includes(qq)
    )
    if (risk !== 'All') rows = rows.filter(s => s.risk === risk)
    rows.sort((a,b) => {
      if (sort === 'overall') return b.overall - a.overall
      if (sort === 'attendance') return b.attendance - a.attendance
      return (a.updatedAt < b.updatedAt) ? 1 : -1
    })
    return rows
  }, [data.students, q, risk, sort])

  const startAdd = () => {
    setDraft({
      id: null,
      studentId: `STU-${String(data.students.length + 1).padStart(3,'0')}`,
      name: '',
      department: 'CSE',
      yearOfStudy: 1,
      attendance: 85,
      overall: 75,
      grade: 'B',
      risk: 'Medium',
      notes: '',
      scores: { "Operating System (OS)": 70, "Full Stack Development (FSAD)": 75, "System Programming for Hardware Acceleration (SPHA)": 78, "UX Design": 72, "Probability & Statistics (P&S)": 80 },
      updatedAt: new Date().toISOString(),
    })
    setOpen(true)
  }

  const startEdit = (s) => {
    setDraft(JSON.parse(JSON.stringify({ ...s, yearOfStudy: s.yearOfStudy || 1 })))
    setOpen(true)
  }

  const save = () => {
    if (!draft.name.trim()) {
      toast({ title: 'Missing name', message: 'Please enter student name.', tone: 'danger' })
      return
    }
    const overall = Number(draft.overall)
    const attendance = Number(draft.attendance)
    const grade = overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B' : overall >= 60 ? 'C' : 'D'
    const next = {
      ...draft,
      overall,
      attendance,
      grade,
      risk: riskLabel(overall, attendance),
      updatedAt: new Date().toISOString(),
    }
    upsertStudent(next)
    setOpen(false)
    toast({ title: 'Saved', message: 'Student record updated.', tone: 'success' })
  }

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="pageTitle">Students</div>
          <div className="pageSub">Search, filter, and manage student performance records.</div>
        </div>
        <div className="pageActions">
          {canEdit && <button className="btn primary" onClick={startAdd}>+ Add Student</button>}
        </div>
      </div>

      <Card
        title="Student directory"
        subtitle="Use search and filters to find students quickly"
        right={
          <div className="filters">
            <input className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name / id / dept..." />
            <select value={risk} onChange={(e) => setRisk(e.target.value)}>
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="updated">Sort: Updated</option>
              <option value="overall">Sort: Overall</option>
              <option value="attendance">Sort: Attendance</option>
            </select>
          </div>
        }
      >
        <div className="table">
          <div className="tHead">
            <div>ID</div><div>Name</div><div>Dept</div><div>Overall</div><div>Attendance</div><div>Risk</div><div className="right">Action</div>
          </div>

          {filtered.map(s => (
            <div className="tRow" key={s.id}>
              <div className="mono">{s.studentId}</div>
              <div className="strong">{s.name}</div>
              <div className="muted">{s.department}</div>
              <div className="mono">{s.overall}%</div>
              <div className="mono">{s.attendance}%</div>
              <div><span className={`badge ${s.risk.toLowerCase()}`}>{s.risk}</span></div>
              <div className="right">
                <button className="btn mini" onClick={() => startEdit(s)}>View</button>
                {canEdit && (
                  <button className="btn mini danger" onClick={() => { deleteStudent(s.id); toast({ title:'Deleted', message:'Student removed.', tone:'neutral' }) }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="empty">
              <div className="emptyTitle">No results</div>
              <div className="emptySub">Try a different search or filter.</div>
            </div>
          )}
        </div>
      </Card>

      <Modal
        open={open}
        title={canEdit ? 'Student record' : 'Student details'}
        onClose={() => setOpen(false)}
        footer={
          <div className="modalBtns">
            <button className="btn ghost" onClick={() => setOpen(false)}>Close</button>
            {canEdit && <button className="btn primary" onClick={save}>Save</button>}
          </div>
        }
      >
        {draft && (
          <div className="formGrid">
            <Input label="Student ID" value={draft.studentId} disabled />
            <Input label="Name" value={draft.name} onChange={(e)=>setDraft({...draft, name:e.target.value})} disabled={!canEdit} />
            <div className="field">
              <label>Department</label>
              <select value={draft.department} onChange={(e)=>setDraft({...draft, department:e.target.value})} disabled={!canEdit}>
                <option>CSE</option><option>IT</option><option>ECE</option><option>EEE</option><option>ME</option><option>CE</option>
              </select>
            </div>
            <div className="field">
              <label>Year</label>
              <select value={draft.yearOfStudy} onChange={(e)=>setDraft({...draft, yearOfStudy:Number(e.target.value)})} disabled={!canEdit}>
                <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
              </select>
            </div>
            <Input label="Overall (%)" type="number" min="0" max="100" value={draft.overall} onChange={(e)=>setDraft({...draft, overall:e.target.value})} disabled={!canEdit} />
            <Input label="Attendance (%)" type="number" min="0" max="100" value={draft.attendance} onChange={(e)=>setDraft({...draft, attendance:e.target.value})} disabled={!canEdit} />
            <div className="field full">
              <label>Notes</label>
              <textarea value={draft.notes} onChange={(e)=>setDraft({...draft, notes:e.target.value})} disabled={!canEdit} rows={3} placeholder="Short note..." />
            </div>

            <div className="field full">
              <label>Subject scores</label>
              <div className="scoreGrid">
                {Object.entries(draft.scores).map(([k,v]) => (
                  <div key={k} className="scoreItem">
                    <div className="muted">{k}</div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={v}
                      disabled={!canEdit}
                      onChange={(e) => setDraft({ ...draft, scores: { ...draft.scores, [k]: Number(e.target.value) } })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="field full">
              <div className="inlineBadges">
                <span className="tag">Grade: {draft.grade}</span>
                <span className={`badge ${draft.risk.toLowerCase()}`}>Risk: {draft.risk}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
