import React, { useEffect, useState } from 'react'
import { APIAdressePropertyType } from '../../../api/api-adresse/types'
import { IAdresseResult } from '../../adresse/AdresseSearch'
import { StyledResultList } from './Autocomplete.styles'
import { useLocation } from 'react-router-dom'

interface ResultListProps {
  results: IAdresseResult[]
  onSelectResult: (result: IAdresseResult) => void
  onSelectAdvancedSearch: () => void
  onBlur: () => void
}

export function ResultList({
  results,
  onSelectResult,
  onSelectAdvancedSearch,
  onBlur,
}: ResultListProps) {
  const houseNumbers = results.filter(({ type }) => type === APIAdressePropertyType.HOUSE_NUMBER)
  const streets = results.filter(({ type }) => type === APIAdressePropertyType.STREET)
  const localities = results.filter(({ type }) => type === APIAdressePropertyType.LOCALITY)

  const filteredResults = [
    { name: 'Adresses', results: houseNumbers },
    { name: 'Rues', results: streets },
    { name: 'Lieux-dits', results: localities },
  ].filter(({ results }) => results.length > 0)

  const location = useLocation()
  const [initialPathname] = useState(location.pathname)

  useEffect(() => {
    if (location.pathname !== initialPathname) {
      onBlur()
    }
  }, [location.pathname, initialPathname])

  return (
    <StyledResultList>
      {filteredResults.map(({ name, results }) => (
        <div key={name} className='result-item'>
          <label>{name}</label>
          {results.map((result) => (
            <button
              tabIndex={0}
              onClick={() => {
                onSelectResult(result)
              }}
              key={result.code}
              type='button'
            >
              {result.nom}
            </button>
          ))}
        </div>
      ))}
      <div className='sticky-button'>
        <button
          onClick={() => {
            onSelectAdvancedSearch()
          }}
          onTouchStart={() => {
            onSelectAdvancedSearch()
          }}
          type='button'
          className='fr-link fr-icon-arrow-right-line fr-link--icon-right'
        >
          Je ne trouve pas mon adresse
        </button>
      </div>
    </StyledResultList>
  )
}
