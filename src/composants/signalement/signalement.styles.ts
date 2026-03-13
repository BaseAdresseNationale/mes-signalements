import styled from 'styled-components'
import { MOBILE_BREAKPOINT } from '../../hooks/useWindowSize'

export const SignalementTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const StyledForm = styled.form`
  padding: 0 4px;
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: unset !important;
  margin: unset !important;
  overflow: scroll;

  section:not(:first-of-type) {
    margin-top: 2em;
  }

  .close-btn {
    position: absolute;
    top: 15px;
    right: 10px;

    :hover {
      cursor: pointer;
      background-color: transparent;
    }
  }

  .form-row {
    margin-bottom: 1em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div {
      width: 100%;

      &:not(:first-child) {
        margin-left: 1em;
      }
    }
  }

  .fr-alert {
    margin-top: 15px;
  }

  .send-date {
    margin-top: 2em;
    display: none;
  }

  .form-controls {
    z-index: 10;
    position: sticky;
    bottom: 0;
    display: flex;
    background-color: white;
    justify-content: center;
    padding-top: 10px;
    margin-top: 1em;

    > :not(:first-child) {
      margin-left: 1em;
    }
  }

  .captcha-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 1em;
  }

  h6 {
    margin: 1em 0 0.5em 0;
  }

  legend {
    font-style: italic;
  }

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    padding: 0;
  }

  @media print {
    section {
      display: none;

      &:has(> .signalement-recap) {
        display: block;
      }
    }

    .send-date {
      display: block;
    }

    .fr-alert {
      display: none;
    }

    button {
      display: none;
    }
  }
`

export const StyledRecapSection = styled.section`
  .signalement-recap {
    display: flex;
    justify-content: space-between;
    margin-top: 1em;

    > div {
      width: 100%;
    }

    h6 {
      font-size: 1.2em;
      margin-bottom: 0.5em;
    }

    @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
      flex-direction: column;

      > div:not(:first-of-type) > h5 {
        margin-top: 1em;
      }
    }
  }
`
