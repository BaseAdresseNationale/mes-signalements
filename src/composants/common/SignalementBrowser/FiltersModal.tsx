import React, { useState } from 'react'
import Modal from '../Modal'
import { MuiSelectInput, SelectOptionType } from '../MuiSelectInput'
import { Alert, Signalement } from '../../../api/signalement'
import { BrowserFilter } from './types'
import styled from 'styled-components'
import Button from '@codegouvfr/react-dsfr/Button'
import { MuiAsyncSelectInput } from '../MuiAsyncSelectInput'
import { search as searchAPIAdresse } from '../../../api/api-adresse'
import { searchDepartements } from '../../../api/api-geo'
import { APIAdressePropertyType } from '../../../api/api-adresse/types'
import { getAlertTypeLabel } from '../../../utils/alert.utils'

export const signalementFilterStatusOptions: SelectOptionType<Signalement.status>[] = [
  {
    label: 'En cours',
    value: Signalement.status.PENDING,
  },
  {
    label: 'Acceptés',
    value: Signalement.status.PROCESSED,
  },
  {
    label: 'Refusés',
    value: Signalement.status.IGNORED,
  },
]

export const signalementFilterTypesOptions: SelectOptionType<Signalement.type>[] = [
  {
    label: 'Modification',
    value: Signalement.type.LOCATION_TO_UPDATE,
  },
  {
    label: 'Création',
    value: Signalement.type.LOCATION_TO_CREATE,
  },
  {
    label: 'Suppression',
    value: Signalement.type.LOCATION_TO_DELETE,
  },
]

export const alertFilterStatusOptions: SelectOptionType<Alert.status>[] = [
  {
    label: 'En cours',
    value: Alert.status.PENDING,
  },
  {
    label: 'Acceptées',
    value: Alert.status.PROCESSED,
  },
  {
    label: 'Refusées',
    value: Alert.status.IGNORED,
  },
  {
    label: 'Expirées',
    value: Alert.status.EXPIRED,
  },
]

export const alertFilterTypesOptions: SelectOptionType<Alert.type>[] = [
  {
    label: getAlertTypeLabel(Alert.type.MISSING_ADDRESS),
    value: Alert.type.MISSING_ADDRESS,
  },
]

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }
`

type GeoFilterValue = { type: 'commune' | 'departement'; code: string }

const EXCLUDED_DEPARTEMENT_CODES = ['75']
const EXCLUDED_COMMUNE_CODES = ['75056', '69123', '13055']

interface FiltersModalProps {
  filters: BrowserFilter
  onClose: () => void
  onSubmit: (newFilters: BrowserFilter) => void
  onReset?: () => void
  sourceOptions?: SelectOptionType<string>[]
  title?: string
  statusOptions: SelectOptionType<Alert.status | Signalement.status>[]
  typeOptions: SelectOptionType<Alert.type | Signalement.type>[]
  typeKey: 'signalementTypes' | 'alertTypes'
  sourceHint?: string
  communeHint?: string
}

export function FiltersModal({
  filters,
  onClose,
  onSubmit,
  onReset,
  sourceOptions,
  title = 'Filtrer',
  statusOptions,
  typeOptions,
  typeKey,
  sourceHint,
  communeHint,
}: Readonly<FiltersModalProps>) {
  const [value, setValue] = useState<BrowserFilter>(filters)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(value)
    onClose()
  }

  const geoValue: SelectOptionType<GeoFilterValue>[] = [
    ...value.departements.map((d) => ({
      label: d.label,
      value: { type: 'departement' as const, code: d.value },
    })),
    ...value.communes.map((c) => ({
      label: c.label,
      value: { type: 'commune' as const, code: c.value },
    })),
  ]

  const handleGeoChange = (newValue: SelectOptionType<GeoFilterValue>[]) => {
    const toOption = (option: SelectOptionType<GeoFilterValue>) => ({
      label: option.label,
      value: option.value.code,
    })
    setValue((prev) => ({
      ...prev,
      departements: newValue.filter((o) => o.value.type === 'departement').map(toOption),
      communes: newValue.filter((o) => o.value.type === 'commune').map(toOption),
    }))
  }

  return (
    <Modal onClose={onClose} title={title} style={{ width: 600 }}>
      <StyledForm onSubmit={handleSubmit}>
        <MuiSelectInput
          isMultiSelect
          label='Statuts'
          value={value.status}
          options={statusOptions}
          onChange={(newValue) =>
            setValue((prev) => ({
              ...prev,
              status: newValue as SelectOptionType<Alert.status | Signalement.status>[],
            }))
          }
          hint={statusOptions.map((option) => option.label).join(', ')}
        />

        <MuiSelectInput
          isMultiSelect
          label='Types'
          value={value[typeKey]}
          options={typeOptions}
          onChange={(newValue) =>
            setValue((prev) => ({
              ...prev,
              [typeKey]: newValue as SelectOptionType<Alert.type | Signalement.type>[],
            }))
          }
          hint={typeOptions.map((option) => option.label).join(', ')}
        />

        {sourceOptions?.length && sourceOptions.length > 0 ? (
          <MuiSelectInput
            isMultiSelect
            label='Sources'
            value={value.sources}
            options={sourceOptions}
            onChange={(newValue) =>
              setValue((prev) => ({
                ...prev,
                sources: newValue as SelectOptionType<string>[],
              }))
            }
            hint={sourceHint}
          />
        ) : null}

        <MuiAsyncSelectInput
          label='Départements ou communes'
          isMultiSelect
          value={geoValue}
          onChange={(newValue) => handleGeoChange(newValue as SelectOptionType<GeoFilterValue>[])}
          onFetchOptions={async (search: string) => {
            const [departementsResults, communesResults] = await Promise.all([
              searchDepartements(search),
              searchAPIAdresse({
                q: search,
                type: APIAdressePropertyType.MUNICIPALITY,
                limit: 10,
              }),
            ])

            const departementOptions: SelectOptionType<GeoFilterValue>[] = departementsResults
              .filter((departement) => !EXCLUDED_DEPARTEMENT_CODES.includes(departement.code))
              .map((departement) => ({
                label: `${departement.nom} (${departement.code})`,
                value: { type: 'departement', code: departement.code },
              }))

            const communeOptions: SelectOptionType<GeoFilterValue>[] = communesResults.features
              .filter(
                ({ properties }: { properties: { id: string } }) =>
                  !EXCLUDED_COMMUNE_CODES.includes(properties.id),
              )
              .map(({ properties }: { properties: { id: string; name: string } }) => ({
                label: `${properties.name} (${properties.id})`,
                value: { type: 'commune', code: properties.id },
              }))

            return [...departementOptions, ...communeOptions].filter(
              (option) =>
                // Filter out options that are already selected
                !geoValue.some(
                  (selected) =>
                    selected.value.type === option.value.type &&
                    selected.value.code === option.value.code,
                ),
            )
          }}
          hint={communeHint}
          searchMinLength={3}
        />

        <div className='form-actions'>
          <div>
            <Button type='submit' priority='primary'>
              Appliquer
            </Button>
            {onReset && (
              <Button
                type='button'
                priority='secondary'
                onClick={onReset}
                style={{ marginLeft: 30 }}
              >
                Réinitialiser
              </Button>
            )}
          </div>
          <Button priority='tertiary no outline' onClick={onClose} type='button'>
            Annuler
          </Button>
        </div>
      </StyledForm>
    </Modal>
  )
}
