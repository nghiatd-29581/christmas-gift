// app/open/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import GiftBox from '@/components/GiftBox'
import { useConfetti } from '@/hooks/useConfetti'
import { useRouter } from 'next/navigation'
export default function OpenGift() {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [gift, setGift] = useState(null)
  const [error, setError] = useState(null)
  const { fireConfetti } = useConfetti()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
      //router.push('/')
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleOpenGift = async () => {
    setError(null)
    setIsLoading(true)

    try {
      // Simulate loading delay (1-3 seconds)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

      const response = await fetch('/api/random-gift')
      const data = await response.json()
      console.log(data)

      if (!response.ok) {
        if (data.noGifts) {
          throw new Error('Không còn quà nào để mở! Hãy tạo quà mới.')
        }
        throw new Error(data.error || 'Failed to open gift')
      }

      // Trigger opening animation
      setIsOpening(true)
      
      // Wait for animation
      setTimeout(() => {
        setGift(data.gift)
        setIsOpening(false)
        setIsLoading(false)
        fireConfetti()
      }, 1000)

    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      setIsOpening(false)
    }
  }

  const handleNextGift = () => {
    setGift(null)
    setError(null)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 md:p-12 max-w-2xl w-full">
        {/* Header with Logout */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Quay lại</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>Đăng xuất</span>
            <span>🚪</span>
          </button>
        </div>

        {!gift ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                🎊 Mở Quà Giáng Sinh
              </h1>
              <p className="text-white/80">
                Khám phá món quà bất ngờ dành cho bạn!
              </p>
            </div>

            {/* Gift Box Area */}
            <div className="flex flex-col items-center justify-center space-y-8 py-8">
              {isLoading ? (
                <div className="text-center space-y-4">
                  <GiftBox isOpening={isOpening} className="mx-auto" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-christmas-gold" viewBox="0 0 24 24">
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
                      <p className="text-white/90 font-medium">
                        {isOpening ? 'Đang mở quà...' : 'Đang tìm quà...'}
                      </p>
                    </div>
                    <p className="text-sm text-white/60">
                      Vui lòng đợi trong giây lát ✨
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <GiftBox onClick={handleOpenGift} className="mx-auto" />
                  <div className="text-center space-y-4">
                    <button
                      onClick={handleOpenGift}
                      className="glass-button"
                    >
                      Mở Quà Ngẫu Nhiên 🎁
                    </button>
                    <p className="text-sm text-white/60">
                      Click vào hộp quà hoặc nút bên dưới để mở!
                    </p>
                  </div>
                </>
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-white w-full max-w-md">
                  <p className="font-medium">⚠️ {error}</p>
                  <Link 
                    href="/create"
                    className="text-sm underline hover:text-christmas-gold mt-2 inline-block"
                  >
                    Tạo quà mới →
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Gift Opened State */}
            <div className="text-center space-y-6 animate-float">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                Chúc Mừng!
              </h2>
              
              {/* Gift Code Display */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-christmas-gold/50">
                <p className="text-sm text-white/80 mb-2">Mã Quà Tặng</p>
                <p className="text-3xl md:text-4xl font-bold text-christmas-gold tracking-wider mb-4">
                  {gift.gift_code}
                </p>
                
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-4" />

                {/* Gift Name */}
                <div className="bg-white/5 rounded-xl p-6">
                  <p className="text-sm text-white/70 mb-2">Tên người tặng</p>
                  <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">
                    {gift.name}
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-4" />
                
                {/* Gift Message */}
                <div className="bg-white/5 rounded-xl p-6">
                  <p className="text-sm text-white/70 mb-2">💌 Lời Chúc</p>
                  <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">
                    {gift.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleNextGift}
                  className="glass-button w-full bg-gradient-to-r from-christmas-green to-green-700"
                >
                  Người Tiếp Theo 🎁
                </button>
                
                <Link 
                  href="/create"
                  className="glass-button w-full block bg-gradient-to-r from-christmas-gold to-yellow-600"
                >
                  Tạo Quà Mới ✨
                </Link>

                <Link 
                  href="/"
                  className="block text-center text-white/70 hover:text-white transition-colors"
                >
                  Về trang chủ →
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}