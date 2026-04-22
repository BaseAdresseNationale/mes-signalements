import { useCallback, useEffect, useState } from 'react'
import { BrowserFilter } from '../composants/common/SignalementBrowser/types'

export interface PaginatedData<TItem> {
  data: TItem[]
  total: number
}

export function useBrowserData<
  TType extends string,
  TStatus extends string,
  TPaginated extends PaginatedData<unknown>,
>(
  fetcher: (page: number, filter: BrowserFilter<TType, TStatus>) => Promise<TPaginated>,
  initialFilter: BrowserFilter<TType, TStatus>,
) {
  const [paginatedData, setPaginatedData] = useState<TPaginated>()
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<BrowserFilter<TType, TStatus>>(initialFilter)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    fetcher(page, filter)
      .then((data) => {
        if (!cancelled) {
          setPaginatedData(data)
        }
      })
      .catch((error) => {
        console.error('Error fetching browser data:', error)
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [fetcher, page, filter])

  const resetFilter = useCallback(() => {
    setFilter(initialFilter)
    setPage(1)
  }, [initialFilter])

  const updateFilter = useCallback((newFilter: BrowserFilter<TType, TStatus>) => {
    setFilter(newFilter)
    setPage(1)
  }, [])

  return {
    paginatedData,
    isLoading,
    filter,
    setFilter: updateFilter,
    page,
    setPage,
    resetFilter,
  }
}
