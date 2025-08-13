import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
import { MuiSelectInput, SelectOptionType } from '../../../common/MuiSelectInput'
import { getExistingLocation } from '../../../../utils/signalement.utils'
import MapContext from '../../../../contexts/map.context'
import Input from '@codegouvfr/react-dsfr/Input'
import { createFilterOptions } from '@mui/material/Autocomplete'
import { FilterOptionsState } from '@mui/material'

interface SignalementNumeroFormProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key?: string) => (value: any) => void
  onClose: () => void
  address: IBANPlateformeNumero | IBANPlateformeVoie | IBANPlateformeCommune
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  initialPositionCoords?: number[]
  hasSignalementChanged: boolean
  mode: CommuneStatusDTO.mode
}

const filter = createFilterOptions<SelectOptionType<string>>()

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
  const { mapRef } = useContext(MapContext)
  const isCreation = signalement.type === Signalement.type.LOCATION_TO_CREATE

  const [voiesOpts, setVoiesOpts] = useState<SelectOptionType<string>[]>([])
  const [complementsOpts, setComplementsOpts] = useState<SelectOptionType<string>[]>([])

  const [selectedVoie, setSelectedVoie] = useState<SelectOptionType<string>>()

  const flyToVoie = useCallback(
    (voie: IBANPlateformeVoie) => {
      if (!mapRef) {
        return
      }

      if (voie.displayBBox) {
        mapRef.flyTo({
          center: [
            (voie.displayBBox[0] + voie.displayBBox[2]) / 2,
            (voie.displayBBox[1] + voie.displayBBox[3]) / 2,
          ],
          zoom: 18,
          maxDuration: 3000,
        })
      }
    },
    [mapRef],
  )

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const results = await BANLookup(signalement.codeCommune)
        const mappedComplements = (results as IBANPlateformeCommune).voies
          .filter(({ type }) => type === BANPlateformeResultTypeEnum.LIEU_DIT)
          .map(({ nomVoie, id }) => ({ value: id, label: nomVoie }))
        setComplementsOpts(mappedComplements)

        const mappedVoies = (results as IBANPlateformeCommune).voies
          .filter(({ type }) => type === BANPlateformeResultTypeEnum.VOIE)
          .map(({ nomVoie, id }) => ({ value: id, label: nomVoie }))
        setVoiesOpts(mappedVoies)
      } catch (error) {
        console.error(error)
      }
    }

    fetchOptions()
  }, [signalement])

  useEffect(() => {
    const updateVoie = async () => {
      if (!selectedVoie) {
        return
      }

      if (selectedVoie.value.startsWith(signalement.codeCommune)) {
        try {
          const voie = await BANLookup(selectedVoie?.value)
          onEditSignalement('changesRequested', 'nomVoie')(selectedVoie.label)
          onEditSignalement('existingLocation')(getExistingLocation(voie))
          flyToVoie(voie as IBANPlateformeVoie)
        } catch (error) {
          console.error(error)
        }
      } else {
        onEditSignalement('changesRequested', 'nomVoie')(selectedVoie.value)
        onEditSignalement('existingLocation')(null)
      }
    }

    if (selectedVoie) {
      updateVoie()
    }
  }, [selectedVoie, flyToVoie, onEditSignalement, signalement.codeCommune])

  const isSubmitDisabled = useMemo(() => {
    const { changesRequested } = signalement
    const isDisabled =
      (changesRequested as NumeroChangesRequestedDTO).positions?.length === 0 ||
      !(changesRequested as NumeroChangesRequestedDTO).nomVoie
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
        <h4>Demande de création d&apos;une adresse</h4>
      ) : (
        <>
          <h4>Demande de modification pour l&apos;adresse</h4>
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
              pattern='^[\da-zA-Z]+$'
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
          {isCreation ? (
            <MuiSelectInput
              label='Nom de la voie*'
              options={voiesOpts}
              value={{ label: nomVoie, value: nomVoie }}
              onChange={(event) => setSelectedVoie(event as SelectOptionType<string>)}
              filterOptions={(
                options: SelectOptionType<string>[],
                params: FilterOptionsState<SelectOptionType<string>>,
              ) => {
                const filtered = filter(options, params)

                const { inputValue } = params
                const isExisting = options.some((option) => inputValue === option.label)
                const isValid = inputValue.length > 3 && inputValue.length < 200
                if (inputValue !== '' && !isExisting && isValid) {
                  filtered.push({
                    value: inputValue,
                    label: `Créer la voie "${inputValue}"`,
                  })
                }

                return filtered
              }}
            />
          ) : (
            <Input
              label='Nom de la voie*'
              nativeInputProps={{
                maxLength: 200,
                minLength: 3,
                name: 'nomVoie',
                required: true,
                value: nomVoie,
                onChange: (event) =>
                  onEditSignalement('changesRequested', 'nomVoie')(event.target.value),
              }}
            />
          )}
        </div>
        <PositionInput
          positions={positions}
          onChange={onEditSignalement('changesRequested', 'positions')}
          initialPositionCoords={initialPositionCoords}
          multiPositionDisabled={mode !== CommuneStatusDTO.mode.FULL}
        />
        {mode === CommuneStatusDTO.mode.FULL && (
          <MuiSelectInput
            label='Complément'
            options={complementsOpts}
            value={{ label: nomComplement || '', value: nomComplement }}
            onChange={(event) =>
              onEditSignalement(
                'changesRequested',
                'nomComplement',
              )((event as SelectOptionType<string>)?.label || '')
            }
          />
        )}
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
