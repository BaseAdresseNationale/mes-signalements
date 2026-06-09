import React, { createContext, useMemo, useState } from 'react'
import { Alert, Signalement } from '../api/signalement'
import Modal from '../composants/common/Modal'
import { getModalTitle } from '../utils/signalement.utils'
import SignalementViewer from '../composants/signalement/SignalementViewer'
import { isReportAlert, isReportSignalement } from '../utils/report.utils'
import AlertViewer from '../composants/alert/AlertViewer'

export interface ReportViewerContextValue {
  setViewedReport: (report: Signalement | Alert | null) => void
}

export const ReportViewerContext = createContext<ReportViewerContextValue>({
  setViewedReport: () => {},
})

interface ReportViewerContextProviderProps {
  children: React.ReactNode
}

export function ReportViewerContextProvider({
  children,
}: Readonly<ReportViewerContextProviderProps>) {
  const [viewedReport, setViewedReport] = useState<Signalement | Alert | null>(null)

  const value = useMemo(
    () => ({
      setViewedReport,
    }),
    [setViewedReport],
  )

  return (
    <ReportViewerContext.Provider value={value}>
      {children}
      {viewedReport && isReportSignalement(viewedReport) && (
        <Modal title={getModalTitle(viewedReport)} onClose={() => setViewedReport(null)}>
          <SignalementViewer signalement={viewedReport} />
        </Modal>
      )}
      {viewedReport && isReportAlert(viewedReport) && (
        <Modal title='Adresse manquante' onClose={() => setViewedReport(null)}>
          <AlertViewer alert={viewedReport} />
        </Modal>
      )}
    </ReportViewerContext.Provider>
  )
}
