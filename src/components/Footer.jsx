function Footer({ footerColumns }) {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-brand">
        <h2>
          Vendora
          <br />
          Express
        </h2>
        <p>Shop Small, Shop with confidence</p>
      </div>

      <div className="footer-columns">
        {footerColumns.map((column) => (
          <section key={column.title} className="footer-column">
            <h3>{column.title}</h3>
            {column.links.map((link) => (
              <a key={link} href="#footer">
                {link}
              </a>
            ))}
          </section>
        ))}
      </div>

      <div className="footer-divider"></div>
      <p className="footer-legal">© 2026 VENDORA EXPRESS. All rights reserved.</p>
    </footer>
  )
}

export default Footer
