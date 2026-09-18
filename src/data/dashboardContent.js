import { roles } from '../lib/roles'

const shared = ['Profile']

export const dashboardContent = {
  [roles.admin]: {
    label: 'Admin Console',
    title: 'Marketplace overview',
    description: 'Monitor people, sellers, orders, and the health of Vendora Express.',
    navigation: ['Dashboard', 'Users', 'Sellers', 'Staff', 'Products', 'Categories', 'Orders', 'Payments', 'Disputes', 'Reports', 'Analytics', 'Settings', 'Audit Logs', 'Security', ...shared],
    metrics: [['Marketplace sales', '$48,240', '+12.4%'], ['Open orders', '184', '+8 today'], ['Seller approvals', '12', '4 need review'], ['Customer satisfaction', '4.8/5', '+0.2 this month']],
    activity: ['12 seller applications await review', 'Low stock alert: 8 catalogue items', 'Three staff permissions were updated'],
  },
  [roles.seller]: {
    label: 'Seller Dashboard',
    title: 'Your store is moving',
    description: 'Keep products, fulfilment, and sales performance in one calm workspace.',
    navigation: ['Dashboard', 'Products', 'Orders', 'Customers', 'Messages', 'Reviews', 'Analytics', 'Promotions', 'Wallet', 'My Store', 'Verification', 'Settings'],
    metrics: [['Today’s sales', '$1,284', '+16.8%'], ['Orders to fulfil', '9', '2 due today'], ['Live products', '36', '3 low in stock'], ['Store rating', '4.9/5', '128 reviews']],
    activity: ['Order #VE-1042 is ready to ship', 'Summer Tote is low in stock', 'Your weekly sales report is ready'],
  },
  [roles.staff]: {
    label: 'Staff Dashboard',
    title: 'Today’s operations',
    description: 'Keep orders, products, and customer requests moving without friction.',
    navigation: ['Dashboard', 'Orders', 'Products', 'Sellers', 'Buyers', 'Reports', 'Disputes', 'Reviews', 'Support', 'Notifications', ...shared],
    metrics: [['Orders to process', '47', '11 priority'], ['Items low in stock', '8', '2 critical'], ['Customer requests', '14', '5 new'], ['Processed today', '126', '+18%']],
    activity: ['Five orders are ready for dispatch', 'Customer request #829 needs a reply', 'Inventory count is scheduled for Friday'],
  },
  [roles.buyer]: {
    label: 'My Vendora',
    title: 'Welcome back',
    description: 'Discover thoughtful products from sellers you can trust.',
    navigation: ['Home', 'Shop', 'Categories', 'Cart', 'My Orders', 'Wishlist', ...shared],
    metrics: [['Orders on the way', '2', 'Arriving this week'], ['Saved items', '8', 'Ready when you are'], ['Vendora rewards', '240', 'Points available'], ['Trusted sellers', '18', 'In your community']],
    activity: ['Your order #VE-1042 is on its way', 'A saved item is back in stock', 'New arrivals in Home & Living'],
  },
}

export const buyerProducts = [
  { id: 'tote', name: 'Hand-woven market tote', price: 38, category: 'Home & Living', seller: 'Willow Market', color: '#d1fae5' },
  { id: 'candle', name: 'Citrus soy candle', price: 24, category: 'Gifts', seller: 'Golden Hour Goods', color: '#fde68a' },
  { id: 'stoneware', name: 'Stoneware breakfast set', price: 56, category: 'Kitchen', seller: 'Clay & Co.', color: '#bfdbfe' },
  { id: 'notebook', name: 'Linen-bound notebook', price: 18, category: 'Stationery', seller: 'Paperfolk', color: '#ddd6fe' },
  { id: 'throw', name: 'Soft-wool throw', price: 72, category: 'Home & Living', seller: 'Hearth Studio', color: '#fecdd3' },
  { id: 'tea', name: 'Morning tea collection', price: 30, category: 'Gifts', seller: 'Field Notes Tea', color: '#bbf7d0' },
]

export const buyerOrders = [
  { id: 'VE-1042', item: 'Hand-woven market tote', date: '17 September', status: 'In transit', total: '$38.00' },
  { id: 'VE-1008', item: 'Citrus soy candle', date: '02 September', status: 'Delivered', total: '$24.00' },
]
