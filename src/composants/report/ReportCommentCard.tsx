import React from 'react'
import { StyledCard } from './ReportCard.styles'

interface ReportCommentCardProps {
  comment: string
}

export default function ReportCommentCard({ comment }: Readonly<ReportCommentCardProps>) {
  return (
    <StyledCard $color='var(--border-plain-grey)' $selectable={false} $selected={false}>
      <p className='heading fr-text--xs'>Commentaire</p>
      <p className='comment fr-text--sm'>{comment}</p>
    </StyledCard>
  )
}
