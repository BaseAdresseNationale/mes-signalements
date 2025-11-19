import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

enum MatomoState {
  NOT_LOADED = 'not-loaded',
  LOADED = 'loaded',
  INITIALIZED = 'initialized',
}

declare global {
  interface Window {
    Matomo: {
      addTracker: () => void
    }
    _paq: any[]
  }
}

const SITE_ID = process.env.REACT_APP_MATOMO_SITE_ID
const TRACKER_URL = process.env.REACT_APP_MATOMO_TRACKER_URL

export function useMatomoTracking() {
  const [matomoState, setMatomoState] = useState(MatomoState.NOT_LOADED)
  const location = useLocation()

  // Load matomo script
  useEffect(() => {
    if (!SITE_ID || !TRACKER_URL) {
      return
    }

    const matomoScriptElem = document.createElement('script')
    const firstScriptElem = document.querySelectorAll('script')[0]
    matomoScriptElem.async = true
    matomoScriptElem.src = `${TRACKER_URL}matomo.js`
    matomoScriptElem.addEventListener('load', () => {
      setMatomoState(MatomoState.LOADED)
    })

    if (firstScriptElem?.parentNode) {
      firstScriptElem.parentNode.insertBefore(matomoScriptElem, firstScriptElem)
    }
  }, [])

  // Init matomo tracker with site configuration
  useEffect(() => {
    if (matomoState === MatomoState.LOADED) {
      window.Matomo.addTracker()
      window._paq.push(['setTrackerUrl', `${TRACKER_URL}matomo.php`], ['setSiteId', `${SITE_ID}`])
      setMatomoState(MatomoState.INITIALIZED)
    }
  }, [matomoState])

  useEffect(() => {
    if (matomoState === MatomoState.INITIALIZED) {
      window._paq.push(['setCustomUrl', location.pathname], ['trackPageView'])
    }
  }, [matomoState, location])
}
