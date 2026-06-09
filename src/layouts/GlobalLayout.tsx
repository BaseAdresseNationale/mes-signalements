import React from 'react'
import { LayoutContextProvider } from '../contexts/layout.context'
import { MapContextProvider } from '../contexts/map.context'
import { ReportViewerContextProvider } from '../contexts/report-viewer.context'
import { SignalementContextProvider } from '../contexts/signalement.context'
import { SourceContextProvider } from '../contexts/source.context'
import { PanoramaxContextProvider } from '../contexts/panoramax.context'
import { MapLayout } from './MapLayout'
import { useMatomoTracking } from '../hooks/useMatomoTracking'

interface GlobalLayoutProps {
  children?: React.ReactNode
}

export function GlobalLayout({ children }: GlobalLayoutProps) {
  useMatomoTracking()

  return (
    <MapContextProvider>
      <LayoutContextProvider>
        <SourceContextProvider>
          <SignalementContextProvider>
            <ReportViewerContextProvider>
              <PanoramaxContextProvider>
                <MapLayout>{children}</MapLayout>
              </PanoramaxContextProvider>
            </ReportViewerContextProvider>
          </SignalementContextProvider>
        </SourceContextProvider>
      </LayoutContextProvider>
    </MapContextProvider>
  )
}
