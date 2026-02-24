import { ControlPosition, IControl, MapInstance, useControl } from 'react-map-gl/maplibre'

type CreateAlertButtonProps = {
  position?: ControlPosition
  navigate: (path: string) => void
}

export class CreateAlertButtonControl implements IControl {
  private controlContainer: HTMLElement | undefined
  private map?: MapInstance

  constructor(private props: CreateAlertButtonProps) {}

  public getDefaultPosition(): string {
    const defaultPosition = 'top-right'
    return defaultPosition
  }

  public onAdd(map: MapInstance): HTMLElement {
    this.map = map
    this.controlContainer = document.createElement('div')
    this.controlContainer.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group')

    const buttonElement = document.createElement('button')
    buttonElement.id = 'create-alert-button'
    buttonElement.type = 'button'
    buttonElement.title = 'Signaler un problème à la commune'
    buttonElement.classList.add('fr-icon-flag-line')

    buttonElement.addEventListener('click', () => {
      this.props.navigate(`/create-alert`)
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

export function CreateAlertButton(props: CreateAlertButtonProps) {
  const { position, ...rest } = props
  useControl(() => new CreateAlertButtonControl(rest), {
    position,
  })

  return null
}
