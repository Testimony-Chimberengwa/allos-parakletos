import { Outlet } from 'react-router-dom'
import Header from './Header'
import Navigation from './Navigation'

function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {children || <Outlet />}
      </main>
      <Navigation />
    </div>
  )
}

export default Layout
