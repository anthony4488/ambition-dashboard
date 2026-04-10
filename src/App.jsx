import React, { useState } from 'react'
import { TabBar } from './components'
import { StoreProvider } from './useStore'
import Timetable from './Timetable'
import F2FCalc from './F2FCalc'
import OnlineCalc from './OnlineCalc'
import Attendance from './Attendance'

const tabs = [
  { id: 'timetable', label: 'Timetable' },
  { id: 'f2f', label: 'F2F calculator' },
  { id: 'online', label: 'Online calculator' },
  { id: 'attendance', label: 'Attendance tracker' },
]

export default function App() {
  const [active, setActive] = useState('timetable')

  return (
    <StoreProvider>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '24px 20px 60px',
        minHeight: '100vh',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 28,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--accent)', display: 'grid', placeContent: 'center',
            fontSize: 16, fontWeight: 800, color: 'var(--bg-primary)',
          }}>A</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>
              Ambition SP
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Business dashboard
            </div>
          </div>
        </div>

        <TabBar tabs={tabs} active={active} onChange={setActive} />

        <div style={{ animation: 'fadeUp 0.25s ease both' }} key={active}>
          {active === 'timetable' && <Timetable />}
          {active === 'f2f' && <F2FCalc />}
          {active === 'online' && <OnlineCalc />}
          {active === 'attendance' && <Attendance />}
        </div>
      </div>
    </StoreProvider>
  )
}
