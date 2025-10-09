export interface QuoteDetailInput {
  clothesVariantId: string
  quantity: number
}

export interface CreateQuoteInput {
  details: QuoteDetailInput[]
  customerId: string
}

export interface QuoteDetail {
  id: string
  unitPrice: number
  quantity: number
  quoteId: string
  clothesVariantId: string
  clothesVariant?: {
    id: string
    additional: string
    size: {
      size: string
    }
    gender: {
      gender: string
    }
    clothes: {
      id: string
      name: string
      price: string
      clothe_image: Array<{ url: string }>
    }
  }
}

export interface Quote {
  id: string
  total: number | string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  customerId: string
  createdAt: string
  updatedAt: string
  details?: QuoteDetail[]
  customer?: {
    id: string
    names: string
    lastNames: string
    phone: string
  }
  totalClothes?: number
  totalUnitsToProduced?: number
}

export interface GetQuotesResponse {
  items: Quote[]
  total: number
  page: number
  limit: number
}

// Para el carrito (estado local)
export interface CartItem {
  clothesId: string
  clothesName: string
  clothesPrice: number
  clothesImage: string
  variantId: string
  size: string
  gender: string
  additional: number
  quantity: number
}
