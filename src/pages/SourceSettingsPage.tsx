import React, { useContext } from 'react'
import SourceContext from '../contexts/source.context'
import { SourceSettingsForm } from '../composants/source/SourceSettingsForm'

export function SourceSettingsPage() {
  const { source, setSource } = useContext(SourceContext)

  return source ? <SourceSettingsForm source={source} onUpdate={setSource} /> : null
}
