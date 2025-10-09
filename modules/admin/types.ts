export type CreateEmployeeResponse = {
  status?: string
  message?: string
  id?: string
  names?: string
  lastNames?: string
  email?: string
  superTokensId?: string
  createdAt?: string
  updatedAt?: string
  user?: {
    id: string
    email: string
    timeJoined: number
  }
}

export type UpdateEmployeeResponse = {
  status?: string
  message?: string
  id?: string
  names?: string
  lastNames?: string
  email?: string
  superTokensId?: string
  createdAt?: string
  updatedAt?: string
  user?: {
    id: string
    email: string
    timeJoined: number
  }
}

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

export interface Customer {
  id: string
  names: string
  lastNames: string
  phone: string
  reference: string | null
  createdAt: string
  updatedAt: string
}

export interface GetCustomersResponse {
  items: Customer[]
  total: number
  page: number
  limit: number
}
