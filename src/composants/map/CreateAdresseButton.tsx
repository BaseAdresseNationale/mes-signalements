import { ControlPosition, IControl, MapInstance, useControl } from 'react-map-gl/maplibre'

type CreateAdresseButtonProps = {
  position?: ControlPosition
  navigate: (path: string) => void
}

export class MaplibreLayerVisibilityControl implements IControl {
  private controlContainer: HTMLElement | undefined
  private map?: MapInstance

  constructor(private props: CreateAdresseButtonProps) {}

  public getDefaultPosition(): string {
    const defaultPosition = 'top-right'
    return defaultPosition
  }

  public onAdd(map: MapInstance): HTMLElement {
    this.map = map
    this.controlContainer = document.createElement('div')
    this.controlContainer.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group')

    const buttonElement = document.createElement('button')
    buttonElement.id = 'create-adresse-button'
    buttonElement.type = 'button'
    buttonElement.title = 'Ajouter une adresse'
    buttonElement.classList.add('fr-icon-add-circle-line')

    buttonElement.addEventListener('click', () => {
      this.props.navigate(`/create`)
    })

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

export function CreateAdresseButton(props: CreateAdresseButtonProps) {
  const { position, ...rest } = props
  useControl(() => new MaplibreLayerVisibilityControl(rest), {
    position,
  })

  return null
}
