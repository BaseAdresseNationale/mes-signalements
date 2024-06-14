import { useCallback, useState } from 'react'
import { ChangesRequested, Signalement } from '../api/signalement'
import { getInitialSignalement } from '../utils/signalement.utils'
import { IBANPlateformeResult } from '../api/ban-plateforme/types'

export interface useSignalementType {
  signalement: Signalement | null
  createSignalement: (
    signalementType: Signalement.type,
    adresse: IBANPlateformeResult,
    changesRequested?: ChangesRequested,
  ) => void
  deleteSignalement: () => void
  onEditSignalement: (property: keyof Signalement, key: string) => (value: any) => void
  isEditParcellesMode: boolean
  setIsEditParcellesMode: (isEditParcellesMode: boolean) => void
}

export function useSignalement(): useSignalementType {
  const [signalement, setSignalement] = useState<Signalement | null>(null)
  const [isEditParcellesMode, setIsEditParcellesMode] = useState(false)

  const createSignalement = useCallback(
    (
      signalementType: Signalement.type,
      adresse: IBANPlateformeResult,
      changesRequested?: ChangesRequested,
    ) => {
      setSignalement(getInitialSignalement(adresse, signalementType, changesRequested))
    },
    [setSignalement],
  )

  const deleteSignalement = useCallback(() => {
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

  return {
    signalement,
    createSignalement,
    deleteSignalement,
    onEditSignalement,
    isEditParcellesMode,
    setIsEditParcellesMode,
  }
}
