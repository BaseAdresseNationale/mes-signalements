import React, { useContext, useEffect, useState } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'
import ReactDOM from 'react-dom'
import LayoutContext from '../../contexts/layout.context'

function SearchMobileButton() {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const { searchMobileButtonRef, setShowSearch, showDrawer, showSearch } = useContext(LayoutContext)

  useEffect(() => {
    const el = document.querySelector('.fr-header__navbar')
    setContainer(el as HTMLElement | null)
  }, [])

  if (!container || showDrawer) {
    return null
  }

  return ReactDOM.createPortal(
    <Button
      ref={searchMobileButtonRef}
      onClick={() => setShowSearch((prev) => !prev)}
      title='Ouvrir la recherche'
      priority='tertiary no outline'
      type='button'
      iconId='fr-icon-search-line'
      style={{ backgroundColor: showSearch ? '#eeeeee' : undefined }}
    />,
    container,
  )
}

export default SearchMobileButton
