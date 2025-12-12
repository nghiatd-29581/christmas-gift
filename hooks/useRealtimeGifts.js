// hooks/useRealtimeGifts.js
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useRealtimeGifts() {
  const [latestGift, setLatestGift] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Subscribe to gift_events table changes
    const channel = supabase
      .channel('gift-events-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gift_events'
        },
        (payload) => {
          console.log('🎁 New gift opened:', payload.new)
          setLatestGift({
            gift_code: payload.new.gift_code,
            message: payload.new.message,
            opened_at: payload.new.opened_at
          })
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime status:', status)
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Cleanup on unmount
    return () => {
      console.log('🔌 Unsubscribing from realtime')
      supabase.removeChannel(channel)
    }
  }, [])

  return { latestGift, isConnected }
}