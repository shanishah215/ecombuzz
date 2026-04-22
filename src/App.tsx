import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from '@/router'
import { useAuthInit } from '@/features/auth/hooks/useAuthInit'

function AppContent() {
  useAuthInit()
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1000,
          style: { fontSize: '14px' },
          success: { iconTheme: { primary: '#388e3c', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ff6161', secondary: '#fff' } },
        }}
      />
    </>
  )
}

export default function App() {
  return <AppContent />
}
