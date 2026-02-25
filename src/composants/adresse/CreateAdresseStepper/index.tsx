import React, { useEffect, useState } from 'react'
import { StyledCreateAdresseStepper } from './CreateAdresseStepper.styles'
import { MappedAPIAdresseResult, useSearchAPIAdresse } from '../../../hooks/useSearchAPIAdresse'
import { APIAdressePropertyType } from '../../../api/api-adresse/types'
import { useCommuneStatus } from '../../../hooks/useCommuneStatus'
import SignalementDisabled from '../../signalement/SignalementDisabled'
import useNavigateWithPreservedSearchParams from '../../../hooks/useNavigateWithPreservedSearchParams'
import SearchInput from '../../common/SearchInput'
import { SearchItemType } from '../../common/SearchInput/SearchInput'

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
          <SearchInput
            onSearch={fetchAPIAdresse(APIAdressePropertyType.MUNICIPALITY)}
            onSelect={(result?: SearchItemType<MappedAPIAdresseResult> | null) => {
              if (result) {
                setCommune(result)
              }
            }}
            label='Rechercher ma commune :'
            nativeInputProps={{ placeholder: 'Bobigny' }}
          />
        )}
      </div>
      {commune && !isCommuneStatusLoading && communeStatus.disabled && (
        <SignalementDisabled codeCommune={commune.code} />
      )}
    </StyledCreateAdresseStepper>
  )
}

export default CreateAdresseStepper
