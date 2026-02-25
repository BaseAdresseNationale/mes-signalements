import React, { useEffect, useState } from 'react'
import Loader from '../common/Loader'
import styled from 'styled-components'
import { APIAdressePropertyType } from '../../api/api-adresse/types'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'
import { Signalement } from '../../api/signalement'
import { MappedAPIAdresseResult, useSearchAPIAdresse } from '../../hooks/useSearchAPIAdresse'
import SearchInput from '../common/SearchInput'
import { SearchItemType } from '../common/SearchInput/SearchInput'

export const StyledAdvancedSearchContent = styled.div`
  padding: 0 0.5rem;
  .step {
    margin-top: 1rem;

    .step-label {
      display: block;
      margin-bottom: 1rem;

      span {
        font-weight: bold;
        margin-right: 0.5rem;
      }
    }

    .selection {
      span {
        font-weight: bold;
      }

      button {
        margin-left: 0.5rem;
      }
    }

    .not-found {
      margin-top: 1rem;
    }
  }
`

export const AdvancedSearchStepper = () => {
  const [adresse, setAdresse] = useState<{
    municipality: { nom: string; code: string } | null
    street: { nom: string; code: string } | null
  }>({
    municipality: null,
    street: null,
  })

  const [numeros, setNumeros] = useState<{ label: string; code: string }[]>([])
  const { navigate } = useNavigateWithPreservedSearchParams()

  const { fetchAPIAdresse, fetchNumeros, isLoading } = useSearchAPIAdresse()

  useEffect(() => {
    if (adresse.municipality && adresse.street) {
      fetchNumeros(adresse.street.code).then(setNumeros)
    }
  }, [adresse])

  return (
    <StyledAdvancedSearchContent>
      <div className='step'>
        <div className='step-label'>
          <span>1.</span>Dans quelle commune se situe votre adresse?
        </div>
        {adresse.municipality ? (
          <div className='selection'>
            Ma commune : <span>{adresse.municipality.nom}</span>{' '}
            <button
              type='button'
              onClick={() =>
                setAdresse({
                  municipality: null,
                  street: null,
                })
              }
              className='fr-icon-close-line'
              title='Réinitialiser la commune'
            />
          </div>
        ) : (
          <SearchInput
            onSearch={fetchAPIAdresse(APIAdressePropertyType.MUNICIPALITY)}
            onSelect={(result?: SearchItemType<MappedAPIAdresseResult> | null) => {
              if (result) {
                setAdresse((adresse) => ({ ...adresse, municipality: result }))
              }
            }}
            label='Rechercher ma commune :'
            nativeInputProps={{ placeholder: 'Bobigny' }}
          />
        )}
      </div>
      {adresse.municipality && (
        <div className='step'>
          <div className='step-label'>
            <span>2.</span> Recherchez votre voie
          </div>
          {adresse.street ? (
            <div className='selection'>
              Ma voie : <span>{adresse.street.nom}</span>{' '}
              <button
                type='button'
                onClick={() =>
                  setAdresse((adresse) => ({
                    ...adresse,
                    street: null,
                    number: '',
                  }))
                }
                className='fr-icon-close-line'
                title='Réinitialiser la voie'
              />
            </div>
          ) : (
            <>
              <SearchInput
                onSearch={fetchAPIAdresse(APIAdressePropertyType.STREET, adresse.municipality.code)}
                onSelect={(result?: SearchItemType<MappedAPIAdresseResult> | null) => {
                  if (result) {
                    setAdresse((adresse) => ({ ...adresse, street: result }))
                  }
                }}
                label='Rechercher ma voie :'
                nativeInputProps={{ placeholder: 'Rue de la Paix' }}
              />
              <button
                type='button'
                className='fr-btn fr-btn--secondary fr-btn--sm not-found'
                onClick={() => {
                  navigate(`/${adresse.municipality?.code}`)
                }}
              >
                Ma voie n&apos;est pas répertoriée
              </button>
            </>
          )}
        </div>
      )}
      {adresse.municipality && adresse.street && (
        <div className='step'>
          <div className='step-label'>
            <span>3.</span> Sélectionnez votre numéro
          </div>

          {isLoading ? (
            <Loader />
          ) : (
            <>
              <select
                defaultValue=''
                className='fr-select'
                onChange={(event) => {
                  navigate(`/${event.target.value}`)
                }}
              >
                <option value='' disabled>
                  -- Choisir votre numéro dans la liste
                </option>
                {numeros.map(({ label, code }) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type='button'
                className='fr-btn fr-btn--secondary fr-btn--sm not-found'
                onClick={() => {
                  navigate(`/${adresse.street?.code}`, {
                    type: Signalement.type.LOCATION_TO_CREATE,
                  })
                }}
              >
                Mon numéro n&apos;est pas dans la liste
              </button>
            </>
          )}
        </div>
      )}
    </StyledAdvancedSearchContent>
  )
}
