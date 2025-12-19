 
// app/create/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CreateGift() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [giftCode, setGiftCode] = useState(null)
  const [error, setError] = useState(null)
  const [name, setName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const postData = {
        message: message,
        name:name
      }
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create gift')
      }

      setGiftCode(data.gift.gift_code)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAnother = () => {
    setMessage('')
    setGiftCode(null)
    setError(null)
    setName('')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-3 sm:p-4 py-6">
      <div className="glass-card p-4 sm:p-6 md:p-8 lg:p-10 max-w-2xl w-full my-auto">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-white/80 hover:text-white mb-4 sm:mb-6 transition-colors"
        >
          <span>←</span>
          <span>Quay lại</span>
        </Link>

        {!giftCode ? (
          <>
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 sm:mb-4">
                🎁 Tạo Quà Tặng
              </h1>
              <p className="text-sm sm:text-base text-white/80">
                Viết lời chúc của bạn và chia sẻ niềm vui
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm font-medium mb-2 text-white/90"
                >
                  Tên bạn:
                </label>
                <textarea
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input resize-none"
                required
                ></textarea>
              </div>
              <div>
                <label 
                  htmlFor="message"
                  className="block text-xs sm:text-sm font-medium mb-2 text-white/90"
                >
                  Lời Chúc Của Bạn ✨
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Viết lời chúc Giáng Sinh ý nghĩa của bạn tại đây..."
                  rows={5}
                  required
                  disabled={isLoading}
                  className="glass-input resize-none"
                />
                <p className="mt-2 text-sm text-white/60">
                  {message.length} ký tự
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-white">
                  <p className="font-medium">⚠️ Lỗi</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !message.trim()}
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
                    Đang tạo...
                  </span>
                ) : (
                  'Tạo Quà Tặng 🎄'
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center space-y-4 sm:space-y-6 animate-float">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
                Quà Đã Được Tạo!
              </h2>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border-2 border-christmas-gold/50">
                <p className="text-xs sm:text-sm text-white/80 mb-2">Mã Quà Tặng</p>
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-christmas-gold tracking-wider">
                  {giftCode}
                </p>
                <p className="text-sm text-white/60 mt-4">
                  Hãy viết mã và tặng này và dán lên hộp quà của bạn nhé!!!
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={handleCreateAnother}
                  className="glass-button w-full bg-gradient-to-r from-christmas-green to-green-700"
                >
                  Tạo Quà Khác 🎁
                </button>

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