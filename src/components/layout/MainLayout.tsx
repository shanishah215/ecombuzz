import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f1f3f6]">
        <Outlet />
      </main>
      {location.pathname !== '/login' && <Footer />}
    </div>
  )
}
