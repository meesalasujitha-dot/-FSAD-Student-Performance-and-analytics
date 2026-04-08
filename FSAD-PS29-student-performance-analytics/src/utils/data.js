const subjects = ['Math', 'Science', 'English', 'Social', 'Computer']
const grades = ['A+', 'A', 'B', 'C', 'D']

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)) }
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

export function seedStudents() {
  // deterministic-ish seed: based on current date; good enough for demo
  const base = [
    ['Aarav', 'CSE', 2],
    ['Ananya', 'ECE', 3],
    ['Ishaan', 'IT', 1],
    ['Diya', 'CSE', 4],
    ['Vihaan', 'EEE', 2],
    ['Meera', 'CSE', 3],
    ['Arjun', 'ME', 1],
    ['Sara', 'CE', 2],
    ['Riya', 'IT', 4],
    ['Kabir', 'ECE', 3],
    ['Nikhil', 'CSE', 2],
    ['Pooja', 'IT', 1],
  ]
  return base.map((b, idx) => {
    const scores = subjects.reduce((acc, s) => ({ ...acc, [s]: rnd(45, 100) }), {})
    const attendance = rnd(60, 100)
    const assignments = rnd(50, 100)
    const quizzes = rnd(40, 100)
    const mid = rnd(35, 100)
    const end = rnd(30, 100)
    const overall = Math.round((assignments*0.2 + quizzes*0.15 + mid*0.25 + end*0.4))
    const grade = overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B' : overall >= 60 ? 'C' : 'D'
    return {
      id: `STU-${String(idx+1).padStart(3,'0')}`,
      name: b[0],
      department: b[1],
      year: b[2],
      attendance,
      scores,
      overall,
      grade,
      risk: riskLabel(overall, attendance),
      notes: overall < 65 ? 'Needs support in core subjects.' : overall < 75 ? 'Stable, can improve with practice.' : 'Good progress. Keep consistency.',
      updatedAt: new Date(Date.now() - rnd(0, 18) * 24*3600*1000).toISOString(),
    }
  })
}

export function riskLabel(overall, attendance) {
  if (overall < 60 || attendance < 70) return 'High'
  if (overall < 75 || attendance < 80) return 'Medium'
  return 'Low'
}

export function computeStudentSummary(students) {
  const total = students.length
  const avgOverall = total ? Math.round(students.reduce((s,x)=>s+x.overall,0)/total) : 0
  const avgAttendance = total ? Math.round(students.reduce((s,x)=>s+x.attendance,0)/total) : 0
  const atRisk = students.filter(s => s.risk === 'High').length
  const improving = students.filter(s => s.overall >= 75 && s.attendance >= 80).length

  const byGrade = grades.reduce((acc,g)=>({ ...acc, [g]: students.filter(s=>s.grade===g).length }), {})
  const byDept = students.reduce((acc,s)=>({ ...acc, [s.department]: (acc[s.department]||0)+1 }), {})

  return { total, avgOverall, avgAttendance, atRisk, improving, byGrade, byDept }
}

export function generateReportRows(students) {
  return students.map(s => ({
    id: s.id,
    name: s.name,
    department: s.department,
    overall: s.overall,
    attendance: s.attendance,
    grade: s.grade,
    risk: s.risk,
    recommendation: recommendationFor(s),
  }))
}

export function recommendationFor(s) {
  const weak = Object.entries(s.scores).sort((a,b)=>a[1]-b[1]).slice(0,2).map(([k])=>k)
  if (s.risk === 'High') return `Schedule weekly mentoring, focus on ${weak.join(' & ')}, improve attendance.`
  if (s.risk === 'Medium') return `Practice ${weak[0]} daily, solve past papers, and maintain attendance.`
  return `Keep momentum, attempt advanced tasks in ${weak[0]} to reach next level.`
}

export function exportCSV(filename, rows) {
  const cols = Object.keys(rows[0] || {})
  const csv = [
    cols.join(','),
    ...rows.map(r => cols.map(c => `"${String(r[c] ?? '').replaceAll('"','""')}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'2-digit' })
  } catch {
    return ''
  }
}

export function scoreToBand(score) {
  const s = clamp(score, 0, 100)
  if (s >= 85) return 'Excellent'
  if (s >= 70) return 'Good'
  if (s >= 55) return 'Average'
  return 'Needs Help'
}
