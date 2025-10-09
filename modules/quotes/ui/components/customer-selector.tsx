'use client'

import { useState } from 'react'

import { User } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface Customer {
  id: string
  names: string
  lastNames: string
  phone: string
}

interface CustomerSelectorProps {
  customers: Customer[]
  onCustomerSelect: (customerId: string) => void
}

export const CustomerSelector = ({
  customers,
  onCustomerSelect
}: CustomerSelectorProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')

  const handleSelect = (value: string) => {
    setSelectedCustomer(value)
    onCustomerSelect(value)
  }

  return (
    <div className='flex items-center gap-2'>
      <User className='text-muted-foreground h-4 w-4' />
      <Select value={selectedCustomer} onValueChange={handleSelect}>
        <SelectTrigger className='w-[200px]'>
          <SelectValue placeholder='Seleccionar cliente' />
        </SelectTrigger>
        <SelectContent>
          {customers.map(customer => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.names} {customer.lastNames}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
