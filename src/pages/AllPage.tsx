import React from 'react'
import { SignalementBrowser } from '../composants/common/SignalementBrowser'
import { useLoaderData } from 'react-router-dom'
import { BrowserFilter, BrowserTabId } from '../composants/common/SignalementBrowser/types'

export function AllPage() {
  const { initialFilters, initialTab, initialPage } = useLoaderData() as {
    initialFilters: BrowserFilter
    initialTab: BrowserTabId
    initialPage: number
  }

  return (
    <SignalementBrowser
      initialFilters={initialFilters}
      initialTab={initialTab}
      initialPage={initialPage}
    />
  )
}
