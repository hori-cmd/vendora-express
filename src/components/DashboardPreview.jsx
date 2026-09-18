function DashboardPreview({ promoLines }) {
  return (
    <section className="frame-card auth-frame" aria-label="Login page preview">
      <div className="auth-side">
        <div className="auth-brand">
          <span className="mini-brand-mark"></span>
          <div>
            <strong>Vendora Express</strong>
            <p>Shop Smart.</p>
            <p>Shop with Confidence.</p>
          </div>
        </div>

        <div className="auth-illustration" aria-hidden="true">
          <span className="blob blob-left"></span>
          <span className="blob blob-right"></span>
          <div className="screen-card">
            <div className="screen-toolbar"></div>
            <div className="screen-body">
              <div className="screen-list"></div>
              <div className="screen-stats">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <div className="person person-left"></div>
          <div className="person person-right"></div>
        </div>
      </div>

      <div className="auth-panel">
        <h2>Welcome back</h2>
        <div className="form-stack">
          <label className="form-field">
            <span>Email</span>
            <input type="text" value="" readOnly />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input type="password" value="" readOnly />
          </label>
          <p className="helper-text">Forgot Password?</p>
          <button type="button" className="auth-action">
            Login
          </button>
          <button type="button" className="google-action">
            Sign in with Google
          </button>
          <p className="auth-note">{promoLines.join(' ')}</p>
        </div>
      </div>
    </section>
  )
}

export default DashboardPreview
