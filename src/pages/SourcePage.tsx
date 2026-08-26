import React, { useContext } from 'react'
import { SignalementBrowser } from '../composants/common/SignalementBrowser'
import SourceContext from '../contexts/source.context'
import { BrowserFilter } from '../composants/common/SignalementBrowser/types'
import { useLoaderData } from 'react-router-dom'

export function SourcePage() {
  const { source } = useContext(SourceContext)
  const { initialFilters } = useLoaderData() as {
    initialFilters: BrowserFilter
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
    />
  ) : null
}
