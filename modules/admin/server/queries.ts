import 'server-only'

import { cache } from 'react'

import { cookies } from 'next/headers'

export interface Employee {
  id: string
  names: string
  lastNames: string
  email: string
  superTokensId: string
  createdAt: string
  updatedAt: string
  roles: string[]
}

export interface GetEmployeesResponse {
  items: Employee[]
  total: number
  page: number
  limit: number
}

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

      const response = await fetch(
        'https://dumi-dev.onrender.com/api/v1/admin/employees',
        {
          headers: {
            Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`
          },
          cache: 'no-store'
        }
      )

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
