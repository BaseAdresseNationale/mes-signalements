import styled, { css } from 'styled-components'
import { REPORT_COLORS } from '../../utils/report.utils'

export const BLUE = REPORT_COLORS.unchanged

export const StyledCard = styled.section<{
  $color: string
  $selectable: boolean
  $selected: boolean
  // Les champs texte ne sont en gras que s'ils ont changé.
  $compare?: boolean
}>`
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--background-alt-grey);
  border-left: 4px solid ${({ $color }) => $color};

  ${({ $selectable }) =>
    $selectable &&
    css`
      cursor: pointer;
      transition:
        background 0.15s,
        box-shadow 0.15s;

      &:hover {
        background: var(--background-alt-grey-hover);
      }
    `}

  ${({ $selected, $color }) =>
    $selected &&
    css`
      background: var(--background-default-grey);
      box-shadow: 0 0 0 2px ${$color};

      &:hover {
        background: var(--background-default-grey-hover);
      }
    `}

  .heading {
    margin-bottom: 0.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: ${({ $color }) => $color};
  }

  button.heading {
    display: block;
    padding: 0;
    background: none;
    border: none;
    cursor: inherit;
    text-align: left;
  }

  .title {
    margin-bottom: 0.25rem;
    font-weight: 700;
  }

  ${({ $compare }) =>
    $compare &&
    css`
      .title {
        font-weight: 400;
      }
    `}

  .title.is-changed,
  .subtitle.is-changed {
    font-weight: 700;
  }

  .comment {
    margin: 0;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }

  .subtitle {
    margin-bottom: 0.25rem;
  }

  .commune {
    margin-bottom: 0.25rem;
  }

  .section-label {
    margin: 0.75rem 0 0.25rem;
    color: var(--text-mention-grey);
  }

  .positions {
    margin: 0.5rem 0 0;
    padding: 0;
    list-style: none;

    li {
      padding: 0;
      margin: 0 0 0.25rem;

      &::before {
        content: none;
      }
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      text-align: left;

      &:hover .position-label {
        text-decoration: underline;
      }
    }

    .indicator {
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1rem;

      &[data-change='added'] {
        color: ${REPORT_COLORS.added};
      }

      &[data-change='removed'] {
        color: ${REPORT_COLORS.removed};
      }

      &[data-change='retyped'] {
        color: ${REPORT_COLORS.retyped};
      }
    }

    .dot {
      box-sizing: border-box;
      width: 0.75rem;
      height: 0.75rem;
      border: 2px solid ${BLUE};
      border-radius: 50%;
    }
  }

  .fr-tags-group {
    margin: 0;
  }
`
