import React from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  min-width: 80px;

  label {
    font-size: 0.9rem;
    color: #555;
  }

  b {
    font-size: 1.2rem;
    color: #000;
  }
`

interface CountStatProps {
  label: string
  count: number
}

export function CountStat({ label, count }: CountStatProps) {
  return (
    <StyledWrapper>
      <label>{label}</label>
      <b>{count}</b>
    </StyledWrapper>
  )
}
