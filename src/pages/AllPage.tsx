import React from 'react'
import { SignalementBrowser } from '../composants/common/SignalementBrowser'

export function AllPage() {
  return (
    <SignalementBrowser
      initialFilter={{
        status: [],
        types: [],
        communes: [],
        sources: [],
      }}
    />
  )
}
