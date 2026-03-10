import React from 'react'
import { SignalementTab } from './SignalementTab'
import { Tabs } from '@codegouvfr/react-dsfr/Tabs'
import { AlertTab } from './AlertTab'
import { AlertBrowserFilter, SignalementBrowserFilter } from './types'
import styled from 'styled-components'

interface SignalementBrowserProps {
  fromSource?: { value: string; label: string }
}

const StyledTabs = styled(Tabs)`
  height: 100%;
  .fr-tabs__panel {
    height: 100%;
    padding: 0;
  }
`

export function SignalementBrowser({ fromSource }: SignalementBrowserProps) {
  const hideSourceFilter = !!fromSource
  const initialFilter = {
    status: [],
    types: [],
    communes: [],
    sources: fromSource ? [fromSource] : [],
  }

  return (
    <StyledTabs
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
