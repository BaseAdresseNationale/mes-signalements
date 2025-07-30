import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { debounce } from '@mui/material/utils'

export type SelectOptionType<T> = {
  label: string
  value: T
}

type AsyncMultiSelectInputProps<T> = {
  label: string
  placeholder?: string
  onChange: (value: SelectOptionType<T>[]) => void
  onFetchOptions: (search: string) => Promise<SelectOptionType<T>[]>
  value: SelectOptionType<T>[]
  hint?: string
  isDisabled?: boolean
  noOptionsText?: string
  searchMinLength?: number
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

export function AsyncMultiSelectInput<T>({
  label,
  placeholder,
  onChange,
  onFetchOptions,
  value,
  hint,
  isDisabled,
  noOptionsText = 'Aucun résultat',
  searchMinLength,
}: AsyncMultiSelectInputProps<T>) {
  const [searchValue, setSearchValue] = useState('')
  const [asyncOptions, setAsyncOptions] = useState<SelectOptionType<T>[]>([])

  const options = [...asyncOptions, ...value]

  useEffect(() => {
    const fetchOptions = debounce(async () => {
      if (searchValue.length < (searchMinLength || 0)) {
        setAsyncOptions([])
        return
      }

      try {
        const fetchedOptions = await onFetchOptions(searchValue)
        setAsyncOptions(fetchedOptions)
      } catch (error) {
        console.error('Error fetching options:', error)
        setAsyncOptions([])
      }
    }, 400)

    fetchOptions()
  }, [searchValue])

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
        style={{ width: '100%' }}
        value={value || []}
        options={options}
        getOptionLabel={(option: any) => option.label}
        onChange={(event, values: any) => {
          onChange(values)
          setSearchValue('')
        }}
        inputValue={searchValue}
        onInputChange={(event, newInputValue) => {
          if (!event) {
            return
          }
          setSearchValue(newInputValue)
        }}
        renderInput={(params: any) => (
          <TextField {...params} variant='standard' placeholder={placeholder} />
        )}
        disablePortal
        noOptionsText={
          searchValue.length >= (searchMinLength || 0)
            ? noOptionsText
            : `Votre recherche doit comporter au moins ${searchMinLength} caractères`
        }
      />
    </div>
  )
}
