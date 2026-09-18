function MarketplaceSection() {
  return (
    <section className="frame-card auth-frame" aria-label="Signup page preview">
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
        <h2>Create your account</h2>
        <div className="name-row">
          <label className="form-field">
            <span>First name</span>
            <input type="text" value="" readOnly />
          </label>
          <label className="form-field">
            <span>Last name</span>
            <input type="text" value="" readOnly />
          </label>
        </div>
        <div className="form-stack">
          <label className="form-field">
            <span>Email</span>
            <input type="text" value="" readOnly />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input type="password" value="" readOnly />
          </label>
          <p className="helper-text">Confirm Password?</p>
          <label className="check-row">
            <input type="checkbox" checked readOnly />
            <span>I agree to the Terms &amp; Conditions</span>
          </label>
          <button type="button" className="auth-action">
            Signup
          </button>
        </div>
      </div>
    </section>
  )
}

export default MarketplaceSection
