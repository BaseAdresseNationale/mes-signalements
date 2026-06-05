import { Sheet } from 'react-modal-sheet'
import styled from 'styled-components'

export const StyledDrawer = styled.div<{ $animationDuration: number }>`
  position: absolute;
  height: 100%;
  width: 400px;
  top: 0;
  left: -400px;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  background: white;
  padding: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: ${({ $animationDuration }) => `left ${$animationDuration}ms ease-in-out`};

  &.open {
    left: 0;
    bottom: 0;
  }

  > .fr-btn--close {
    position: absolute;
    top: 5px;
    right: 5px;
  }

  .content {
    flex: 1;
    margin-top: 32px;
    overflow-y: auto;
  }
`

export const StyledSheetHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding: 8px 8px 4px;

  > .fr-btn--close {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
`

// Conteneur invisible utilisé pour garder les enfants montés (et leurs effets actifs)
// quand la Sheet est fermée — la Sheet de react-modal-sheet démonte ses children
// quand isOpen=false.
export const StyledHiddenDrawerContent = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
  visibility: hidden;
`

// react-modal-sheet est monté via un portail dans document.body :
// on garantit qu'il reste au-dessus de la carte et des autres calques.
export const StyledSheet = styled(Sheet)`
  .react-modal-sheet-container {
    padding: 5px;
    z-index: 1000;
  }
  .react-modal-sheet-backdrop {
    z-index: 999;
  }
`
