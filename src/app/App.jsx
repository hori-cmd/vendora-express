import { useEffect, useState } from 'react'
import AuthScreen from '../components/auth/AuthScreen'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import BuyerHome from '../components/buyer/BuyerHome'
import HeroSection from '../components/hero/HeroSection'
import Footer from '../components/Footer'
import { useAuth } from '../hooks/useAuth'
import { featureItems, footerColumns } from '../data/siteContent'
import { dashboardPathFor, isRole } from '../lib/roles'
import '../styles/app.css'

function App() {
  const { isAuthenticated, user } = useAuth()
  const [path, setPath] = useState(() => window.location.pathname)
  const [authMode, setAuthMode] = useState('login')

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (nextPath) => {
    if (nextPath !== window.location.pathname) window.history.pushState({}, '', nextPath)
    setPath(nextPath)
  }

  const openLogin = (mode = 'login') => {
    setAuthMode(mode)
    navigate('/login')
  }

  const goHome = () => navigate('/')
  // Buyers use the storefront until a dedicated buyer dashboard is introduced.
  const destinationFor = (role) => role === 'buyer' ? '/shop' : dashboardPathFor(role)
  const isDashboardPath = /^\/(admin|seller|staff|buyer)\/dashboard$/.test(path)
  const isBuyerStorePath = path === '/shop'

  useEffect(() => {
    if (isDashboardPath && isAuthenticated && path !== destinationFor(user.role)) {
      const destination = destinationFor(user.role)
      window.history.replaceState({}, '', destination)
    }
  }, [isDashboardPath, isAuthenticated, path, user])

  if (isDashboardPath) {
    if (!isAuthenticated || !isRole(user.role)) {
      return <AuthScreen mode="login" onModeChange={setAuthMode} onBackHome={goHome} onAuthenticated={(authenticatedUser) => navigate(destinationFor(authenticatedUser.role))} />
    }
    if (destinationFor(user.role) === '/shop') {
      return <BuyerHome onNavigate={navigate} />
    }
    if (path !== dashboardPathFor(user.role)) {
      return null
    }
    return <DashboardLayout onNavigate={navigate} />
  }

  if (isBuyerStorePath) {
    if (!isAuthenticated || user.role !== 'buyer') {
      return <AuthScreen mode="login" onModeChange={setAuthMode} onBackHome={goHome} onAuthenticated={(authenticatedUser) => navigate(destinationFor(authenticatedUser.role))} />
    }
    return <BuyerHome onNavigate={navigate} />
  }

  if (path === '/login' || path === '/register') {
    return (
      <AuthScreen
        mode={path === '/register' ? 'register' : authMode}
        onModeChange={(mode) => {
          setAuthMode(mode)
          navigate(mode === 'register' ? '/register' : '/login')
        }}
        onBackHome={goHome}
        onAuthenticated={(authenticatedUser) => navigate(destinationFor(authenticatedUser.role))}
      />
    )
  }

  return (
    <main className="landing-page">
      <div className="page-shell">
        <HeroSection featureItems={featureItems} onOpenLogin={openLogin} />
        <Footer footerColumns={footerColumns} />
      </div>
    </main>
  )
}

export default App
