import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import { RouterProvider, createHashRouter, redirect } from 'react-router-dom'
import { lookup } from './api/ban-plateforme'
import { SignalementPage } from './pages/SignalementPage'
import { Alert, CreateAlertDTO, OpenAPI } from './api/signalement'
import { SourcePage } from './pages/SourcePage'
import { AdresseSearchPage } from './pages/AdresseSearchPage'
import GlobalStyle from './globalStyles'
import { startReactDsfr } from '@codegouvfr/react-dsfr/spa'
import { AllPage } from './pages/AllPage'
import { CreateAdressePage } from './pages/CreateAdressePage'
import * as Sentry from '@sentry/react'
import { AdvancedSearchPage } from './pages/AdvancedSearchPage'
import { AlertPage } from './pages/AlertPage'
import { StatsPage } from './pages/StatsPage'
import { GlobalLayout } from './layouts/GlobalLayout'

import 'maplibre-gl/dist/maplibre-gl.css'

startReactDsfr({ defaultColorScheme: 'light' })

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: false,
  })
}

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
      <GlobalLayout>
        <SourcePage />
      </GlobalLayout>
    ),
  },
  {
    path: '/all',
    element: (
      <GlobalLayout>
        <AllPage />
      </GlobalLayout>
    ),
  },
  {
    path: '/create-adresse',
    element: (
      <GlobalLayout>
        <CreateAdressePage />
      </GlobalLayout>
    ),
  },
  {
    path: '/alert',
    element: (
      <GlobalLayout>
        <AlertPage />
      </GlobalLayout>
    ),
    loader: ({ request }) => {
      const url = new URL(request.url)
      const lat = Number(url.searchParams.get('lat'))
      const lng = Number(url.searchParams.get('lng'))
      const type = url.searchParams.get('type')
      const comment = url.searchParams.get('comment')

      if (!lat || isNaN(lat) || !lng || isNaN(lng)) {
        console.error('Invalid position format in search params:', { lat, lng })
        return redirect('/')
      }

      if (type && !Object.values(CreateAlertDTO['type']).includes(type as CreateAlertDTO['type'])) {
        console.error('Invalid type format in search params:', type)
        return redirect('/')
      }

      return {
        initialAlert: {
          point: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          type: Alert.type.MISSING_ADDRESS,
          comment: comment || '',
        },
      }
    },
  },
  {
    path: '/advanced-search',
    element: (
      <GlobalLayout>
        <AdvancedSearchPage />
      </GlobalLayout>
    ),
  },
  {
    path: '/stats',
    element: (
      <GlobalLayout baseLayout>
        <StatsPage />
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
