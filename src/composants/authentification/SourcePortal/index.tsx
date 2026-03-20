'use client'

import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Author, OpenAPI, Source } from '../../../api/signalement'
import { getValueFromLocalStorage, LocalStorageKeys } from '../../../utils/localStorage.utils'
import SourceMenuPopover from '../SourceMenuPopover'

const MenuButton = styled.button.attrs({
  className: 'fr-btn fr-icon-account-circle-fill',
})`
  cursor: pointer;

  &::after {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 1rem;
    height: 1rem;
    background-color: currentColor;
    mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z'/%3E%3C/svg%3E");
    -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-position: center;
    margin-left: 0.5rem;
    transition: transform 0.3s;
  }

  &[aria-expanded='true']::after {
    transform: rotate(180deg);
  }
`

interface SourcePortalProps {
  source: Source
}

export default function SourcePortal({ source }: SourcePortalProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const user = getValueFromLocalStorage<Author>(LocalStorageKeys.AUTHOR_CONTACT)

  return user ? (
    <div>
      <MenuButton
        ref={buttonRef}
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup='menu'
        aria-controls='source-menu-popover'
      >
        Mon espace
      </MenuButton>
      <SourceMenuPopover
        open={open}
        anchorRef={buttonRef}
        onClose={() => setOpen(false)}
        displayName={`${user.firstName} ${user.lastName}`}
        userEmail={user.email ?? ''}
        organization={source.nom}
        sourceUrl='/#/source'
        logoutUrl={`${OpenAPI.BASE}/proconnect/logout`}
      />
    </div>
  ) : null
}
