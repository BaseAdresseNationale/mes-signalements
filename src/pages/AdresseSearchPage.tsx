import React, { useContext, useEffect } from 'react'
import MapContext from '../contexts/map.context'
import { useMapContent } from '../hooks/useMapContent'
import { SignalementsSearchMap } from '../composants/map/SignalementsSearchMap'

export function AdresseSearchPage() {
  const { setAdresseSearchMapLayersOptions } = useContext(MapContext)

  useEffect(() => {
    setAdresseSearchMapLayersOptions({
      adresse: {},
      'adresse-label': {},
      voie: {},
      toponyme: {},
    })
  }, [setAdresseSearchMapLayersOptions])

  useMapContent(<SignalementsSearchMap />)

  return null
}
