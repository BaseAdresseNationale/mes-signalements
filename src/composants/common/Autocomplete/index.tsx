import React, { useEffect, useRef, useState } from 'react'
import { StyledAutocomplete } from './Autocomplete.styles'

interface AutocompleteProps<T> {
  fetchResults: (search: string) => Promise<T[]>
  renderResultList: (results: Array<T>, onBlur: () => void) => React.ReactNode
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

const Autocomplete = <T extends { code: string }>({
  fetchResults,
  renderResultList,
  inputProps,
}: AutocompleteProps<T>) => {
  const searchTimeoutRef = useRef({} as NodeJS.Timeout)
  const [hasFocus, setHasFocus] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<T[]>([])

  useEffect(() => {
    async function fetch() {
      if (search.length >= 4) {
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
    <StyledAutocomplete>
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
          {results.length === 0 && search.length >= 4 && <p>Aucun résultat</p>}
          {results.length === 0 && search.length > 0 && search.length < 4 && (
            <p>Votre recherche doit comporter au moins 4 caractères</p>
          )}
        </div>
      )}
    </StyledAutocomplete>
  )
}

export default Autocomplete
