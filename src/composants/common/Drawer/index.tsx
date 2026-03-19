import React, { forwardRef, useEffect } from 'react'
import { StyledDrawer } from './Drawer.styles'
import { ANIMATION_DURATION } from '../../../contexts/layout.context'

interface DrawerProps {
  ref: React.Ref<HTMLDivElement>
  children: React.ReactNode
  onClose: () => void
}

function _Drawer({ children, onClose }: DrawerProps, ref: React.Ref<HTMLDivElement>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('[role="dialog"]')) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <StyledDrawer
      ref={ref}
      $animationDuration={ANIMATION_DURATION}
      role='complementary'
      aria-label='Panneau latéral'
    >
      <button
        className='fr-btn fr-btn--close fr-btn--tertiary-no-outline'
        title='Fermer'
        aria-label='Fermer le panneau'
        type='button'
        onClick={onClose}
      >
        Fermer
      </button>
      <div className='content'>{children}</div>
    </StyledDrawer>
  )
}

export const Drawer = forwardRef(_Drawer)
