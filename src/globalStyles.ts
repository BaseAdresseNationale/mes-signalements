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

/* ─── CreateAlertButton – Drag & Drop (Street-View style) ─── */

.create-alert-draggable {
  cursor: grab !important;
  transition: opacity 0.2s ease, transform 0.2s ease, color 0.2s ease;
}
.create-alert-draggable:hover:not(.active) {
  transform: rotate(30deg);
  color: inherit !important;
}
.create-alert-draggable.dragging {
  opacity: 0.25;
  transform: scale(0.8);
  cursor: grabbing !important;
}

/* Global cursor override while dragging */
body.alert-dragging,
body.alert-dragging * {
  cursor: grabbing !important;
  user-select: none;
}

/* Ghost flag element that follows the cursor */
.alert-drag-ghost {
  position: fixed;
  z-index: 10000;
  pointer-events: none;
  /* pole is at 34px from SVG left edge (viewBox starts at -28, pole at x=6) */
  transform: translate(-34px, -100%) scale(0.4);
  transform-origin: 34px bottom;
  opacity: 0;
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.alert-drag-ghost.visible {
  opacity: 1;
  transform: translate(-34px, -100%) scale(1);
}

/* SVG flag */
.alert-drag-ghost .alert-drag-flag {
  transition: transform 0.15s ease-out, filter 0.15s ease-out;
  filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.25));
}

/* Shadow dot beneath the pin */
.alert-drag-ghost .alert-drag-shadow-dot {
  width: 12px;
  height: 5px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.35), transparent);
  border-radius: 50%;
  margin-top: -3px;
  margin-left: 28px;
  transition: all 0.15s ease-out;
}

/* Enlarge when hovering over the map */
.alert-drag-ghost.over-map .alert-drag-flag {
  transform: scale(1.2);
  filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.35));
}
.alert-drag-ghost.over-map .alert-drag-shadow-dot {
  width: 18px;
  height: 7px;
}

/* Flag-drop bounce animation on successful drop */
.alert-drag-ghost.drop .alert-drag-flag {
  animation: alert-pin-bounce 0.5s ease-out forwards;
}
.alert-drag-ghost.drop .alert-drag-shadow-dot {
  animation: alert-shadow-pulse 0.5s ease-out forwards;
}

@keyframes alert-pin-bounce {
  0%   { transform: scale(1.2); }
  25%  { transform: scale(1.35) translateY(-10px); }
  50%  { transform: scale(1) translateY(0); }
  65%  { transform: scale(1.08) translateY(-4px); }
  80%  { transform: scale(1) translateY(0); }
  100% { transform: scale(1); opacity: 0; }
}

@keyframes alert-shadow-pulse {
  0%   { transform: scale(1); opacity: 1; }
  25%  { transform: scale(0.5); opacity: 0.4; }
  50%  { transform: scale(1.3); opacity: 1; }
  65%  { transform: scale(0.85); opacity: 0.8; }
  80%  { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}

/* Return-to-button animation */
.alert-drag-ghost.returning {
  opacity: 0 !important;
  transform: translate(-34px, -50%) scale(0.2) !important;
}
`

export default GlobalStyle
