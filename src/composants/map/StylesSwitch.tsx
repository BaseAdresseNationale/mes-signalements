import { ControlPosition, IControl, MapInstance, useControl } from 'react-map-gl/maplibre'
import { MaplibreStyleDefinition } from '../../types/maplibre.types'

export class MapboxStyleSwitcherControl implements IControl {
  private controlContainer: HTMLElement | undefined
  private map?: MapInstance
  private styles: [MaplibreStyleDefinition, MaplibreStyleDefinition]
  private currentStyleIndex: number

  constructor(styles: [MaplibreStyleDefinition, MaplibreStyleDefinition]) {
    this.styles = styles
    this.currentStyleIndex = 0
  }

  public getDefaultPosition(): string {
    const defaultPosition = 'top-right'
    return defaultPosition
  }

  public onAdd(map: MapInstance): HTMLElement {
    this.map = map
    this.controlContainer = document.createElement('div')
    this.controlContainer.classList.add('maplibregl-ctrl')
    this.controlContainer.classList.add('maplibregl-style-switcher')

    const buttonElement = document.createElement('button')
    buttonElement.type = 'button'
    buttonElement.title = this.styles[1].title
    buttonElement.style.backgroundImage = `url("${this.styles[1].previewImage}")`

    const labelElement = document.createElement('span')
    labelElement.textContent = this.styles[1].title

    buttonElement.addEventListener('click', (event) => {
      let srcElement = event.target as HTMLButtonElement
      if (srcElement.tagName !== 'BUTTON') {
        srcElement = srcElement.closest('button')!
      }
      srcElement.title = this.styles[this.currentStyleIndex].title
      srcElement.style.backgroundImage = `url("${this.styles[this.currentStyleIndex].previewImage}")`
      if (srcElement.firstChild) {
        srcElement.firstChild.textContent = this.styles[this.currentStyleIndex].title
      }

      this.currentStyleIndex = this.currentStyleIndex === 0 ? 1 : 0
      this.map!.setStyle(this.styles[this.currentStyleIndex].uri)
    })

    buttonElement.appendChild(labelElement)
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

export type StylesSwitchProps = {
  styles: [MaplibreStyleDefinition, MaplibreStyleDefinition]
  position?: ControlPosition
}

export function StylesSwitch(props: StylesSwitchProps) {
  const { styles } = props
  useControl(() => new MapboxStyleSwitcherControl(styles), {
    position: props.position,
  })

  return null
}
