function AuthSidebar() {
  return (
    <aside className="auth-sidebar" aria-label="Vendora Express brand panel">
      <div className="auth-sidebar-brand">
        <span className="auth-sidebar-mark">V</span>
        <span>Vendora Express</span>
      </div>

      <div className="auth-sidebar-copy">
        <h2>
          Shop Small,
          <br />
          Shop with Confidence.
        </h2>
        <p>
          Discover products from emerging sellers through a platform designed
          for trustworthy transactions.
        </p>
      </div>

      <div className="auth-sidebar-visual" aria-hidden="true">
        <span className="visual-dot visual-dot-green"></span>
        <span className="visual-dot visual-dot-amber"></span>
        <span className="visual-dot visual-dot-teal"></span>
        <span className="visual-circle"></span>
        <div className="visual-screen">
          <div className="screen-top"></div>
          <div className="screen-grid">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="screen-awning">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="bag bag-top"></div>
        <div className="bag bag-bottom"></div>
        <div className="character character-left"></div>
        <div className="character character-right"></div>
      </div>
    </aside>
  )
}

export default AuthSidebar
