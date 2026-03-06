import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { MOBILE_BREAKPOINT } from '../../hooks/useWindowSize'
import * as focusTrap from 'focus-trap'

const StyledBackDrop = styled.div`
  height: 100dvh;
  position: fixed;
  background: rgb(24, 24, 24, 0.7);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;

  @media print {
    background: transparent;
  }
`

const StyledModal = styled.div`
  background: white;
  display: flex;
  padding: 2em;
  max-height: 90%;
  max-width: 90%;
  height: fit-content;
  flex-direction: column;

  > .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
    text-align: center;

    h3 {
      margin: 0;
      margin-right: 1em;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      margin: 0;

      &:hover {
        background: none;
      }
    }
  }

  > .content {
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
  }

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    padding: 1em;
  }

  @media print {
    position: absolute;
    bottom: 0;
    padding: 1em;
    height: calc(100% - 90px);
    width: 100%;
    max-width: unset;
    max-height: unset;

    > .header {
      button {
        display: none;
      }
    }
  }
`

interface ModalProps {
  title: string
  children: React.ReactNode
  onClose: () => void
  style?: React.CSSProperties
}

function Modal({ title, children, onClose, style }: ModalProps) {
  const rootElement = document.getElementById('root')
  const modalRef = useRef<HTMLDivElement>(null)
  const focusTrapRef = useRef<focusTrap.FocusTrap | null>(null)

  // Focus trap for accessibility
  useEffect(() => {
    if (!modalRef.current) {
      return
    }

    if (!focusTrapRef.current) {
      focusTrapRef.current = focusTrap.createFocusTrap(modalRef.current, {
        escapeDeactivates: true,
        clickOutsideDeactivates: true,
        onDeactivate: onClose,
      })
    }

    focusTrapRef.current.activate()
  }, [])

  return ReactDOM.createPortal(
    <StyledBackDrop>
      <StyledModal
        onClick={(e) => e.stopPropagation()}
        style={style}
        ref={modalRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
      >
        <div className='header'>
          <h3 id='modal-title'>{title}</h3>
          <button
            className='fr-btn fr-btn--close fr-btn--tertiary-no-outline'
            title='Fermer'
            type='button'
            onClick={() => {
              if (focusTrapRef.current) {
                focusTrapRef.current.deactivate()
              }
              onClose()
            }}
          >
            Fermer
          </button>
        </div>
        <div className='content'>{children}</div>
      </StyledModal>
    </StyledBackDrop>,
    rootElement as HTMLElement,
  )
}

export default Modal
