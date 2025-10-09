'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { CartItem } from '../types'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
}

export const selectTotalItems = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0)

export const selectTotalPrice = (state: CartStore) =>
  state.items.reduce(
    (sum, item) => sum + (item.clothesPrice + item.additional) * item.quantity,
    0
  )

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        set(state => {
          const existing = state.items.find(i => i.variantId === item.variantId)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (variantId: string) => {
        set(state => ({
          items: state.items.filter(i => i.variantId !== variantId)
        }))
      },

      updateQuantity: (variantId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
        } else {
          set(state => ({
            items: state.items.map(i =>
              i.variantId === variantId ? { ...i, quantity } : i
            )
          }))
        }
      },

      clearCart: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'quote-cart-storage'
    }
  )
)

export const useCart = useCartStore
