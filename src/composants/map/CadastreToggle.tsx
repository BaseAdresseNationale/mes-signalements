import { useEffect } from 'react'
import { ControlPosition, IControl, MapInstance, useControl } from 'react-map-gl/maplibre'

type CadastreToggleProps = {
  layers: string[]
  showCadastre: boolean
  setShowCadastre: (show: boolean) => void
  position?: ControlPosition
}

export class MaplibreLayerVisibilityControl implements IControl {
  private controlContainer: HTMLElement | undefined
  private buttonElement: HTMLButtonElement | undefined
  private map?: MapInstance

  constructor(private props: CadastreToggleProps) {}

  public getDefaultPosition(): string {
    const defaultPosition = 'top-right'
    return defaultPosition
  }

  public setProps(props: CadastreToggleProps) {
    this.props = props
    this.syncButton()
  }

  private syncButton() {
    if (!this.buttonElement) {
      return
    }

    const label = this.props.showCadastre ? 'Masquer le cadastre' : 'Afficher le cadastre'
    this.buttonElement.title = label
    this.buttonElement.ariaLabel = label
    this.buttonElement.classList.toggle('active', this.props.showCadastre)
  }

  public onAdd(map: MapInstance): HTMLElement {
    this.map = map
    this.controlContainer = document.createElement('div')
    this.controlContainer.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group')

    const buttonElement = document.createElement('button')
    buttonElement.id = 'cadastre-toggle'
    buttonElement.type = 'button'
    this.buttonElement = buttonElement
    this.syncButton()

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
    this.buttonElement = undefined
    this.map = undefined
  }
}

export function CadastreToggle(props: CadastreToggleProps) {
  const { position, ...rest } = props
  const control = useControl(() => new MaplibreLayerVisibilityControl(rest), {
    position,
  })

  useEffect(() => {
    control.setProps(rest)
  }, [control, rest.showCadastre, rest.setShowCadastre])

  return null
}
