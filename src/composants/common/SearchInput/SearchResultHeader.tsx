import React, { ReactNode } from 'react'
import { ItemHeader } from './SearchResultHeader.styles'

interface SearchResultHeaderProps {
  header: ReactNode
}

function SearchResultHeader({ header }: SearchResultHeaderProps) {
  return (
    <div>
      <ItemHeader className='item-header'>{header}</ItemHeader>
    </div>
  )
}

export default SearchResultHeader
