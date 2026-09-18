export const roles = {
  admin: 'admin',
  seller: 'seller',
  staff: 'staff',
  buyer: 'buyer',
}

export const publicRegistrationRoles = [
  {
    value: roles.buyer,
    label: 'Buyer',
    description: 'Shop, save products, and track your orders.',
  },
  {
    value: roles.seller,
    label: 'Seller',
    description: 'Apply to sell products on Vendora Express.',
  },
]

export const dashboardPaths = {
  [roles.admin]: '/admin/dashboard',
  [roles.seller]: '/seller/dashboard',
  [roles.staff]: '/staff/dashboard',
  [roles.buyer]: '/buyer/dashboard',
}

export function isRole(value) {
  return Object.values(roles).includes(value)
}

export function dashboardPathFor(role) {
  return dashboardPaths[role] ?? dashboardPaths[roles.buyer]
}
