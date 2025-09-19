import React from 'react'
import styled from 'styled-components'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { FilterOptionsState } from '@mui/material'

export type SelectOptionType<T> = {
  label: string
  value: T
}

type CallbackType<IsMulti extends boolean, T> = IsMulti extends true
  ? (value: SelectOptionType<T>[]) => void
  : (value: SelectOptionType<T>) => void

type MuiSelectInputProps<IsMulti extends boolean, T> = {
  label: string
  placeholder?: string
  options: Array<SelectOptionType<T>>
  onChange: CallbackType<IsMulti, T>
  value: IsMulti extends true ? SelectOptionType<T>[] : SelectOptionType<T>
  hint?: string | React.ReactNode
  isDisabled?: boolean
  noOptionsText?: string
  isMultiSelect?: IsMulti
  disableClearable?: boolean
  filterOptions?: (
    options: SelectOptionType<string>[],
    params: FilterOptionsState<SelectOptionType<string>>,
  ) => SelectOptionType<string>[]
  errorMessage?: string
}

const StyledAutocomplete = styled(Autocomplete)`
  background-color: var(--background-contrast-grey);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  .MuiInputBase-root {
    &::before {
      border-bottom: 2px solid var(--border-plain-grey);
    }
    &::after {
      border-bottom: 2px solid var(--background-action-high-blue-france);
    }
    > input.MuiInputBase-input {
      padding: 0.5rem 1rem;
    }
  }
`

export function MuiSelectInput<IsMulti extends boolean, T>({
  label,
  placeholder,
  options,
  onChange,
  value,
  hint,
  isDisabled,
  noOptionsText = 'Aucun résultat',
  isMultiSelect = false as IsMulti,
  disableClearable = false,
  filterOptions,
  errorMessage,
}: MuiSelectInputProps<IsMulti, T>) {
  return (
    <div
      className={`fr-select-group${isDisabled ? ' fr-select-group--disabled' : ''}`}
      style={{ marginBottom: 0 }}
    >
      <label className='fr-label' htmlFor={`select-${label}`}>
        {label}
        {hint && <span className='fr-hint-text'>{hint}</span>}
      </label>
      <StyledAutocomplete
        multiple={isMultiSelect}
        value={value}
        style={{ width: '100%' }}
        options={options}
        getOptionLabel={(option: any) => option.label}
        onChange={(event, values: any) => {
          onChange(values)
        }}
        renderInput={(params: any) => (
          <TextField {...params} variant='standard' placeholder={placeholder} />
        )}
        disablePortal
        noOptionsText={noOptionsText}
        filterOptions={filterOptions as any}
        disableClearable={disableClearable}
      />
      {errorMessage && (
        <div className='fr-messages-group' aria-live='polite'>
          <p className='fr-message fr-message--error'>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}
