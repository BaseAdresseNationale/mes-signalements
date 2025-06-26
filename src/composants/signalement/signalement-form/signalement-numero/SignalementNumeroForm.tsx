import React, { useEffect, useMemo, useState } from 'react'
import { StyledForm } from '../../signalement.styles'
import PositionInput from '../../../common/Position/PositionInput'
import {
  CommuneStatusDTO,
  NumeroChangesRequestedDTO,
  Signalement,
} from '../../../../api/signalement'
import {
  BANPlateformeResultTypeEnum,
  IBANPlateformeCommune,
  IBANPlateformeNumero,
  IBANPlateformeVoie,
} from '../../../../api/ban-plateforme/types'
import ParcelleInput from '../../../common/ParcelleInput'
import { getAdresseLabel } from '../../../../utils/adresse.utils'
import { lookup as BANLookup } from '../../../../api/ban-plateforme'
import SelectInput from '../../../common/SelectInput'

interface SignalementNumeroFormProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key: string) => (value: any) => void
  onClose: () => void
  address: IBANPlateformeNumero | IBANPlateformeVoie
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  initialPositionCoords: number[]
  hasSignalementChanged: boolean
  mode: CommuneStatusDTO.mode
}

export default function SignalementNumeroForm({
  signalement,
  onEditSignalement,
  onClose,
  address,
  onSubmit,
  initialPositionCoords,
  hasSignalementChanged,
  mode,
}: SignalementNumeroFormProps) {
  const isCreation = signalement.type === Signalement.type.LOCATION_TO_CREATE

  const [complementsOpts, setComplementsOpts] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    if (address) {
      const fetchComplements = async () => {
        try {
          const { commune } = address

          const results = await BANLookup(commune.code)
          const mappedResults = (results as unknown as IBANPlateformeCommune).voies
            .filter(({ type }) => type === BANPlateformeResultTypeEnum.LIEU_DIT)
            .map(({ nomVoie }) => ({ value: nomVoie, label: nomVoie }))
          setComplementsOpts(mappedResults)
        } catch (error) {
          console.error(error)
        }
      }

      fetchComplements()
    }
  }, [address])

  const isSubmitDisabled = useMemo(() => {
    const { changesRequested } = signalement
    const isDisabled = (changesRequested as NumeroChangesRequestedDTO).positions?.length === 0
    if (isCreation) {
      return isDisabled
    }

    return isDisabled || !hasSignalementChanged
  }, [hasSignalementChanged, signalement, isCreation])

  const { numero, suffixe, nomVoie, nomComplement, positions, parcelles, comment } =
    signalement.changesRequested as NumeroChangesRequestedDTO

  return (
    <StyledForm onSubmit={onSubmit}>
      {isCreation ? (
        <h5>Demande de création d&apos;une adresse</h5>
      ) : (
        <>
          <h5>Demande de modification pour l&apos;adresse</h5>
          <section>
            <div>{getAdresseLabel(address)}</div>
          </section>
        </>
      )}
      <section>
        {!isCreation && <h5>Modifications demandées</h5>}
        <div className='form-row' style={{ marginBottom: 0 }}>
          <div className='fr-input-group'>
            <label className='fr-label' htmlFor='numero'>
              Numéro*
            </label>
            <input
              className='fr-input'
              name='numero'
              required
              min={1}
              max={9998}
              type='number'
              value={numero || ''}
              onChange={(event) =>
                onEditSignalement('changesRequested', 'numero')(event.target.value)
              }
            />
          </div>
          <div className='fr-input-group'>
            <label className='fr-label' htmlFor='suffixe'>
              Suffixe
            </label>
            <input
              name='suffixe'
              pattern='/^[\da-z]/i'
              maxLength={9}
              className='fr-input'
              value={suffixe as string}
              placeholder={'bis, ter...'}
              onChange={(event) =>
                onEditSignalement('changesRequested', 'suffixe')(event.target.value)
              }
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='fr-input-group'>
            <label className='fr-label' htmlFor='nomVoie'>
              Nom de la voie*
            </label>
            <input
              className='fr-input'
              name='nomVoie'
              required
              disabled={isCreation}
              value={nomVoie as string}
              onChange={(event) =>
                onEditSignalement('changesRequested', 'nomVoie')(event.target.value)
              }
            />
          </div>
        </div>
        {mode === CommuneStatusDTO.mode.FULL && (
          <SelectInput
            label='Complément'
            defaultOption='-'
            value={nomComplement}
            options={complementsOpts}
            handleChange={(value) => onEditSignalement('changesRequested', 'nomComplement')(value)}
          />
        )}
        <PositionInput
          positions={positions}
          onChange={onEditSignalement('changesRequested', 'positions')}
          initialPositionCoords={initialPositionCoords}
          multiPositionDisabled={mode !== CommuneStatusDTO.mode.FULL}
        />
        {mode === CommuneStatusDTO.mode.FULL && <ParcelleInput parcelles={parcelles} />}
      </section>
      <section>
        <div className='form-row'>
          <div className='fr-input-group'>
            <label className='fr-label' htmlFor='comment'>
              Informations complémentaires
            </label>
            <textarea
              className='fr-input'
              name='comment'
              value={comment as string}
              onChange={(event) =>
                onEditSignalement('changesRequested', 'comment')(event.target.value)
              }
              placeholder='Merci de ne pas indiquer de données personnelles'
            />
          </div>
        </div>
      </section>
      <div className='form-controls'>
        <button
          className='fr-btn'
          disabled={isSubmitDisabled}
          style={{ color: 'white' }}
          type='submit'
        >
          Envoyer le signalement
        </button>
        <button className='fr-btn' type='button' onClick={onClose}>
          Annuler
        </button>
      </div>
    </StyledForm>
  )
}
