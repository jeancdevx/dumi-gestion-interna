import { cache } from 'react'

import { cookies } from 'next/headers'

import { apiBaseUrl } from '@/db'

import { GetQuotesResponse, Quote } from '../types'

export const getQuotes = cache(async (): Promise<GetQuotesResponse | null> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sAccessToken')?.value
    const refreshToken = cookieStore.get('sRefreshToken')?.value
    const frontToken = cookieStore.get('sFrontToken')?.value

    if (!accessToken) {
      console.error('No access token found')
      return null
    }

    const response = await fetch(`${apiBaseUrl}/quotes`, {
      headers: {
        Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`
      },
      next: {
        revalidate: 60,
        tags: ['quotes']
      }
    })

    if (!response.ok) {
      console.error('Failed to fetch quotes:', response.status)
      return null
    }

    const rawData = await response.json()

    let quotes: Quote[]

    if (Array.isArray(rawData)) {
      quotes = rawData
    } else if (rawData && Array.isArray(rawData.items)) {
      quotes = rawData.items
    } else {
      console.error('Invalid response structure:', rawData)
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 10
      }
    }

    return {
      items: quotes,
      total: rawData.total || quotes.length,
      page: rawData.page || 1,
      limit: rawData.limit || quotes.length
    }
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return null
  }
})

export const getQuoteById = cache(async (id: string): Promise<Quote | null> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sAccessToken')?.value
    const refreshToken = cookieStore.get('sRefreshToken')?.value
    const frontToken = cookieStore.get('sFrontToken')?.value

    if (!accessToken) {
      console.error('No access token found')
      return null
    }

    const response = await fetch(`${apiBaseUrl}/quotes/${id}`, {
      headers: {
        Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`
      },
      next: {
        revalidate: 60,
        tags: ['quotes', `quote-${id}`]
      }
    })

    if (!response.ok) {
      console.error('Failed to fetch quote:', response.status)
      return null
    }

    const data: Quote = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching quote:', error)
    return null
  }
})
