import React from 'react'

import { useCart } from '../../context/CartContext'

export default function BillSummary() {
	const { total } = useCart()
	const tax = total * 0.05
	const grandTotal = total + tax

	return (
		<section
			style={{
				marginTop: 14,
				background: 'var(--bg-card)',
				border: '1px solid var(--border)',
				borderRadius: 12,
				padding: 14,
			}}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
				<span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
				<span>Rs {total.toFixed(2)}</span>
			</div>
			<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 10 }}>
				<span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
				<span>Rs {tax.toFixed(2)}</span>
			</div>
			<div
				style={{
					borderTop: '1px solid var(--border)',
					paddingTop: 10,
					display: 'flex',
					justifyContent: 'space-between',
					fontWeight: 700,
					fontSize: 14,
				}}
			>
				<span>Total</span>
				<span style={{ color: 'var(--accent)' }}>Rs {grandTotal.toFixed(2)}</span>
			</div>
		</section>
	)
}
