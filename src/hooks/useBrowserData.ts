import { useCallback, useEffect, useState } from 'react'
import { BrowserFilter } from '../composants/common/SignalementBrowser/types'

export interface PaginatedData<TItem> {
  data: TItem[]
  total: number
}

export function useBrowserData<
  SPaginated extends PaginatedData<unknown>,
  APaginated extends PaginatedData<unknown>,
>(
  {
    fetchSignalements,
    fetchAlerts,
  }: {
    fetchSignalements: (page: number, filter: BrowserFilter) => Promise<SPaginated>
    fetchAlerts: (page: number, filter: BrowserFilter) => Promise<APaginated>
  },
  initialFilter: BrowserFilter,
) {
  const [filter, setFilter] = useState<BrowserFilter>(initialFilter)
  const signalementsBrowser = useTabData<SPaginated>(fetchSignalements, filter)
  const alertsBrowser = useTabData<APaginated>(fetchAlerts, filter)

  const syncFilterToUrl = useCallback((newFilter: BrowserFilter) => {
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
      'signalementTypes',
      newFilter.signalementTypes.map((t) => t.value),
    )
    apply(
      'alertTypes',
      newFilter.alertTypes.map((t) => t.value),
    )
    apply(
      'communes',
      newFilter.communes.map((c) => c.value),
    )
    const search = params.toString()
    url.hash = '#' + (hashPath || '/') + (search ? '?' + search : '')
    window.history.replaceState(window.history.state, '', url.toString())
  }, [])

  const resetFilter = useCallback(() => {
    const reset = {
      signalementTypes: [],
      alertTypes: [],
      status: [],
      communes: [],
      sources: initialFilter.sources,
    }
    setFilter(reset)
    signalementsBrowser.setPage(1)
    alertsBrowser.setPage(1)
    syncFilterToUrl(reset)
  }, [initialFilter, syncFilterToUrl])

  const updateFilter = useCallback(
    (newFilter: BrowserFilter) => {
      setFilter(newFilter)
      signalementsBrowser.setPage(1)
      alertsBrowser.setPage(1)
      syncFilterToUrl(newFilter)
    },
    [syncFilterToUrl],
  )

  return {
    signalementsBrowser,
    alertsBrowser,
    filter,
    setFilter: updateFilter,
    resetFilter,
  }
}

function useTabData<TPaginated>(
  fetcher: (page: number, filter: BrowserFilter) => Promise<TPaginated>,
  filter: BrowserFilter,
) {
  const [paginatedData, setPaginatedData] = useState<TPaginated>()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)

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

  return {
    paginatedData,
    isLoading,
    page,
    setPage,
    setPaginatedData,
    setIsLoading,
  }
}
