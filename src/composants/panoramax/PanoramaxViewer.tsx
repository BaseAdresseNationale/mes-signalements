import React, { useEffect } from 'react'
import styled from 'styled-components'

interface PanoramaxViewerProps {
  src: string
  onClose: () => void
}

const StyledPanoramaxViewer = styled.div`
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
  animation: panoramax-viewer-fade-in 250ms ease-out;

  @keyframes panoramax-viewer-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .panoramax-viewer-container {
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    min-height: 0;
  }
  .panoramax-viewer-iframe {
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }
  .panoramax-viewer-close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10001;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
  .panoramax-viewer-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
  }
`

export function PanoramaxViewer({ src, onClose }: Readonly<PanoramaxViewerProps>) {
  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <StyledPanoramaxViewer>
      <button
        type='button'
        className='panoramax-viewer-close fr-btn fr-btn--secondary fr-icon-close-line fr-btn--icon-left'
        title='Fermer Panoramax'
        aria-label='Fermer Panoramax'
        onClick={onClose}
      >
        Fermer Panoramax
      </button>
      <iframe
        className='panoramax-viewer-iframe'
        src={src}
        title='Visionneuse Panoramax'
        allow='fullscreen; geolocation; xr-spatial-tracking'
        allowFullScreen
      />
    </StyledPanoramaxViewer>
  )
}
