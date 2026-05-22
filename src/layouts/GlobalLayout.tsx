import React from 'react'
import { LayoutContextProvider } from '../contexts/layout.context'
import { MapContextProvider } from '../contexts/map.context'
import { SignalementViewerContextProvider } from '../contexts/signalement-viewer.context'
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
            <SignalementViewerContextProvider>
              <PanoramaxContextProvider>
                <MapLayout>{children}</MapLayout>
              </PanoramaxContextProvider>
            </SignalementViewerContextProvider>
          </SignalementContextProvider>
        </SourceContextProvider>
      </LayoutContextProvider>
    </MapContextProvider>
  )
}
