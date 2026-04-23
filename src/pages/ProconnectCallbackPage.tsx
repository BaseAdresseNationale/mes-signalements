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
  const { sourceToken, author, error } = useLoaderData() as {
    sourceToken: string
    author: Author
    error: {
      message: string
      link: string
    }
  }
  useEffect(() => {
    const initializeSource = async () => {
      try {
        await fetchSourceByToken(sourceToken)
        setValueInLocalStorage(LocalStorageKeys.AUTHOR_CONTACT, author)
        setValueInLocalStorage(LocalStorageKeys.PROCONNECTED, 'true')
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
  ) : error.message === 'ORGANIZATION_NOT_PUBLIC' ? (
    <Alert
      severity='error'
      title='Erreur de connexion'
      description='La connexion ProConnect est réservée aux organisations publiques. Veuillez contacter votre administrateur ProConnect pour plus d’informations.'
    />
  ) : error.message === 'COMMUNE_NOT_ALLOWED' ? (
    <Alert
      severity='error'
      title='Erreur de connexion'
      description={
        <>
          Afin d&apos;éditer les adresses de votre commune, veuillez suivre les indications
          disponibles sur <a href={error.link}>cette page</a>.
        </>
      }
    />
  ) : (
    <Alert
      severity='error'
      title='Erreur de connexion'
      description='Une erreur est survenue lors de la connexion. Veuillez réessayer.'
    />
  )
}
