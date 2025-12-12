// app/page.js
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen flex items-center justify-center p-3 sm:p-4 py-6">
      <div className="glass-card p-6 sm:p-8 md:p-10 lg:p-12 max-w-2xl w-full animate-float my-auto">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-text drop-shadow-lg">
            🎄 Merry Christmas 🎄
          </h1>
          <p className="text-sm sm:text-xl md:text-xl text-white/90 font-light">
            Chia sẻ niềm vui và yêu thương trong mùa Giáng Sinh
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center space-x-3 sm:space-x-4 py-3 sm:py-4">
          <div className="h-px bg-gradient-to-r from-transparent via-christmas-gold to-transparent w-full" />
          <span className="text-2xl sm:text-3xl">🎁</span>
          <div className="h-px bg-gradient-to-r from-transparent via-christmas-gold to-transparent w-full" />
        </div>

        {/* Description */}
        <div className="space-y-3 sm:space-y-4 text-white/80 text-center">
          <p className="text-base sm:text-lg">
            Tạo một món quà đặc biệt với lời chúc ý nghĩa và chia sẻ niềm vui với mọi người!
          </p>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 text-left">
            <div className="bg-white/5 p-3 sm:p-4 rounded-lg">
              <div className="text-xl sm:text-2xl mb-2">✨</div>
              <h3 className="font-bold mb-1 text-sm sm:text-base">Tạo Quà Tặng</h3>
              <p className="text-xs sm:text-sm text-white/70">Viết lời chúc của bạn và nhận mã quà tặng độc đáo</p>
            </div>
            <div className="bg-white/5 p-3 sm:p-4 rounded-lg">
              <div className="text-xl sm:text-2xl mb-2">🎉</div>
              <h3 className="font-bold mb-1 text-sm sm:text-base">Mở Quà Ngẫu Nhiên</h3>
              <p className="text-xs sm:text-sm text-white/70">Khám phá những lời chúc ấm áp từ mọi người</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <Link 
              href="/create"
              className="glass-button flex-1 hover:from-christmas-green hover:to-green-700"
            >
              <span className="flex items-center justify-center gap-2">
                <span>🎁</span>
                <span>Tạo Quà Tặng</span>
              </span>
            </Link>
            
            <Link 
              href="/open"
              className="glass-button flex-1 hover:from-christmas-gold hover:to-yellow-600"
            >
              <span className="flex items-center justify-center gap-2">
                <span>🎊</span>
                <span>Mở Quà</span>
              </span>
            </Link>
          </div>

          {/* Result Page Link */}
          <Link 
            href="/result"
            className="block text-center glass-button bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
          >
            <span className="flex items-center justify-center gap-2">
              <span>📺</span>
              <span>Màn Hình Theo Dõi</span>
            </span>
          </Link>
        </div>

        {/* Footer Text */}
        <div className="pt-8 text-sm text-white/60">
          <p>Made with ❤️ for the holiday season</p>
        </div>
      </div>
    </main>
  )
}