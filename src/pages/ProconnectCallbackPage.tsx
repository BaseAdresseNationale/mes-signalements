import React, { useContext, useEffect, useState } from 'react'
import SourceContext from '../contexts/source.context'
import Loader from '../composants/common/Loader'
import { useLoaderData } from 'react-router-dom'
import { LocalStorageKeys, setValueInLocalStorage } from '../utils/localStorage.utils'
import { Author } from '../api/signalement'
import useNavigateWithPreservedSearchParams from '../hooks/useNavigateWithPreservedSearchParams'
import Alert from '@codegouvfr/react-dsfr/Alert'

export function ProconnectCallbackPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { fetchSourceByToken } = useContext(SourceContext)
  const { navigate } = useNavigateWithPreservedSearchParams()
  const { sourceToken, author } = useLoaderData() as {
    sourceToken: string
    author: Author
  }
  useEffect(() => {
    const initializeSource = async () => {
      try {
        await fetchSourceByToken(sourceToken)
        setValueInLocalStorage(LocalStorageKeys.AUTHOR_CONTACT, author)
        navigate('/')
      } catch (error) {
        console.error('Error fetching source by token:', error)
        setIsLoading(false)
      }
    }

    initializeSource()
  }, [])

  return isLoading ? (
    <Loader />
  ) : (
    <Alert
      severity='error'
      title='Erreur de connexion'
      description='Une erreur est survenue lors de la connexion. Veuillez réessayer.'
    />
  )
}
