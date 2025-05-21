import React, { useContext } from 'react'
import { SignalementBrowser } from '../composants/common/SignalementBrowser'
import SourceContext from '../contexts/source.context'
import { filterStatusOptions } from '../composants/common/SignalementBrowser/FiltersModal'

export function SourcePage() {
  const { source } = useContext(SourceContext)

  return source ? (
    <SignalementBrowser
      initialFilter={{
        types: [],
        status: [filterStatusOptions[0]],
        communes: [],
        sources: [{ value: source.id, label: source.nom }],
      }}
      hideSourceFilter
    />
  ) : null
}
