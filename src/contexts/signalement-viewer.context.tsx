import React, { createContext, useMemo, useState } from 'react'
import { Signalement } from '../api/signalement'
import Modal from '../composants/common/Modal'
import { getModalTitle } from '../utils/signalement.utils'
import SignalementViewer from '../composants/signalement/SignalementViewer'

export interface SignalementViewerContextValue {
  setViewedSignalement: (signalement: Signalement | null) => void
}

export const SignalementViewerContext = createContext<SignalementViewerContextValue>({
  setViewedSignalement: () => {},
})

interface SignalementViewerContextProviderProps {
  children: React.ReactNode
}

export function SignalementViewerContextProvider({
  children,
}: Readonly<SignalementViewerContextProviderProps>) {
  const [viewedSignalement, setViewedSignalement] = useState<Signalement | null>(null)

  const value = useMemo(
    () => ({
      setViewedSignalement,
    }),
    [setViewedSignalement],
  )

  return (
    <SignalementViewerContext.Provider value={value}>
      {children}
      {viewedSignalement && (
        <Modal title={getModalTitle(viewedSignalement)} onClose={() => setViewedSignalement(null)}>
          <SignalementViewer signalement={viewedSignalement} />
        </Modal>
      )}
    </SignalementViewerContext.Provider>
  )
}
