// app/api/login/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    const validUsername = process.env.ADMIN_USERNAME
    const validPassword = process.env.ADMIN_PASSWORD

    if (!validUsername || !validPassword) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Check credentials
    if (username === validUsername && password === validPassword) {
      const response = NextResponse.json({ 
        success: true,
        message: 'Login successful' 
      })

      // Set authentication cookie
      response.cookies.set('auth-token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}