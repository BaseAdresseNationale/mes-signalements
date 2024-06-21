import styled from 'styled-components'
import { APIAdressePropertyType } from '../../api/api-adresse/types'
import { search } from '../../api/api-adresse'
import Autocomplete from '../common/Autocomplete'
import { ANIMATION_DURATION } from '../../layouts/MapLayout'
import React, { forwardRef } from 'react'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'
import { MOBILE_BREAKPOINT } from '../../hooks/useWindowSize'

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

const StyledResultList = styled.div`
  display: flex;
  flex-direction: column;
  > div {
    padding: 5px;
    > label {
      font-weight: bold;
    }
    > button {
      width: 100%;
      text-align: left;
      padding: 5px 10px;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
    }
  }
`

interface IAdresseResult {
  code: string
  nom: string
  type: APIAdressePropertyType
}

function _AdresseSearch(props: any, ref: React.ForwardedRef<HTMLDivElement>) {
  const { navigate } = useNavigateWithPreservedSearchParams()

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
      <Autocomplete
        inputProps={{
          placeholder: '20 avenue de Ségur, Paris',
        }}
        fetchResults={fetchAdresses}
        onSelect={(adresse) => navigate(`/${adresse.code}`)}
        renderResultList={(results) => {
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
                <div key={name}>
                  <label>{name}</label>
                  {results.map((result) => (
                    <button tabIndex={0} onClick={result.onClick} key={result.code} type='button'>
                      {result.nom}
                    </button>
                  ))}
                </div>
              ))}
            </StyledResultList>
          )
        }}
      />
    </StyledSearch>
  )
}

export const AdresseSearch = forwardRef(_AdresseSearch)
