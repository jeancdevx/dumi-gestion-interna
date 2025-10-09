import { cache } from 'react'

import { cookies } from 'next/headers'

import { apiBaseUrl } from '@/db'

import { ClothesDetail, ClothesItem, GetClothesResponse } from '../types'

export const getClothes = cache(
  async (): Promise<GetClothesResponse | null> => {
    try {
      const cookieStore = await cookies()
      const accessToken = cookieStore.get('sAccessToken')?.value
      const refreshToken = cookieStore.get('sRefreshToken')?.value
      const frontToken = cookieStore.get('sFrontToken')?.value

      if (!accessToken) {
        console.error('No access token found')
        return null
      }

      const response = await fetch(`${apiBaseUrl}/clothes`, {
        headers: {
          Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        console.error('Failed to fetch clothes:', response.status)
        return null
      }

      const rawData = await response.json()

      let clothes: ClothesItem[]

      if (Array.isArray(rawData)) {
        clothes = rawData
      } else if (rawData && Array.isArray(rawData.items)) {
        clothes = rawData.items
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
        items: clothes,
        total: rawData.total || clothes.length,
        page: rawData.page || 1,
        limit: rawData.limit || clothes.length
      }
    } catch (error) {
      console.error('Error fetching clothes:', error)
      return null
    }
  }
)

export const getClotheById = cache(
  async (id: string): Promise<ClothesDetail | null> => {
    try {
      const cookieStore = await cookies()
      const accessToken = cookieStore.get('sAccessToken')?.value
      const refreshToken = cookieStore.get('sRefreshToken')?.value
      const frontToken = cookieStore.get('sFrontToken')?.value

      if (!accessToken) {
        console.error('No access token found')
        return null
      }

      const response = await fetch(`${apiBaseUrl}/clothes/${id}`, {
        headers: {
          Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        console.error('Failed to fetch clothe:', response.status)
        return null
      }

      const data: ClothesDetail = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching clothe:', error)
      return null
    }
  }
)
