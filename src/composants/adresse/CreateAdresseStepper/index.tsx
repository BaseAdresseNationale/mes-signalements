import React, { useEffect, useState } from 'react'
import { StyledCreateAdresseStepper } from './CreateAdresseStepper.styles'
import Autocomplete from '../../common/Autocomplete'
import { StyledResultList } from '../../common/Autocomplete/Autocomplete.styles'
import { MappedAPIAdresseResult, useSearchAPIAdresse } from '../../../hooks/useSearchAPIAdresse'
import { APIAdressePropertyType } from '../../../api/api-adresse/types'
import { useCommuneStatus } from '../../../hooks/useCommuneStatus'
import SignalementDisabled from '../../signalement/SignalementDisabled'
import useNavigateWithPreservedSearchParams from '../../../hooks/useNavigateWithPreservedSearchParams'

const CreateAdresseStepper = () => {
  const { navigate } = useNavigateWithPreservedSearchParams()
  const [commune, setCommune] = useState<MappedAPIAdresseResult | null>(null)
  const { communeStatus, isCommuneStatusLoading } = useCommuneStatus({
    codeCommune: commune?.code,
  })

  useEffect(() => {
    if (commune && !isCommuneStatusLoading && !communeStatus.disabled) {
      navigate(`/${commune.code}`)
    }
  }, [commune, isCommuneStatusLoading, communeStatus, navigate])

  const { fetchAPIAdresse } = useSearchAPIAdresse()

  return (
    <StyledCreateAdresseStepper>
      <div className='step'>
        <div className='step-label'>
          Dans quelle commune souhaitez-vous demander la création d&apos;une adresse ?
        </div>
        {commune ? (
          <div className='selection'>
            Commune : <span>{commune.nom}</span>{' '}
            <button
              type='button'
              onClick={() => setCommune(null)}
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
                        setCommune(result)
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
      {commune && !isCommuneStatusLoading && communeStatus.disabled && <SignalementDisabled />}
    </StyledCreateAdresseStepper>
  )
}

export default CreateAdresseStepper
