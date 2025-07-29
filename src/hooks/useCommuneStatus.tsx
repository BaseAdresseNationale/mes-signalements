import { useContext, useEffect, useState } from 'react'
import { CommuneStatusDTO, SettingsService } from '../api/signalement'
import SourceContext from '../contexts/source.context'

type UseCommuneStatusParams = {
  codeCommune?: string
}

export function useCommuneStatus({ codeCommune }: UseCommuneStatusParams): {
  communeStatus: CommuneStatusDTO
  isCommuneStatusLoading: boolean
} {
  const [communeStatus, setCommuneStatus] = useState<CommuneStatusDTO>({
    disabled: true,
  })
  const [isCommuneStatusLoading, setIsCommuneStatusLoading] = useState(true)
  const { source } = useContext(SourceContext)
  const sourceId = source?.id || process.env.REACT_APP_API_SIGNALEMENT_SOURCE_ID

  useEffect(() => {
    async function fetchCommuneStatus() {
      if (!codeCommune || !sourceId) {
        console.warn('Code commune or source ID is missing')
        return
      }

      setIsCommuneStatusLoading(true)
      try {
        const _communeStatus = await SettingsService.getCommuneStatus(codeCommune, sourceId)
        setCommuneStatus(_communeStatus)
      } catch (error) {
        console.error('Error fetching commune status:', error)
        setCommuneStatus({ disabled: true })
      } finally {
        setIsCommuneStatusLoading(false)
      }
    }

    if (codeCommune) {
      fetchCommuneStatus()
    }
  }, [codeCommune, sourceId])

  return { communeStatus, isCommuneStatusLoading }
}
