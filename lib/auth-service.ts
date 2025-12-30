// Enterprise Authentication Service
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'developer' | 'viewer'
  permissions: string[]
  lastLogin?: Date
  createdAt: Date
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  refreshToken: string | null
}

export class AuthService {
  private static instance: AuthService
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null
  }
  private listeners: ((state: AuthState) => void)[] = []

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('kriya-auth')
      if (stored) {
        const parsed = JSON.parse(stored)
        this.authState = {
          ...parsed,
          user: parsed.user ? {
            ...parsed.user,
            lastLogin: parsed.user.lastLogin ? new Date(parsed.user.lastLogin) : undefined,
            createdAt: new Date(parsed.user.createdAt)
          } : null
        }
        
        // Validate token expiry
        if (this.authState.token && this.isTokenExpired(this.authState.token)) {
          this.logout()
        }
      }
    } catch (error) {
      console.error('Failed to load auth state:', error)
      this.logout()
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('kriya-auth', JSON.stringify(this.authState))
    } catch (error) {
      console.error('Failed to save auth state:', error)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.authState))
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  getAuthState(): AuthState {
    return { ...this.authState }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication - in production, this would be a real API call
      if (email === 'demo@kriya.dev' && password === 'demo123') {
        const user: User = {
          id: '1',
          email,
          name: 'Demo User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
          role: 'developer',
          permissions: ['read', 'write', 'deploy', 'admin'],
          lastLogin: new Date(),
          createdAt: new Date('2024-01-01')
        }

        const token = this.generateMockToken(user)
        const refreshToken = this.generateMockRefreshToken(user)

        this.authState = {
          isAuthenticated: true,
          user,
          token,
          refreshToken
        }

        this.saveToStorage()
        this.notifyListeners()
        return user
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async loginWithProvider(provider: 'github' | 'google' | 'microsoft'): Promise<User> {
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const user: User = {
        id: '2',
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face',
        role: 'developer',
        permissions: ['read', 'write', 'deploy'],
        lastLogin: new Date(),
        createdAt: new Date('2024-01-15')
      }

      const token = this.generateMockToken(user)
      const refreshToken = this.generateMockRefreshToken(user)

      this.authState = {
        isAuthenticated: true,
        user,
        token,
        refreshToken
      }

      this.saveToStorage()
      this.notifyListeners()
      return user
    } catch (error) {
      console.error('OAuth login failed:', error)
      throw error
    }
  }

  async refreshAuthToken(): Promise<string> {
    if (!this.authState.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      // Simulate token refresh
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (this.authState.user) {
        const newToken = this.generateMockToken(this.authState.user)
        this.authState.token = newToken
        this.saveToStorage()
        this.notifyListeners()
        return newToken
      } else {
        throw new Error('No user data available')
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.logout()
      throw error
    }
  }

  logout(): void {
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null
    }
    
    localStorage.removeItem('kriya-auth')
    this.notifyListeners()
  }

  async updateProfile(updates: Partial<Pick<User, 'name' | 'avatar'>>): Promise<User> {
    if (!this.authState.user) {
      throw new Error('Not authenticated')
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const updatedUser = { ...this.authState.user, ...updates }
      this.authState.user = updatedUser
      this.saveToStorage()
      this.notifyListeners()
      return updatedUser
    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.authState.user) {
      throw new Error('Not authenticated')
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock validation
      if (currentPassword !== 'demo123') {
        throw new Error('Current password is incorrect')
      }
      
      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters')
      }
      
      // In production, this would update the password on the server
      console.log('Password changed successfully')
    } catch (error) {
      console.error('Password change failed:', error)
      throw error
    }
  }

  hasPermission(permission: string): boolean {
    return this.authState.user?.permissions.includes(permission) || false
  }

  hasRole(role: User['role']): boolean {
    return this.authState.user?.role === role || false
  }

  private generateMockToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }))
    const signature = btoa('mock-signature')
    
    return `${header}.${payload}.${signature}`
  }

  private generateMockRefreshToken(user: User): string {
    const payload = btoa(JSON.stringify({
      sub: user.id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    }))
    
    return `refresh.${payload}.mock-signature`
  }
}