import { useContext, useEffect } from 'react'
import MapContext from '../contexts/map.context'

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

  return null
}
