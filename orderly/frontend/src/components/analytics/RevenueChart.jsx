import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function RevenueChart({ orders = [] }) {
  const daily = {}
  orders.forEach(o => {
    const day = new Date(o.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    daily[day] = (daily[day] || 0) + (o.total_price || 0)
  })
  const data = Object.entries(daily).map(([date, revenue]) => ({ date, revenue }))

  if (!data.length) return null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '20px 24px',
    }}>
      <p style={{ fontFamily: 'Playfair Display', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
        Revenue Trend
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
            itemStyle={{ color: 'var(--accent)' }}
            formatter={(v) => [`₹${v.toFixed(2)}`, 'Revenue']}
          />
          <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}