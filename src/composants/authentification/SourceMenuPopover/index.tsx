'use client'

import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import * as focusTrap from 'focus-trap'
import {
  getValueFromLocalStorage,
  LocalStorageKeys,
  removeValueFromLocalStorage,
} from '../../../utils/localStorage.utils'
import { Author, OpenAPI } from '../../../api/signalement'

const Popover = styled.div`
  position: fixed;
  z-index: 1000;
  min-width: 240px;
  max-width: 320px;
  background: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
`

const UserInfo = styled.div`
  padding: 0.75rem 1rem;
  background: var(--background-alt-blue-france);
  border-bottom: 1px solid var(--border-default-grey);
`

const UserName = styled.div`
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-title-grey);
`

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: var(--text-mention-grey);
  word-break: break-word;
`

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.25rem 0;
  max-height: 220px;
  overflow-y: auto;
`

const MenuItem = styled.li`
  margin: 0;
  &:hover {
    background: var(--background-alt-blue-france);
    text-decoration: none;
  }
`

const MenuLink = styled.a`
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  color: inherit;
  text-decoration: none;
  font-size: 0.875rem;
`

interface SourceMenuPopoverProps {
  open: boolean
  anchorRef: React.RefObject<HTMLElement>
  onClose: () => void
}

export default function SourceMenuPopover({ open, anchorRef, onClose }: SourceMenuPopoverProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const focusTrapRef = useRef<focusTrap.FocusTrap | null>(null)
  const user = getValueFromLocalStorage<Author>(LocalStorageKeys.AUTHOR_CONTACT)

  useEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }

    const anchor = anchorRef.current
    if (!anchor) return

    const handleResize = () => {
      const minWidth = 240
      const rect = anchor.getBoundingClientRect()
      const left = Math.min(Math.max(8, rect.right - minWidth), window.innerWidth - minWidth - 8)
      const top = rect.bottom + 8
      setPosition({ top, left })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [anchorRef, onClose, open])

  // Focus trap
  useEffect(() => {
    if (!open || !popoverRef.current) return

    if (!focusTrapRef.current) {
      focusTrapRef.current = focusTrap.createFocusTrap(popoverRef.current, {
        escapeDeactivates: true,
        clickOutsideDeactivates: true,
        returnFocusOnDeactivate: true,
        onDeactivate: onClose,
      })
    }

    focusTrapRef.current.activate()

    return () => {
      focusTrapRef.current?.deactivate()
      focusTrapRef.current = null
    }
  }, [open])

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onClose()

    const wasProconnected = getValueFromLocalStorage<boolean>(LocalStorageKeys.PROCONNECTED)

    removeValueFromLocalStorage(LocalStorageKeys.AUTHOR_CONTACT)
    removeValueFromLocalStorage(LocalStorageKeys.SOURCE_TOKEN)
    removeValueFromLocalStorage(LocalStorageKeys.PROCONNECTED)

    if (wasProconnected) {
      window.location.href = `${OpenAPI.BASE}/proconnect/logout`
    } else {
      window.location.href = '/'
    }
  }

  return (
    <Popover
      id='source-menu-popover'
      role='menu'
      ref={popoverRef}
      style={{
        top: `${position?.top}px`,
        left: `${position?.left}px`,
        display: open ? 'block' : 'none',
      }}
    >
      {user && (
        <UserInfo>
          {user.firstName && user.lastName && (
            <UserName>{`${user.firstName} ${user.lastName}`}</UserName>
          )}
          {user.email && <UserEmail>{user.email}</UserEmail>}
        </UserInfo>
      )}
      <MenuList>
        <MenuItem>
          <MenuLink
            href='/#/source'
            onClick={onClose}
            className='fr-link fr-link--icon-left fr-icon-bar-chart-line'
          >
            Tableau de suivi
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink
            href='/'
            onClick={handleLogout}
            className='fr-link fr-link--icon-left fr-icon-arrow-right-line'
          >
            Se déconnecter
          </MenuLink>
        </MenuItem>
      </MenuList>
    </Popover>
  )
}
