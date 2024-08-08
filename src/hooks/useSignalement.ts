import { useCallback, useMemo, useState } from 'react'
import { Signalement } from '../api/signalement'
import { getInitialSignalement } from '../utils/signalement.utils'
import { IBANPlateformeResult } from '../api/ban-plateforme/types'
import { ChangesRequested } from '../types/signalement.types'

export interface useSignalementType {
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

export function useSignalement(): useSignalementType {
  const [initialSignalement, setInitialSignalement] = useState<Signalement | null>(null)
  const [signalement, setSignalement] = useState<Signalement | null>(null)

  const createSignalement = useCallback(
    (
      signalementType: Signalement.type,
      adresse: IBANPlateformeResult,
      changesRequested?: ChangesRequested,
    ) => {
      const signalement = getInitialSignalement(adresse, signalementType, changesRequested)
      setInitialSignalement(signalement)
      setSignalement(signalement)
    },
    [setSignalement],
  )

  const deleteSignalement = useCallback(() => {
    setInitialSignalement(null)
    setSignalement(null)
  }, [setSignalement])

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

  const hasSignalementChanged = useMemo(() => {
    return (
      JSON.stringify(initialSignalement) !==
      JSON.stringify(signalement, (_key, value) => {
        if (typeof value === 'string') {
          return value.trim()
        }
        return value
      })
    )
  }, [initialSignalement, signalement])

  return {
    signalement,
    createSignalement,
    deleteSignalement,
    onEditSignalement,
    hasSignalementChanged,
  }
}
