import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { MapLayout } from './layouts/MapLayout'
import { lookup } from './api/ban-plateforme'
import { SignalementPage } from './pages/SignalementPage'
import { OpenAPI } from './api/signalement'

import '@gouvfr/dsfr/dist/dsfr.min.css'
import '@gouvfr/dsfr/dist/utility/utility.min.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import { SourcePage } from './pages/SourcePage'
import { MapContextProvider } from './contexts/map.context'
import { AdresseSearchPage } from './pages/AdresseSearchPage'
import GlobalStyle from './globalStyles'
import { SourceContextProvider } from './contexts/source.context'
import { SignalementContextProvider } from './contexts/signalement.context'
import { getCurrentRevision } from './api/api-depot'
import { getSignalementMode } from './utils/perimeters.utils'

const API_SIGNALEMENT_URL = process.env.REACT_APP_API_SIGNALEMENT_URL

if (!API_SIGNALEMENT_URL) {
  throw new Error('REACT_APP_API_SIGNALEMENT_URL is not defined')
}

const API_SIGNALEMENNT_SOURCE_ID = process.env.REACT_APP_API_SIGNALEMENT_SOURCE_ID

if (!API_SIGNALEMENNT_SOURCE_ID) {
  throw new Error('REACT_APP_API_SIGNALEMENT_SOURCE_ID is not defined')
}

Object.assign(OpenAPI, {
  BASE: API_SIGNALEMENT_URL,
})

const GlobalLayout = (props: { children: React.ReactNode }) => {
  const { children } = props
  return (
    <MapContextProvider>
      <SignalementContextProvider>
        <SourceContextProvider>
          <MapLayout>{children}</MapLayout>
        </SourceContextProvider>
      </SignalementContextProvider>
    </MapContextProvider>
  )
}

const router = createHashRouter([
  {
    path: '/',
    element: (
      <GlobalLayout>
        <AdresseSearchPage />
      </GlobalLayout>
    ),
  },
  {
    path: '/:code',
    element: (
      <GlobalLayout>
        <SignalementPage />
      </GlobalLayout>
    ),
    loader: async ({ params }) => {
      if (!params.code) {
        return {
          adresse: null,
        }
      }
      const codeCommune = params.code.split('_')[0]
      const currentRevision = await getCurrentRevision(codeCommune)
      const mode = getSignalementMode(currentRevision)
      const adresse = await lookup(params.code)

      return {
        adresse,
        mode,
      }
    },
    errorElement: <div>Une erreur est survenue</div>,
  },
  {
    path: '/source',
    element: (
      <GlobalLayout>
        <SourcePage />
      </GlobalLayout>
    ),
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <RouterProvider router={router} />
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
