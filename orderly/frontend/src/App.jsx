import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'
import { VoiceProvider } from './context/VoiceContext'

import LandingPage from './pages/LandingPage'
import CustomerHome from './pages/customer/CustomerHome'
import MenuPage from './pages/customer/MenuPage'
import CategoryItemsPage from './pages/customer/CategoryItemsPage'
import StaffDashboard from './pages/staff/StaffDashboard'
import ReceivedOrdersPage from './pages/staff/ReceivedOrdersPage'
import CancelledOrdersPage from './pages/staff/CancelledOrdersPage'
import CompletedOrdersPage from './pages/staff/CompletedOrdersPage'
import SpecialsPage from './pages/staff/SpecialsPage'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <OrderProvider>
          <VoiceProvider>
            <Routes>
              <Route path="/"                        element={<LandingPage />} />
              <Route path="/customer"                element={<CustomerHome />} />
              <Route path="/customer/menu"           element={<MenuPage />} />
              <Route path="/customer/menu/:category" element={<CategoryItemsPage />} />
              <Route path="/staff"                   element={<StaffDashboard />} />
              <Route path="/staff/orders/received"   element={<ReceivedOrdersPage />} />
              <Route path="/staff/orders/cancelled"  element={<CancelledOrdersPage />} />
              <Route path="/staff/orders/completed"  element={<CompletedOrdersPage />} />
              <Route path="/staff/specials"          element={<SpecialsPage />} />
              <Route path="*"                        element={<Navigate to="/" replace />} />
            </Routes>
          </VoiceProvider>
        </OrderProvider>
      </CartProvider>
    </BrowserRouter>
  )
}
