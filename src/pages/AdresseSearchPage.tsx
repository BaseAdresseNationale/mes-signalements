import React, { useMemo } from 'react'
import { useMapContent } from '../hooks/useMapContent'
import { AdresseSearchMap } from '../composants/map/AdresseSearchMap'

export function AdresseSearchPage() {
  useMapContent(useMemo(() => <AdresseSearchMap />, []))

  return null
}
