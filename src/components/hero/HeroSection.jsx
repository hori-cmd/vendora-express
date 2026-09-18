import { ArrowRight, BadgeCheck, CreditCard, MapPin, Sparkles, Store } from 'lucide-react'

const featureIcons = {
  'Secure Payments': CreditCard,
  'Verified Sellers': BadgeCheck,
  'Local Discovery': MapPin,
  'Trusted Ratings': Sparkles,
}

function HeroSection({ featureItems, onOpenLogin }) {
  return (
    <>
      <header className="site-header">
        <div className="site-brand">
          <span className="brand-mark">V</span>
          <span>Vendora Express</span>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <h1>
            Shop Small
            <br />
            Shop with Confidence.
          </h1>
          <p>
            Discover products from emerging sellers through a platform designed
            for trustworthy transactions.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={onOpenLogin}>
              <span>Explore Products</span>
              <ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
            </button>
            <button type="button" className="secondary-button" onClick={() => onOpenLogin('register')}>
              <Store size={17} strokeWidth={2.2} aria-hidden="true" />
              <span>Start Selling</span>
            </button>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
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
      </section>

      <section className="features-section" id="features">
        <div className="feature-row">
          {featureItems.map((item) => (
            <article className="feature-card" key={item.title}>
              <span className="feature-icon" aria-hidden="true">
                {(() => {
                  const Icon = featureIcons[item.title] ?? Sparkles
                  return <Icon size={19} strokeWidth={2.2} />
                })()}
              </span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default HeroSection
