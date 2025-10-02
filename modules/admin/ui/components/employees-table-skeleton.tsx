import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export function EmployeesTableSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-10 w-[250px]' />
        <Skeleton className='h-10 w-[100px]' />
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className='h-4 w-[100px]' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-[80px]' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-[120px]' />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-[180px]' />
                      <Skeleton className='h-3 w-[200px]' />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-6 w-[70px] rounded-full' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[100px]' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-[200px]' />
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 w-[100px]' />
          <Skeleton className='h-9 w-[100px]' />
        </div>
      </div>
    </div>
  )
}
