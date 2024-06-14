import React from 'react'
import styled from 'styled-components'

const StyledFilters = styled.ul``

interface FiltersProps {
  options: { label: string; value: string | null }[]
  value: string | null
  onChange: (value: string | null) => void
}

export function Filters({ options, value, onChange }: FiltersProps) {
  return (
    <StyledFilters className='fr-btns-group fr-btns-group--inline'>
      {options.map(({ label, value: _value }, index) => (
        <button
          key={index}
          onClick={() => onChange(value === _value ? null : _value)}
          className={value === _value ? 'fr-btn fr-btn--secondary' : 'fr-btn'}
        >
          {label}
        </button>
      ))}
    </StyledFilters>
  )
}
