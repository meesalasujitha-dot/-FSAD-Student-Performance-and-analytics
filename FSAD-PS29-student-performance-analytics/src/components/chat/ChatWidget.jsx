import React, { useMemo, useState } from 'react'
import { useApp } from '../../state/AppState.jsx'
import '../../styles/chat.css'

const canned = [
  { q: 'How can I improve my overall score?', a: 'Focus on weak subjects, attempt weekly practice tests, and revise notes daily.' },
  { q: 'What does “High Risk” mean?', a: 'It usually indicates low overall score or low attendance. Meet your mentor and follow a study plan.' },
  { q: 'How are recommendations generated?', a: 'Based on scores, attendance, and trends. It suggests the most helpful next actions.' },
]

export default function ChatWidget() {
  const { ui, toggleChat, toast } = useApp()
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I can help you understand reports, grades, and next steps.' },
  ])
  const [input, setInput] = useState('')

  const suggestions = useMemo(() => canned.slice(0, 3), [])

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages(m => [...m, { from: 'user', text }])
    setInput('')
    // simple response
    const found = canned.find(x => x.q.toLowerCase() === text.toLowerCase())
    const reply = found ? found.a : 'Thanks! Check the Insights tab for actionable recommendations. You can also export reports as CSV.'
    setTimeout(() => setMessages(m => [...m, { from: 'bot', text: reply }]), 250)
  }

  return (
    <>
      <button className="chatFab" onClick={toggleChat} aria-label="Open help chat">
        💬
        <span className="chatPulse" aria-hidden="true" />
      </button>

      {ui.chatOpen && (
        <div className="chatPanel" role="dialog" aria-label="Help chat">
          <div className="chatTop">
            <div>
              <div className="chatTitle">Assistant</div>
              <div className="chatSub">Quick help • Reports • Suggestions</div>
            </div>
            <div className="chatActions">
              <button className="btn mini ghost" onClick={() => {
                toast({ title: 'Tip', message: 'Use Reports → Export CSV to download.', tone: 'neutral' })
              }}>Tip</button>
              <button className="chatClose" onClick={toggleChat} aria-label="Close">✕</button>
            </div>
          </div>

          <div className="chatBody">
            {messages.map((m, i) => (
              <div key={i} className={`bubbleRow ${m.from}`}>
                <div className={`bubble ${m.from}`}>{m.text}</div>
              </div>
            ))}

            <div className="chips">
              {suggestions.map((s, i) => (
                <button key={i} className="chip" onClick={() => setInput(s.q)}>{s.q}</button>
              ))}
            </div>
          </div>

          <div className="chatInput">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => { if (e.key === 'Enter') send() }}
            />
            <button className="btn primary" onClick={send}>Send</button>
          </div>
        </div>
      )}
    </>
  )
}
