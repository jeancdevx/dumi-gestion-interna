export interface Address {
  id: string
  department: string
  city: string
  district: string
  street: string
}

export interface Order {
  id: string
  total: string | number
  deliveryDate: string
  status: 'IN_PRODUCTION' | 'DELIVERED' | 'CANCELLED'
  quoteId: string
  addressId?: string
  address?: Address
  customer?: {
    id: string
    names: string
    lastNames: string
    phone: string
  }
  quote?: {
    id: string
    customerId: string
    customer?: {
      id: string
      names: string
      lastNames: string
    }
  }
  totalClothes?: number
  totalUnitsToProduced?: number
  createdAt: string
}

export interface GetOrdersResponse {
  items: Order[]
  total: number
  page: number
  limit: number
}

export interface CreateOrderInput {
  quoteId: string
  deliveryDate: string
  address: {
    department: string
    city: string
    district: string
    street: string
  }
}
