import React from 'react'
import { SignalementBrowser } from '../composants/common/SignalementBrowser'
import { useLoaderData } from 'react-router-dom'
import { BrowserFilter } from '../composants/common/SignalementBrowser/types'

export function AllPage() {
  const { initialFilters } = useLoaderData() as {
    initialFilters: BrowserFilter
  }

  return <SignalementBrowser initialFilters={initialFilters} />
}
