import React, { useEffect } from 'react'
import Loader from '../composants/common/Loader'
import { LocalStorageKeys, removeValueFromLocalStorage } from '../utils/localStorage.utils'
import useNavigateWithPreservedSearchParams from '../hooks/useNavigateWithPreservedSearchParams'

export function ProconnectLogoutPage() {
  const { navigate } = useNavigateWithPreservedSearchParams()
  useEffect(() => {
    removeValueFromLocalStorage(LocalStorageKeys.AUTHOR_CONTACT)
    removeValueFromLocalStorage(LocalStorageKeys.SOURCE_TOKEN)
    navigate('/')
  }, [])

  return <Loader />
}
