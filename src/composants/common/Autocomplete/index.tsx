import React, { useEffect, useRef, useState } from 'react'
import { StyledAutocomplete } from './Autocomplete.styles'

interface AutocompleteProps<T> {
  fetchResults: (search: string) => Promise<T[]>
  renderResultList: (results: Array<T>, onBlur: () => void) => React.ReactNode
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  minSearchLength?: number
}

const Autocomplete = <T extends { code: string }>({
  fetchResults,
  renderResultList,
  inputProps,
  minSearchLength = 4,
}: AutocompleteProps<T>) => {
  const searchTimeoutRef = useRef({} as NodeJS.Timeout)
  const [hasFocus, setHasFocus] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<T[]>([])
  const [resultListWidth, setResultListWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleSetWidth = () => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width
        setResultListWidth(width)
      }
    }
    handleSetWidth()
    window.addEventListener('resize', handleSetWidth)

    return () => {
      window.removeEventListener('resize', handleSetWidth)
    }
  }, [])

  useEffect(() => {
    async function fetch() {
      if (search.length >= minSearchLength) {
        const results = await fetchResults(search)

        setResults(results)
      } else {
        setResults([])
      }
    }

    fetch()
  }, [search])

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 4) {
      setSearch(e.target.value)
    } else if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(e.target.value)
    }, 500)
  }

  return (
    <StyledAutocomplete ref={ref} $resultListWidth={resultListWidth}>
      <div className='fr-search-bar' id='header-search' role='search'>
        <input
          className='fr-input'
          onChange={onSearch}
          onFocus={() => setHasFocus(true)}
          onBlur={(e) => {
            if (e.relatedTarget instanceof Element && e.relatedTarget.tagName === 'BUTTON') {
              return
            }
            setHasFocus(false)
          }}
          type='search'
          id='autocomplete-search'
          name='autocomplete-search'
          {...inputProps}
        />
        <button type='button' className='fr-btn' title='Rechercher' disabled={inputProps?.disabled}>
          Rechercher
        </button>
      </div>
      {hasFocus && (
        <div className='results'>
          {results.length > 0 && renderResultList(results, () => setHasFocus(false))}
          {results.length === 0 && search.length >= minSearchLength && <p>Aucun résultat</p>}
          {results.length === 0 && search.length > 0 && search.length < minSearchLength && (
            <p>Votre recherche doit comporter au moins 4 caractères</p>
          )}
        </div>
      )}
    </StyledAutocomplete>
  )
}

export default Autocomplete
