import React from 'react'
import Button from '@codegouvfr/react-dsfr/Button'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`

interface PaginationProps {
  count: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ count, currentPage, onPageChange }: PaginationProps) {
  return (
    <StyledWrapper>
      <Button
        iconId='fr-icon-arrow-left-s-first-line'
        onClick={() => onPageChange(1)}
        priority='tertiary no outline'
        title='Première page'
        disabled={currentPage === 1}
      />
      <Button
        iconId='fr-icon-arrow-left-s-line'
        onClick={() => onPageChange(currentPage - 1)}
        priority='tertiary no outline'
        title='Page précédente'
        disabled={currentPage === 1}
      />
      <div>
        Page {currentPage} / {count}
      </div>
      <Button
        iconId='fr-icon-arrow-right-s-line'
        onClick={() => onPageChange(currentPage + 1)}
        priority='tertiary no outline'
        title='Page suivante'
        disabled={currentPage === count}
      />
      <Button
        iconId='fr-icon-arrow-right-s-last-line'
        onClick={() => onPageChange(count)}
        priority='tertiary no outline'
        title='Dernière page'
        disabled={currentPage === count}
      />
    </StyledWrapper>
  )
}
