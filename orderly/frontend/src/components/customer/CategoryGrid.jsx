import React from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
	'Breakfast',
	'Chaat',
	'Starters',
	'Veg Curry',
	'Non-Veg Curry',
	'Breads',
	'Rice',
	'Combos',
	'Pizza',
	'Burgers',
	'Sides',
	'Desserts',
	'Beverages',
]

export default function CategoryGrid() {
	const navigate = useNavigate()

	return (
		<section
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
				gap: 14,
			}}
		>
			{CATEGORIES.map((category, index) => (
				<button
					key={category}
					type="button"
					className="page-enter"
					onClick={() => navigate(`/customer/menu/${encodeURIComponent(category)}`)}
					style={{
						animationDelay: `${index * 0.04}s`,
						background: 'var(--bg-card)',
						border: '1px solid var(--border)',
						borderRadius: 12,
						padding: '14px 10px',
						textAlign: 'center',
						cursor: 'pointer',
						color: 'var(--text-primary)',
						fontSize: 13,
						fontWeight: 600,
						transition: 'all 0.2s ease',
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.borderColor = 'var(--accent-border)'
						e.currentTarget.style.transform = 'translateY(-2px)'
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.borderColor = 'var(--border)'
						e.currentTarget.style.transform = 'translateY(0px)'
					}}
				>
					{category}
				</button>
			))}
		</section>
	)
}
