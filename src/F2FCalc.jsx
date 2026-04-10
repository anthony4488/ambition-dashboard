import React, { useState } from 'react'
import { MetricCard, MetricGrid, Slider, SectionHeader, TierCard } from './components'

const fmt = n => '$' + Math.round(n).toLocaleString()

export default function F2FCalc() {
  const [spend, setSpend] = useState(10000)
  const [cpl, setCpl] = useState(5.33)
  const [cac, setCac] = useState(150)
  const [rate, setRate] = useState(100)
  const [ret, setRet] = useState(10)
  const [cap, setCap] = useState(80)

  const leads = Math.round(spend / cpl)
  const convRate = cpl / cac
  const clientsRaw = Math.round(leads * convRate)
  const clients = Math.min(clientsRaw, cap)
  const ltv = rate * ret
  const revenue = clients * ltv
  const roas = revenue / spend
  const profit = revenue - spend
  const capacityHit = clientsRaw > cap

  const scenarios = [5000, 10000, 20000, 40000]

  return (
    <div>
      <MetricGrid>
        <MetricCard label="Leads" value={leads.toLocaleString()} delay={0} />
        <MetricCard label="Clients" value={clients} delay={50} />
        <MetricCard label="Revenue" value={fmt(revenue)} color="var(--green)" delay={100} />
        <MetricCard label="ROAS" value={roas.toFixed(1) + 'x'} color="var(--accent)" delay={150} />
        <MetricCard label="Profit" value={fmt(profit)} color={profit >= 0 ? 'var(--green)' : 'var(--red)'} delay={200} />
      </MetricGrid>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <SectionHeader>Ad spend & acquisition</SectionHeader>
          <Slider label="Monthly ad spend" value={spend} onChange={setSpend} min={1000} max={50000} step={500} format={fmt} />
          <Slider label="Cost per lead" value={cpl} onChange={setCpl} min={2} max={15} step={0.5} format={v => '$' + v.toFixed(2)} />
          <Slider label="CAC" value={cac} onChange={setCac} min={50} max={400} step={10} format={fmt} />
        </div>
        <div>
          <SectionHeader>Revenue & capacity</SectionHeader>
          <Slider label="Weekly rate / client" value={rate} onChange={setRate} min={50} max={200} step={10} format={fmt} />
          <Slider label="Avg retention (weeks)" value={ret} onChange={setRet} min={4} max={52} step={1} format={v => v + ' wk'} />
          <Slider label="Max capacity" value={cap} onChange={setCap} min={20} max={300} step={5} format={v => v + ' clients'} />
        </div>
      </div>

      {capacityHit && (
        <div style={{
          background: 'var(--red-dim)', border: '1px solid var(--red)',
          borderRadius: 'var(--radius)', padding: '12px 16px', margin: '16px 0',
          fontSize: 13, color: 'var(--red)',
        }}>
          ⚠ Capacity capped — ad spend could acquire {clientsRaw} clients but max is {cap}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <SectionHeader>Scenario comparison</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {scenarios.map(s => {
            const sl = Math.round(s / cpl)
            const sc = Math.min(Math.round(sl * convRate), cap)
            const sr = sc * ltv
            const sroas = sr / s
            return (
              <div key={s} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '14px 16px',
                borderTop: s === spend ? '2px solid var(--accent)' : '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 10 }}>
                  {fmt(s)} spend
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{sl.toLocaleString()} leads → {sc} clients</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--green)', marginBottom: 2 }}>{fmt(sr)}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{sroas.toFixed(1)}x ROAS</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
