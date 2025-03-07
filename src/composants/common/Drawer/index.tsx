import React, { forwardRef } from 'react'
import { StyledDrawer } from './Drawer.styles'
import { ANIMATION_DURATION } from '../../../layouts/MapLayout'

interface DrawerProps {
  ref: React.Ref<HTMLDivElement>
  children: React.ReactNode
  onClose: () => void
}

function _Drawer({ children, onClose }: DrawerProps, ref: React.Ref<HTMLDivElement>) {
  return (
    <StyledDrawer ref={ref} $animationDuration={ANIMATION_DURATION}>
      <button
        className='fr-btn fr-btn--close fr-btn--tertiary-no-outline'
        title='Fermer'
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
