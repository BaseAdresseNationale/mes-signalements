import React, { useEffect, useState } from 'react'
import Autocomplete from '../common/Autocomplete'
import Loader from '../common/Loader'
import Modal from '../common/Modal'
import styled from 'styled-components'
import { APIAdressePropertyType } from '../../api/api-adresse/types'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'
import { Signalement } from '../../api/signalement'
import { StyledResultList } from '../common/Autocomplete/Autocomplete.styles'
import { useSearchAPIAdresse } from '../../hooks/useSearchAPIAdresse'

export const StyledAdvancedSearchContent = styled.div`
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

interface AdvancedSearchModalProps {
  onClose: () => void
}

export const AdvancedSearchModal = ({ onClose }: AdvancedSearchModalProps) => {
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
    <Modal title='Recherche avancée' onClose={onClose}>
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
            <Autocomplete
              inputProps={{ placeholder: 'Rechercher ma commune' }}
              fetchResults={fetchAPIAdresse(APIAdressePropertyType.MUNICIPALITY)}
              renderResultList={(results, onBlur) => (
                <StyledResultList>
                  {results.map((result) => (
                    <div key={result.code} className='result-item'>
                      <button
                        tabIndex={0}
                        type='button'
                        onClick={() => {
                          setAdresse((adresse) => ({ ...adresse, municipality: result }))
                          onBlur()
                        }}
                      >
                        {result.nom} ({result.postcode})
                      </button>
                    </div>
                  ))}
                </StyledResultList>
              )}
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
              <Autocomplete
                inputProps={{ placeholder: 'Rechercher ma voie' }}
                fetchResults={fetchAPIAdresse(
                  APIAdressePropertyType.STREET,
                  adresse.municipality.code,
                )}
                renderResultList={(results, onBlur) => (
                  <StyledResultList>
                    {results.map((result) => (
                      <div key={result.code} className='result-item'>
                        <button
                          tabIndex={0}
                          type='button'
                          onClick={() => {
                            setAdresse((adresse) => ({ ...adresse, street: result }))
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
                    onClose()
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
                    onClose()
                    navigate(`/${adresse.street?.code}?type=${Signalement.type.LOCATION_TO_CREATE}`)
                  }}
                >
                  Mon numéro n&apos;est pas dans la liste
                </button>
              </>
            )}
          </div>
        )}
      </StyledAdvancedSearchContent>
    </Modal>
  )
}
