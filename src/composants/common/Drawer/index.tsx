import React, { forwardRef, useContext, useEffect, useRef } from 'react'
import { Sheet, type SheetRef } from 'react-modal-sheet'
import { useTransform } from 'motion/react'
import {
  StyledDrawer,
  StyledHiddenDrawerContent,
  StyledSheet,
  StyledSheetHeader,
} from './Drawer.styles'
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

function MobileSheetContent({ children }: { children: React.ReactNode }) {
  // Le scroller interne de Sheet.Content ne donne accès qu'à la portion visible.
  // En ajoutant un padding-bottom égal à la distance qui sépare la sheet de sa
  // position totalement ouverte (`y`), l'utilisateur peut atteindre tout le
  // contenu même quand la sheet est sur un snap point intermédiaire.
  const { y } = Sheet.useContext()
  const paddingBottom = useTransform(y, (val) => val)

  return <Sheet.Content scrollStyle={{ paddingBottom }}>{children}</Sheet.Content>
}

function _Drawer({ children, onClose }: DrawerProps, ref: React.Ref<HTMLDivElement>) {
  const { isMobile } = useWindowSize()
  const { showDrawer } = useContext(LayoutContext)
  const sheetRef = useRef<SheetRef>(null)

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
    // La Sheet de react-modal-sheet démonte ses enfants quand isOpen=false.
    // Pour garder le comportement du drawer desktop (enfants toujours montés,
    // visibilité gérée par show/hide), on rend les enfants hors de la Sheet
    // dans un conteneur masqué quand le drawer doit être fermé.
    return showDrawer ? (
      <StyledSheet
        ref={sheetRef}
        isOpen
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
          <MobileSheetContent>{children}</MobileSheetContent>
        </Sheet.Container>
      </StyledSheet>
    ) : (
      <StyledHiddenDrawerContent aria-hidden='true'>{children}</StyledHiddenDrawerContent>
    )
  }

  return (
    <StyledDrawer
      ref={ref}
      $animationDuration={ANIMATION_DURATION}
      role='complementary'
      aria-label='Panneau latéral'
      className={showDrawer ? 'open' : ''}
      aria-hidden={!showDrawer}
    >
      {closeButton}
      <div className='content'>{children}</div>
    </StyledDrawer>
  )
}

export const Drawer = forwardRef(_Drawer)
