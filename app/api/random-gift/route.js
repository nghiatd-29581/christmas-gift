// app/api/random-gift/route.js
import { supabase } from '../../../lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // SOLUTION 1: Atomic operation - Select and update in one query
    // This prevents race conditions by locking the row during selection
    
    // Step 1: Get random unopened gift with atomic update
    const { data: gift, error: fetchError } = await supabase.rpc(
      'get_random_gift'
    )

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      
      // Fallback to old method if RPC function doesn't exist
      return fallbackRandomGift()
    }

    if (!gift || gift.length === 0) {
      return NextResponse.json(
        { error: 'No gifts available', noGifts: true },
        { status: 404 }
      )
    }

    // Broadcast event to all listeners (for /result page)
    const { error: broadcastError } = await supabase
      .from('gift_events')
      .insert({
        gift_code: gift[0].gift_code,
        message: gift[0].message,
        event_type: 'opened',
        name: gift[0].name
      })

    if (broadcastError) {
      console.error('Broadcast error:', broadcastError)
      // Don't fail the request if broadcast fails
    }

    return NextResponse.json({
      success: true,
      gift: {
        gift_code: gift[0].gift_code,
        message: gift[0].message,
        name: gift[0].name
      },
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Fallback method - Less efficient but works without RPC
async function fallbackRandomGift() {
  try {
    // SOLUTION 2: Optimized query - Only select necessary columns and limit
    // Get count of unopened gifts first
    const { count, error: countError } = await supabase
      .from('gifts')
      .select('*', { count: 'exact', head: true })
      .eq('is_opened', false)

    if (countError || !count || count === 0) {
      return NextResponse.json(
        { error: 'No gifts available', noGifts: true },
        { status: 404 }
      )
    }

    // Calculate random offset
    const randomOffset = Math.floor(Math.random() * count)

    // Get ONE random gift with offset
    const { data: gifts, error: fetchError } = await supabase
      .from('gifts')
      .select('id, gift_code, message,name')  // Only select needed columns
      .eq('is_opened', false)
      .range(randomOffset, randomOffset)  // Get only 1 record at offset
      .limit(1)

    if (fetchError || !gifts || gifts.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch gift' },
        { status: 500 }
      )
    }

    const selectedGift = gifts[0]

    // IMPORTANT: Try to update, but check if another request already opened it
    const { data: updatedGift, error: updateError } = await supabase
      .from('gifts')
      .update({ is_opened: true })
      .eq('id', selectedGift.id)
      .eq('is_opened', false)  // CRITICAL: Only update if still unopened
      .select()
      .single()

    // If update failed, the gift was opened by another request
    if (updateError || !updatedGift) {
      console.log('Gift was already opened by another request, retrying...')
      // Recursively try again
      return fallbackRandomGift()
    }

    // Broadcast event
    const { error: broadcastError } = await supabase
      .from('gift_events')
      .insert({
        gift_code: updatedGift.gift_code,
        message: updatedGift.message,
        event_type: 'opened',
        name: updatedGift.name
      })

    if (broadcastError) {
      console.error('Broadcast error:', broadcastError)
    }

    return NextResponse.json({
      success: true,
      gift: {
        gift_code: updatedGift.gift_code,
        message: updatedGift.message,
        name: updatedGift.name
      },
    })
  } catch (error) {
    console.error('Fallback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Reset a gift (for testing purposes)
export async function POST(request) {
  try {
    const { giftCode } = await request.json()

    const { error } = await supabase
      .from('gifts')
      .update({ is_opened: false })
      .eq('gift_code', giftCode)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to reset gift' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}