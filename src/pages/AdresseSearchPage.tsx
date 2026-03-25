import { useContext, useEffect } from 'react'
import MapContext from '../contexts/map.context'

export function AdresseSearchPage() {
  const { setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions } =
    useContext(MapContext)

  useEffect(() => {
    setAdresseSearchMapLayersOptions({
      adresse: {},
      'adresse-label': {},
      voie: {},
      toponyme: {},
    })
    setSignalementSearchMapLayerOptions({})
  }, [setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions])

  return null
}
