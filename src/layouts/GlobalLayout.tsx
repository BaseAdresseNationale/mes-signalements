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
  showSearch?: boolean
  showDrawer?: boolean
}

export function GlobalLayout({ children, showSearch, showDrawer }: GlobalLayoutProps) {
  useMatomoTracking()

  return (
    <MapContextProvider>
      <LayoutContextProvider showSearch={showSearch} showDrawer={showDrawer}>
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
