'use client'

import { useState } from 'react'

import { ShoppingCart } from 'lucide-react'

import { formatPrice } from '@/modules/clothes/helpers'
import { ClothesDetail } from '@/modules/clothes/types'
import { useCart } from '@/modules/quotes/context/cart-context'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface AddToCartSelectorProps {
  clothe: ClothesDetail
}

export const AddToCartSelector = ({ clothe }: AddToCartSelectorProps) => {
  const { addItem } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  const selectedVariant = clothe.clothes_variant.find(
    v => v.id === selectedVariantId
  )

  const price = parseFloat(clothe.price)
  const additional = selectedVariant
    ? parseFloat(selectedVariant.additional)
    : 0
  const totalPrice = (price + additional) * quantity

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Por favor, selecciona una variante')
      return
    }

    const firstImage = clothe.clothe_image[0]?.url || ''

    addItem({
      clothesId: clothe.id,
      clothesName: clothe.name,
      clothesPrice: price,
      clothesImage: firstImage,
      variantId: selectedVariant.id,
      size: selectedVariant.size.size,
      gender: selectedVariant.gender.gender,
      additional,
      quantity
    })

    // Reset
    setSelectedVariantId('')
    setQuantity(1)
  }

  return (
    <div className='space-y-6 rounded-lg border p-6'>
      <h3 className='text-lg font-semibold'>Agregar al Carrito</h3>

      {/* Selector de variante */}
      <div className='space-y-2'>
        <Label>Seleccionar Talla y Género</Label>
        <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
          <SelectTrigger>
            <SelectValue placeholder='Selecciona una opción' />
          </SelectTrigger>
          <SelectContent>
            {clothe.clothes_variant.map(variant => {
              const variantAdditional = parseFloat(variant.additional)
              return (
                <SelectItem key={variant.id} value={variant.id}>
                  <div className='flex items-center gap-2'>
                    <span>
                      {variant.size.size} - {variant.gender.gender}
                    </span>
                    {variantAdditional > 0 && (
                      <Badge variant='secondary' className='ml-2'>
                        +{formatPrice(variantAdditional)}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Cantidad */}
      <div className='space-y-2'>
        <Label>Cantidad</Label>
        <Input
          type='number'
          min={1}
          value={quantity}
          onChange={e =>
            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
          }
        />
      </div>

      {/* Resumen */}
      {selectedVariant && (
        <div className='bg-muted space-y-2 rounded-lg p-4'>
          <div className='flex justify-between text-sm'>
            <span>Precio base:</span>
            <span>{formatPrice(price)}</span>
          </div>
          {additional > 0 && (
            <div className='flex justify-between text-sm'>
              <span>Adicional por talla:</span>
              <span>+{formatPrice(additional)}</span>
            </div>
          )}
          <div className='flex justify-between text-sm'>
            <span>Cantidad:</span>
            <span>×{quantity}</span>
          </div>
          <div className='border-t pt-2'>
            <div className='flex justify-between font-semibold'>
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Botón */}
      <Button
        className='w-full'
        size='lg'
        onClick={handleAddToCart}
        disabled={!selectedVariantId}
      >
        <ShoppingCart className='mr-2 h-5 w-5' />
        Agregar al Carrito
      </Button>
    </div>
  )
}
