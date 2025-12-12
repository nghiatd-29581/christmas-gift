// app/result/page.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRealtimeGifts } from '../../hooks/useRealtimeGifts'
import { useConfetti } from '../../hooks/useConfetti'

export default function ResultPage() {
  const { latestGift, isConnected } = useRealtimeGifts()
  const { fireConfetti } = useConfetti()
  const [displayedGift, setDisplayedGift] = useState(null)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (latestGift && latestGift !== displayedGift) {
      // Trigger animation when new gift arrives
      setShowAnimation(true)
      fireConfetti()
      
      // Update displayed gift after animation starts
      setTimeout(() => {
        setDisplayedGift(latestGift)
        setShowAnimation(false)
      }, 500)
    }
  }, [latestGift, displayedGift, fireConfetti])

  return (
    <main className="min-h-screen flex items-center justify-center p-3 sm:p-4 py-6">
      <div className="glass-card p-4 sm:p-6 md:p-8 lg:p-10 max-w-2xl w-full my-auto">
        {/* Header with Connection Status */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-white/80 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Quay lại</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs sm:text-sm text-white/60">
              {isConnected ? 'Đang kết nối' : 'Mất kết nối'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        {!displayedGift ? (
          <>
            {/* Waiting State */}
            <div className="text-center space-y-6 sm:space-y-8 py-8">
              <div className="text-5xl sm:text-6xl md:text-7xl animate-float">
                📺
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">
                Màn Hình Theo Dõi
              </h1>
              <p className="text-sm sm:text-base text-white/80 max-w-md mx-auto">
                Màn hình này sẽ tự động hiển thị khi có người mở quà trên màn hình chính
              </p>

              {/* Status Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                    <p className="text-base sm:text-lg font-medium">
                      {isConnected ? '✅ Sẵn sàng nhận quà' : '⏳ Đang kết nối...'}
                    </p>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-white/60">
                    <p>💡 Mẹo: Giữ màn hình này mở</p>
                    <p>Quà sẽ xuất hiện ngay khi được mở!</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
                <div className="bg-white/5 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl mb-2">1️⃣</div>
                  <p className="text-xs sm:text-sm text-white/70">
                    Mở trang này trên điện thoại hoặc màn hình phụ
                  </p>
                </div>
                <div className="bg-white/5 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl mb-2">2️⃣</div>
                  <p className="text-xs sm:text-sm text-white/70">
                    Người mở quà sử dụng màn hình chính
                  </p>
                </div>
                <div className="bg-white/5 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl mb-2">3️⃣</div>
                  <p className="text-xs sm:text-sm text-white/70">
                    Quà tự động hiển thị tại đây!
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Gift Display */}
            <div className={`text-center space-y-4 sm:space-y-6 ${showAnimation ? 'animate-float' : ''}`}>
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
                Quà Vừa Được Mở!
              </h2>
              
              {/* Gift Code Display */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border-2 border-christmas-gold/50">
                <p className="text-xs sm:text-sm text-white/80 mb-2">Mã Quà Tặng</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-christmas-gold tracking-wider mb-3 sm:mb-4">
                  {displayedGift.gift_code}
                </p>
                
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-3 sm:my-4" />
                
                {/* Gift Message */}
                <div className="bg-white/5 rounded-xl p-4 sm:p-6">
                  <p className="text-xs sm:text-sm text-white/70 mb-2">💌 Lời Chúc</p>
                  <p className="text-base sm:text-lg text-white leading-relaxed whitespace-pre-wrap">
                    {displayedGift.message}
                  </p>
                </div>

                {/* Timestamp */}
                {displayedGift.opened_at && (
                  <p className="text-xs text-white/50 mt-4">
                    {new Date(displayedGift.opened_at).toLocaleTimeString('vi-VN')}
                  </p>
                )}
              </div>

              {/* Info */}
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 sm:p-4 text-sm">
                <p className="text-white/90">
                  ℹ️ Quà tiếp theo sẽ tự động hiển thị khi được mở
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}