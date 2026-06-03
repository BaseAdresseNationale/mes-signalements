import React, { useContext } from 'react'
import { SignalementBrowser } from '../composants/common/SignalementBrowser'
import SourceContext from '../contexts/source.context'
import {
  AlertBrowserFilter,
  SignalementBrowserFilter,
} from '../composants/common/SignalementBrowser/types'
import { useLoaderData } from 'react-router-dom'

export function SourcePage() {
  const { source } = useContext(SourceContext)
  const { signalementsInitialFilter, alertsInitialFilter } = useLoaderData() as {
    signalementsInitialFilter: SignalementBrowserFilter
    alertsInitialFilter: AlertBrowserFilter
  }
  signalementsInitialFilter.sources = source ? [{ value: source.id, label: source.nom }] : []
  alertsInitialFilter.sources = source ? [{ value: source.id, label: source.nom }] : []

  return source ? (
    <SignalementBrowser
      fromSource={{ value: source.id, label: source.nom }}
      signalementsInitialFilter={signalementsInitialFilter}
      alertsInitialFilter={alertsInitialFilter}
    />
  ) : null
}
