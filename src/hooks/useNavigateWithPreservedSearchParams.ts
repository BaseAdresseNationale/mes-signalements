import { useNavigate, useSearchParams } from 'react-router-dom'
import { SignalementContext } from '../contexts/signalement.context'
import { useContext } from 'react'

const searchParamsToPreserve = ['sourceId']

function useNavigateWithPreservedSearchParams() {
  const _navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signalement, deleteSignalement } = useContext(SignalementContext)

  const navigate = (to: string, params: Record<string, string> = {}) => {
    if (signalement) {
      deleteSignalement()
    }

    const paramsToPreserve = searchParamsToPreserve.reduce(
      (acc, param) => {
        const value = searchParams.get(param)
        if (value) {
          acc[param] = value
        }
        return acc
      },
      {} as Record<string, string>,
    )

    const mergedParams = new URLSearchParams({
      ...paramsToPreserve,
      ...params,
    })

    const queryString = mergedParams.toString()
    const url = queryString ? `${to}?${queryString}` : to

    _navigate(url)
  }

  return { navigate }
}

export default useNavigateWithPreservedSearchParams
