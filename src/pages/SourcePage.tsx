import React, { useContext } from 'react'
import { SignalementBrowser } from '../composants/common/SignalementBrowser'
import SourceContext from '../contexts/source.context'
import { BrowserFilter, BrowserTabId } from '../composants/common/SignalementBrowser/types'
import { useLoaderData } from 'react-router-dom'

export function SourcePage() {
  const { source } = useContext(SourceContext)
  const { initialFilters, initialTab, initialPage } = useLoaderData() as {
    initialFilters: BrowserFilter
    initialTab: BrowserTabId
    initialPage: number
  }
  const sourceOption = source ? [{ value: source.id, label: source.nom }] : []

  const initialFiltersWithSource = {
    ...initialFilters,
    sources: sourceOption,
  }

  return source ? (
    <SignalementBrowser
      fromSource={{ value: source.id, label: source.nom }}
      initialFilters={initialFiltersWithSource}
      initialTab={initialTab}
      initialPage={initialPage}
    />
  ) : null
}
