import React, { useState } from 'react'
import Modal from '../Modal'
import { MuiSelectInput, SelectOptionType } from '../MuiSelectInput'
import { Alert, Signalement } from '../../../api/signalement'
import { BrowserFilter } from './types'
import styled from 'styled-components'
import Button from '@codegouvfr/react-dsfr/Button'
import { MuiAsyncSelectInput } from '../MuiAsyncSelectInput'
import { search as searchAPIAdresse } from '../../../api/api-adresse'
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
  {
    label: getAlertTypeLabel(Alert.type.ROAD_PROBLEM),
    value: Alert.type.ROAD_PROBLEM,
  },
  {
    label: getAlertTypeLabel(Alert.type.OTHER),
    value: Alert.type.OTHER,
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

interface FiltersModalProps<TType extends string, TStatus extends string> {
  filters: BrowserFilter<TType, TStatus>
  onClose: () => void
  onSubmit: (newFilters: BrowserFilter<TType, TStatus>) => void
  onReset?: () => void
  sourceOptions?: SelectOptionType<string>[]
  title?: string
  statusOptions: SelectOptionType<TStatus>[]
  typeOptions: SelectOptionType<TType>[]
  sourceHint?: string
  communeHint?: string
}

export function FiltersModal<TType extends string, TStatus extends string>({
  filters,
  onClose,
  onSubmit,
  onReset,
  sourceOptions,
  title = 'Filtrer',
  statusOptions,
  typeOptions,
  sourceHint,
  communeHint,
}: Readonly<FiltersModalProps<TType, TStatus>>) {
  const [value, setValue] = useState<BrowserFilter<TType, TStatus>>(filters)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(value)
    onClose()
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
              status: newValue as SelectOptionType<TStatus>[],
            }))
          }
          hint={statusOptions.map((option) => option.label).join(', ')}
        />

        <MuiSelectInput
          isMultiSelect
          label='Types'
          value={value.types}
          options={typeOptions}
          onChange={(newValue) =>
            setValue((prev) => ({
              ...prev,
              types: newValue as SelectOptionType<TType>[],
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
          label='Communes'
          isMultiSelect
          value={value.communes}
          onChange={(newValue) =>
            setValue((prev) => ({
              ...prev,
              communes: newValue as SelectOptionType<string>[],
            }))
          }
          onFetchOptions={async (search: string) => {
            const results = await searchAPIAdresse({
              q: search,
              type: APIAdressePropertyType.MUNICIPALITY,
              limit: 10,
            })

            return results.features.map(
              ({ properties }: { properties: { id: string; name: string } }) => ({
                value: properties.id,
                label: `${properties.name} (${properties.id})`,
              }),
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
