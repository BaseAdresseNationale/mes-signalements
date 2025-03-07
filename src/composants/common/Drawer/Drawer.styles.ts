import styled from 'styled-components'
import { MOBILE_BREAKPOINT } from '../../../hooks/useWindowSize'

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

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    position: absolute;
    height: 50%;
    bottom: -50%;
    width: 100%;
    top: unset;
    left: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    background: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: ${({ $animationDuration }) => `bottom ${$animationDuration}ms ease-in-out`};
  }
`
