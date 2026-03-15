import React from 'react'
import { UtensilsCrossed } from 'lucide-react'

export default function MenuButton({ onClick }) {
	return (
		<button
			type="button"
			onClick={onClick}
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				background: 'var(--bg-card)',
				border: '1px solid var(--border)',
				borderRadius: 12,
				padding: '14px 22px',
				cursor: 'pointer',
				color: 'var(--text-primary)',
			}}
		>
			<UtensilsCrossed size={18} color="var(--accent)" />
			<span style={{ fontFamily: 'Playfair Display', fontWeight: 700 }}>Menu</span>
		</button>
	)
}
