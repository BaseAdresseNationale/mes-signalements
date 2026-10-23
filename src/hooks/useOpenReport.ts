import { useCallback } from 'react'
import useNavigateWithPreservedSearchParams from './useNavigateWithPreservedSearchParams'

export interface ReportLocationState {
  // Fermer le rapport revient à la page précédente au lieu de la home.
  backOnClose?: boolean
}

export function useOpenReport() {
  const { navigate } = useNavigateWithPreservedSearchParams()

  return useCallback(
    (report: { id: string }, { backOnClose }: ReportLocationState = {}) =>
      navigate(
        `/report/${encodeURIComponent(report.id)}`,
        {},
        {
          state: backOnClose ? { backOnClose } : undefined,
        },
      ),
    [navigate],
  )
}
