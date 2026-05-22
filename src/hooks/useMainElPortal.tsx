import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface UseMainElPortalResult {
  mainElPortal: ((children: React.ReactNode) => React.ReactPortal | null) | null
}

export function useMainElPortal(): UseMainElPortalResult {
  const [mainEl, setMainEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setMainEl(document.querySelector('main'))
  }, [])

  const mainElPortal = useCallback(
    (children: React.ReactNode) => {
      if (!mainEl) return null

      return createPortal(children, mainEl)
    },
    [mainEl],
  )

  return {
    mainElPortal,
  }
}
