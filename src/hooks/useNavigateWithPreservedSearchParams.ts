import { useNavigate, useSearchParams } from 'react-router-dom'
import { SignalementContext } from '../contexts/signalement.context'
import { useContext } from 'react'

function useNavigateWithPreservedSearchParams() {
  const _navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signalement, deleteSignalement } = useContext(SignalementContext)

  const navigate = (to: string) => {
    if (signalement) {
      deleteSignalement()
    }

    const hasSearchParams = searchParams.size > 0
    _navigate(hasSearchParams ? `${to}?${searchParams.toString()}` : to)
  }

  return { navigate }
}

export default useNavigateWithPreservedSearchParams
