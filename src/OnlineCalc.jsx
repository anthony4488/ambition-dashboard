import React, { useState } from 'react'
import { MetricCard, MetricGrid, Slider, SectionHeader, TierCard } from './components'

const fmt = n => '$' + Math.round(n).toLocaleString()

export default function OnlineCalc() {
  const [spend, setSpend] = useState(10000)
  const [cpl, setCpl] = useState(5.33)
  const [months, setMonths] = useState(6)
  const [t1, setT1] = useState(12)
  const [t2, setT2] = useState(15)
  const [t3, setT3] = useState(7)
  const [t4, setT4] = useState(5)

  const totalSpend = spend * months
  const totalLeads = Math.round(totalSpend / cpl)
  const nurtureBoost = 1 + Math.min(months - 1, 11) * 0.08

  const lmBuyers = Math.round(totalLeads * (t1 / 100))
  const lmRev = lmBuyers * 29
  const courseBuyers = Math.round(lmBuyers * (t2 / 100) * nurtureBoost)
  const courseRev = courseBuyers * 299
  const bundleBuyers = Math.round(courseBuyers * (t3 / 100))
  const bundleRev = bundleBuyers * 1999
  const coachBuyers = Math.round(bundleBuyers * (t4 / 100))
  const coachRev = coachBuyers * 3500

  const totalRev = lmRev + courseRev + bundleRev + coachRev
  const roas = totalSpend > 0 ? totalRev / totalSpend : 0
  const profit = totalRev - totalSpend

  const tiers = [
    { name: 'Tier 1 · $29 lead magnet', buyers: lmBuyers, rev: lmRev, cac: lmBuyers > 0 ? totalSpend / lmBuyers : 0 },
    { name: 'Tier 2 · $299 course', buyers: courseBuyers, rev: courseRev, cac: courseBuyers > 0 ? totalSpend / courseBuyers : 0, note: `nurture ${nurtureBoost.toFixed(2)}x` },
    { name: 'Tier 3 · $1,999 bundle', buyers: bundleBuyers, rev: bundleRev, cac: bundleBuyers > 0 ? totalSpend / bundleBuyers : 0 },
    { name: 'Tier 4 · $3,500 coaching', buyers: coachBuyers, rev: coachRev, cac: coachBuyers > 0 ? totalSpend / coachBuyers : 0 },
  ]

  return (
    <div>
      <MetricGrid>
        <MetricCard label={`Spend (${months}mo)`} value={fmt(totalSpend)} delay={0} />
        <MetricCard label="Leads" value={totalLeads.toLocaleString()} delay={50} />
        <MetricCard label="Revenue" value={fmt(totalRev)} color="var(--green)" delay={100} />
        <MetricCard label="ROAS" value={roas.toFixed(1) + 'x'} color={roas >= 1 ? 'var(--accent)' : 'var(--red)'} delay={150} />
        <MetricCard label="Profit" value={fmt(profit)} color={profit >= 0 ? 'var(--green)' : 'var(--red)'} delay={200} />
      </MetricGrid>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <SectionHeader>Ad spend & timeline</SectionHeader>
          <Slider label="Monthly ad spend" value={spend} onChange={setSpend} min={1000} max={50000} step={500} format={fmt} />
          <Slider label="Cost per lead" value={cpl} onChange={setCpl} min={2} max={15} step={0.5} format={v => '$' + v.toFixed(2)} />
          <Slider label="Months running" value={months} onChange={setMonths} min={1} max={24} step={1} format={v => v + ' mo'} />
        </div>
        <div>
          <SectionHeader>Conversion rates</SectionHeader>
          <Slider label="Lead → $29 magnet" value={t1} onChange={setT1} min={2} max={30} step={1} format={v => v + '%'} />
          <Slider label="Magnet → $299 course" value={t2} onChange={setT2} min={2} max={35} step={1} format={v => v + '%'} />
          <Slider label="Course → $1,999 bundle" value={t3} onChange={setT3} min={1} max={20} step={1} format={v => v + '%'} />
          <Slider label="Bundle → $3,500 coaching" value={t4} onChange={setT4} min={1} max={20} step={1} format={v => v + '%'} />
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionHeader>Revenue by tier</SectionHeader>
        {tiers.map(t => (
          <TierCard
            key={t.name}
            name={t.name}
            revenue={fmt(t.rev)}
            detail={`${t.buyers.toLocaleString()} buyers · CAC ${t.cac > 0 ? fmt(t.cac) : '—'}${t.note ? ' · ' + t.note : ''}`}
          />
        ))}
        <TierCard
          name="Email list asset"
          revenue={lmBuyers.toLocaleString() + ' subscribers'}
          detail="$0 cost per send · list compounds without additional ad spend"
          accent="var(--accent)"
        />
      </div>

      <div style={{
        marginTop: 16, background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '16px 20px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
          How to reach 10x ROAS
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {roas >= 10
            ? '🔥 You\'re at 10x+ ROAS. The funnel is printing.'
            : roas >= 5
            ? 'Getting close. Extend months or push course conversion higher to break 10x.'
            : roas >= 2
            ? 'Solid foundation. The list needs more time to compound — slide months to 12+ and increase Tier 2 conversion.'
            : 'Early stage. ROAS improves as the list compounds. Keep building — the back-end tiers make or break the model.'
          }
        </div>
      </div>
    </div>
  )
}
