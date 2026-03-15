import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function OrdersChart({ orders = [] }) {
  const hourly = Array(24).fill(0).map((_, h) => ({
    hour: `${h}:00`,
    orders: orders.filter(o => new Date(o.created_at).getHours() === h).length,
  })).filter(d => d.orders > 0)

  if (!hourly.length) return null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '20px 24px',
      marginBottom: 24,
    }}>
      <p style={{ fontFamily: 'Playfair Display', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
        Orders by Hour
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={hourly}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="hour" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
            labelStyle={{ color: 'var(--text-muted)', fontSize: 12 }}
            itemStyle={{ color: 'var(--accent)' }}
          />
          <Bar dataKey="orders" fill="var(--accent)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}