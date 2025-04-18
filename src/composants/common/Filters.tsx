import React from 'react'
import styled from 'styled-components'
import { MOBILE_BREAKPOINT } from '../../hooks/useWindowSize'

const StyledFilters = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  position: sticky;
  flex-shrink: 0;

  > button:not(:first-child) {
    margin-left: 5px;
  }

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    > button {
      font-size: 0.8em;
    }
  }
`

interface FiltersProps {
  options: { label: string; value: string | null }[]
  value: string | null
  onChange: (value: string | null) => void
  style?: React.CSSProperties
}

export function Filters({ options, value, onChange, style }: Readonly<FiltersProps>) {
  return (
    <StyledFilters style={style}>
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
