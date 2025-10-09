'use client'

import { PlusIcon, Trash2Icon } from 'lucide-react'

import { GarmentSizeFormData } from '@/modules/clothes/schemas'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface SizeSelectorProps {
  value: GarmentSizeFormData[]
  onChange: (sizes: GarmentSizeFormData[]) => void
  disabled?: boolean
}

const AVAILABLE_SIZES = [
  '2',
  '4',
  '6',
  '8',
  '10',
  '12',
  '14',
  '16',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL'
]
const AVAILABLE_GENDERS = [
  { value: 'hombre', label: 'Hombre' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'unisex', label: 'Unisex' }
] as const

export const SizeSelector = ({
  value = [],
  onChange,
  disabled = false
}: SizeSelectorProps) => {
  const addSize = () => {
    onChange([...value, { size: '', gender: 'unisex', additional: 0 }])
  }

  const removeSize = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateSize = (
    index: number,
    field: keyof GarmentSizeFormData,
    newValue: string | number
  ) => {
    const newSizes = [...value]
    newSizes[index] = { ...newSizes[index], [field]: newValue }
    onChange(newSizes)
  }

  // Check if a size+gender combination is already used (excluding current index)
  const isSizeGenderDuplicate = (
    size: string,
    gender: string,
    currentIndex: number
  ): boolean => {
    return value.some(
      (item, idx) =>
        idx !== currentIndex &&
        item.size === size &&
        item.gender === gender &&
        size !== '' // Don't validate empty sizes
    )
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <label className='text-sm font-medium'>
          Tallas, Género y Precio Adicional
        </label>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={addSize}
          disabled={disabled}
        >
          <PlusIcon className='mr-1 h-4 w-4' />
          Agregar Talla
        </Button>
      </div>

      {value.length === 0 ? (
        <div className='border-muted-foreground/25 bg-muted/10 flex min-h-[100px] items-center justify-center rounded-lg border-2 border-dashed px-4 py-8'>
          <div className='text-center'>
            <p className='text-muted-foreground text-sm'>
              No hay tallas agregadas
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>
              Haz clic en &quot;Agregar Talla&quot; para comenzar
            </p>
          </div>
        </div>
      ) : (
        <div className='space-y-2'>
          {value.map((item, index) => {
            const isDuplicate = isSizeGenderDuplicate(
              item.size,
              item.gender,
              index
            )

            return (
              <div key={index} className='space-y-1'>
                <div className='bg-card rounded-lg border p-3'>
                  <div className='flex items-start gap-2'>
                    <div className='grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3'>
                      {/* Size Select */}
                      <div className='min-w-0'>
                        <Select
                          value={item.size}
                          onValueChange={newValue =>
                            updateSize(index, 'size', newValue)
                          }
                          disabled={disabled}
                        >
                          <SelectTrigger
                            className={isDuplicate ? 'border-destructive' : ''}
                          >
                            <SelectValue placeholder='Talla' />
                          </SelectTrigger>
                          <SelectContent className='max-h-[300px]'>
                            {AVAILABLE_SIZES.map(size => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Gender Select */}
                      <div className='min-w-0'>
                        <Select
                          value={item.gender}
                          onValueChange={newValue =>
                            updateSize(
                              index,
                              'gender',
                              newValue as GarmentSizeFormData['gender']
                            )
                          }
                          disabled={disabled}
                        >
                          <SelectTrigger
                            className={isDuplicate ? 'border-destructive' : ''}
                          >
                            <SelectValue placeholder='Género' />
                          </SelectTrigger>
                          <SelectContent className='max-h-[200px]'>
                            {AVAILABLE_GENDERS.map(gender => (
                              <SelectItem
                                key={gender.value}
                                value={gender.value}
                              >
                                {gender.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Additional Price Input */}
                      <div className='col-span-2 min-w-0 sm:col-span-1'>
                        <div className='relative'>
                          <span className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm'>
                            +S/
                          </span>
                          <Input
                            type='number'
                            step='0.01'
                            min='0'
                            placeholder='0.00'
                            disabled={disabled}
                            className='pl-12'
                            value={item.additional || 0}
                            onChange={e => {
                              const value = e.target.value
                              updateSize(
                                index,
                                'additional',
                                value === '' ? 0 : parseFloat(value)
                              )
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => removeSize(index)}
                      disabled={disabled}
                      className='text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9 shrink-0'
                    >
                      <Trash2Icon className='h-4 w-4' />
                      <span className='sr-only'>Eliminar talla</span>
                    </Button>
                  </div>
                </div>

                {/* Duplicate Warning */}
                {isDuplicate && (
                  <p className='text-destructive px-3 text-xs'>
                    Esta combinación de talla y género ya existe
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
