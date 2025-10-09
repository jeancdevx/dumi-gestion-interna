import { CLOTHES_GENDER } from '../types'

export const getSizeApiValue = (sizeName: string): string => sizeName

export const getGenderApiValue = (genderName: string): string => {
  const genderMap: Record<string, string> = {
    hombre: CLOTHES_GENDER.MALE,
    mujer: CLOTHES_GENDER.FEMALE,
    unisex: CLOTHES_GENDER.UNISEX
  }

  return genderMap[genderName] || CLOTHES_GENDER.UNISEX
}
