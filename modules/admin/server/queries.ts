import 'server-only'

import { cache } from 'react'

import { cookies } from 'next/headers'

import { apiBaseUrl } from '@/db'

import {
  Customer,
  Employee,
  GetCustomersResponse,
  GetEmployeesResponse
} from '@/modules/admin/types'

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

export const getCustomers = cache(
  async (): Promise<GetCustomersResponse | null> => {
    try {
      const cookieStore = await cookies()
      const accessToken = cookieStore.get('sAccessToken')?.value
      const refreshToken = cookieStore.get('sRefreshToken')?.value
      const frontToken = cookieStore.get('sFrontToken')?.value

      if (!accessToken) {
        console.error('No access token found')
        return null
      }

      const response = await fetch(`${apiBaseUrl}/customers`, {
        headers: {
          Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        console.error('Failed to fetch customers:', response.status)
        return null
      }

      const rawData = await response.json()

      let customers: Customer[]

      if (Array.isArray(rawData)) {
        customers = rawData
      } else if (rawData && Array.isArray(rawData.items)) {
        customers = rawData.items
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
        items: customers,
        total: rawData.total || customers.length,
        page: rawData.page || 1,
        limit: rawData.limit || customers.length
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      return null
    }
  }
)
