import React, { createContext, useCallback, useMemo, useState } from 'react'
import { Signalement } from '../api/signalement'
import { getInitialSignalement } from '../utils/signalement.utils'
import { IBANPlateformeResult } from '../api/ban-plateforme/types'
import { ChangesRequested } from '../types/signalement.types'

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
      for (const [key, value] of Object.entries(changesRequested ?? {})) {
        onEditSignalement('changesRequested', key)(value)
      }
    },
    [setSignalement],
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
