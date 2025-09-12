import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import Input from '@codegouvfr/react-dsfr/Input'
import { createFilterOptions } from '@mui/material/Autocomplete'
import { FilterOptionsState } from '@mui/material'
import useNavigateWithPreservedSearchParams from '../../../../hooks/useNavigateWithPreservedSearchParams'
import { useParams } from 'react-router-dom'
import { useAsyncBalValidator } from '../../../../hooks/useAsyncBALValidator'

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
  const isCreation = signalement.type === Signalement.type.LOCATION_TO_CREATE
  const { navigate } = useNavigateWithPreservedSearchParams()
  const routerParams = useParams()

  const [voiesOpts, setVoiesOpts] = useState<SelectOptionType<string>[]>([])
  const [complementsOpts, setComplementsOpts] = useState<SelectOptionType<string>[]>([])

  const { validationErrors, onValidate, onEdit } = useAsyncBalValidator<NumeroChangesRequestedDTO>({
    onSubmit,
    onEditSignalement,
  })

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

  const handleChangeVoie = useCallback(
    async (selectedVoie: SelectOptionType<string>) => {
      if (!selectedVoie || selectedVoie.value === address.id) {
        return
      }

      if (selectedVoie.value.startsWith(signalement.codeCommune)) {
        try {
          const voie = await BANLookup(selectedVoie?.value)
          navigate(`/${voie.id}?type=${Signalement.type.LOCATION_TO_CREATE}`)
        } catch (error) {
          console.error(error)
        }
      } else if (routerParams['code'] === signalement.codeCommune) {
        onEdit('changesRequested', 'nomVoie')(selectedVoie.value)
      } else {
        navigate(
          `/${signalement.codeCommune}?type=${Signalement.type.LOCATION_TO_CREATE}&changesRequested=${JSON.stringify(
            {
              nomVoie: selectedVoie.value,
            },
          )}`,
        )
      }
    },
    [signalement.codeCommune, navigate, onEdit, address.id],
  )

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

  const selectedVoie = useMemo(() => {
    return voiesOpts.find(({ label }) => label === nomVoie)
  }, [signalement, voiesOpts])

  return (
    <StyledForm onSubmit={(event) => onValidate(event)(signalement.changesRequested)}>
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
          <Input
            label='Numéro*'
            nativeInputProps={{
              required: true,
              min: 1,
              type: 'number',
              name: 'numero',
              value: numero || '',
              onChange: (event) => onEdit('changesRequested', 'numero')(event.target.value),
            }}
            {...(validationErrors?.numero && {
              stateRelatedMessage: validationErrors.numero,
              state: 'error',
            })}
          />
          <Input
            label='Suffixe'
            nativeInputProps={{
              maxLength: 9,
              pattern: '^[\\da-zA-Z]+$',
              name: 'suffixe',
              placeholder: 'bis, ter...',
              value: suffixe as string,
              onChange: (event) => onEdit('changesRequested', 'suffixe')(event.target.value),
            }}
            {...(validationErrors?.suffixe && {
              stateRelatedMessage: validationErrors.suffixe,
              state: 'error',
            })}
          />
        </div>
        <div className='form-row'>
          <MuiSelectInput
            label='Voie*'
            options={voiesOpts}
            value={{ label: nomVoie, value: nomVoie }}
            onChange={(event) => handleChangeVoie(event as SelectOptionType<string>)}
            isDisabled={mode !== CommuneStatusDTO.mode.FULL}
            {...(isCreation
              ? {
                  filterOptions: (
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
                  },
                  hint: 'Si la voie n’existe pas dans la liste, vous pouvez la créer en la saisissant ci-dessus.',
                }
              : {
                  hint: selectedVoie && (
                    <>
                      Si vous souhaitez renommer la voie, c&apos;est par{' '}
                      <button
                        className='fr-link'
                        type='button'
                        onClick={() =>
                          navigate(
                            `/${selectedVoie.value}?type=${Signalement.type.LOCATION_TO_UPDATE}`,
                          )
                        }
                      >
                        ici
                      </button>
                    </>
                  ),
                })}
            {...(validationErrors?.nomVoie && {
              errorMessage: validationErrors.nomVoie,
            })}
          />
        </div>
        <PositionInput
          positions={positions}
          onChange={onEdit('changesRequested', 'positions')}
          initialPositionCoords={initialPositionCoords}
          multiPositionDisabled={mode !== CommuneStatusDTO.mode.FULL}
          {...(validationErrors?.positions && {
            errorMessage: validationErrors.positions,
          })}
        />
        {mode === CommuneStatusDTO.mode.FULL && (
          <MuiSelectInput
            label='Complément'
            options={complementsOpts}
            value={{ label: nomComplement || '', value: nomComplement }}
            onChange={(event) =>
              onEdit(
                'changesRequested',
                'nomComplement',
              )((event as SelectOptionType<string>)?.label || '')
            }
            {...(validationErrors?.nomComplement && {
              errorMessage: validationErrors.nomComplement,
            })}
          />
        )}
        {mode === CommuneStatusDTO.mode.FULL && (
          <ParcelleInput
            parcelles={parcelles}
            {...(validationErrors?.parcelles && {
              errorMessage: validationErrors.parcelles,
            })}
          />
        )}
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
              onChange={(event) => onEdit('changesRequested', 'comment')(event.target.value)}
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
