import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { OpenAPI, Source, SourcesService } from '../api/signalement'

interface SourceContextValue {
  source?: Source
  fetchSourceByToken: (sourceToken: string) => Promise<void>
}

export const SourceContext = createContext<SourceContextValue>({
  fetchSourceByToken: async () => {},
})

export function SourceContextProvider(props: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams()
  const [sourceId] = useState<string | null>(searchParams.get('sourceId'))
  const [sourceToken] = useState<string | null>(localStorage.getItem('sourceToken'))
  const [source, setSource] = useState<Source>()

  const fetchSourceById = useCallback(async (sourceId: string) => {
    const source = await SourcesService.getSourceById(sourceId)
    setSource(source)
  }, [])

  const fetchSourceByToken = useCallback(async (sourceToken: string) => {
    const source = await SourcesService.getSourceByToken(sourceToken)
    setSource(source)
    Object.assign(OpenAPI, { TOKEN: sourceToken })
    localStorage.setItem('sourceToken', sourceToken)
  }, [])

  useEffect(() => {
    try {
      if (sourceId) {
        fetchSourceById(sourceId)
      } else if (sourceToken) {
        fetchSourceByToken(sourceToken)
      }
    } catch (e) {
      console.error(e)
    }
  }, [sourceId, fetchSourceById, fetchSourceByToken])

  const value = useMemo(() => ({ source, fetchSourceByToken }), [source, fetchSourceByToken])

  return <SourceContext.Provider value={value} {...props} />
}

export default SourceContext
