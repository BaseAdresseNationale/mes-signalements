import styled from 'styled-components'
import { APIAdressePropertyType } from '../../api/api-adresse/types'
import { search } from '../../api/api-adresse'
import Autocomplete from '../common/Autocomplete'
import { ANIMATION_DURATION } from '../../layouts/MapLayout'
import React, { forwardRef, useMemo, useState } from 'react'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'
import { MOBILE_BREAKPOINT } from '../../hooks/useWindowSize'
import { AdvancedSearchModal } from './AdvancedSearchModal'
import { StyledResultList } from '../common/Autocomplete/Autocomplete.styles'

const placeHolders = [
  '10 rue Paulin Viry, Pocé-Sur-Cisse',
  '2 chemin de la Croix, Saint-Georges-sur-Cher',
  '1 rue de la Mairie, Saint-Aignan',
  '25 bis rue de la République, Tours',
  '12 rue Nationale, Amboise',
  '2 rue de la Mairie, Bléré',
  "1 rue d'Azay, Montlouis-sur-Loire",
]

const StyledSearch = styled.div<{ $animationDuration: number }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  background: white;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: ${({ $animationDuration }) => `top ${$animationDuration}ms ease-in-out`};

  p {
    margin-bottom: 4px;
  }

  input {
    width: 400px;
  }

  &.show {
    top: 50px;
  }

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    padding: 10px;
    width: calc(100% - 80px);
    left: 10px;
    transform: none;

    input {
      width: 100%;
    }

    &.show {
      top: 10px;
    }
  }
`

interface IAdresseResult {
  code: string
  nom: string
  type: APIAdressePropertyType
}

function _AdresseSearch(props: any, ref: React.ForwardedRef<HTMLDivElement>) {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const { navigate } = useNavigateWithPreservedSearchParams()
  const placeholder = useMemo(
    () => placeHolders[Math.floor(Math.random() * placeHolders.length)],
    [],
  )

  const fetchAdresses = async (query: string): Promise<IAdresseResult[]> => {
    const results = await search({ q: query, limit: 10 })

    return results.features.map((feature) => ({
      code: feature.properties.id,
      nom: feature.properties.label,
      type: feature.properties.type,
    }))
  }

  return (
    <StyledSearch ref={ref} $animationDuration={ANIMATION_DURATION}>
      <p>Rechercher une adresse, une voie ou un lieu-dit :</p>
      <Autocomplete
        inputProps={{
          placeholder,
        }}
        fetchResults={fetchAdresses}
        renderResultList={(results, onBlur) => {
          const houseNumbers = results.filter(
            ({ type }) => type === APIAdressePropertyType.HOUSE_NUMBER,
          )
          const streets = results.filter(({ type }) => type === APIAdressePropertyType.STREET)
          const localities = results.filter(({ type }) => type === APIAdressePropertyType.LOCALITY)

          const filteredResults = [
            { name: 'Adresses', results: houseNumbers },
            { name: 'Rues', results: streets },
            { name: 'Lieux-dits', results: localities },
          ].filter(({ results }) => results.length > 0)

          return (
            <StyledResultList>
              {filteredResults.map(({ name, results }) => (
                <div key={name} className='result-item'>
                  <label>{name}</label>
                  {results.map((result) => (
                    <button
                      tabIndex={0}
                      onClick={() => {
                        navigate(`/${result.code}`)
                        onBlur()
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
                    setShowAdvancedSearch(true)
                    onBlur()
                  }}
                  onTouchStart={() => {
                    setShowAdvancedSearch(true)
                    onBlur()
                  }}
                  type='button'
                  className='fr-link fr-icon-arrow-right-line fr-link--icon-right'
                >
                  Je ne trouve pas mon adresse
                </button>
              </div>
            </StyledResultList>
          )
        }}
      />
      {showAdvancedSearch && <AdvancedSearchModal onClose={() => setShowAdvancedSearch(false)} />}
    </StyledSearch>
  )
}

export const AdresseSearch = forwardRef(_AdresseSearch)
