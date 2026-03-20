import { useContext, useEffect } from 'react'
import MapContext from '../contexts/map.context'
import { LocalStorageKeys, removeValueFromLocalStorage } from '../utils/localStorage.utils'

export function AdresseSearchPage() {
  const { setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions } =
    useContext(MapContext)

  // Handle Proconnect logout callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const proconnectLogout = params.get('proconnect-logout')
    if (proconnectLogout && proconnectLogout === 'success') {
      removeValueFromLocalStorage(LocalStorageKeys.AUTHOR_CONTACT)
      removeValueFromLocalStorage(LocalStorageKeys.SOURCE_TOKEN)
      params.delete('proconnect-logout')
      params.delete('state')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

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
