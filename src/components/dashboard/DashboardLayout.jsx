import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  Box,
  ChartColumn,
  CircleCheck,
  CircleHelp,
  Clock3,
  DollarSign,
  Eye,
  Flag,
  FileText,
  Inbox,
  KeyRound,
  LayoutGrid,
  LogOut,
  MessageSquare,
  MoreVertical,
  Package,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Store,
  Tag,
  Trash2,
  TrendingUp,
  Users,
  WalletCards,
} from 'lucide-react'
import { buyerOrders, buyerProducts, dashboardContent } from '../../data/dashboardContent'
import { useAuth } from '../../hooks/useAuth'
import { dashboardPathFor } from '../../lib/roles'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import '../../styles/seller-analytics.css'
import '../../styles/seller-orders.css'
import '../../styles/seller-wallet.css'
import '../../styles/staff-dashboard.css'
import '../../styles/staff-disputes.css'
import '../../styles/staff-support.css'
import '../../styles/admin-dashboard.css'

const navigationIcons = {
  Dashboard: LayoutGrid,
  Products: Package,
  'My Products': Package,
  Orders: Inbox,
  Customers: Users,
  Messages: MessageSquare,
  Reviews: Star,
  Analytics: ChartColumn,
  Promotions: Tag,
  Wallet: WalletCards,
  'My Store': Store,
  Verification: CircleCheck,
  Settings,
  Users,
  Staff: Users,
  Sellers: Package,
  Buyers: Users,
  Reports: ChartColumn,
  Payments: WalletCards,
  Disputes: AlertTriangle,
  'Audit Logs': FileText,
  Security: Shield,
  Support: MessageSquare,
  Notifications: Bell,
  Home: Store,
  Shop: Package,
  Categories: LayoutGrid,
  Cart: Inbox,
  'My Orders': Inbox,
  Wishlist: Star,
  Profile: Users,
  Inventory: Package,
  Sales: ChartColumn,
  Logout: LogOut,
}

