import { useCallback, useEffect, useState } from 'react'
import { Signalement, SignalementsService, Source } from '../api/signalement'

export function useCustomSource(source?: Source) {
  const [signalements, setSignalements] = useState<Signalement[]>([])

  const fetchSignalements = useCallback(async (sourceId: string) => {
    try {
      const paginatedSignalements = await SignalementsService.getSignalements(
        undefined,
        undefined,
        undefined,
        undefined,
        [sourceId],
      )
      setSignalements(paginatedSignalements.data as any)
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    if (source) {
      fetchSignalements(source.id)
    }
  }, [source, fetchSignalements])

  return {
    source,
    signalements,
  }
}
