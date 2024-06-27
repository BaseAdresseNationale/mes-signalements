import { useCallback, useEffect, useState } from 'react'
import { Signalement, SignalementsService, Source, SourcesService } from '../api/signalement'
import { useSearchParams } from 'react-router-dom'

export function useCustomSource() {
  const [searchParams] = useSearchParams()
  const [sourceId] = useState<string | null>(searchParams.get('sourceId'))
  const [source, setSource] = useState<Source>()
  const [signalements, setSignalements] = useState<Signalement[]>([])

  const fetchSource = useCallback(async (sourceId: string) => {
    try {
      const source = await SourcesService.getSourceById(sourceId)
      setSource(source)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const fetchSignalements = useCallback(async (sourceId: string) => {
    try {
      const paginatedSignalements = await SignalementsService.getSignalements(
        undefined,
        sourceId as string,
      )
      setSignalements(paginatedSignalements.data)
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    if (sourceId) {
      fetchSource(sourceId)
      fetchSignalements(sourceId)
    }
  }, [sourceId, fetchSource, fetchSignalements])

  return {
    source,
    signalements,
  }
}
