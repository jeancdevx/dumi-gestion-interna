'use client'

import { useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'

import { formatPrice } from '@/modules/clothes/helpers'
import {
  selectTotalItems,
  selectTotalPrice,
  useCart
} from '@/modules/quotes/context/cart-context'
import { createQuoteAction } from '@/modules/quotes/server/actions'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

interface CartDrawerProps {
  customerId?: string
}

export const CartDrawer = ({ customerId }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const totalItems = useCart(selectTotalItems)
  const totalPrice = useCart(selectTotalPrice)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCreateQuote = async () => {
    if (!customerId) {
      alert('Debe seleccionar un cliente primero')
      return
    }

    if (items.length === 0) {
      alert('El carrito está vacío')
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append('customerId', customerId)
    formData.append(
      'details',
      JSON.stringify(
        items.map(item => ({
          clothesVariantId: item.variantId,
          quantity: item.quantity
        }))
      )
    )

    const result = await createQuoteAction(formData)

    setIsLoading(false)

    if (result.success) {
      clearCart()
      setIsOpen(false)
      router.push(`/admin/quotes/${result.data.id}`)
    } else {
      alert(result.message)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon' className='relative'>
          <ShoppingCart className='h-5 w-5' />
          {totalItems > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs'
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className='flex w-full flex-col sm:max-w-lg'>
        <SheetHeader>
          <SheetTitle>Carrito de Cotización</SheetTitle>
          <SheetDescription>
            {totalItems} {totalItems === 1 ? 'prenda' : 'prendas'} en el carrito
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 px-6'>
            <ShoppingCart className='text-muted-foreground h-16 w-16' />
            <p className='text-muted-foreground text-center'>
              El carrito está vacío
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className='flex-1 px-6'>
              <div className='space-y-4'>
                {items.map(item => (
                  <div
                    key={item.variantId}
                    className='flex gap-4 rounded-lg border p-4'
                  >
                    <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md'>
                      <Image
                        src={item.clothesImage}
                        alt={item.clothesName}
                        fill
                        className='object-cover'
                        unoptimized
                      />
                    </div>
                    <div className='flex flex-1 flex-col gap-2'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <h4 className='font-semibold'>{item.clothesName}</h4>
                          <div className='mt-1 flex gap-2'>
                            <Badge variant='outline'>{item.size}</Badge>
                            <Badge variant='outline'>{item.gender}</Badge>
                          </div>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                          >
                            <Minus className='h-3 w-3' />
                          </Button>
                          <span className='w-8 text-center font-medium'>
                            {item.quantity}
                          </span>
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                          >
                            <Plus className='h-3 w-3' />
                          </Button>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-semibold'>
                            {formatPrice(
                              (item.clothesPrice + item.additional) *
                                item.quantity
                            )}
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            {formatPrice(item.clothesPrice + item.additional)}{' '}
                            c/u
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className='space-y-4 border-t px-6 py-4'>
              <div className='flex items-center justify-between'>
                <span className='text-lg font-semibold'>Total</span>
                <span className='text-2xl font-bold'>
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Button
                className='w-full'
                size='lg'
                onClick={handleCreateQuote}
                disabled={isLoading || !customerId}
              >
                {isLoading ? 'Creando...' : 'Crear Cotización'}
              </Button>
              {!customerId && (
                <p className='text-destructive text-center text-sm'>
                  Debe seleccionar un cliente antes de crear la cotización
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