const generateProductSku = () => `VE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
const PRODUCTS_STORAGE_KEY = 'vendora-express.products'

function DashboardLayout({ onNavigate }) {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [activePage, setActivePage] = useState(user.role === 'buyer' ? 'Home' : 'Dashboard')
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState(['candle'])
  const [query] = useState('')
  const [productQuery, setProductQuery] = useState('')
  const [productStatus, setProductStatus] = useState('All')
  const [orderStatus, setOrderStatus] = useState('All')
  const [userFilter, setUserFilter] = useState('All')
  const [selectedDispute, setSelectedDispute] = useState(null)
  const [productSku, setProductSku] = useState(() => generateProductSku())
  const [productImage, setProductImage] = useState(null)
  const [products, setProducts] = useState(() => {
    try {
      const stored = window.localStorage.getItem(PRODUCTS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  useEffect(() => () => { if (productImage?.url) URL.revokeObjectURL(productImage.url) }, [productImage])
  useEffect(() => { try { window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products)) } catch { /* Local prototype storage can be unavailable or full. */ } }, [products])
  // Keep the chart tooltip anchored to the cursor without re-rendering the whole dashboard on every move.
  useEffect(() => {
    if (user.role !== 'admin' || activePage !== 'Dashboard') return undefined
    const chartConfigs = [
      { selector: '.admin-chart-stage', valueLabel: 'Revenue', points: [['Jul', 42000], ['Aug', 58000], ['Sep', 51000], ['Oct', 67000], ['Nov', 89000], ['Dec', 95000]] },
      { selector: '.admin-orders-stage', valueLabel: 'Orders', points: [['Jul', 300], ['Aug', 420], ['Sep', 389], ['Oct', 500], ['Nov', 670], ['Dec', 720]] },
    ]
    const cleanups = chartConfigs.flatMap(({ selector, valueLabel, points }) => {
      const chart = document.querySelector(selector)
      const tooltip = chart?.querySelector('.admin-chart-tooltip')
      const tooltipMonth = tooltip?.querySelector('strong')
      const tooltipValue = tooltip?.querySelector('span')
      if (!chart || !tooltip || !tooltipMonth || !tooltipValue) return []
      const bars = [...chart.querySelectorAll('.admin-order-bar')]
      const updateTooltip = (event) => {
        const bounds = chart.getBoundingClientRect()
        const index = Math.max(0, Math.min(points.length - 1, Math.round(((event.clientX - bounds.left) / bounds.width) * (points.length - 1))))
        tooltipMonth.textContent = points[index][0]
        tooltipValue.textContent = `${valueLabel} : ${valueLabel === 'Revenue' ? '$' : ''}${points[index][1].toLocaleString()}`
        bars.forEach((bar, barIndex) => bar.classList.toggle('is-active', barIndex === index))
        const pointerX = event.clientX - bounds.left
        const pointerY = event.clientY - bounds.top
        const tooltipX = Math.max(12, Math.min(bounds.width - tooltip.offsetWidth - 12, pointerX + 16))
        const tooltipY = Math.max(12, Math.min(bounds.height - tooltip.offsetHeight - 12, pointerY - tooltip.offsetHeight - 14))
        tooltip.style.setProperty('--tooltip-x', `${tooltipX}px`)
        tooltip.style.setProperty('--tooltip-y', `${tooltipY}px`)
      }
      chart.addEventListener('mousemove', updateTooltip)
      return [() => chart.removeEventListener('mousemove', updateTooltip)]
    })
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [activePage, user.role])
  const [hoveredRevenue, setHoveredRevenue] = useState(null)
  const content = dashboardContent[user.role]
  const cartTotal = useMemo(() => cart.reduce((total, product) => total + product.price, 0), [cart])

  const navigate = (item) => {
    setIsMenuOpen(false)
    if (item === 'Logout') {
      logout()
      onNavigate('/')
      return
    }
    if (item === 'Home') onNavigate('/')
    else {
      if (item === 'Add Product') { setProductSku(generateProductSku()); setProductImage(null) }
      setActivePage(item)
    }
  }

  const addToCart = (product) => setCart((items) => (items.some((item) => item.id === product.id) ? items : [...items, product]))
  const toggleWishlist = (productId) => setWishlist((items) => items.includes(productId) ? items.filter((item) => item !== productId) : [...items, productId])
  const handleProductImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setProductImage({ url: URL.createObjectURL(file), dataUrl: reader.result, name: file.name })
    reader.readAsDataURL(file)
  }
  const filteredProducts = buyerProducts.filter((product) => `${product.name} ${product.category} ${product.seller}`.toLowerCase().includes(query.toLowerCase()))

  const buyerPage = () => {
    if (user.role !== 'buyer' || activePage === 'Home') return null
    if (activePage === 'Shop' || activePage === 'Categories') return <section className="buyer-page"><div className="buyer-page-heading"><div><p>{activePage === 'Shop' ? 'SHOP SMALL' : 'CATEGORIES'}</p><h1>{activePage === 'Shop' ? 'Discover local favourites' : 'Shop by category'}</h1></div><span>{activePage === 'Categories' ? 'Home & Living · Kitchen · Gifts · Stationery' : `${filteredProducts.length} considered picks`}</span></div><div className="product-grid">{filteredProducts.map((product) => <article key={product.id} className="product-card"><div className="product-image" style={{ background: product.color }}><button type="button" onClick={() => toggleWishlist(product.id)} aria-label={`Save ${product.name}`}>{wishlist.includes(product.id) ? '♥' : '♡'}</button></div><p>{product.category}</p><h2>{product.name}</h2><span>By {product.seller}</span><div><strong>${product.price}</strong><button type="button" onClick={() => addToCart(product)}>{cart.some((item) => item.id === product.id) ? 'In cart' : 'Add to cart'}</button></div></article>)}</div></section>
    if (activePage === 'Cart') return <section className="buyer-page"><div className="buyer-page-heading"><div><p>YOUR CART</p><h1>Ready when you are</h1></div><span>{cart.length} item{cart.length === 1 ? '' : 's'}</span></div>{cart.length === 0 ? <div className="empty-state"><h2>Your cart is empty</h2><p>Explore products from thoughtful local sellers.</p><button type="button" onClick={() => setActivePage('Shop')}>Browse products</button></div> : <div className="cart-layout"><div className="cart-list">{cart.map((product) => <article key={product.id} className="cart-item"><div style={{ background: product.color }}></div><span><strong>{product.name}</strong><small>{product.seller}</small></span><b>${product.price}</b><button type="button" onClick={() => setCart((items) => items.filter((item) => item.id !== product.id))}>Remove</button></article>)}</div><aside className="cart-summary"><p>ORDER SUMMARY</p><h2>${cartTotal.toFixed(2)}</h2><span>Taxes and delivery calculated at checkout.</span><button type="button">Proceed to checkout</button></aside></div>}</section>
    if (activePage === 'Wishlist') { const saved = buyerProducts.filter((product) => wishlist.includes(product.id)); return <section className="buyer-page"><div className="buyer-page-heading"><div><p>WISHLIST</p><h1>Saved for later</h1></div><span>{saved.length} saved item{saved.length === 1 ? '' : 's'}</span></div><div className="product-grid">{saved.map((product) => <article key={product.id} className="product-card"><div className="product-image" style={{ background: product.color }}></div><p>{product.category}</p><h2>{product.name}</h2><span>By {product.seller}</span><div><strong>${product.price}</strong><button type="button" onClick={() => addToCart(product)}>Add to cart</button></div></article>)}</div></section> }
    if (activePage === 'My Orders') return <section className="buyer-page"><div className="buyer-page-heading"><div><p>ORDERS</p><h1>Your order history</h1></div></div><div className="orders-table">{buyerOrders.map((order) => <article key={order.id}><span><strong>{order.id}</strong><small>{order.date}</small></span><span>{order.item}</span><span className="status-badge">{order.status}</span><strong>{order.total}</strong></article>)}</div></section>
    return <section className="buyer-page"><div className="buyer-page-heading"><div><p>ACCOUNT</p><h1>Your profile</h1></div></div><div className="profile-card"><div>{user.name.slice(0, 1).toUpperCase()}</div><span><strong>{user.name}</strong><small>{user.email}</small><small>Buyer account</small></span><button type="button">Edit profile</button></div></section>
  }

  const managementPage = () => {
    if (user.role === 'admin' && activePage === 'Users') return adminUsersPage()
    if (user.role === 'admin' && activePage === 'Staff') return adminStaffPage()
    if (user.role === 'admin' && activePage === 'Payments') return adminPaymentsPage()
    if (user.role === 'admin' && activePage === 'Audit Logs') return adminAuditLogsPage()
    if (user.role === 'admin' && activePage === 'Security') return adminSecurityPage()
    if (user.role === 'staff' || user.role === 'admin') {
      return <section className="dashboard-maintenance-page" aria-label={`${activePage} maintenance`}><div><h1>{activePage}</h1><p>This section is currently under maintenance.</p></div></section>
    }
    const maintenancePages = ['Settings', 'Verification', 'My Store', 'Promotions', 'Reviews', 'Messages', 'Customers']
    if (maintenancePages.includes(activePage)) {
      return <section className="dashboard-maintenance-page" aria-label={`${activePage} maintenance`}><div><h1>{activePage}</h1><p>This section is currently under maintenance.</p></div></section>
    }
    if (activePage === 'Add Product') {
      return <section className="create-product-page" aria-label="Create product"><div className="create-product-heading"><div><p>SELLER DASHBOARD</p><h1>Create product</h1><span>Add the details for a product you want to sell.</span></div><Button type="button" variant="ghost" onClick={() => setActivePage('Products')}>Back to products</Button></div><form className="create-product-form" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); setProducts((items) => [...items, { id: crypto.randomUUID(), name: data.get('name'), sku: data.get('sku'), category: data.get('category'), price: Number(data.get('price')), stock: Number(data.get('stock')), seller: user.name, status: 'Active', sales: 0, rating: '—', imageName: productImage?.name ?? '', imageData: productImage?.dataUrl ?? null }]); setProductImage(null); setActivePage('Products') }}><div className="create-product-main"><div className="create-product-card"><div className="create-product-card-heading"><div><h2>Product details</h2><span>Give shoppers the information they need.</span></div></div><div className="create-product-fields"><label><span>Product name</span><input name="name" required type="text" placeholder="e.g. Wireless headphones" /></label><label><span>SKU</span><input name="sku" readOnly value={productSku} /></label><label><span>Category</span><select name="category" required defaultValue=""><option value="" disabled>Select a category</option><option>Electronics</option><option>Home & Living</option><option>Fashion</option><option>Beauty</option><option>Accessories</option></select></label><label><span>Price</span><div className="create-product-input-prefix"><b>$</b><input name="price" required type="number" min="0" step="0.01" placeholder="0.00" /></div></label><label><span>Stock quantity</span><input name="stock" required type="number" min="0" placeholder="0" /></label><label className="create-product-description"><span>Description</span><textarea name="description" rows="5" placeholder="Describe what makes this product special..." /></label></div></div><aside className="create-product-card create-product-media"><div className="create-product-card-heading"><div><h2>Product image</h2><span>Upload a clear image for your listing.</span></div></div><label className={`create-product-upload ${productImage ? 'has-image' : ''}`}><input type="file" accept="image/*" onChange={handleProductImageChange} />{productImage ? <><img src={productImage.url} alt="Product preview" /><strong>{productImage.name}</strong><small>Choose another image</small></> : <><span className="create-product-upload-icon"><Plus size={20} aria-hidden="true" /></span><strong>Drop an image here</strong><small>or choose a file from your device</small></>}</label></aside></div><div className="create-product-actions"><Button type="button" variant="ghost" onClick={() => setActivePage('Products')}>Cancel</Button><Button type="submit" variant="brand" className="dashboard-primary"><Plus size={16} strokeWidth={2.2} aria-hidden="true" /> Create product</Button></div></form></section>
    }
    if (activePage === 'Products') {
      const statuses = ['All', 'Active', 'Draft', 'Out of Stock', 'Pending Approval', 'Rejected']
      return <section className="products-page" aria-label="Products"><div className="products-page-heading"><h1>Products</h1><Button type="button" variant="brand" className="dashboard-primary" onClick={() => { setProductSku(generateProductSku()); setProductImage(null); setActivePage('Add Product') }}><Plus size={16} strokeWidth={2.2} aria-hidden="true" /> Add Product</Button></div><div className="products-toolbar"><label className="products-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search products</span><input type="search" placeholder="Search products..." value={productQuery} onChange={(event) => setProductQuery(event.target.value)} /></label><div className="products-filters" role="group" aria-label="Filter products">{statuses.map((status) => <button type="button" className={productStatus === status ? 'is-active' : ''} key={status} onClick={() => setProductStatus(status)}>{status}</button>)}</div></div><div className="products-table-shell"><div className="products-table" role="table" aria-label="Product catalogue"><div className="products-table-row products-table-head" role="row">{['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Sales', 'Rating', 'Actions'].map((heading) => <span role="columnheader" key={heading}>{heading}</span>)}</div>{products.length === 0 ? <div className="products-empty" role="row"><strong>No products yet</strong><span>Add your first product to start building your catalogue.</span></div> : products.map((product) => <div className="products-table-row products-table-body-row" role="row" key={product.id}><strong>{product.name}</strong><span>{product.sku}</span><span className="products-table-category">{product.category}</span><strong>${product.price.toFixed(2)}</strong><span>{product.stock}</span><span className="products-table-status">{product.status}</span><span>{product.sales}</span><span>{product.rating}</span><div className="products-table-actions"><button type="button" aria-label={`Edit ${product.name}`} onClick={() => { setProductSku(product.sku); setProductImage(null); setActivePage('Add Product') }}><Pencil size={15} /></button><button type="button" aria-label={`Delete ${product.name}`} onClick={() => setProducts((items) => items.filter((item) => item.id !== product.id))}><Trash2 size={15} /></button><button type="button" aria-label={`More actions for ${product.name}`}><MoreVertical size={15} /></button></div></div>)}</div></div></section>
    }
    const isProductPage = ['Products', 'My Products', 'Add Product', 'Inventory'].includes(activePage)
    const isOrderPage = activePage === 'Orders'
    const rows = isOrderPage
      ? [['VE-1042', '3 items', 'Ready to process'], ['VE-1039', '1 item', 'In transit'], ['VE-1034', '2 items', 'Delivered']]
      : isProductPage
        ? [['Hand-woven market tote', 'Home & Living', 'In stock'], ['Citrus soy candle', 'Gifts', 'Low stock'], ['Stoneware breakfast set', 'Kitchen', 'In stock']]
        : [['Recent request', 'Updated today', 'Review needed'], ['Marketplace report', 'This week', 'Ready'], ['Account activity', 'Today', 'Complete']]
    const action = activePage === 'Add Product' ? 'Create product' : `Manage ${activePage.toLowerCase()}`
    return <section className="buyer-page management-page"><div className="buyer-page-heading"><div><p>{content.label}</p><h1>{activePage}</h1></div><Button variant="brand" className="dashboard-primary">{action}</Button></div><Card className="workspace-card"><CardContent className="workspace-content"><div className="card-heading"><div><p>CURRENT VIEW</p><h2>{isOrderPage ? 'Orders requiring action' : isProductPage ? 'Catalogue overview' : `${activePage} workspace`}</h2></div><Button variant="ghost" size="sm">Filter</Button></div><div className="orders-table">{rows.map(([primary, secondary, status]) => <article key={primary}><span><strong>{primary}</strong><small>{secondary}</small></span><span>Last updated today</span><span className="status-badge">{status}</span><strong>Open</strong></article>)}</div></CardContent></Card></section>
  }

  // Analytics is kept as its own seller view so its charts can later consume backend metrics.
  const sellerAnalyticsPage = () => {
    const categories = [...new Set(products.map((product) => product.category).filter(Boolean))]
    const totalProducts = products.length
    const topProducts = [...products].sort((a, b) => Number(b.sales || 0) - Number(a.sales || 0)).slice(0, 5)
    return <section className="seller-analytics-page" aria-label="Seller analytics">
      <section className="analytics-kpi-grid" aria-label="Analytics summary">
        {[['Total revenue', '$0', 'Awaiting sales data'], ['Orders', '0', 'Awaiting order data'], ['Customers', '0', 'Awaiting customer data'], ['Conversion', '—', 'Awaiting traffic data']].map(([label, value, detail]) => <article className="analytics-kpi-card" key={label}><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>)}
      </section>
      <section className="analytics-chart-grid">
        <Card className="analytics-panel"><CardContent className="analytics-panel-content"><div className="analytics-panel-heading"><h2>Revenue &amp; Orders</h2><span>Last 6 months</span></div><div className="analytics-bar-chart" aria-label="Revenue and orders data pending">{['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => <div key={month}><i style={{ height: '8%' }}></i><small>{month}</small></div>)}</div><p className="analytics-empty-note">Revenue and order data will appear here once connected.</p></CardContent></Card>
        <Card className="analytics-panel"><CardContent className="analytics-panel-content"><div className="analytics-panel-heading"><h2>Sales by Category</h2></div><div className="analytics-donut-wrap"><div className="analytics-donut"><span>0%</span></div><ul>{(categories.length ? categories.slice(0, 4) : ['Electronics', 'Computers', 'Accessories', 'Other']).map((category) => <li key={category}><i></i><span>{category}</span><b>—</b></li>)}</ul></div><p className="analytics-empty-note">Category sales will appear here once orders are connected.</p></CardContent></Card>
      </section>
      <Card className="analytics-panel analytics-performance"><CardContent className="analytics-panel-content"><div className="analytics-panel-heading"><h2>Top Products Performance</h2><span>{totalProducts} product{totalProducts === 1 ? '' : 's'}</span></div>{topProducts.length ? topProducts.map((product) => <div className="analytics-product-row" key={product.id}><strong>{product.name}</strong><div><i style={{ width: `${Math.min(100, Math.max(4, Number(product.sales || 0)))}%` }}></i></div><b>{product.sales || 0}</b><span>—</span></div>) : <p className="analytics-empty-note">Product performance will appear here after products receive sales.</p>}</CardContent></Card>
    </section>
  }

  // Orders layout is frontend-ready; backend order records can populate the table later.
  const sellerOrdersPage = () => {
    const filters = ['All', 'New', 'Processing', 'Ready to Ship', 'Shipped', 'Delivered', 'Cancelled', 'Returns']
    return <section className="seller-orders-page" aria-label="Seller orders">
      <div className="seller-orders-filters" role="group" aria-label="Order status filters">{filters.map((filter) => <button type="button" className={orderStatus === filter ? 'is-active' : ''} key={filter} onClick={() => setOrderStatus(filter)}>{filter}</button>)}</div>
      <div className="seller-orders-table-shell"><div className="seller-orders-table" role="table" aria-label="Orders table"><div className="seller-orders-row seller-orders-head" role="row">{['Order ID', 'Buyer', 'Product', 'Amount', 'Status', 'Date', 'Actions'].map((heading) => <span role="columnheader" key={heading}>{heading}</span>)}</div><div className="seller-orders-empty" role="row"><strong>No orders yet</strong><span>Orders will appear here when buyers purchase your products.</span></div></div></div>
    </section>
  }

  // Wallet is presentation-only for now; payout values will come from the finance service later.
  const sellerWalletPage = () => <section className="seller-wallet-page" aria-label="Wallet and payouts">
    <div className="wallet-balance-grid"><article className="wallet-balance-card wallet-balance-primary"><p>Available balance</p><strong>$0.00</strong><span>Ready for withdrawal</span><Button type="button" variant="brand">Withdraw</Button></article><article className="wallet-balance-card"><p>Pending balance</p><strong>$0.00</strong><span>Clears when payouts are connected</span></article><article className="wallet-balance-card"><p>Lifetime earnings</p><strong>$0.00</strong><span>Awaiting sales data</span></article></div>
    <Card className="wallet-history-panel"><CardContent className="wallet-history-content"><div className="wallet-panel-heading"><h2>Payout History</h2><Button type="button" variant="outline" size="sm">Export</Button></div><div className="wallet-history-table"><div className="wallet-history-head"><span>Date</span><span>Amount</span><span>Method</span><span>Reference</span><span>Status</span></div><div className="wallet-empty"><strong>No payouts yet</strong><span>Payout history will appear here once transactions are connected.</span></div></div></CardContent></Card>
  </section>

  // Staff overview keeps moderation work visible at a glance.
  const staffDashboardPage = () => {
    const disputes = [['Package not delivered', 'Sarah Chen vs GadgetHub · $499', 'Waiting for Seller'], ['Counterfeit product', 'Olivia Brown vs Style Avenue · $249.99', 'Escalated']]
    const sellers = [['HS', 'HomeSphere', 'Chicago, IL · Applied Sep 2023'], ['TN', 'TechNova Store', 'San Francisco, CA · Applied Jan 2022'], ['GH', 'GadgetHub', 'Austin, TX · Applied Mar 2021']]
    return <section className="staff-dashboard-content" aria-label="Staff dashboard overview"><div className="staff-dashboard-heading"><div><h1>Staff Dashboard</h1><span>Operational overview — Dec 15, 2024</span></div></div><div className="staff-kpi-grid">{[['Open disputes', '—', 'Awaiting data', 'neutral'], ['Pending verification', '—', 'Awaiting data', 'neutral'], ['Support tickets', '—', 'Awaiting data', 'neutral'], ['Products to review', '—', 'Awaiting data', 'neutral']].map(([label, value, detail, tone]) => <article className="staff-kpi-card" key={label}><p>{label}</p><strong>{value}</strong><span className={tone}>{detail}</span></article>)}</div><div className="staff-overview-grid"><Card className="staff-panel"><CardContent><div className="staff-panel-heading"><h2><AlertTriangle size={16} /> Urgent Disputes</h2><button type="button">View All</button></div><div className="staff-dispute-list">{disputes.map(([title, detail, status]) => <article key={title}><i><AlertTriangle size={15} /></i><div><strong>{title}</strong><span>{detail}</span><small>DIS-2024-{title.startsWith('Package') ? '444' : '443'}</small></div><b>{status}</b><button type="button">Investigate</button></article>)}</div></CardContent></Card><Card className="staff-panel"><CardContent><div className="staff-panel-heading"><h2><CircleCheck size={16} /> Seller Verification Queue</h2><button type="button">View All</button></div><div className="staff-seller-list">{sellers.map(([initials, name, detail]) => <article key={name}><b>{initials}</b><div><strong>{name}</strong><span>{detail}</span></div><button type="button" aria-label={`Approve ${name}`}><CircleCheck size={14} /></button><button type="button" aria-label={`Reject ${name}`}><AlertTriangle size={14} /></button><button type="button" aria-label={`View ${name}`}><Eye size={14} /></button></article>)}</div></CardContent></Card></div><Card className="staff-panel staff-reported-panel"><CardContent><div className="staff-panel-heading"><h2><Flag size={16} /> Reported Products</h2><button type="button">View Moderation Queue</button></div><div className="staff-report-table"><div className="staff-report-head"><span>Product</span><span>Seller</span><span>Report type</span><span>Reporter</span><span>Priority</span><span>Actions</span></div><div className="staff-report-empty">Reported products will appear here when moderation data is connected.</div></div></CardContent></Card></section>
  }

  // Disputes gets an interactive moderation layout while its backend workflow is prepared.
  const staffDisputesPage = () => {
    const disputes = [['DIS-2024-445', 'Item not as described', 'Marcus Johnson vs TechNova Store', 'Investigating', 'High', '2024-12-14'], ['DIS-2024-444', 'Package not delivered', 'Sarah Chen vs GadgetHub', 'Waiting for Seller', 'Critical', '2024-12-13'], ['DIS-2024-443', 'Counterfeit product', 'Olivia Brown vs Style Avenue', 'Escalated', 'Critical', '2024-12-12'], ['DIS-2024-442', 'Refund not processed', 'Noah Wilson vs Urban Finds', 'Open', 'Medium', '2024-12-11']]
    const active = selectedDispute ?? disputes[0]
    return <section className="staff-disputes-page" aria-label="Disputes"><div className="staff-disputes-heading"><h1>Disputes</h1><div><label><Search size={16} /><input placeholder="Search disputes..." /></label><button type="button"><SlidersHorizontal size={15} /> Filter</button></div></div><div className="staff-disputes-layout"><div className="staff-dispute-cards">{disputes.map((dispute) => <button type="button" className={`staff-dispute-card ${active[0] === dispute[0] ? 'is-selected' : ''}`} key={dispute[0]} onClick={() => setSelectedDispute(dispute)}><span>{dispute[0]}</span><b className={dispute[4].toLowerCase()}>{dispute[4]}</b><strong>{dispute[1]}</strong><small>{dispute[2]}</small><i>{dispute[3]}</i><em>{dispute[5]}</em></button>)}</div><div className="staff-dispute-detail"><div className="staff-dispute-detail-icon"><AlertTriangle size={25} /></div><h2>Select a dispute</h2><p>Click a dispute from the list to view details and<br />take action.</p></div></div></section>
  }

  // Support ticket queue is isolated so ticket data can be connected independently later.
  const staffSupportPage = () => {
    const tickets = [['TKT-2024-441', 'Em', 'Emily Davis', 'Order not received after 14 days', 'Open', 'High', 'Dec 14, 2024'], ['TKT-2024-440', 'No', 'Noah Wilson', 'Unable to process refund for returned item', 'Processing', 'Medium', 'Dec 13, 2024'], ['TKT-2024-439', 'Av', 'Ava Martinez', 'Payment declined but amount deducted', 'Escalated', 'Critical', 'Dec 12, 2024'], ['TKT-2024-438', 'Ma', 'Marcus Johnson', 'Wrong product received from seller', 'Open', 'High', 'Dec 12, 2024'], ['TKT-2024-437', 'Sa', 'Sarah Chen', 'Account verification email not received', 'Delivered', 'Low', 'Dec 11, 2024']]
    return <section className="staff-support-page" aria-label="Support tickets"><div className="staff-support-heading"><h1>Support Tickets</h1><div><label><Search size={16} /><input placeholder="Search tickets..." /></label><button type="button"><SlidersHorizontal size={15} /> Filter</button></div></div><div className="staff-support-table-shell"><div className="staff-support-table"><div className="staff-support-head"><span>Ticket ID</span><span>User</span><span>Issue</span><span>Status</span><span>Priority</span><span>Created</span></div>{tickets.map(([id, initials, name, issue, status, priority, created]) => <article key={id}><span>{id}</span><div className="staff-support-user"><b>{initials}</b><strong>{name}</strong></div><span>{issue}</span><em className={`ticket-status ${status.toLowerCase()}`}>{status}</em><em className={`ticket-priority ${priority.toLowerCase()}`}>{priority}</em><span>{created}</span></article>)}</div></div></section>
  }

  const adminUsersPage = () => {
    const users = [['MJ', 'Marcus Johnson', 'Buyer', 'marcus.j@email.com', 'Active', 'Mar 2023', '23'], ['SC', 'Sarah Chen', 'Buyer', 'sarah.c@email.com', 'Active', 'Jan 2024', '8'], ['AR', 'Alex Rivera', 'Buyer', 'alex.r@email.com', 'Active', 'Jun 2022', '45'], ['ED', 'Emily Davis', 'Buyer', 'emily.d@email.com', 'Active', 'Sep 2023', '12'], ['JK', 'James Kim', 'Buyer', 'james.k@email.com', 'Suspended', 'Feb 2024', '3'], ['TN', 'TechNova Store', 'Seller', 'contact@technovastore.com', 'Active', 'Jan 2022', '15,234'], ['GH', 'GadgetHub', 'Seller', 'contact@gadgethub.com', 'Active', 'Mar 2021', '9,234'], ['SA', 'Style Avenue', 'Seller', 'contact@styleavenue.com', 'Active', 'Jun 2020', '23,456'], ['HS', 'HomeSphere', 'Seller', 'contact@homesphere.com', 'Pending Verification', 'Sep 2023', '4,567']]
    const visibleUsers = users.filter(([, , role, , status]) => userFilter === 'All' || (userFilter === 'Buyers' && role === 'Buyer') || (userFilter === 'Sellers' && role === 'Seller') || (userFilter === 'Staff' && role === 'Staff') || userFilter === status)
    return <section className="admin-users-page" aria-label="User management"><div className="admin-users-heading"><h1>User Management</h1><Button type="button" variant="brand"><Plus size={16} /> Add Staff</Button></div><div className="admin-user-filters" role="group" aria-label="User role filter">{['All', 'Buyers', 'Sellers', 'Staff', 'Suspended', 'Pending Verification'].map((filter) => <button type="button" className={userFilter === filter ? 'is-active' : ''} onClick={() => setUserFilter(filter)} key={filter}>{filter}</button>)}</div><div className="admin-users-toolbar"><label><Search size={17} /><input type="search" placeholder="Search users by name, email..." /></label><Button type="button" variant="outline"><SlidersHorizontal size={16} /> Filter</Button><Button type="button" variant="outline"><FileText size={16} /> Export</Button></div><div className="admin-users-table-shell"><div className="admin-users-table" role="table" aria-label="User accounts"><div className="admin-users-table-head" role="row">{['User', 'Role', 'Email', 'Status', 'Joined', 'Orders/Sales'].map((heading) => <span role="columnheader" key={heading}>{heading}</span>)}</div>{visibleUsers.map(([initials, name, role, email, status, joined, orders]) => <article role="row" key={email}><div className="admin-user-name"><b>{initials}</b><strong>{name}</strong><CircleCheck size={14} aria-label="Verified" /></div><em className={`admin-user-role ${role.toLowerCase()}`}>{role}</em><span>{email}</span><em className={`admin-user-status ${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</em><span>{joined}</span><span>{orders}</span></article>)}</div></div></section>
  }

  const adminStaffPage = () => {
    const members = [['RF', 'Rachel Foster', 'rachel.f@vendora.com', 'Senior Moderator', 'Moderation', 'Active', 'Today, 9:15 AM', '234'], ['DP', 'Daniel Park', 'daniel.p@vendora.com', 'Support Agent', 'Customer Support', 'Active', 'Today, 8:45 AM', '189'], ['PS', 'Priya Sharma', 'priya.s@vendora.com', 'Seller Verification Specialist', 'Onboarding', 'Active', 'Yesterday', '156'], ['TB', 'Tom Bradley', 'tom.b@vendora.com', 'Dispute Resolver', 'Disputes', 'Inactive', '3 days ago', '423']]
    const permissions = [['View Orders', [true, true, false, true]], ['Manage Orders', [false, false, false, true]], ['View Sellers', [true, false, true, false]], ['Verify Sellers', [false, false, true, false]], ['Moderate Products', [true, false, false, false]], ['Manage Disputes', [false, false, false, true]], ['Manage Refunds', [false, true, false, true]], ['View Reports', [true, true, false, true]], ['Access Analytics', [true, false, false, false]]]
    return <section className="admin-staff-page" aria-label="Staff management"><div className="admin-staff-heading"><h1>Staff Management</h1><Button type="button" variant="brand"><Plus size={16} /> Add Staff Member</Button></div><div className="admin-staff-table-shell"><div className="admin-staff-table" role="table" aria-label="Staff members"><div className="admin-staff-table-head" role="row">{['Staff member', 'Role', 'Department', 'Status', 'Last login', 'Tickets', 'Actions'].map((heading) => <span role="columnheader" key={heading}>{heading}</span>)}</div>{members.map(([initials, name, email, role, department, status, lastLogin, tickets]) => <article role="row" key={email}><div className="admin-staff-name"><b>{initials}</b><span><strong>{name}</strong><small>{email}</small></span></div><span>{role}</span><em>{department}</em><i className={status.toLowerCase()}>{status}</i><span>{lastLogin}</span><strong>{tickets}</strong><div className="admin-staff-actions"><button type="button" aria-label={`View ${name}`}><Eye size={16} /></button><button type="button" aria-label={`Manage permissions for ${name}`}><KeyRound size={15} /></button><button type="button" aria-label={`Manage ${name}`}><Users size={16} /></button></div></article>)}</div></div><div className="admin-permissions-shell"><h2>Permissions Matrix</h2><div className="admin-permissions-table" role="table" aria-label="Staff permission matrix"><div role="row">{['Permission', 'Senior Moderator', 'Support Agent', 'Verification Specialist', 'Dispute Resolver'].map((heading) => <strong role="columnheader" key={heading}>{heading}</strong>)}</div>{permissions.map(([permission, access]) => <article role="row" key={permission}><span>{permission}</span>{access.map((allowed, index) => <span key={index}>{allowed ? <CircleCheck size={17} aria-label="Allowed" /> : <CircleHelp size={16} aria-label="Not allowed" />}</span>)}</article>)}</div></div></section>
  }

  const adminPaymentsPage = () => {
    const transactions = [['TXN-8821', 'Marcus Johnson', 'TechNova Store', 'VE-2024-8821', '$89.99', '$4.50', 'Credit Card', 'Delivered'], ['TXN-8820', 'Sarah Chen', 'GadgetHub', 'VE-2024-8820', '$499.00', '$24.95', 'Digital Wallet', 'Delivered'], ['TXN-8819', 'Alex Rivera', 'Style Avenue', 'VE-2024-8819', '$119.99', '$6.00', 'Credit Card', 'Delivered'], ['TXN-8818', 'Emily Davis', 'HomeSphere', 'VE-2024-8818', '$189.99', '$9.50', 'Bank Transfer', 'Delivered'], ['TXN-8817', 'James Kim', 'TechNova Store', 'VE-2024-8817', '$899.00', '$44.95', 'Credit Card', 'Delivered'], ['TXN-8816', 'Olivia Brown', 'Style Avenue', 'VE-2024-8816', '$249.99', '$12.50', 'Credit Card', 'Delivered'], ['TXN-8815', 'Noah Wilson', 'Urban Finds', 'VE-2024-8815', '$69.99', '$3.50', 'Digital Wallet', 'Delivered'], ['TXN-8814', 'Ava Martinez', 'GadgetHub', 'VE-2024-8814', '$499.00', '$24.95', '—', 'Pending Approval']]
    return <section className="admin-payments-page" aria-label="Payments and finance"><h1>Payments &amp; Finance</h1><div className="admin-payment-summary">{[['Total GMV', '$4.9M', '↑ 14% vs last month'], ['Platform Revenue', '$489.2k', '↑ 11% vs last month'], ['Seller Payouts', '$3.8M', '↑ 9% vs last month'], ['Total Refunds', '$89k', '89 refunds']].map(([label, value, detail]) => <article key={label}><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>)}</div><div className="admin-transactions-shell"><div className="admin-transactions-heading"><h2>Recent Transactions</h2><div><Button type="button" variant="outline" size="icon" aria-label="Filter transactions"><SlidersHorizontal size={16} /></Button><Button type="button" variant="outline"><FileText size={16} /> Export CSV</Button></div></div><div className="admin-transactions-table" role="table" aria-label="Recent transactions"><div className="admin-transactions-head" role="row">{['Transaction ID', 'Buyer', 'Seller', 'Order', 'Amount', 'Fee', 'Method', 'Status'].map((heading) => <span role="columnheader" key={heading}>{heading}</span>)}</div>{transactions.map(([id, buyer, seller, order, amount, fee, method, status]) => <article role="row" key={id}><span>{id}</span><strong>{buyer}</strong><strong>{seller}</strong><span>{order}</span><strong>{amount}</strong><b>{fee}</b><span>{method}</span><em className={status === 'Delivered' ? 'delivered' : 'pending'}>{status}</em></article>)}</div></div></section>
  }

  const adminAuditLogsPage = () => {
    const logs = [['2024-12-15 14:32:11', 'Ra', 'Rachel Foster', 'Staff', 'Approved seller verification', 'HomeSphere', 'Success'], ['2024-12-15 13:18:42', 'Ad', 'Admin', 'Admin', 'Suspended user account', 'James Kim (Buyer)', 'Success'], ['2024-12-15 12:55:07', 'Da', 'Daniel Park', 'Staff', 'Closed support ticket TKT-438', 'Marcus Johnson', 'Success'], ['2024-12-15 11:40:33', 'Ad', 'Admin', 'Admin', 'Updated platform fee settings', 'System Settings', 'Success'], ['2024-12-15 10:22:18', 'Ra', 'Rachel Foster', 'Staff', 'Removed reported product', 'Style Avenue · Product #6', 'Success'], ['2024-12-15 09:15:55', 'To', 'Tom Bradley', 'Staff', 'Escalated dispute to Admin', 'DIS-2024-443', 'Success'], ['2024-12-14 22:01:44', 'Un', 'Unknown', '—', 'Failed login attempt', 'Admin Console', 'Failed']]
    return <section className="admin-audit-page" aria-label="Audit logs"><div className="admin-audit-heading"><h1>Audit Logs</h1><div><Button type="button" variant="outline" size="icon" aria-label="Filter audit logs"><SlidersHorizontal size={16} /></Button><Button type="button" variant="outline"><FileText size={16} /> Export</Button></div></div><aside className="admin-audit-notice"><strong>Audit logs are retained for 90 days</strong><span>Export logs regularly for compliance and security purposes.</span></aside><div className="admin-audit-table-shell"><div className="admin-audit-table" role="table" aria-label="Audit log entries"><div className="admin-audit-head" role="row">{['Timestamp', 'User', 'Role', 'Action', 'Resource', 'Status'].map((heading) => <span role="columnheader" key={heading}>{heading}</span>)}</div>{logs.map(([timestamp, initials, name, role, action, resource, status]) => <article role="row" key={`${timestamp}-${name}`}><span>{timestamp}</span><div className="admin-audit-user"><b>{initials}</b><strong>{name}</strong></div><em className={role.toLowerCase()}>{role}</em><strong>{action}</strong><span>{resource}</span><i className={status.toLowerCase()}>{status}</i></article>)}</div></div></section>
  }

  const adminSecurityPage = () => {
    const alerts = [['Brute force attempt on Admin account', '2 hours ago', 'critical'], ['Unusual payment activity from seller GadgetHub', '4 hours ago', 'warning'], ['Multiple accounts created from same IP address', '1 day ago', 'warning'], ['SSL certificate renewed successfully', '2 days ago', 'info']]
    const sessions = [['Ad', 'Admin', 'San Francisco, CA · Chrome / macOS', '192.168.1.1', 'Active now'], ['Ra', 'Rachel Foster', 'New York, NY · Firefox / Windows', '10.0.0.23', '2 hours ago'], ['Da', 'Daniel Park', 'Austin, TX · Chrome / macOS', '10.0.0.45', '4 hours ago']]
    return <section className="admin-security-page" aria-label="Security center"><h1>Security Center</h1><div className="admin-security-notices"><article><strong>3 Suspicious Login Attempts</strong><span>Multiple failed logins detected from IP 192.168.1.xxx</span></article><article><strong>2FA Not Enabled</strong><span>4 staff accounts have not enabled two-factor authentication.</span></article></div><div className="admin-security-metrics">{[['Active Sessions', '234', Activity], ['Failed Logins', '17', Shield], ['Locked Accounts', '3', Users], ['2FA Enabled', '89%', KeyRound]].map(([label, value, Icon], index) => <article key={label}><span className="admin-security-icon"><Icon size={19} /></span><p>{label}</p><strong>{value}</strong>{index === 1 && <small>Last 24 hours</small>}</article>)}</div><div className="admin-security-grid"><div className="admin-security-panel"><h2><Shield size={18} /> Security Alerts</h2>{alerts.map(([title, time, tone]) => <article className={tone} key={title}><span><Shield size={16} /></span><div><strong>{title}</strong><small>{time}</small></div><Button type="button" variant="outline" size="sm">Review</Button></article>)}</div><div className="admin-security-panel"><h2>Active Admin Sessions</h2>{sessions.map(([initials, name, device, ip, time]) => <article className="admin-session" key={name}><b>{initials}</b><div><strong>{name}</strong><span>{device}</span><small>{ip}</small></div><aside><span>{time}</span><button type="button">Revoke</button></aside></article>)}</div></div></section>
  }

  // Admin overview surfaces platform-wide health and moderation signals.
  const adminDashboardPage = () => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const axisLabels = ['$100k', '$75k', '$50k', '$25k', '$0k']
    const metricCards = [['Total GMV', '$4.9M', '↑ 14% vs last month', TrendingUp], ['Platform Revenue', '$489.2k', '↑ 11% vs last month', DollarSign], ['Active Buyers', '34,521', '↑ 9% vs last month', Users], ['Active Sellers', '1,234', '↑ 7% vs last month', Store], ['Active Products', '89,423', '↑ 5% vs last month', Box], ['Total Orders', '23,456', '↑ 8% vs last month', Activity], ['Open Disputes', '34', 'Needs attention', AlertTriangle], ['Pending Verification', '23', 'Seller applications', Shield]]
    return <section className="admin-dashboard-content" aria-label="Admin dashboard"><div className="admin-dashboard-heading"><div><h1>Admin Dashboard</h1><span>Vendora Express · Platform Overview · Dec 15, 2024</span></div><div><Button type="button" variant="outline"><FileText size={15} /> Export Report</Button><Button type="button" variant="brand"><Activity size={15} /> System Status</Button></div></div><div className="admin-alert-grid"><article><strong>3 Critical Fraud Alerts</strong><span>Suspicious activity detected — immediate review required.</span></article><article><strong>23 Seller Verifications Pending</strong><span>New seller applications awaiting approval.</span></article></div><div className="admin-kpi-grid">{metricCards.map(([label,value,detail,Icon])=><article key={label}><span className="admin-kpi-icon"><Icon size={18} strokeWidth={1.8} /></span><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>)}</div><div className="admin-chart-grid"><Card className="admin-panel"><CardContent><div className="admin-panel-heading"><h2>GMV &amp; Revenue</h2><b>+14% vs last month</b></div><div className="admin-revenue-chart"><div className="admin-axis-y">{axisLabels.map((label) => <span key={label}>{label}</span>)}</div><div className="admin-chart-stage"><div className="admin-chart-gridlines"></div><svg viewBox="0 0 500 160" preserveAspectRatio="none" role="img" aria-label="GMV and revenue trend"><path d="M0 117 C70 80 100 100 150 96 S240 101 300 61 S390 20 500 16" /></svg><div className="admin-chart-tooltip"><strong>Sep</strong><span>Revenue : $51,000</span></div><div className="admin-axis-x">{months.map((month) => <span key={month}>{month}</span>)}</div></div></div></CardContent></Card><Card className="admin-panel"><CardContent><div className="admin-panel-heading"><h2>Orders Volume</h2><b>+8% vs last month</b></div><div className="admin-orders-chart"><div className="admin-axis-y">{['800','600','400','200','0'].map((label) => <span key={label}>{label}</span>)}</div><div className="admin-orders-stage"><div className="admin-chart-gridlines"></div><div className="admin-order-bars">{[37.5,52.5,48.625,62.5,83.75,90].map((height,index)=><i className="admin-order-bar" style={{height:`${height}%`}} key={months[index]}></i>)}</div><div className="admin-chart-tooltip"><strong>Sep</strong><span>Orders : 389</span></div><div className="admin-axis-x">{months.map((month) => <span key={month}>{month}</span>)}</div></div></div></CardContent></Card></div><div className="admin-lower-grid"><Card className="admin-panel"><CardContent><div className="admin-panel-heading"><h2>Recent Orders</h2><button type="button">View All</button></div><div className="admin-empty-data">Order data will appear here when connected.</div></CardContent></Card><Card className="admin-panel"><CardContent><div className="admin-panel-heading"><h2>Platform Health</h2></div>{['Buyer Satisfaction','Seller Performance','Dispute Resolution','On-time Delivery','Fraud Rate'].map((label,index)=><div className={`admin-health-row ${index===4?'risk':''}`} key={label}><span>{label}<b>{index===4?'2%':`${94-index*3}%`}</b></span><i><em style={{width:`${index===4?12:94-index*3}%`}}></em></i></div>)}</CardContent></Card></div></section>
  }

  const sellerDashboardPage = () => (
    (() => {
      const displayName = user.name || user.email?.split('@')[0] || 'seller'
      const revenuePoints = []
      const handleRevenueMove = (event) => {
        if (revenuePoints.length === 0) return
        const bounds = event.currentTarget.getBoundingClientRect()
        const x = ((event.clientX - bounds.left) / bounds.width) * 720
        const nearest = revenuePoints.reduce((best, point, index) => Math.abs(point.x - x) < Math.abs(revenuePoints[best].x - x) ? index : best, 0)
        setHoveredRevenue(nearest)
      }

      return <section className="seller-dashboard-content" aria-label="Seller dashboard overview">
      <div className="seller-dashboard-heading">
        <div><h1>Welcome back, {displayName}! <span className="seller-wave" aria-hidden="true">👋</span></h1><span>Here's what's happening with your store today.</span></div>
        <Button type="button" variant="brand" className="dashboard-primary"><Plus size={16} strokeWidth={2.2} aria-hidden="true" /> Add Product</Button>
      </div>

      <section className="seller-kpi-grid" aria-label="Seller summary">
        {[['Total revenue', '—', 'Awaiting data', DollarSign], ['Total orders', '—', 'Awaiting data', ShoppingBag], ['Products sold', '—', 'Awaiting data', Box], ['Avg order value', '—', 'Awaiting data', ArrowUpRight], ['Product views', '—', 'Awaiting data', Eye], ['Conversion rate', '—', 'Awaiting data', BarChart3]].map(([label, value, detail, Icon], index) => <article className={`seller-kpi-card seller-kpi-card-${index}`} key={label}><div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div><i><Icon size={19} /></i></article>)}
      </section>

      <Card className="seller-panel seller-revenue-panel"><CardContent><div className="seller-panel-heading"><h2>Revenue Overview</h2><select aria-label="Revenue period" defaultValue="6"><option value="6">Last 6 months</option></select></div><div className="seller-chart"><div className="seller-chart-y"><span>—</span><span>—</span><span>—</span><span>—</span><span>—</span></div><div className="seller-chart-plot" onMouseMove={handleRevenueMove} onMouseLeave={() => setHoveredRevenue(null)}><svg className={revenuePoints.length ? '' : 'is-empty'} viewBox="0 0 720 220" preserveAspectRatio="none" role="img" aria-label="Revenue data pending"><g className="seller-chart-grid"><path d="M0 20H720M0 62H720M0 104H720M0 146H720M0 188H720" /><path d="M0 20V188M144 20V188M288 20V188M432 20V188M576 20V188M720 20V188" /></g>{hoveredRevenue !== null && <line className="seller-chart-guide" x1={revenuePoints[hoveredRevenue].x} x2={revenuePoints[hoveredRevenue].x} y1="20" y2="188" />}<path className="seller-chart-line" d="M0 120 C48 108 96 92 144 96 S240 120 288 106 S384 84 432 74 S528 38 576 44 S672 28 720 36" /><g className="seller-chart-points">{revenuePoints.map((point) => <ellipse key={point.month} cx={point.x} cy={point.y} rx="3.2" ry="4.5" />)}</g></svg>{revenuePoints.length === 0 && <div className="seller-chart-empty">Revenue data will appear here once sales are connected.</div>}{hoveredRevenue !== null && <div className="seller-chart-tooltip" style={{ left: `${Math.min(92, Math.max(8, (revenuePoints[hoveredRevenue].x / 720) * 100))}%`, top: `${Math.max(5, (revenuePoints[hoveredRevenue].y / 220) * 100 - 16)}%` }}><strong>{revenuePoints[hoveredRevenue].month}</strong><span>Revenue : ${revenuePoints[hoveredRevenue].value.toLocaleString()}</span></div>}</div><div className="seller-chart-x"><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span></div></div></CardContent></Card>

      <section className="seller-overview-grid seller-lists-grid"><Card className="seller-panel"><CardContent><div className="seller-panel-heading"><h2>Recent Orders</h2><Button type="button" variant="ghost" size="sm">View All</Button></div><div className="seller-list-empty">Order data will appear here once connected.</div></CardContent></Card><Card className="seller-panel"><CardContent><div className="seller-panel-heading"><h2>Top Products</h2><Button type="button" variant="ghost" size="sm">View All</Button></div><div className="seller-list-empty">Product performance will appear here once connected.</div></CardContent></Card></section>

      <div className="seller-alert-grid"><article className="seller-alert seller-alert-stock"><AlertTriangle size={18} /><div><strong>Low Stock Alerts</strong><span>Alerts will appear when inventory data is connected.</span></div></article><article className="seller-alert seller-alert-payout"><CircleCheck size={18} /><div><strong>Payout Status</strong><span>Payout information will appear here once connected.</span></div></article><article className="seller-alert seller-alert-orders"><Clock3 size={18} /><div><strong>Order Status</strong><span>Order updates will appear here once connected.</span></div></article></div>
      </section>
    })()
  )

  // Keep the fixed header title in sync with the section currently selected in the sidebar.
  const topbarTitle = activePage === 'Add Product' ? 'Create Product' : activePage

  return (
    <main className="dashboard-page">
      <aside className={`dashboard-sidebar dashboard-sidebar-${user.role} ${isMenuOpen ? 'is-open' : ''}`}>
        <div className="dashboard-sidebar-top">
          <div className="dashboard-brand"><span>V</span><strong>Vendora<b>Express</b></strong></div>
          <div className="dashboard-role"><em>{user.role}</em><span>{content.label}</span></div>
        </div>
        <nav aria-label={`${content.label} navigation`}>
          {content.navigation.map((item) => {
            const Icon = navigationIcons[item] ?? CircleCheck
            return (
              <Button key={item} type="button" variant="ghost" className={`dashboard-nav-link ${item === activePage ? 'is-active' : ''} ${item === 'Logout' ? 'dashboard-logout' : ''}`} onClick={() => navigate(item)}>
                <Icon aria-hidden="true" size={16} strokeWidth={1.7} /><span>{item}</span>{item === activePage && <b aria-hidden="true">›</b>}
              </Button>
            )
          })}
        </nav>
        <div className={`dashboard-account-footer ${isAccountMenuOpen ? 'is-open' : ''}`}>
          <button type="button" className="dashboard-account" onClick={() => setIsAccountMenuOpen((open) => !open)} aria-expanded={isAccountMenuOpen} aria-label="Open account menu"><div className="dashboard-account-avatar">{user.name.slice(0, 2).toUpperCase()}</div><span><strong>{user.name}</strong><small>{user.email}</small></span><i aria-hidden="true">⌄</i></button>
          {isAccountMenuOpen && <div className="dashboard-account-menu"><Button type="button" variant="ghost" size="sm" onClick={() => navigate(user.role === 'seller' ? 'My Store' : 'Home')}><Store size={15} aria-hidden="true" />Storefront</Button><Button type="button" variant="ghost" size="sm" onClick={() => navigate('Logout')}><LogOut size={15} aria-hidden="true" />Sign Out</Button></div>}
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <h1 className="dashboard-topbar-title">{topbarTitle}</h1>
          <Button type="button" variant="navy" size="icon" className="dashboard-menu" onClick={() => setIsMenuOpen((open) => !open)} aria-expanded={isMenuOpen} aria-label="Toggle navigation">☰</Button>
          <Button type="button" variant="outline" size="icon" className="dashboard-notification" aria-label="Notifications"><Bell size={17} strokeWidth={1.8} /><b aria-hidden="true">5</b></Button>
          <Button type="button" variant="outline" size="icon" className="dashboard-help" aria-label="Help"><CircleHelp size={17} strokeWidth={1.8} /></Button>
          <Button type="button" variant="outline" size="icon" className="dashboard-profile" onClick={() => onNavigate(dashboardPathFor(user.role))}>{user.name.slice(0, 2).toUpperCase()}</Button>
        </header>

        {activePage === 'Home' || activePage === 'Dashboard' ? user.role === 'seller' ? sellerDashboardPage() : user.role === 'staff' ? staffDashboardPage() : user.role === 'admin' ? adminDashboardPage() : <><div className="dashboard-intro">
          <div><p>{content.label}</p><h1>{content.title}</h1><span>{content.description}</span></div>
          <Button type="button" variant="brand" className="dashboard-primary">{user.role === 'buyer' ? 'Browse the shop' : 'View all activity'}</Button>
        </div>

        {user.sellerApplicationStatus === 'pending' && <p className="seller-pending" role="status">Your seller application is pending review. You can shop while our team verifies your details.</p>}

        <section className="metric-grid" aria-label="Dashboard summary">
          {content.metrics.map(([label, value, detail]) => <Card key={label} className="metric-card"><CardContent><p>{label}</p><strong>{value}</strong><span>{detail}</span></CardContent></Card>)}
        </section>

        <section className="dashboard-grid">
          <Card className="dashboard-card activity-card"><CardContent><div className="card-heading"><div><p>UPDATES</p><h2>Recent activity</h2></div><Button type="button" variant="ghost" size="sm">View all</Button></div><ul>{content.activity.map((activity) => <li key={activity}><span></span>{activity}<small>Just now</small></li>)}</ul></CardContent></Card>
          <Card className="dashboard-card order-card"><CardContent><div className="card-heading"><div><p>{user.role === 'buyer' ? 'ORDERS' : 'FULFILMENT'}</p><h2>{user.role === 'buyer' ? 'Your latest order' : 'Orders requiring attention'}</h2></div></div><div className="order-row"><div className="order-thumb"></div><div><strong>#VE-1042</strong><p>{user.role === 'buyer' ? 'Hand-woven market tote' : 'Customer order — 3 items'}</p></div><span className="status-badge">{user.role === 'buyer' ? 'In transit' : 'Ready to process'}</span></div></CardContent></Card>
        </section></> : user.role === 'seller' && activePage === 'Analytics' ? sellerAnalyticsPage() : user.role === 'seller' && activePage === 'Orders' ? sellerOrdersPage() : user.role === 'seller' && activePage === 'Wallet' ? sellerWalletPage() : user.role === 'staff' && activePage === 'Disputes' ? staffDisputesPage() : user.role === 'staff' && activePage === 'Support' ? staffSupportPage() : user.role === 'buyer' ? buyerPage() : managementPage()}
      </section>
    </main>
  )
}

export default DashboardLayout
