import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Author, CommuneStatusDTO, CreateAlertDTO, Source } from '../api/signalement'
import SourceContext from './source.context'
import { getValueFromLocalStorage, LocalStorageKeys } from '../utils/localStorage.utils'
import { useCommuneStatus } from '../hooks/useCommuneStatus'
import { useLoaderData } from 'react-router-dom'

export interface AlertContextValue {
  alert: Partial<CreateAlertDTO> | null
  createAlert: (alert: Partial<CreateAlertDTO>) => void
  deleteAlert: () => void
  onEditAlert: (property: keyof Partial<CreateAlertDTO>, value: any) => void
  communeStatus: CommuneStatusDTO
  isCommuneStatusLoading: boolean
  codeCommune: string
}

export const AlertContext = createContext<AlertContextValue>({
  alert: null,
  createAlert: () => {},
  deleteAlert: () => {},
  onEditAlert: () => {},
  communeStatus: { disabled: true },
  isCommuneStatusLoading: true,
  codeCommune: '',
})

interface AlertContextProviderProps {
  children: React.ReactNode
}

export function AlertContextProvider(props: Readonly<AlertContextProviderProps>) {
  const loaderData = useLoaderData() as {
    intialAlert: Partial<CreateAlertDTO> | null
  }
  console.log('AlertContextProvider loaderData', loaderData)
  const [alert, setAlert] = useState<Partial<CreateAlertDTO> | null>(
    loaderData?.intialAlert || null,
  )

  const [codeCommune, setCodeCommune] = useState<string>('')
  const { communeStatus, isCommuneStatusLoading } = useCommuneStatus({
    codeCommune,
  })
  const { source } = useContext(SourceContext)
  const isPublicSource = source?.type !== Source.type.PRIVATE

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

  const createAlert = useCallback(
    (alert: Partial<CreateAlertDTO>) => {
      console.log('Creating alert with data:', alert)
      setAlert(alert as Partial<CreateAlertDTO>)

      // Set author if provided in local storage
      const authorContact = getValueFromLocalStorage<Author>(LocalStorageKeys.AUTHOR_CONTACT)
      if (authorContact && isPublicSource) {
        onEditAlert('author', {
          firstName: authorContact.firstName,
          lastName: authorContact.lastName,
          email: authorContact.email,
        } as Author)
      }
    },
    [setAlert, onEditAlert, isPublicSource],
  )

  const deleteAlert = useCallback(() => {
    setAlert(null)
  }, [setAlert])

  const value = useMemo(
    () => ({
      createAlert,
      deleteAlert,
      onEditAlert,
      alert,
      codeCommune,
      communeStatus,
      isCommuneStatusLoading,
    }),
    [createAlert, deleteAlert, onEditAlert, alert, communeStatus, isCommuneStatusLoading],
  )

  return <AlertContext.Provider value={value} {...props} />
}
