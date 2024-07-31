import React, { useCallback } from 'react'
import styled from 'styled-components'
import { IBANPlateformeNumero, IBANPlateformeVoie } from '../../api/ban-plateforme/types'
import { search as searchAPIAdresse } from '../../api/api-adresse'
import { APIAdressePropertyType } from '../../api/api-adresse/types'
import Autocomplete from './Autocomplete'
import { StyledResultList } from './Autocomplete/Autocomplete.styles'

const StyledContainer = styled.div`
  p {
    margin-bottom: 0.5rem;
  }

  .complement-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5rem;
    background-color: var(--background-contrast-grey);
    border-radius: 5px;
  }
`

interface ComplementInputProps {
  address: IBANPlateformeNumero | IBANPlateformeVoie
  onChange: (event: any) => void
  value: string
}

export default function ComplementInput({ address, onChange, value }: ComplementInputProps) {
  const fetchAPIAdresse = useCallback(async (search: string) => {
    try {
      const data = await searchAPIAdresse({
        q: search,
        type: APIAdressePropertyType.LOCALITY,
        citycode: address.commune.code,
      })

      return data.features.map(
        ({ properties }: { properties: { id: string; name: string; postcode?: string } }) => ({
          code: properties.id,
          nom: properties.name,
          ...(properties.postcode && { postcode: properties.postcode }),
        }),
      )
    } catch (error) {
      console.error(error)
      return []
    }
  }, [])

  const resetComplement = () => {
    onChange('')
  }

  return (
    <StyledContainer>
      <p>Complément</p>
      {value ? (
        <div className='complement-wrapper'>
          {value}
          <button
            type='button'
            className='fr-btn  fr-icon-refresh-line fr-btn--tertiary-no-outline'
            title='Réinitialiser le complément'
            onClick={resetComplement}
          >
            Réinitialiser le complément
          </button>
        </div>
      ) : (
        <Autocomplete
          inputProps={{ placeholder: 'Rechercher un complément' }}
          fetchResults={fetchAPIAdresse}
          renderResultList={(results, onBlur) => (
            <StyledResultList>
              {results.map((result) => (
                <div key={result.code} className='result-item'>
                  <button
                    tabIndex={0}
                    type='button'
                    onClick={() => {
                      onChange(result.nom)
                      onBlur()
                    }}
                  >
                    {result.nom}
                  </button>
                </div>
              ))}
            </StyledResultList>
          )}
        />
      )}
    </StyledContainer>
  )
}
