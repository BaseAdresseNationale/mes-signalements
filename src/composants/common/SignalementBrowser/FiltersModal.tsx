import React, { useState } from 'react'
import Modal from '../Modal'
import { MultiSelectInput, SelectOptionType } from '../MultiSelectInput'
import { Signalement } from '../../../api/signalement'
import { SignalementBrowserFilter } from '.'
import styled from 'styled-components'
import Button from '@codegouvfr/react-dsfr/Button'
import { AsyncMultiSelectInput } from '../AsyncMultiSelectInput'
import { search as searchAPIAdresse } from '../../../api/api-adresse'
import { APIAdressePropertyType } from '../../../api/api-adresse/types'

export const filterStatusOptions = [
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

export const filterTypesOptions = [
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

interface FiltersModalProps {
  filters: SignalementBrowserFilter
  onClose: () => void
  onSubmit: (newFilters: SignalementBrowserFilter) => void
  onReset?: () => void
  sourceOptions?: SelectOptionType<string>[]
}

export function FiltersModal({
  filters,
  onClose,
  onSubmit,
  onReset,
  sourceOptions,
}: FiltersModalProps) {
  const [value, setValue] = useState(filters)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(value)
    onClose()
  }

  return (
    <Modal onClose={onClose} title='Filtrer les signalements' style={{ width: 600 }}>
      <StyledForm onSubmit={handleSubmit}>
        <MultiSelectInput
          label='Statuts'
          value={value.status}
          options={filterStatusOptions}
          onChange={(newValue) =>
            setValue((prev: SignalementBrowserFilter) => ({
              ...prev,
              status: newValue as SelectOptionType<Signalement.status>[],
            }))
          }
          hint={filterStatusOptions.map((option) => option.label).join(', ')}
        />

        <MultiSelectInput
          label='Types'
          value={value.types}
          options={filterTypesOptions}
          onChange={(newValue) =>
            setValue((prev: SignalementBrowserFilter) => ({
              ...prev,
              types: newValue as SelectOptionType<Signalement.type>[],
            }))
          }
          hint={filterTypesOptions.map((option) => option.label).join(', ')}
        />

        {sourceOptions?.length && sourceOptions.length > 0 && (
          <MultiSelectInput
            label='Sources'
            value={value.sources}
            options={sourceOptions}
            onChange={(newValue) =>
              setValue((prev: SignalementBrowserFilter) => ({
                ...prev,
                sources: newValue as SelectOptionType<string>[],
              }))
            }
            hint='Sources de provenance des signalements'
          />
        )}

        <AsyncMultiSelectInput
          label='Communes'
          value={value.communes}
          onChange={(newValue) =>
            setValue((prev: SignalementBrowserFilter) => ({
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
          hint='Communes sur lesquelles les signalements ont été effectués'
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
