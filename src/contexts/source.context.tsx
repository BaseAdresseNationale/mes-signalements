import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { OpenAPI, Source, SourcesService } from '../api/signalement'
import type { ApiRequestOptions } from '../api/signalement/core/ApiRequestOptions'
import {
  getValueFromLocalStorage,
  LocalStorageKeys,
  setValueInLocalStorage,
} from '../utils/localStorage.utils'

interface SourceContextValue {
  source?: Source
  setSource: (source: Source | undefined) => void
  fetchSourceByToken: (sourceToken: string) => Promise<void>
}

// L'API traite tout Bearer de ces routes comme un token client et répond 401 pour un token de source.
const CLIENT_ONLY_ROUTES = ['/signalements/{idSignalement}', '/alerts/{idAlert}']

const buildSourceTokenResolver =
  (sourceToken: string) =>
  async ({ method, url }: ApiRequestOptions) =>
    method === 'GET' && CLIENT_ONLY_ROUTES.includes(url) ? '' : sourceToken

export const SourceContext = createContext<SourceContextValue>({
  fetchSourceByToken: async () => {},
  setSource: () => {},
})

export function SourceContextProvider(props: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams()
  const [sourceId] = useState<string | null>(searchParams.get('sourceId'))
  const [sourceToken] = useState(getValueFromLocalStorage<string>(LocalStorageKeys.SOURCE_TOKEN))
  const [source, setSource] = useState<Source>()

  const fetchSourceById = useCallback(async (sourceId: string) => {
    const source = await SourcesService.getSourceById(sourceId)
    setSource(source)
  }, [])

  const fetchSourceByToken = useCallback(async (sourceToken: string) => {
    const source = await SourcesService.getSourceByToken(sourceToken)
    setSource(source)
    Object.assign(OpenAPI, { TOKEN: buildSourceTokenResolver(sourceToken) })
    setValueInLocalStorage(LocalStorageKeys.SOURCE_TOKEN, sourceToken)
  }, [])

  useEffect(() => {
    try {
      if (sourceToken) {
        fetchSourceByToken(sourceToken)
      } else if (sourceId) {
        fetchSourceById(sourceId)
      }
    } catch (e) {
      console.error(e)
    }
  }, [sourceId, fetchSourceById, fetchSourceByToken])

  const value = useMemo(
    () => ({ source, setSource, fetchSourceByToken }),
    [source, setSource, fetchSourceByToken],
  )

  return <SourceContext.Provider value={value} {...props} />
}

export default SourceContext
