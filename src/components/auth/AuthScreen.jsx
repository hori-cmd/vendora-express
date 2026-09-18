import { useEffect, useRef, useState } from 'react'
import AuthSidebar from './AuthSidebar'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

function AuthScreen({ mode, onModeChange, onBackHome, onAuthenticated }) {
  const [displayMode, setDisplayMode] = useState(mode)
  const transitionTimer = useRef(null)

  useEffect(() => {
    if (mode === displayMode) return undefined

    transitionTimer.current = window.setTimeout(() => {
      setDisplayMode(mode)
    }, 180)

    return () => window.clearTimeout(transitionTimer.current)
  }, [displayMode, mode])

  useEffect(() => () => window.clearTimeout(transitionTimer.current), [])

  const renderedIsLogin = displayMode === 'login'
  const transitionPhase = mode === displayMode ? 'intro' : 'outro'

  return (
    <main className={`auth-page auth-phase-${transitionPhase}`}>
      <div className="auth-shell">
        <AuthSidebar />
        <div className={`auth-panel ${renderedIsLogin ? 'auth-panel-login' : 'auth-panel-register'}`}>
          {renderedIsLogin ? (
            <LoginForm
              onSwitchToRegister={() => onModeChange('register')}
              onBackHome={onBackHome}
              onAuthenticated={onAuthenticated}
            />
          ) : (
            <RegisterForm
              onSwitchToLogin={() => onModeChange('login')}
              onBackHome={onBackHome}
              onAuthenticated={onAuthenticated}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default AuthScreen
