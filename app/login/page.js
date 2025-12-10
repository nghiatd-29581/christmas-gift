// app/login/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to /open page
        router.push('/open')
      } else {
        setError(data.error || 'Đăng nhập thất bại')
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 md:p-12 max-w-md w-full">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <span>←</span>
          <span>Quay lại</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Đăng Nhập
          </h1>
          <p className="text-white/80 text-sm">
            Chỉ quản trị viên mới có thể mở quà
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label 
              htmlFor="username"
              className="block text-sm font-medium mb-2 text-white/90"
            >
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
              disabled={isLoading}
              className="glass-input"
              autoComplete="username"
            />
          </div>

          <div>
            <label 
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-white/90"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              disabled={isLoading}
              className="glass-input"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-white text-sm">
              <p className="font-medium">⚠️ {error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="glass-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang đăng nhập...
              </span>
            ) : (
              'Đăng Nhập 🎄'
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-white/5 rounded-lg p-4 text-sm text-white/70">
          <p className="mb-2">💡 <strong>Lưu ý:</strong></p>
          <ul className="space-y-1 text-xs">
            <li>• Chỉ quản trị viên mới có quyền mở quà</li>
            <li>• Bảo vệ mật khẩu của bạn cẩn thận</li>
            <li>• Phiên đăng nhập tồn tại trong 24 giờ</li>
          </ul>
        </div>
      </div>
    </main>
  )
}