'use server'

import { cache } from 'react'

import { cookies } from 'next/headers'

import { apiBaseUrl } from '@/db'

import { GetOrdersResponse, Order } from '../types'

export const getOrders = cache(async (): Promise<GetOrdersResponse | null> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sAccessToken')?.value
    const refreshToken = cookieStore.get('sRefreshToken')?.value
    const frontToken = cookieStore.get('sFrontToken')?.value

    if (!accessToken) {
      return null
    }

    const response = await fetch(`${apiBaseUrl}/orders`, {
      headers: {
        Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`
      },
      next: {
        revalidate: 60,
        tags: ['orders']
      }
    })

    if (!response.ok) {
      console.error('Error fetching orders:', response.statusText)
      return null
    }

    const data = await response.json()

    // El backend puede devolver array directo o objeto con items
    if (Array.isArray(data)) {
      return {
        items: data,
        total: data.length,
        page: 1,
        limit: data.length
      }
    }

    return data
  } catch (error) {
    console.error('Error in getOrders:', error)
    return null
  }
})

export const getOrderById = cache(async (id: string): Promise<Order | null> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sAccessToken')?.value
    const refreshToken = cookieStore.get('sRefreshToken')?.value
    const frontToken = cookieStore.get('sFrontToken')?.value

    if (!accessToken) {
      return null
    }

    const response = await fetch(`${apiBaseUrl}/orders/${id}`, {
      headers: {
        Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`
      },
      next: {
        revalidate: 60,
        tags: ['orders', `order-${id}`]
      }
    })

    if (!response.ok) {
      console.error('Error fetching order:', response.statusText)
      return null
    }

    return response.json()
  } catch (error) {
    console.error('Error in getOrderById:', error)
    return null
  }
})
