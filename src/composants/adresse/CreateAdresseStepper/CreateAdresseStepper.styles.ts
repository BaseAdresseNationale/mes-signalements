import styled from 'styled-components'

export const StyledCreateAdresseStepper = styled.div`
  .step {
    margin-top: 1rem;

    .step-label {
      display: block;
      margin-bottom: 1rem;

      span {
        font-weight: bold;
        margin-right: 0.5rem;
      }
    }

    .selection {
      margin-bottom: 1rem;
      span {
        font-weight: bold;
      }

      button {
        margin-left: 0.5rem;
      }
    }

    .not-found {
      margin-top: 1rem;
    }
  }
`
