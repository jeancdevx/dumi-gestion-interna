import 'server-only'

import { cache } from 'react'

import { cookies } from 'next/headers'

import { apiBaseUrl } from '@/db'

import {
  ClothesItem,
  Employee,
  GetClothesResponse,
  GetEmployeesResponse
} from '../types'

export const getEmployees = cache(
  async (): Promise<GetEmployeesResponse | null> => {
    try {
      const cookieStore = await cookies()
      const accessToken = cookieStore.get('sAccessToken')?.value
      const refreshToken = cookieStore.get('sRefreshToken')?.value
      const frontToken = cookieStore.get('sFrontToken')?.value

      if (!accessToken) {
        console.error('No access token found')
        return null
      }

      const response = await fetch(`${apiBaseUrl}/admin/employees`, {
        headers: {
          Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        console.error('Failed to fetch employees:', response.status)
        return null
      }

      const rawData = await response.json()

      let employees: Employee[]

      if (Array.isArray(rawData)) {
        employees = rawData
      } else if (rawData && Array.isArray(rawData.items)) {
        employees = rawData.items
      } else {
        console.error('Invalid response structure:', rawData)
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 10
        }
      }

      const sellersOnly = employees.filter(employee =>
        employee.roles.includes('seller')
      )

      return {
        items: sellersOnly,
        total: sellersOnly.length,
        page: rawData.page || 1,
        limit: rawData.limit || sellersOnly.length
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      return null
    }
  }
)

export const getClothes = cache(
  async (
    page: number = 1,
    limit: number = 10
  ): Promise<GetClothesResponse | null> => {
    try {
      const cookieStore = await cookies()
      const accessToken = cookieStore.get('sAccessToken')?.value
      const refreshToken = cookieStore.get('sRefreshToken')?.value
      const frontToken = cookieStore.get('sFrontToken')?.value

      if (!accessToken) {
        console.error('No access token found')
        return null
      }

      const response = await fetch(
        `${apiBaseUrl}/clothes?page=${page}&limit=${limit}`,
        {
          headers: {
            Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`
          },
          cache: 'no-store'
        }
      )

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
