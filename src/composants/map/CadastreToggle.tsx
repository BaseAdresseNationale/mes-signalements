import { ControlPosition, IControl, MapInstance, useControl } from 'react-map-gl/maplibre'

type CadastreToggleProps = {
  layers: string[]
  showCadastre: boolean
  setShowCadastre: (show: boolean) => void
  position?: ControlPosition
}

export class MaplibreLayerVisibilityControl implements IControl {
  private controlContainer: HTMLElement | undefined
  private map?: MapInstance

  constructor(private props: CadastreToggleProps) {}

  public getDefaultPosition(): string {
    const defaultPosition = 'top-right'
    return defaultPosition
  }

  public onAdd(map: MapInstance): HTMLElement {
    this.map = map
    this.controlContainer = document.createElement('div')
    this.controlContainer.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group')

    const buttonElement = document.createElement('button')
    buttonElement.id = 'cadastre-toggle'
    buttonElement.type = 'button'
    buttonElement.title = this.props.showCadastre ? 'Masquer le cadastre' : 'Afficher le cadastre'
    buttonElement.ariaLabel = this.props.showCadastre
      ? 'Masquer le cadastre'
      : 'Afficher le cadastre'

    buttonElement.addEventListener('click', () => {
      const isVisible = this.props.layers.every((layerId) => {
        const layer = this.map!.getLayer(layerId)

        return layer && layer.visibility === 'visible'
      })

      this.props.setShowCadastre(!isVisible)
    })

    const iconElement = document.createElement('img')
    iconElement.src = '/icons/layout.svg'

    buttonElement.appendChild(iconElement)

    this.controlContainer.appendChild(buttonElement)

    return this.controlContainer
  }

  public onRemove(): void {
    if (!this.controlContainer || !this.controlContainer.parentNode || !this.map) {
      return
    }
    this.controlContainer.parentNode.removeChild(this.controlContainer)
    this.map = undefined
  }
}

export function CadastreToggle(props: CadastreToggleProps) {
  const { position, ...rest } = props
  useControl(() => new MaplibreLayerVisibilityControl(rest), {
    position,
  })

  return null
}
