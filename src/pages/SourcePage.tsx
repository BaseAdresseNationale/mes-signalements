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
  const loaderData = useLoaderData() as {
    signalementsInitialFilter: SignalementBrowserFilter
    alertsInitialFilter: AlertBrowserFilter
  }
  const sourceOption = source ? [{ value: source.id, label: source.nom }] : []

  const signalementsInitialFilter = {
    ...loaderData.signalementsInitialFilter,
    sources: sourceOption,
  }
  const alertsInitialFilter = { ...loaderData.alertsInitialFilter, sources: sourceOption }

  return source ? (
    <SignalementBrowser
      fromSource={{ value: source.id, label: source.nom }}
      signalementsInitialFilter={signalementsInitialFilter}
      alertsInitialFilter={alertsInitialFilter}
    />
  ) : null
}
