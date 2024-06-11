import ReactDOM from "react-dom";
import styled from "styled-components";
import { MOBILE_BREAKPOINT } from "../../hooks/useWindowSize";

const StyledContainer = styled.div`
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

  > .modal {
    background: white;
    display: flex;
    padding: 2em;
    border-radius: 5px;
    max-height: 90%;
    max-width: 90%;
    height: fit-content;
    flex-direction: column;
    overflow: auto;

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
  }

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    > .modal {
      padding: 1em;
    }
  }
`;

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

function Modal({ title, children, onClose }: ModalProps) {
  const rootElement = document.getElementById("root");

  return ReactDOM.createPortal(
    <StyledContainer>
      <div className="modal">
        <div className="header">
          <h3>{title}</h3>
          <button type="button" onClick={onClose}>
            X
          </button>
        </div>
        {children}
      </div>
    </StyledContainer>,
    rootElement as HTMLElement
  );
}

export default Modal;
