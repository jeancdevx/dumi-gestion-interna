export interface ClothesVariant {
  clothesId: string
  sizeId: string
  genderId: string
  additional: number
  id: string
}

export interface PreSignedPut {
  key: string
  putUrl: string
  expiresAt: string
  requiredHeaders: {
    'Content-Type': string
  }
}

export interface CreateClothesResponse {
  name: string
  description: string
  price: number
  id: string
  createdAt: string
  updatedAt: string
  variants: ClothesVariant[]
  preSignedPuts: PreSignedPut[]
}

export enum CLOTHES_SIZES {
  TALLA_2 = '2',
  TALLA_4 = '4',
  TALLA_6 = '6',
  TALLA_8 = '8',
  TALLA_10 = '10',
  TALLA_12 = '12',
  TALLA_14 = '14',
  TALLA_16 = '16',
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL'
}

export enum CLOTHES_GENDER {
  MALE = 'HOMBRE',
  FEMALE = 'MUJER',
  UNISEX = 'UNISEX'
}

export interface ClothesVariant {
  id: string
  clothesId: string
  sizeId: string
  genderId: string
  additional: number
  size?: {
    id: string
    name: string
  }
  gender?: {
    id: string
    name: string
  }
}

export interface ClothesImage {
  url: string
}

export interface ClothesItem {
  id: string
  name: string
  description: string | null
  price: string
  clothe_image: ClothesImage[]
}

export interface GetClothesResponse {
  items: ClothesItem[]
  total: number
  page: number
  limit: number
}

export interface ClothesDetailVariant {
  id: string
  additional: string
  size: {
    size: string
  }
  gender: {
    gender: string
  }
}

export interface ClothesDetail {
  id: string
  name: string
  description: string | null
  price: string
  createdAt: string
  updatedAt: string
  clothes_variant: ClothesDetailVariant[]
  clothe_image: ClothesImage[]
}
