import { StyledForm } from '../../signalement.styles'
import {
  CommuneStatusDTO,
  Position,
  Signalement,
  ToponymeChangesRequestedDTO,
} from '../../../../api/signalement'
import React, { useMemo } from 'react'
import { getAdresseLabel } from '../../../../utils/adresse.utils'
import { IBANPlateformeCommune, IBANPlateformeLieuDit } from '../../../../api/ban-plateforme/types'
import PositionInput from '../../../common/Position/PositionInput'
import ParcelleInput from '../../../common/ParcelleInput'
import { useAsyncBalValidator } from '../../../../hooks/useAsyncBALValidator'
import { Input } from '@codegouvfr/react-dsfr/Input'

interface SignalementToponymeFormProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key?: string) => (value: any) => void
  onClose: () => void
  address: IBANPlateformeLieuDit | IBANPlateformeCommune
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  hasSignalementChanged: boolean
  mode: CommuneStatusDTO.mode
}

export default function SignalementToponymeForm({
  signalement,
  onEditSignalement,
  onClose,
  address,
  onSubmit,
  hasSignalementChanged,
  mode,
}: SignalementToponymeFormProps) {
  const isCreation = signalement.type === Signalement.type.LOCATION_TO_CREATE

  const isSubmitDisabled = useMemo(() => {
    const { changesRequested } = signalement
    const isDisabled = (changesRequested as ToponymeChangesRequestedDTO).positions?.length === 0
    if (isCreation) {
      return isDisabled
    }

    return isDisabled || !hasSignalementChanged
  }, [hasSignalementChanged, signalement, isCreation])

  const { nom, positions, parcelles, comment } =
    signalement.changesRequested as ToponymeChangesRequestedDTO

  const { validationErrors, onValidate } = useAsyncBalValidator<ToponymeChangesRequestedDTO>({
    onSubmit,
  })

  console.log('validationError:', validationErrors)

  return (
    <StyledForm onSubmit={(event) => onValidate(event)(signalement.changesRequested)}>
      {isCreation ? (
        <h4>Demande de création d&apos;un lieu-dit</h4>
      ) : (
        <>
          <h4>Demande de modification du lieu-dit</h4>
          <section>
            <div>{getAdresseLabel(address)}</div>
          </section>
        </>
      )}

      <section>
        {!isCreation && <h5>Modifications demandées</h5>}
        <div className='form-row'>
          <Input
            label='Nom*'
            nativeInputProps={{
              required: true,
              name: 'nom',
              value: nom as string,
              onChange: (event) => onEditSignalement('changesRequested', 'nom')(event.target.value),
            }}
            {...(validationErrors?.nom && {
              stateRelatedMessage: validationErrors.nom,
              state: 'error',
            })}
          />
        </div>
        <PositionInput
          positions={positions}
          onChange={onEditSignalement('changesRequested', 'positions')}
          defaultPositionType={Position.type.SEGMENT}
          multiPositionDisabled={mode !== CommuneStatusDTO.mode.FULL}
        />
        {mode === CommuneStatusDTO.mode.FULL && <ParcelleInput parcelles={parcelles} />}
      </section>
      <section>
        <div className='form-row'>
          <Input
            textArea
            label='Informations complémentaires'
            nativeTextAreaProps={{
              name: 'comment',
              value: comment as string,
              onChange: (event) =>
                onEditSignalement('changesRequested', 'comment')(event.target.value),
              placeholder: 'Merci de ne pas indiquer de données personnelles',
            }}
          />
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
