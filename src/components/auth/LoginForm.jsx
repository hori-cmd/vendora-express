import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { roles } from '../../lib/roles'

function LoginForm({ onSwitchToRegister, onBackHome, onAuthenticated }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [demoRole, setDemoRole] = useState(roles.buyer)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const authenticatedUser = await login({ email, demoRole })
      onAuthenticated(authenticatedUser)
    } catch {
      setError('We could not sign you in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-card" aria-label="Login form">
      <div className="auth-card-header">
        <h1>Welcome back</h1>
        <p>Welcome to authentication.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>Email</span>
          <input type="email" placeholder="Email@gmail.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        </label>

        {import.meta.env.DEV && (
          <label className="auth-field demo-role-field">
            <span>Demo dashboard role</span>
            <select value={demoRole} onChange={(event) => setDemoRole(event.target.value)}>
              <option value={roles.buyer}>Buyer</option>
              <option value={roles.seller}>Seller</option>
              <option value={roles.staff}>Staff</option>
              <option value={roles.admin}>Admin</option>
            </select>
            <small>Development preview only. Production roles must come from the backend.</small>
          </label>
        )}

        <label className="auth-field">
          <span>Password</span>
          <input type="password" placeholder="Password" autoComplete="current-password" required />
        </label>

        <div className="auth-meta-row">
          <label className="auth-checkbox">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <button type="button" className="auth-link-button">
            Forget Password?
          </button>
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}
        <button type="submit" className="auth-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Login'}
        </button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* Backend integration note:
            Wire this button to your OAuth provider redirect or popup flow. */}
        <button type="button" className="auth-social">
          Continue with Google
        </button>
      </form>

      <div className="auth-card-footer">
        <p>Don’t have an account?</p>
        <button type="button" className="auth-link-button" onClick={onSwitchToRegister}>
          Create one here
        </button>
      </div>

      <button type="button" className="auth-home-link" onClick={onBackHome}>
        Back to home
      </button>
    </section>
  )
}

export default LoginForm
