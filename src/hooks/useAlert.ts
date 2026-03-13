import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Author, CreateAlertDTO, Source } from '../api/signalement'
import { getValueFromLocalStorage, LocalStorageKeys } from '../utils/localStorage.utils'
import { useCommuneStatus } from '../hooks/useCommuneStatus'
import SourceContext from '../contexts/source.context'
import MapContext from '../contexts/map.context'

interface useAlertParams {
  initialAlert: Partial<CreateAlertDTO>
}

export function useAlert({ initialAlert }: useAlertParams) {
  const [alert, setAlert] = useState<Partial<CreateAlertDTO>>(initialAlert)
  const { mapRef } = useContext(MapContext)
  const [codeCommune, setCodeCommune] = useState<string>('')
  const { communeStatus, isCommuneStatusLoading } = useCommuneStatus({
    codeCommune,
  })
  const { source } = useContext(SourceContext)
  const isPublicSource = source?.type !== Source.type.PRIVATE

  useEffect(() => {
    // Set author if provided in local storage
    const authorContact = getValueFromLocalStorage<Author>(LocalStorageKeys.AUTHOR_CONTACT)
    if (authorContact && isPublicSource) {
      onEditAlert('author', {
        firstName: authorContact.firstName,
        lastName: authorContact.lastName,
        email: authorContact.email,
      } as Author)
    }
  }, [isPublicSource])

  useEffect(() => {
    if (initialAlert?.point && mapRef) {
      const [longitude, latitude] = initialAlert.point.coordinates
      const currentZoom = mapRef.getZoom()
      if (currentZoom < 15) {
        mapRef.flyTo({
          center: [longitude, latitude],
          zoom: 17,
          essential: true,
          maxDuration: 3000,
          speed: 1.2,
        })
      }
    }
  }, [mapRef, initialAlert?.point])

  // Get commune code from alert point
  useMemo(() => {
    if (alert?.point) {
      const [longitude, latitude] = alert.point.coordinates
      const fetchCommune = async () => {
        try {
          const response = await fetch(
            `https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&fields=nom,code,centre&format=json&geometry=centre`,
          )
          const communes = await response.json()
          if (communes.length > 0) {
            setCodeCommune(communes[0].code)
          }
        } catch (error) {
          console.error('Error fetching commune:', error)
        }
      }
      fetchCommune()
    } else {
      setCodeCommune('')
    }
  }, [alert?.point])

  const onEditAlert = useCallback(
    (property: keyof Partial<CreateAlertDTO>, value: any) => {
      setAlert(
        (state) =>
          state &&
          ({
            ...state,
            [property]: value,
          } as Partial<CreateAlertDTO>),
      )
    },
    [setAlert],
  )

  return {
    alert,
    onEditAlert,
    communeStatus,
    isCommuneStatusLoading,
    codeCommune,
  }
}
