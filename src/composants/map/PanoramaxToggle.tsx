import { ControlPosition, IControl, MapInstance, useControl } from 'react-map-gl/maplibre'
import { useEffect, useRef } from 'react'
import { PANORAMAX_LAYERS_SOURCE, PANORAMAX_SOURCE_ID } from '../../config/map/panoramax'

type PanoramaxToggleProps = {
  showPanoramax: boolean
  setShowPanoramax: (show: boolean) => void
  position?: ControlPosition
}

const ENABLED_TITLE = 'Masquer Panoramax'
const DISABLED_TITLE = 'Afficher Panoramax'
const UNAVAILABLE_TITLE = 'Aucune photographie Panoramax disponible sur cette zone'

export class PanoramaxToggleControl implements IControl {
  private controlContainer: HTMLElement | undefined
  private buttonElement: HTMLButtonElement | undefined
  private map?: MapInstance
  private boundSourceData?: (e: any) => void

  constructor(private props: PanoramaxToggleProps) {}

  public getDefaultPosition(): string {
    return 'top-right'
  }

  private updateButtonAppearance() {
    if (!this.buttonElement) return
    const { showPanoramax } = this.props
    const isDisabled = this.buttonElement.hasAttribute('data-unavailable')
    const isScanMode = this.buttonElement.classList.contains('scan-mode')

    if (isDisabled) {
      this.buttonElement.title = UNAVAILABLE_TITLE
      this.buttonElement.ariaLabel = UNAVAILABLE_TITLE
      this.buttonElement.classList.add('disabled')
      this.buttonElement.classList.remove('active')
    } else {
      this.buttonElement.classList.remove('disabled')
      const title = isScanMode
        ? 'Fermer le mode scan Panoramax'
        : showPanoramax
          ? ENABLED_TITLE
          : DISABLED_TITLE
      this.buttonElement.title = title
      this.buttonElement.ariaLabel = title
      showPanoramax
        ? this.buttonElement.classList.add('active')
        : this.buttonElement.classList.remove('active')
    }
  }

  public setShowPanoramax(show: boolean) {
    this.props.showPanoramax = show
    this.updateButtonAppearance()
  }

  public onAdd(map: MapInstance): HTMLElement {
    this.map = map
    this.controlContainer = document.createElement('div')
    this.controlContainer.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group')

    const buttonElement = document.createElement('button')
    this.buttonElement = buttonElement
    buttonElement.id = 'panoramax-toggle'
    buttonElement.type = 'button'
    buttonElement.classList.add('panoramax-draggable')
    buttonElement.setAttribute('data-unavailable', '')

    const iconElement = document.createElement('img')
    iconElement.src = '/icons/panoramax.svg'
    iconElement.alt = 'Panoramax'
    iconElement.width = 18
    iconElement.height = 18
    buttonElement.appendChild(iconElement)

    // Click semantics are owned by <PanoramaxLensDrag /> (enter/exit scan mode
    // on click, drag + drop on a picture to dive). We keep no native click
    // handler here so the two flows don't conflict.

    this.controlContainer.appendChild(buttonElement)

    // Check if Panoramax data is available in the current view
    this.boundSourceData = (e: any) => {
      if (e.sourceId === PANORAMAX_SOURCE_ID && e.isSourceLoaded) {
        const sequences = (this.map as any)?.querySourceFeatures(PANORAMAX_SOURCE_ID, {
          sourceLayer: PANORAMAX_LAYERS_SOURCE.SEQUENCES,
        })
        const available = !!(sequences && sequences.length > 0)
        if (available) {
          this.buttonElement?.removeAttribute('data-unavailable')
        } else {
          this.buttonElement?.setAttribute('data-unavailable', '')
        }
        this.updateButtonAppearance()
      }
    }
    map.on('sourcedata', this.boundSourceData as any)

    this.updateButtonAppearance()

    return this.controlContainer
  }

  public onRemove(): void {
    if (this.map && this.boundSourceData) {
      this.map.off('sourcedata', this.boundSourceData as any)
    }
    if (this.controlContainer && this.controlContainer.parentNode) {
      this.controlContainer.parentNode.removeChild(this.controlContainer)
    }
    this.map = undefined
  }
}

export function PanoramaxToggle(props: PanoramaxToggleProps) {
  const { position, ...rest } = props
  const controlRef = useRef<PanoramaxToggleControl | null>(null)

  useControl(
    () => {
      const control = new PanoramaxToggleControl(rest)
      controlRef.current = control
      return control
    },
    { position },
  )

  // Keep control state in sync with React state changes
  useEffect(() => {
    controlRef.current?.setShowPanoramax(props.showPanoramax)
  }, [props.showPanoramax])

  return null
}
