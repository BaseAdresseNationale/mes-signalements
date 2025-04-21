import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Author, PositionDTO, Signalement, Source } from '../api/signalement'
import { getInitialSignalement, getPositionTypeLabel } from '../utils/signalement.utils'
import { IBANPlateformeResult } from '../api/ban-plateforme/types'
import { ChangesRequested } from '../types/signalement.types'
import { getValueFromLocalStorage, LocalStorageKeys } from '../utils/localStorage.utils'
import SourceContext from './source.context'

export interface SignalementContextValue {
  signalement: Signalement | null
  createSignalement: (
    signalementType: Signalement.type,
    adresse: IBANPlateformeResult,
    changesRequested?: ChangesRequested,
  ) => void
  deleteSignalement: () => void
  onEditSignalement: (property: keyof Signalement, key: string) => (value: any) => void
  hasSignalementChanged: boolean
}

export const SignalementContext = createContext<SignalementContextValue>({
  signalement: null,
  createSignalement: () => {},
  deleteSignalement: () => {},
  onEditSignalement: () => () => {},
  hasSignalementChanged: false,
})

interface SignalementContextProviderProps {
  children: React.ReactNode
}

export function SignalementContextProvider(props: Readonly<SignalementContextProviderProps>) {
  const [initialSignalement, setInitialSignalement] = useState<Signalement | null>(null)
  const [signalement, setSignalement] = useState<Signalement | null>(null)
  const { source } = useContext(SourceContext)
  const isPublicSource = source?.type !== Source.type.PRIVATE

  const onEditSignalement = useCallback(
    (property: keyof Signalement, key: string) => (value: any) => {
      setSignalement(
        (state) =>
          state &&
          ({
            ...state,
            [property]: {
              ...(state[property] as object),
              [key]: value,
            },
          } as Signalement),
      )
    },
    [setSignalement],
  )

  const createSignalement = useCallback(
    (
      signalementType: Signalement.type,
      adresse: IBANPlateformeResult,
      changesRequested?: ChangesRequested,
    ) => {
      const signalement = getInitialSignalement(adresse, signalementType)
      setInitialSignalement(signalement)
      setSignalement(signalement)

      // Set the changesRequested if provided in query params
      for (const [key, value] of Object.entries(changesRequested ?? {})) {
        if (key === 'positions') {
          const positions = (value as PositionDTO[]).map(({ point, type }) => ({
            point,
            type: getPositionTypeLabel(type) ? type : PositionDTO.type.ENTR_E,
          }))
          onEditSignalement('changesRequested', key)(positions)
        } else {
          onEditSignalement('changesRequested', key)(value)
        }
      }

      // Set author if provided in local storage
      const authorContact = getValueFromLocalStorage<Author>(LocalStorageKeys.AUTHOR_CONTACT)
      if (authorContact && isPublicSource) {
        console.log('here')
        onEditSignalement('author', 'firstName')(authorContact.firstName)
        onEditSignalement('author', 'lastName')(authorContact.lastName)
        onEditSignalement('author', 'email')(authorContact.email)
      }
    },
    [setSignalement, isPublicSource],
  )

  const deleteSignalement = useCallback(() => {
    setInitialSignalement(null)
    setSignalement(null)
  }, [setSignalement])

  const hasSignalementChanged = useMemo(() => {
    return (
      JSON.stringify(initialSignalement?.changesRequested) !==
      JSON.stringify(signalement?.changesRequested, (_key, value) => {
        if (_key === 'comment') {
          return ''
        }
        if (_key === 'numero') {
          return parseInt(value, 10)
        }
        if (typeof value === 'string') {
          return value.trim()
        }
        return value
      })
    )
  }, [initialSignalement, signalement])

  const value = useMemo(
    () => ({
      createSignalement,
      deleteSignalement,
      onEditSignalement,
      hasSignalementChanged,
      signalement,
    }),
    [createSignalement, deleteSignalement, onEditSignalement, hasSignalementChanged, signalement],
  )

  return <SignalementContext.Provider value={value} {...props} />
}
