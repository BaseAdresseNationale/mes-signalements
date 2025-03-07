import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { MOBILE_BREAKPOINT } from '../../hooks/useWindowSize'

const StyledBackDrop = styled.div`
  height: 100vh;
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
}

function Modal({ title, children, onClose }: ModalProps) {
  const rootElement = document.getElementById('root')

  return ReactDOM.createPortal(
    <StyledBackDrop onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <div className='header'>
          <h3>{title}</h3>
          <button
            className='fr-btn fr-btn--close fr-btn--tertiary-no-outline'
            title='Fermer'
            type='button'
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
        {children}
      </StyledModal>
    </StyledBackDrop>,
    rootElement as HTMLElement,
  )
}

export default Modal
