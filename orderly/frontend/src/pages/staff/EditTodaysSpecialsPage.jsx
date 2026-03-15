import React from 'react'

import Navbar from '../../components/common/Navbar'
import EditTodaysSpecials from '../../components/staff/EditTodaysSpecials'

export default function EditTodaysSpecialsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar title="Edit Today's Specials" backTo="/staff" />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 40px' }}>
        <EditTodaysSpecials />
      </main>
    </div>
  )
}
