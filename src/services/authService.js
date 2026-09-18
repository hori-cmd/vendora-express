import { roles } from '../lib/roles'

// Replace this adapter with real API calls. The UI only trusts the role returned
// by this service; it does not infer authorization from a route or form choice.
const wait = () => new Promise((resolve) => window.setTimeout(resolve, 350))

export async function login({ email, demoRole }) {
  await wait()

  return {
    id: 'demo-buyer-01',
    name: email.split('@')[0] || 'Vendora customer',
    email,
    // This opt-in is available only during local Vite development to preview
    // protected layouts. A production API response always owns this field.
    role: import.meta.env.DEV && Object.values(roles).includes(demoRole)
      ? demoRole
      : roles.buyer,
  }
}

export async function register({ fullName, email, requestedRole }) {
  await wait()

  return {
    id: 'demo-buyer-01',
    name: fullName,
    email,
    role: roles.buyer,
    sellerApplicationStatus:
      requestedRole === roles.seller ? 'pending' : undefined,
  }
}
