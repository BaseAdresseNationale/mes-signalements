import React from 'react'
import styled from 'styled-components'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

export type SelectOptionType<T> = {
  label: string
  value: T
}

type MultiSelectInputProps<T> = {
  label: string
  placeholder?: string
  options: Array<SelectOptionType<T>>
  onChange: (value: SelectOptionType<T>[]) => void
  value: SelectOptionType<T>[]
  hint?: string
  isDisabled?: boolean
  noOptionsText?: string
}

const StyledAutocomplete = styled(Autocomplete)`
  background-color: var(--background-contrast-grey);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  .MuiInputBase-root {
    > input.MuiInputBase-input {
      padding: 0.5rem 1rem;
    }
  }
`

export function MultiSelectInput<T>({
  label,
  placeholder,
  options,
  onChange,
  value,
  hint,
  isDisabled,
  noOptionsText = 'Aucun résultat',
}: MultiSelectInputProps<T>) {
  return (
    <div
      className={`fr-select-group ${isDisabled ? 'fr-select-group--disabled' : ''}`}
      style={{ marginBottom: 0 }}
    >
      <label className='fr-label' htmlFor={`select-${label}`}>
        {label}
        {hint && <span className='fr-hint-text'>{hint}</span>}
      </label>
      <StyledAutocomplete
        multiple
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
      />
    </div>
  )
}
