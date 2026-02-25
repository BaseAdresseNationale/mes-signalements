import { useNavigate, useSearchParams } from 'react-router-dom'
import { SignalementContext } from '../contexts/signalement.context'
import { useContext } from 'react'

function useNavigateWithPreservedSearchParams() {
  const _navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signalement, deleteSignalement } = useContext(SignalementContext)

  const navigate = (to: string, params: Record<string, string> = {}) => {
    if (signalement) {
      deleteSignalement()
    }

    const mergedParams = new URLSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      ...params,
    })

    const url = `${to}?${mergedParams.toString()}`

    _navigate(url)
  }

  return { navigate }
}

export default useNavigateWithPreservedSearchParams
