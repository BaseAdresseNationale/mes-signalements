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

  const syncFilterToUrl = useCallback((newFilter: BrowserFilter<TType, TStatus>) => {
    // Update the URL directly via the History API so react-router's loader is not re-triggered.
    // HashRouter stores the route (and its search params) inside window.location.hash.
    const url = new URL(window.location.href)
    const [hashPath, hashSearch = ''] = (url.hash.startsWith('#') ? url.hash.slice(1) : '').split(
      '?',
    )
    const params = new URLSearchParams(hashSearch)
    const apply = (key: string, values: string[]) => {
      if (values.length === 0) {
        params.delete(key)
      } else {
        params.set(key, values.join(','))
      }
    }
    apply(
      'status',
      newFilter.status.map((s) => s.value),
    )
    apply(
      'types',
      newFilter.types.map((t) => t.value),
    )
    apply(
      'communes',
      newFilter.communes.map((c) => c.value),
    )
    const search = params.toString()
    url.hash = '#' + (hashPath || '/') + (search ? '?' + search : '')
    window.history.replaceState(window.history.state, '', url.toString())
  }, [])

  // Update URL when filter changes
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
    const reset = {
      types: [],
      status: [],
      communes: [],
      sources: initialFilter.sources,
    }
    setFilter(reset)
    setPage(1)
    syncFilterToUrl(reset)
  }, [initialFilter, syncFilterToUrl])

  const updateFilter = useCallback(
    (newFilter: BrowserFilter<TType, TStatus>) => {
      setFilter(newFilter)
      setPage(1)
      syncFilterToUrl(newFilter)
    },
    [syncFilterToUrl],
  )

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
