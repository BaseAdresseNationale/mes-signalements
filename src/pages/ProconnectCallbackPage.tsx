import React, { useContext, useEffect } from 'react'
import SourceContext from '../contexts/source.context'
import Loader from '../composants/common/Loader'
import { useLoaderData } from 'react-router-dom'
import { LocalStorageKeys, setValueInLocalStorage } from '../utils/localStorage.utils'
import { Author } from '../api/signalement'
import useNavigateWithPreservedSearchParams from '../hooks/useNavigateWithPreservedSearchParams'

export function ProconnectCallbackPage() {
  const { fetchSourceByToken } = useContext(SourceContext)
  const { navigate } = useNavigateWithPreservedSearchParams()
  const { sourceToken, author } = useLoaderData() as {
    sourceToken: string
    author: Author
  }
  useEffect(() => {
    const initializeSource = async () => {
      await fetchSourceByToken(sourceToken)
      setValueInLocalStorage(LocalStorageKeys.AUTHOR_CONTACT, author)

      navigate('/')
    }

    initializeSource()
  }, [])

  return <Loader />
}
