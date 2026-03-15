import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function PopularItemsChart({ orders = [] }) {
  const countMap = {}
  orders.forEach(o => {
    o.items?.forEach(item => {
      countMap[item.name] = (countMap[item.name] || 0) + item.qty
    })
  })
  const data = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }))

  if (!data.length) return null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '20px 24px',
    }}>
      <p style={{ fontFamily: 'Playfair Display', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
        Popular Items
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis type="number" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis dataKey="name" type="category" width={120} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
            itemStyle={{ color: 'var(--accent)' }}
          />
          <Bar dataKey="count" fill="#fbbf24" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}