import { IControl, MapInstance, useControl } from 'react-map-gl/maplibre'

// Source : https://www.npmjs.com/package/mapbox-gl-style-switcher
export type MapboxStyleDefinition = {
  id: string
  title: string
  icon: string
  uri: string
}

type MapboxStyleSwitcherEvents = {
  onChange?: (event: MouseEvent, style: string) => boolean
}

export type MapboxStyleSwitcherOptions = {
  defaultStyle?: string
  eventListeners?: MapboxStyleSwitcherEvents
}

export class MapboxStyleSwitcherControl implements IControl {
  private controlContainer: HTMLElement | undefined
  private map?: MapInstance
  private styles: MapboxStyleDefinition[]
  private events?: MapboxStyleSwitcherEvents
  private defaultStyle: string

  constructor(styles: MapboxStyleDefinition[], options?: MapboxStyleSwitcherOptions) {
    this.styles = styles
    this.defaultStyle = options?.defaultStyle || styles[0].id
    this.events = typeof options !== 'string' && options ? options.eventListeners : undefined
  }

  public getDefaultPosition(): string {
    const defaultPosition = 'top-right'
    return defaultPosition
  }

  public onAdd(map: MapInstance): HTMLElement {
    this.map = map
    this.controlContainer = document.createElement('div')
    this.controlContainer.classList.add('maplibregl-ctrl')
    this.controlContainer.classList.add('maplibregl-ctrl-group')

    for (const style of this.styles) {
      const styleElement = document.createElement('button')
      styleElement.type = 'button'
      styleElement.title = style.title
      styleElement.classList.add(style.icon)
      styleElement.setAttribute('data-uri', JSON.stringify(style.uri))
      styleElement.addEventListener('click', (event) => {
        let srcElement = event.target as HTMLButtonElement
        if (srcElement.tagName !== 'BUTTON') {
          srcElement = srcElement.closest('button')!
        }
        if (srcElement.classList.contains('active')) {
          return
        }

        const dataUri = srcElement.getAttribute('data-uri')
        const style = JSON.parse(dataUri!)
        this.map!.setStyle(style)
        const elms = this.controlContainer!.getElementsByClassName('active')
        while (elms[0]) {
          elms[0].classList.remove('active')
        }
        srcElement.classList.add('active')
        if (this.events && this.events.onChange && this.events.onChange(event, style)) {
          return
        }
      })

      const iconElement = document.createElement('span')
      iconElement.classList.add('maplibregl-ctrl-icon')
      iconElement.setAttribute('aria-hidden', 'true')

      styleElement.appendChild(iconElement)

      if (style.id === this.defaultStyle) {
        styleElement.classList.add('active')
      }

      this.controlContainer.appendChild(styleElement)
    }
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
  styles: MapboxStyleDefinition[]
  options?: MapboxStyleSwitcherOptions
  position?: string
}

export function StylesSwitch(props: StylesSwitchProps) {
  const { styles, options } = props
  useControl(() => new MapboxStyleSwitcherControl(styles, options) as any, {
    position: props.position as any,
  })

  return null
}
