import { NextRequest, NextResponse } from 'next/server'

interface GoldPriceResponse {
  success: boolean
  current_price: {
    buy_price: number
    sell_price: number
    timestamp: string
    source: string
  }
  historical_data?: Array<{
    date: string
    buy_price: number
    sell_price: number
  }>
  price_trend: {
    direction: 'up' | 'down' | 'stable'
    percentage_change: number
    change_amount: number
  }
  currency: string
  unit: string
  error?: string
}

// Mock gold price data - in real app, this would come from Pegadaian API
const MOCK_GOLD_PRICES = {
  current: {
    buy_price: 1250000,  // Harga beli per gram
    sell_price: 1270000, // Harga jual per gram
    timestamp: new Date().toISOString(),
    source: 'Pegadaian Official'
  },
  historical: [
    { date: '2024-01-12', buy_price: 1250000, sell_price: 1270000 },
    { date: '2024-01-11', buy_price: 1245000, sell_price: 1265000 },
    { date: '2024-01-10', buy_price: 1240000, sell_price: 1260000 },
    { date: '2024-01-09', buy_price: 1235000, sell_price: 1255000 },
    { date: '2024-01-08', buy_price: 1230000, sell_price: 1250000 },
    { date: '2024-01-07', buy_price: 1225000, sell_price: 1245000 },
    { date: '2024-01-06', buy_price: 1220000, sell_price: 1240000 }
  ]
}

function calculatePriceTrend(historical: Array<{ buy_price: number }>) {
  if (historical.length < 2) {
    return {
      direction: 'stable' as const,
      percentage_change: 0,
      change_amount: 0
    }
  }

  const currentPrice = historical[0].buy_price
  const previousPrice = historical[1].buy_price
  const changeAmount = currentPrice - previousPrice
  const percentageChange = (changeAmount / previousPrice) * 100

  let direction: 'up' | 'down' | 'stable' = 'stable'
  if (percentageChange > 0.1) direction = 'up'
  else if (percentageChange < -0.1) direction = 'down'

  return {
    direction,
    percentage_change: Math.round(percentageChange * 100) / 100,
    change_amount
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeHistorical = searchParams.get('historical') === 'true'
    const days = parseInt(searchParams.get('days') || '7')

    const priceTrend = calculatePriceTrend(MOCK_GOLD_PRICES.historical)

    const response: GoldPriceResponse = {
      success: true,
      current_price: MOCK_GOLD_PRICES.current,
      historical_data: includeHistorical ? 
        MOCK_GOLD_PRICES.historical.slice(0, Math.min(days, MOCK_GOLD_PRICES.historical.length)) : 
        undefined,
      price_trend: priceTrend,
      currency: 'IDR',
      unit: 'gram'
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Gold price API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch gold price'
    }, { status: 500 })
  }
}

// Webhook endpoint to update gold prices (for admin use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate admin authorization in real app
    // For demo purposes, we'll just log the update
    console.log('Gold price update request:', body)

    // In a real app, you would:
    // 1. Validate admin credentials
    // 2. Update the database with new prices
    // 3. Trigger notifications if needed

    return NextResponse.json({
      success: true,
      message: 'Gold price updated successfully'
    })

  } catch (error) {
    console.error('Gold price update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update gold price'
    }, { status: 500 })
  }
}