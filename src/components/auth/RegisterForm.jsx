import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { publicRegistrationRoles, roles } from '../../lib/roles'

function RegisterForm({ onSwitchToLogin, onBackHome, onAuthenticated }) {
  const { register } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', requestedRole: roles.buyer, termsAccepted: false })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.password !== form.confirmPassword) return setError('Passwords must match.')
    if (!form.termsAccepted) return setError('Please accept the terms before continuing.')
    setError('')
    setIsSubmitting(true)
    try {
      const registeredUser = await register(form)
      onAuthenticated(registeredUser)
    } catch {
      setError('We could not create your account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-card auth-register-card" aria-label="Register form">
      <div className="auth-card-header">
        <h1>Create your account</h1>
        <p>Create your account in Vendora Express.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <label className="auth-field">
            <span>Full name</span>
            <input type="text" placeholder="Your full name" value={form.fullName} onChange={update('fullName')} autoComplete="name" required />
          </label>
        </div>

        <label className="auth-field">
          <span>Email</span>
          <input type="email" placeholder="Enter your@email.com" value={form.email} onChange={update('email')} autoComplete="email" required />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input type="password" placeholder="At least 8 characters" value={form.password} onChange={update('password')} autoComplete="new-password" minLength="8" required />
        </label>

        <label className="auth-field">
          <span>Confirm Password</span>
          <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={update('confirmPassword')} autoComplete="new-password" required />
        </label>

        <fieldset className="role-selector"><legend>Account type</legend>{publicRegistrationRoles.map((role) => <label key={role.value} className={`role-option ${form.requestedRole === role.value ? 'is-selected' : ''}`}><input type="radio" name="accountType" value={role.value} checked={form.requestedRole === role.value} onChange={update('requestedRole')} /><span><strong>{role.label}</strong><small>{role.description}</small></span></label>)}<p>Staff and Admin accounts are created or invited by administrators.</p></fieldset>

        <label className="auth-checkbox auth-checkbox-inline">
          <input type="checkbox" checked={form.termsAccepted} onChange={update('termsAccepted')} required />
          <span>
            I Agree to the Terms &amp; Conditions{' '}
            <button type="button" className="auth-inline-link">
              Privacy preview
            </button>
          </span>
        </label>

        {form.requestedRole === roles.seller && <p className="auth-help">Seller applications are reviewed before selling is enabled.</p>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button type="submit" className="auth-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="auth-card-footer">
        <p>Already have an account?</p>
        <button type="button" className="auth-link-button" onClick={onSwitchToLogin}>
          Login here
        </button>
      </div>

      <button type="button" className="auth-home-link" onClick={onBackHome}>
        Back to home
      </button>
    </section>
  )
}

export default RegisterForm
