import styled from 'styled-components'
import { MOBILE_BREAKPOINT } from '../../../hooks/useWindowSize'

export const StyledAutocomplete = styled.div<{ $resultListWidth: number }>`
  position: relative;
  input:focus {
    outline: none;
  }
  .results {
    position: fixed;
    width: ${(props) => props.$resultListWidth}px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-top: none;
    z-index: 100;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 0 0 4px 4px;

    > p {
      padding: 5px 10px;
      margin: 0;
    }
  }
`

export const StyledResultList = styled.div`
  display: flex;
  flex-direction: column;
  > .result-item {
    padding: 5px;
    > label {
      font-weight: bold;
    }

    > button {
      width: 100%;
      text-align: left;
      padding: 5px 10px;
      &:hover {
        background-color: #eee;
      }
    }
  }

  > .sticky-button {
    padding: 5px;
    background-color: white;
    position: sticky;
    bottom: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    > button {
      width: 100%;
      text-align: left;
      padding: 5px 10px;
      &:hover {
        background-color: initial;
      }

      @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
        font-size: 0.9em;
      }
    }
  }
`
