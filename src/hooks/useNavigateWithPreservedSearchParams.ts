import { useNavigate, useSearchParams } from 'react-router-dom'

function useNavigateWithPreservedSearchParams() {
  const _navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const navigate = (to: string) => {
    const hasSearchParams = searchParams.size > 0
    _navigate(hasSearchParams ? `${to}?${searchParams.toString()}` : to)
  }

  return { navigate }
}

export default useNavigateWithPreservedSearchParams
