import React, { useContext } from 'react'
import { SignalementBrowser } from '../composants/common/SignalementBrowser'
import SourceContext from '../contexts/source.context'
import { Signalement } from '../api/signalement'

export function SourcePage() {
  const { source } = useContext(SourceContext)

  return source ? (
    <SignalementBrowser
      initialFilter={{
        types: [],
        status: [Signalement.status.PENDING],
        communes: [],
        sources: [source.id],
      }}
      hideSourceFilter
    />
  ) : null
}
