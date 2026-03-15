import React from 'react'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'

import { useCart } from '../../context/CartContext'
import BillSummary from './BillSummary'

export default function Cart() {
	const { cartItems, itemCount, updateQty, removeItem } = useCart()

	return (
		<section style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
				<ShoppingBag size={16} color="var(--accent)" />
				<h3 style={{ fontFamily: 'Playfair Display', fontSize: 16, fontWeight: 700 }}>Cart</h3>
				{itemCount > 0 && (
					<span className="badge badge-accent" style={{ marginLeft: 'auto' }}>
						{itemCount}
					</span>
				)}
			</div>

			{cartItems.length === 0 ? (
				<p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Your cart is empty.</p>
			) : (
				<>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
						{cartItems.map((item) => (
							<article
								key={item.id}
								style={{
									background: 'var(--bg-card)',
									border: '1px solid var(--border)',
									borderRadius: 10,
									padding: '10px 12px',
								}}
							>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
									<p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p>
									<button
										type="button"
										onClick={() => removeItem(item.id)}
										style={{ background: 'none', border: 'none', cursor: 'pointer' }}
									>
										<Trash2 size={13} color="var(--text-dim)" />
									</button>
								</div>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
										<button
											type="button"
											onClick={() => updateQty(item.id, item.qty - 1)}
											style={{
												width: 22,
												height: 22,
												borderRadius: 6,
												border: '1px solid var(--border)',
												background: 'var(--bg-card-hover)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												cursor: 'pointer',
											}}
										>
											<Minus size={12} />
										</button>
										<span style={{ fontSize: 13, minWidth: 14, textAlign: 'center' }}>{item.qty}</span>
										<button
											type="button"
											onClick={() => updateQty(item.id, item.qty + 1)}
											style={{
												width: 22,
												height: 22,
												borderRadius: 6,
												border: '1px solid var(--border)',
												background: 'var(--bg-card-hover)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												cursor: 'pointer',
											}}
										>
											<Plus size={12} />
										</button>
									</div>
									<span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>
										Rs {(Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)}
									</span>
								</div>
							</article>
						))}
					</div>
					<BillSummary />
				</>
			)}
		</section>
	)
}
