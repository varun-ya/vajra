import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password, provider } = body

  // Simulate authentication delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  if (provider) {
    // OAuth login simulation
    return NextResponse.json({
      success: true,
      user: {
        id: '2',
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face',
        role: 'developer',
        permissions: ['read', 'write', 'deploy']
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    })
  }

  // Email/password login
  if (email === 'demo@kriya.dev' && password === 'demo123') {
    return NextResponse.json({
      success: true,
      user: {
        id: '1',
        email,
        name: 'Demo User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        role: 'developer',
        permissions: ['read', 'write', 'deploy', 'admin']
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    })
  }

  return NextResponse.json(
    { success: false, error: 'Invalid credentials' },
    { status: 401 }
  )
}

export async function DELETE() {
  // Logout endpoint
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })
}