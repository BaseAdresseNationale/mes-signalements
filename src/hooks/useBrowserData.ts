import { useCallback, useEffect, useState } from 'react'
import { BrowserFilter } from '../composants/common/SignalementBrowser/types'
import { updateHashSearchParams } from '../utils/signalement-browser.utils'

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
  initialPages: { signalements?: number; alerts?: number } = {},
) {
  const [filter, setFilter] = useState<BrowserFilter>(initialFilter)
  const signalementsBrowser = useTabData<SPaginated>(
    fetchSignalements,
    filter,
    initialPages.signalements,
  )
  const alertsBrowser = useTabData<APaginated>(fetchAlerts, filter, initialPages.alerts)

  const syncFilterToUrl = useCallback((newFilter: BrowserFilter) => {
    const toParam = (values: { value: string }[]) =>
      values.length === 0 ? null : values.map((v) => v.value).join(',')

    updateHashSearchParams({
      status: toParam(newFilter.status),
      signalementTypes: toParam(newFilter.signalementTypes),
      alertTypes: toParam(newFilter.alertTypes),
      communes: toParam(newFilter.communes),
      departements: toParam(newFilter.departements),
    })
  }, [])

  const resetFilter = useCallback(() => {
    const reset = {
      signalementTypes: [],
      alertTypes: [],
      status: [],
      communes: [],
      departements: [],
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
  initialPage = 1,
) {
  const [paginatedData, setPaginatedData] = useState<TPaginated>()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(initialPage)

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
