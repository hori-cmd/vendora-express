import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Bell, ChevronDown, Clock3, Heart, Lightbulb, Search, ShieldCheck, ShoppingCart, Sparkles, Star, Store, Zap } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import '../../styles/buyer-home.css'

// Shared storage contract: sellers write catalogue records here and buyers read them.
const PRODUCTS_STORAGE_KEY = 'vendora-express.products'

const categories = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Computers', 'Accessories', 'Mobile']

function BuyerHome({ onNavigate }) {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')

  // Keep the storefront synced when a seller creates a product in another open view.
  useEffect(() => {
    const readProducts = () => {
      try {
        const stored = window.localStorage.getItem(PRODUCTS_STORAGE_KEY)
        setProducts(stored ? JSON.parse(stored) : [])
      } catch {
        setProducts([])
      }
    }
    readProducts()
    window.addEventListener('storage', readProducts)
    return () => window.removeEventListener('storage', readProducts)
  }, [])

  const visibleProducts = useMemo(() => products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [products, query])
  const featuredProducts = visibleProducts.slice(0, 4)
  const sellerNames = [...new Set(products.map((product) => product.seller).filter(Boolean))].slice(0, 5)

  const signOut = () => {
    logout()
    onNavigate('/')
  }

  // Product cards intentionally render seller-provided data only; no demo products are injected.
  const ProductCard = ({ product, compact = false }) => (
    <article className={`buyer-product-card ${compact ? 'is-compact' : ''}`}>
      <div className="buyer-product-image">{product.imageData ? <img src={product.imageData} alt="" /> : <Store size={32} aria-hidden="true" />}<span>{product.status || 'Active'}</span></div>
      <div className="buyer-product-info"><small><Store size={12} aria-hidden="true" /> {product.seller || 'Verified seller'}</small><h3>{product.name}</h3><div className="buyer-product-meta"><span><Star size={13} fill="currentColor" aria-hidden="true" /> —</span><strong>${Number(product.price || 0).toFixed(2)}</strong></div></div>
    </article>
  )

  return <main className="buyer-storefront">
    <div className="buyer-top-strip"><span><ShieldCheck size={14} aria-hidden="true" /> Buyer Protection on all orders</span><div><button type="button">Help Center</button><button type="button">Track Order</button><button type="button" onClick={() => onNavigate('/shop')}>{user.name}</button></div></div>
    <header className="buyer-header"><button type="button" className="buyer-brand" onClick={() => onNavigate('/shop')}><b>V</b><strong>Vendora<span>Express</span></strong></button><label className="buyer-search"><Search size={18} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for products, brands, sellers..." /><button type="button">Search</button></label><nav className="buyer-header-actions"><button type="button" aria-label="Wishlist"><Heart size={20} /></button><button type="button" aria-label="Notifications"><Bell size={20} /><i>3</i></button><button type="button" aria-label="Cart"><ShoppingCart size={20} /><i>0</i></button><button type="button" className="buyer-user" onClick={signOut}>{user.name.slice(0, 2).toUpperCase()} <ChevronDown size={14} /></button></nav></header>
    <nav className="buyer-category-nav"><button type="button">All Categories <ChevronDown size={13} /></button>{categories.map((category) => <button type="button" key={category}>{category}</button>)}<button type="button" className="buyer-flash-link"><Zap size={14} fill="currentColor" /> Flash Deals</button></nav>

    <section className="buyer-hero"><div className="buyer-hero-copy"><span className="buyer-protection-pill"><ShieldCheck size={14} /> Buyer Protection on All Orders</span><h1>Shop Millions of<br />Products from <em>Verified<br />Sellers</em></h1><p>Discover amazing deals from independent sellers worldwide. Safe, secure, and fast.</p><div className="buyer-hero-actions"><button type="button" className="buyer-primary">Shop Now <ArrowRight size={17} /></button><button type="button" className="buyer-secondary">Sell on Vendora</button></div><div className="buyer-stats"><span><b>1M+</b>Products</span><span><b>50K+</b>Sellers</span><span><b>5M+</b>Buyers</span></div></div><div className="buyer-feature-grid">{featuredProducts.length ? featuredProducts.map((product) => <ProductCard key={product.id} product={product} compact />) : <div className="buyer-empty-feature"><Sparkles size={24} /><strong>Seller products will appear here</strong><span>Explore the marketplace once sellers publish their catalogue.</span></div>}</div></section>

    <section className="buyer-benefits"><span><ShieldCheck size={18} />Buyer Protection</span><span><Zap size={18} />Fast Delivery</span><span><Star size={18} />Verified Sellers</span><span><Clock3 size={18} />24/7 Support</span></section>
    <section className="buyer-light-section"><div className="buyer-section-heading"><h2>Shop by Category</h2><button type="button">View All <ArrowRight size={15} /></button></div><div className="buyer-category-grid">{categories.map((category) => <button type="button" key={category}><span><Lightbulb size={22} /></span>{category}</button>)}</div></section>
    <section className="buyer-dark-section"><div className="buyer-section-heading"><h2><Zap size={22} fill="currentColor" /> Flash Deals</h2><button type="button">See All <ArrowRight size={15} /></button></div><div className="buyer-product-grid">{featuredProducts.length ? featuredProducts.map((product) => <ProductCard key={product.id} product={product} compact />) : <div className="buyer-empty-wide">Flash deals will appear after sellers add products.</div>}</div></section>
    <section className="buyer-light-section buyer-trending"><div className="buyer-section-heading"><h2><ArrowRight size={22} /> Trending Now</h2><button type="button">View All <ArrowRight size={15} /></button></div><div className="buyer-product-grid">{visibleProducts.length ? visibleProducts.map((product) => <ProductCard key={product.id} product={product} />) : <div className="buyer-empty-wide">No seller products match your search yet.</div>}</div></section>
    <section className="buyer-sellers"><div className="buyer-section-heading"><h2>Top Verified Sellers</h2></div><div className="buyer-seller-grid">{sellerNames.length ? sellerNames.map((seller) => <article key={seller}><b>{seller.slice(0, 2).toUpperCase()}</b><strong>{seller}</strong><span><ShieldCheck size={13} /> Verified</span><small><Star size={12} fill="currentColor" /> —</small></article>) : <div className="buyer-empty-wide">Verified sellers will appear here once they publish products.</div>}</div></section>
    <section className="buyer-protection-panel"><div><h2><ShieldCheck size={25} /> Vendora Buyer Protection</h2><p>Shop with confidence. Every purchase on Vendora Express is protected by a clear, secure buying experience.</p><ul><li>Full Refund Guarantee</li><li>Secure Payments</li><li>Anti-Fraud Protection</li><li>24/7 Support</li></ul></div><div className="buyer-protection-stat"><strong>100%</strong><span>Orders Protected</span><small>Backed by Vendora Buyer Guarantee</small></div></section>
  </main>
}

export default BuyerHome
