import styled from "styled-components";

export const StyledDrawer = styled.div<{ $animationDuration: number }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  background: white;
  height: 100%;
  width: 400px;
  top: 0;
  left: -400px;
  bottom: 0;
  z-index: 2;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: ${({ $animationDuration }) =>
    `left ${$animationDuration}ms ease-in-out`};

  &.open {
    left: 0;
  }
`;
