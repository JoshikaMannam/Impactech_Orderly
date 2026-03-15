import React from 'react'
import Navbar from '../../components/common/Navbar'
import EditTodaysSpecials from '../../components/staff/EditTodaysSpecials'

export default function SpecialsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar title="Edit Today's Specials" backTo="/staff" />
      <div style={{ padding: '40px 48px' }}>
        <EditTodaysSpecials />
      </div>
    </div>
  )
}

