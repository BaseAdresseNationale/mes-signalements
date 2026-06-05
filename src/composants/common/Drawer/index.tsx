import React, { forwardRef, useContext, useEffect } from 'react'
import { Sheet } from 'react-modal-sheet'
import { StyledDrawer, StyledSheetGlobal, StyledSheetHeader } from './Drawer.styles'
import LayoutContext, { ANIMATION_DURATION } from '../../../contexts/layout.context'
import useWindowSize from '../../../hooks/useWindowSize'

interface DrawerProps {
  ref: React.Ref<HTMLDivElement>
  children: React.ReactNode
  onClose: () => void
}

// Snap points en proportion de la hauteur disponible (ordre croissant).
// Index 0 = fermé, 1 = rétracté, 2 = mi-hauteur (par défaut), 3 = étiré.
const MOBILE_SNAP_POINTS = [0, 0.15, 0.5, 1]
const MOBILE_INITIAL_SNAP = 2

function _Drawer({ children, onClose }: DrawerProps, ref: React.Ref<HTMLDivElement>) {
  const { isMobile } = useWindowSize()
  const { showDrawer } = useContext(LayoutContext)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('[role="dialog"]')) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const closeButton = (
    <button
      className='fr-btn fr-btn--close fr-btn--tertiary-no-outline'
      title='Fermer'
      aria-label='Fermer le panneau'
      type='button'
      onClick={onClose}
    >
      Fermer
    </button>
  )

  if (isMobile) {
    return (
      <>
        <StyledSheetGlobal />
        <Sheet
          isOpen={showDrawer}
          onClose={onClose}
          snapPoints={MOBILE_SNAP_POINTS}
          initialSnap={MOBILE_INITIAL_SNAP}
        >
          <Sheet.Container>
            <Sheet.Header>
              <StyledSheetHeader>
                <Sheet.DragIndicator />
                {closeButton}
              </StyledSheetHeader>
            </Sheet.Header>
            <Sheet.Content>{children}</Sheet.Content>
          </Sheet.Container>
        </Sheet>
      </>
    )
  }

  return (
    <StyledDrawer
      ref={ref}
      $animationDuration={ANIMATION_DURATION}
      role='complementary'
      aria-label='Panneau latéral'
    >
      {closeButton}
      <div className='content'>{children}</div>
    </StyledDrawer>
  )
}

export const Drawer = forwardRef(_Drawer)
