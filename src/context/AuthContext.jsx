import { useMemo, useState } from 'react'
import { AuthContext } from './authContextValue'
import { login, register } from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      async login(credentials) {
        const authenticatedUser = await login(credentials)
        setUser(authenticatedUser)
        return authenticatedUser
      },
      async register(details) {
        const registeredUser = await register(details)
        setUser(registeredUser)
        return registeredUser
      },
      logout() {
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
