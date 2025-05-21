import React, { useContext } from 'react'
import { SignalementBrowser } from '../composants/common/SignalementBrowser'
import SourceContext from '../contexts/source.context'

export function SourcePage() {
  const { source } = useContext(SourceContext)

  return source ? (
    <SignalementBrowser
      initialFilter={{
        types: [],
        status: [],
        communes: [],
        sources: [{ value: source.id, label: source.nom }],
      }}
      hideSourceFilter
    />
  ) : null
}
