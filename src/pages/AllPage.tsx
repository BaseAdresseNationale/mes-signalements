import React from 'react'
import { SignalementBrowser } from '../composants/common/SignalementBrowser'
import { useLoaderData } from 'react-router-dom'
import {
  AlertBrowserFilter,
  SignalementBrowserFilter,
} from '../composants/common/SignalementBrowser/types'

export function AllPage() {
  const { signalementsInitialFilter, alertsInitialFilter } = useLoaderData() as {
    signalementsInitialFilter: SignalementBrowserFilter
    alertsInitialFilter: AlertBrowserFilter
  }

  return (
    <SignalementBrowser
      signalementsInitialFilter={signalementsInitialFilter}
      alertsInitialFilter={alertsInitialFilter}
    />
  )
}
