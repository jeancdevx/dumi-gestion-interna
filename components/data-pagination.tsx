'use client'

import { useRouter } from 'next/navigation'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from './ui/pagination'

interface DataPaginationProps {
  total: number
  limit: number
  currentPage: number
  onPageChange?: (page: number) => void
}

const DataPagination = ({
  total,
  limit,
  currentPage,
  onPageChange
}: DataPaginationProps) => {
  const router = useRouter()
  const totalPages = Math.ceil(total / limit)
  const startItem = (currentPage - 1) * limit + 1
  const endItem = Math.min(currentPage * limit, total)

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
    } else {
      router.push(`?page=${page}`)
    }
  }

  return (
    <>
      {total > 0 && (
        <div className='flex items-center justify-between px-2'>
          <p className='text-muted-foreground text-sm'>
            Mostrando {startItem} - {endItem} de {total} prendas
          </p>

          {totalPages > 1 && (
            <Pagination className='justify-end'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={e => {
                      e.preventDefault()
                      if (currentPage > 1) {
                        handlePageChange(Math.max(currentPage - 1, 1))
                      }
                    }}
                    className={
                      currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  page => {
                    // Mostrar solo algunas páginas alrededor de la actual
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href='#'
                            onClick={e => {
                              e.preventDefault()
                              handlePageChange(page)
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <span className='px-4'>...</span>
                        </PaginationItem>
                      )
                    }
                    return null
                  }
                )}

                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={e => {
                      e.preventDefault()
                      if (currentPage < totalPages) {
                        handlePageChange(Math.min(currentPage + 1, totalPages))
                      }
                    }}
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </>
  )
}

export { DataPagination }
