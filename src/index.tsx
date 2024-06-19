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

const router = createHashRouter([
  {
    path: '/',
    element: (
      <MapLayout>
        <AdresseSearchPage />
      </MapLayout>
    ),
  },
  {
    path: '/:code',
    element: (
      <MapLayout>
        <SignalementPage />
      </MapLayout>
    ),
    loader: async ({ params }) => {
      if (!params.code) {
        return {
          adresse: null,
        }
      }
      const adresse = await lookup(params.code)

      return {
        adresse,
      }
    },
    errorElement: <div>Une erreur est survenue</div>,
  },
  {
    path: '/source',
    element: (
      <MapLayout>
        <SourcePage />
      </MapLayout>
    ),
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <MapContextProvider>
      <RouterProvider router={router} />
    </MapContextProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
