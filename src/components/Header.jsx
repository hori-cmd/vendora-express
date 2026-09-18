function Header({ navLinks }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Vendora Express</p>
        <a className="brand" href="#home">
          Trusted local commerce, built to move fast.
        </a>
      </div>

      <nav className="topbar-nav" aria-label="Primary">
        {navLinks.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`}>
            {link}
          </a>
        ))}
      </nav>

      <div className="topbar-actions">
        <a className="text-link" href="#dashboard">
          Admin View
        </a>
        <a className="button button-primary" href="#categories">
          Start Selling
        </a>
      </div>
    </header>
  )
}

export default Header
