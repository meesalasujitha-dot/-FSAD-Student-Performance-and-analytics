import React, { useState, useEffect } from 'react'
import { useApp } from '../state/AppState.jsx'
import Card from '../components/ui/Card.jsx'
import '../styles/pages.css'

export default function Settings() {
  const { session, toggleChat, updateProfile } = useApp()
  const [draftName, setDraftName] = useState(session.user?.name || '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setDraftName(session.user?.name || '')
  }, [session.user?.name])

  const onSaveProfile = async () => {
    setIsSaving(true);
    await updateProfile(draftName);
    setIsSaving(false);
  }

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="pageTitle">Settings</div>
          <div className="pageSub">Manage your personal profile and preferences.</div>
        </div>
      </div>

      <div className="grid two">
        <Card title="Profile Details" subtitle="Update your personal details below">
          <div className="formGrid">
            <div className="field full">
              <label>Name</label>
              <input type="text" value={draftName} onChange={e => setDraftName(e.target.value)} placeholder="Your Name" />
            </div>
            <div className="field full">
              <label>Role / Access Level</label>
              <div className="kv" style={{marginTop: '0.5rem'}}>
                <div className="v">{session.role === 'admin' ? 'Admin / Teacher (All Privileges)' : 'Student (Read Only)'}</div>
              </div>
            </div>
            <div className="field full">
              <label>Connected Context</label>
              <div className="kv" style={{marginTop: '0.5rem'}}>
                <div className="v">Using MySQL Server</div>
              </div>
            </div>
          </div>

          <div className="btnRow" style={{marginTop: '1.5rem'}}>
            <button className="btn primary" onClick={onSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
            <button className="btn ghost" onClick={toggleChat}>Chat with Support</button>
          </div>
        </Card>

        <Card title="PerformancePulse Info" subtitle="Project Details">
          <div className="p">
            A web application that analyzes student performance to generate reports and insights.
            It helps educators track progress, identify areas for improvement, and provide
            actionable recommendations to enhance learning outcomes.
          </div>

          <div className="callouts">
            <div className="callout">
              <div className="callTitle">Admin Module</div>
              <div className="callText">Complete access to manage student registries, grades, and insights globally.</div>
            </div>
            <div className="callout">
              <div className="callTitle">Student Hub</div>
              <div className="callText">Protected view providing individualized metrics and study strategies organically.</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
