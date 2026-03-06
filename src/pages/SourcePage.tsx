import React, { useContext } from 'react'
import { SignalementBrowser } from '../composants/common/SignalementBrowser'
import SourceContext from '../contexts/source.context'

export function SourcePage() {
  const { source } = useContext(SourceContext)

  return source ? <SignalementBrowser fromSource={{ value: source.id, label: source.nom }} /> : null
}
