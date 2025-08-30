import { createGlobalStyle } from 'styled-components'

// Global styles to override styles
const GlobalStyle = createGlobalStyle`
/* Trick to display the CSS pseudo classes background colors in the print preview */
@media print {
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}

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
 * Maplibre Styles
 */

.maplibregl-ctrl.maplibregl-style-switcher {
  > button {
    background-size: cover;
    width: 80px;
    height: 80px;
    border: none;
    margin: 5px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    position: relative;

    > span {
      color: white;
      font-size: 10px;
      font-weight: bold;
      padding: 4px;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      bottom: 2px;
      left: 50%;
      border-radius: 5px;
      transform: translateX(-50%);
    }
  }
}

/**
 * DSFR Styles Overrides
 */

/**
 * We want to display the search button first in the header
 * which is included using createPortal in the navbar
 */
.fr-header__navbar {
  flex-direction: row-reverse;
  justify-content: flex-start;
}


.maplibregl-ctrl.maplibregl-ctrl-group {
  > button.active {
    color: white;
    background-color: #000091;
    border-radius: 5px;
    > img {
      filter: invert(1);
    }
  }
}

 

.loader-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
`

export default GlobalStyle
