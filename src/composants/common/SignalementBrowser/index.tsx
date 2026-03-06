import React from 'react'
import { SignalementTab } from './SignalementTab'
import { Tabs } from '@codegouvfr/react-dsfr/Tabs'
import { AlertTab } from './AlertTab'
import { AlertBrowserFilter, SignalementBrowserFilter } from './types'

interface SignalementBrowserProps {
  fromSource?: { value: string; label: string }
}

export function SignalementBrowser({ fromSource }: SignalementBrowserProps) {
  const hideSourceFilter = !!fromSource
  const initialFilter = {
    status: [],
    types: [],
    communes: [],
    sources: fromSource ? [fromSource] : [],
  }

  return (
    <Tabs
      tabs={[
        {
          label: 'Signalements',
          content: (
            <SignalementTab
              initialFilter={initialFilter as SignalementBrowserFilter}
              hideSourceFilter={hideSourceFilter}
            />
          ),
          isDefault: true,
        },
        {
          label: 'Alertes',
          content: (
            <AlertTab
              initialFilter={initialFilter as AlertBrowserFilter}
              hideSourceFilter={hideSourceFilter}
            />
          ),
        },
      ]}
    />
  )
}
