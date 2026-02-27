import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Author, CreateAlertDTO, Source } from '../api/signalement'
import SourceContext from './source.context'
import { getValueFromLocalStorage, LocalStorageKeys } from '../utils/localStorage.utils'

export interface AlertContextValue {
  alert: CreateAlertDTO | null
  createAlert: (point: CreateAlertDTO['point']) => void
  deleteAlert: () => void
  onEditAlert: (property: keyof CreateAlertDTO, value: any) => void
}

export const AlertContext = createContext<AlertContextValue>({
  alert: null,
  createAlert: () => {},
  deleteAlert: () => {},
  onEditAlert: () => {},
})

interface AlertContextProviderProps {
  children: React.ReactNode
}

export function AlertContextProvider(props: Readonly<AlertContextProviderProps>) {
  const [alert, setAlert] = useState<CreateAlertDTO | null>(null)
  const { source } = useContext(SourceContext)
  const isPublicSource = source?.type !== Source.type.PRIVATE

  const onEditAlert = useCallback(
    (property: keyof CreateAlertDTO, value: any) => {
      setAlert(
        (state) =>
          state &&
          ({
            ...state,
            [property]: value,
          } as CreateAlertDTO),
      )
    },
    [setAlert],
  )

  const createAlert = useCallback(
    (point: CreateAlertDTO['point']) => {
      setAlert({ point } as CreateAlertDTO)

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
    }),
    [createAlert, deleteAlert, onEditAlert, alert],
  )

  return <AlertContext.Provider value={value} {...props} />
}
