import { createGlobalStyle } from 'styled-components'

// Global styles to override styles
const GlobalStyle = createGlobalStyle`

/**
 * Tooltip Styles
 */

/* Add this attribute to the element that needs a tooltip */
[data-tooltip] {
  position: relative;
  z-index: 2;
  cursor: pointer;
}

/* Hide the tooltip content by default */
[data-tooltip]:before,
[data-tooltip]:after {
  visibility: hidden;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=0);
  opacity: 0;
  pointer-events: none;
}

/* Position tooltip above the element */
[data-tooltip]:before {
  position: absolute;
  bottom: 150%;
  left: 50%;
  margin-bottom: 5px;
  margin-left: -80px;
  padding: 7px;
  width: 160px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  background-color: #000;
  background-color: hsla(0, 0%, 20%, 0.9);
  color: #fff;
  content: attr(data-tooltip);
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
}

/* Triangle hack to make tooltip look like a speech bubble */
[data-tooltip]:after {
  position: absolute;
  bottom: 150%;
  left: 50%;
  margin-left: -5px;
  width: 0;
  border-top: 5px solid #000;
  border-top: 5px solid hsla(0, 0%, 20%, 0.9);
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  content: " ";
  font-size: 0;
  line-height: 0;
}

/* Show tooltip content on hover */
[data-tooltip]:hover:before,
[data-tooltip]:hover:after {
  visibility: visible;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
  filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=100);
  opacity: 1;
}

/**
 * Mapbox Styles
 */

.maplibregl-ctrl.maplibregl-ctrl-group {
    > button.active {
        background-color: rgb(0 0 0 / 5%);
    }

    > button.maplibregl-ctrl-plan  {
        > .maplibregl-ctrl-icon {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTIxLjc3NSA0LjM0MUEuNS41IDAgMCAxIDIyIDQuNzZWMTlsLTcgMy02LTMtNi4zMDMgMi43MDFhLjUuNSAwIDAgMS0uNjk3LS40NlY3bDItLjg1N3YxMi44MjRsNS4wNjUtMi4xNyA2IDNMMjAgMTcuNjhWNC44NTdsMS4zMDMtLjU1OGEuNS41IDAgMCAxIC40NzIuMDQyWm0tNS41MzItMS41ODNhNiA2IDAgMCAxIDAgOC40ODVMMTIgMTUuNDg1bC00LjI0My00LjI0MmE2IDYgMCAwIDEgOC40ODYtOC40ODVaTTEyIDIuOTk5YTQgNCAwIDAgMC0yLjgyOCA2LjgyOUwxMiAxMi42NTdsMi44MjgtMi44MjlBNCA0IDAgMCAwIDEyIDIuOTk5WiIvPjwvc3ZnPg==)

        }

        &.active {
            > .maplibregl-ctrl-icon {
                background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTIxLjc3NSA0LjM0YS41LjUgMCAwIDEgLjIyNS40MThWMTlsLTcgMy02LTMtNi4zMDMgMi43MDFhLjUuNSAwIDAgMS0uNjk3LS40NlY3bDMuMTI5LTEuMzQxYTYuOTkzIDYuOTkzIDAgMCAwIDEuOTIxIDYuMjlMMTIgMTYuOWw0Ljk1LTQuOTVhNi45OTYgNi45OTYgMCAwIDAgMS44NTgtNi41ODJsMi40OTUtMS4wN2EuNS41IDAgMCAxIC40NzIuMDQyWm0tNi4yNC0uODc2YTUgNSAwIDAgMSAuMDAxIDcuMDcxdi4wMDFMMTIgMTQuMDdsLTMuNTM2LTMuNTM1YTUgNSAwIDAgMSA3LjA3MS03LjA3WiIvPjwvc3ZnPg==)
            }
        }
    }

    > button.maplibregl-ctrl-satellite {
        > .maplibregl-ctrl-icon {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMTIuNTA2NSAzLjYyMzI2TDExLjQ4MzUgNS4zOTUwMUM4LjU3Mzc4IDQuNTE2MjkgNS45Njk2OCA0Ljk0NTMxIDUuMDcyMDcgNi41MDAwMUMzLjg5NDc3IDguNTM5MTUgNS44NjIzOSAxMi4xNTI0IDkuNzUwMjcgMTQuMzk3MUMxMy42MzgyIDE2LjY0MTggMTcuNzUxMiAxNi41MzkyIDE4LjkyODUgMTQuNUMxOS44MjYxIDEyLjk0NTMgMTguODk1NiAxMC40NzU2IDE2LjY3OTcgOC4zOTUwMUwxNy43MDI2IDYuNjIzMjZDMjAuNzg0NyA5LjMzMTk2IDIyLjE2NTQgMTIuODkzNCAyMC42NjA1IDE1LjVDMTguODAwMyAxOC43MjIxIDEzLjQ3MTcgMTguODU1MSA4Ljc1MDI3IDE2LjEyOTJDNC4wMjg5IDEzLjQwMzMgMS40Nzk3NiA4LjcyMjA4IDMuMzQwMDIgNS41MDAwMUM0Ljg0NDkyIDIuODkzNDQgOC42MTk2NCAyLjMwODQ5IDEyLjUwNjUgMy42MjMyNlpNMTUuODg0MiAxLjc3Mjc3TDE3LjYxNjMgMi43NzI3N0wxMi42MTYzIDExLjQzM0wxMC44ODQyIDEwLjQzM0wxNS44ODQyIDEuNzcyNzdaTTYuNzMyMzMgMjBIMTcuMDAwM1YyMkg1LjAxNzYxQzQuOTQwMDggMjIuMDAxNCA0Ljg2MTk0IDIxLjk5MzggNC43ODQ4MSAyMS45NzY4QzQuNzcwMjUgMjEuOTczNSA0Ljc1NTggMjEuOTcgNC43NDE0NyAyMS45NjYyQzQuNjU4OSAyMS45NDQgNC41Nzc4NCAyMS45MTA4IDQuNTAwMjggMjEuODY2QzQuNDcxMDYgMjEuODQ5MiA0LjQ0MzAxIDIxLjgzMSA0LjQxNjE2IDIxLjgxMThDNC4zMDE2MSAyMS43MjkyIDQuMjA1MjQgMjEuNjIzIDQuMTM0MiAyMS41MDAzQzQuMDYzMjggMjEuMzc3MiA0LjAxOTM5IDIxLjI0MDQgNC4wMDUxOCAyMS4wOTk3QzQuMDA0NDYgMjEuMDkyNCA0LjAwMzgxIDIxLjA4NSA0LjAwMzI1IDIxLjA3NzdDMy45ODc4NiAyMC44ODMgNC4wMjkyNCAyMC42ODE5IDQuMTM0MjUgMjAuNUw2LjM4NDI1IDE2LjYwMjlMOC4xMTYzIDE3LjYwMjlMNi43MzIzMyAyMFoiPjwvcGF0aD48L3N2Zz4=)

        }

        &.active {
            > .maplibregl-ctrl-icon {
                background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMTQuMzY4NSA0LjM5ODA3TDEwLjg4NDIgMTAuNDMzTDEyLjYxNjMgMTEuNDMzTDE2LjEwMDYgNS4zOTgwN0MyMC4yNyA4LjE3MDAyIDIyLjQwNTggMTIuNDc3MSAyMC42NjA1IDE1LjVDMTguODAwMyAxOC43MjIxIDEzLjQ3MTcgMTguODU1MSA4Ljc1MDI3IDE2LjEyOTJDNC4wMjg5IDEzLjQwMzMgMS40Nzk3NiA4LjcyMjA4IDMuMzQwMDIgNS41MDAwMUM1LjA4NTI3IDIuNDc3MTUgOS44ODMyNCAyLjE3MzIxIDE0LjM2ODUgNC4zOTgwN1pNMTUuODg0MiAxLjc3Mjc3TDE3LjYxNjMgMi43NzI3N0wxNi4xMTYzIDUuMzcwODRMMTQuMzg0MiA0LjM3MDg0TDE1Ljg4NDIgMS43NzI3N1pNNi43MzIzMyAyMEgxNy4wMDAzVjIySDUuMDE3NjFDNC45NDAwOCAyMi4wMDE0IDQuODYxOTQgMjEuOTkzOCA0Ljc4NDgxIDIxLjk3NjhDNC43NzAyNSAyMS45NzM1IDQuNzU1OCAyMS45NyA0Ljc0MTQ3IDIxLjk2NjJDNC42NTg5IDIxLjk0NCA0LjU3Nzg0IDIxLjkxMDggNC41MDAyOCAyMS44NjZDNC40NzEwNiAyMS44NDkyIDQuNDQzMDEgMjEuODMxIDQuNDE2MTYgMjEuODExOEM0LjMwMTYxIDIxLjcyOTIgNC4yMDUyNCAyMS42MjMgNC4xMzQyIDIxLjUwMDNDNC4wNjMyOCAyMS4zNzcyIDQuMDE5MzkgMjEuMjQwNCA0LjAwNTE4IDIxLjA5OTdDNC4wMDQ0NiAyMS4wOTI0IDQuMDAzODEgMjEuMDg1IDQuMDAzMjUgMjEuMDc3N0MzLjk4Nzg2IDIwLjg4MyA0LjAyOTI0IDIwLjY4MTkgNC4xMzQyNSAyMC41TDYuMzg0MjUgMTYuNjAyOUw4LjExNjMgMTcuNjAyOUw2LjczMjMzIDIwWiI+PC9wYXRoPjwvc3ZnPg==)
            }
        }
    }
}
`

export default GlobalStyle
