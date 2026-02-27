import { ControlPosition, IControl, MapInstance, useControl } from 'react-map-gl/maplibre'
import { CreateAlertDTO } from '../../../api/signalement'

const DRAG_THRESHOLD = 5

const GHOST_FLAG_HTML = `
  <div class="alert-drag-flag">
    <svg width="40" height="48" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
      <line x1="6" y1="2" x2="6" y2="46" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M6 4 L36 10 L6 22 Z" fill="#E1000F" stroke="#b0000c" stroke-width="0.5"/>
      <circle cx="6" cy="46" r="2.5" fill="#333"/>
    </svg>
  </div>
  <div class="alert-drag-shadow-dot"></div>
`

type CreateAlertButtonProps = {
  position?: ControlPosition
  navigate: (path: string) => void
  createAlert: (point: CreateAlertDTO['point']) => void
}

export class CreateAlertButtonControl implements IControl {
  private controlContainer: HTMLElement | undefined
  private map?: MapInstance
  private dragGhost: HTMLElement | null = null
  private dragStartX = 0
  private dragStartY = 0
  private hasDragged = false

  constructor(private props: CreateAlertButtonProps) {}

  public getDefaultPosition(): string {
    return 'top-right'
  }

  public onAdd(map: MapInstance): HTMLElement {
    this.map = map
    this.controlContainer = document.createElement('div')
    this.controlContainer.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group')

    const buttonElement = document.createElement('button')
    buttonElement.id = 'create-alert-button'
    buttonElement.type = 'button'
    buttonElement.title = 'Glisser-déposer sur la carte pour signaler un problème'
    buttonElement.classList.add('fr-icon-flag-line', 'create-alert-draggable')

    buttonElement.addEventListener('mousedown', (e) => this.onMouseDown(e))
    buttonElement.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false })

    this.controlContainer.appendChild(buttonElement)
    return this.controlContainer
  }

  // ─── Mouse events ───────────────────────────────────────────

  private onMouseDown(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    this.dragStartX = e.clientX
    this.dragStartY = e.clientY
    this.hasDragged = false

    const onMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - this.dragStartX
      const dy = ev.clientY - this.dragStartY
      if (!this.hasDragged && Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
        this.hasDragged = true
        this.createGhost(ev.clientX, ev.clientY)
      }
      if (this.hasDragged) {
        this.moveGhost(ev.clientX, ev.clientY)
      }
    }

    const onMouseUp = (ev: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      if (this.hasDragged) {
        this.handleDrop(ev.clientX, ev.clientY)
      } else {
        this.props.navigate('/alert')
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  // ─── Touch events ───────────────────────────────────────────

  private onTouchStart(e: TouchEvent) {
    e.preventDefault()
    const touch = e.touches[0]
    this.dragStartX = touch.clientX
    this.dragStartY = touch.clientY
    this.hasDragged = false

    const onTouchMove = (ev: TouchEvent) => {
      const t = ev.touches[0]
      const dx = t.clientX - this.dragStartX
      const dy = t.clientY - this.dragStartY
      if (!this.hasDragged && Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
        this.hasDragged = true
        this.createGhost(t.clientX, t.clientY)
      }
      if (this.hasDragged) {
        this.moveGhost(t.clientX, t.clientY)
      }
    }

    const onTouchEnd = (ev: TouchEvent) => {
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
      if (this.hasDragged) {
        const t = ev.changedTouches[0]
        this.handleDrop(t.clientX, t.clientY)
      } else {
        this.props.navigate('/alert')
      }
    }

    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('touchend', onTouchEnd)
  }

  // ─── Ghost management ──────────────────────────────────────

  private createGhost(x: number, y: number) {
    this.dragGhost = document.createElement('div')
    this.dragGhost.className = 'alert-drag-ghost'
    this.dragGhost.innerHTML = GHOST_FLAG_HTML
    this.dragGhost.style.left = `${x}px`
    this.dragGhost.style.top = `${y}px`
    document.body.appendChild(this.dragGhost)

    // Trigger reflow then animate in
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.dragGhost.offsetHeight
    this.dragGhost.classList.add('visible')

    // Dim the source button
    const btn = document.getElementById('create-alert-button')
    if (btn) btn.classList.add('dragging')

    // Set global cursor
    document.body.classList.add('alert-dragging')
  }

  private moveGhost(x: number, y: number) {
    if (!this.dragGhost) return
    this.dragGhost.style.left = `${x}px`
    this.dragGhost.style.top = `${y}px`

    // Detect if cursor is over the map canvas
    const mapCanvas = this.map?.getCanvas()
    if (mapCanvas) {
      const rect = mapCanvas.getBoundingClientRect()
      const isOverMap = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      this.dragGhost.classList.toggle('over-map', isOverMap)
    }
  }

  // ─── Drop handling ─────────────────────────────────────────

  private handleDrop(x: number, y: number) {
    const mapCanvas = this.map?.getCanvas()
    if (!mapCanvas || !this.map) {
      this.cleanupDrag()
      return
    }

    const rect = mapCanvas.getBoundingClientRect()
    const isOverMap = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom

    if (isOverMap) {
      // Pin-drop bounce animation
      this.dragGhost?.classList.add('drop')

      // Convert screen coordinates to map lng/lat
      const mapX = x - rect.left
      const mapY = y - rect.top
      const lngLat = this.map.unproject([mapX, mapY])

      const ghost = this.dragGhost
      setTimeout(() => ghost?.remove(), 600)
      this.cleanupDragState()

      // Create alert with the drop position and navigate
      this.props.createAlert({
        type: 'Point',
        coordinates: [lngLat.lng, lngLat.lat],
      })
      this.props.navigate('/alert')
    } else {
      // Animate ghost back to the button
      this.animateReturn()
    }
  }

  private animateReturn() {
    const btn = document.getElementById('create-alert-button')
    if (btn && this.dragGhost) {
      const btnRect = btn.getBoundingClientRect()
      const ghost = this.dragGhost
      ghost.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      ghost.style.left = `${btnRect.left + btnRect.width / 2}px`
      ghost.style.top = `${btnRect.top + btnRect.height / 2}px`
      ghost.classList.add('returning')
      setTimeout(() => ghost.remove(), 350)
    } else {
      this.dragGhost?.remove()
    }
    this.cleanupDragState()
  }

  // ─── Cleanup ───────────────────────────────────────────────

  private cleanupDragState() {
    const btn = document.getElementById('create-alert-button')
    if (btn) btn.classList.remove('dragging')
    document.body.classList.remove('alert-dragging')
    this.dragGhost = null
    this.hasDragged = false
  }

  private cleanupDrag() {
    this.dragGhost?.remove()
    this.cleanupDragState()
  }

  public onRemove(): void {
    if (!this.controlContainer || !this.controlContainer.parentNode || !this.map) {
      return
    }
    this.controlContainer.parentNode.removeChild(this.controlContainer)
    this.map = undefined
  }
}

export function CreateAlertButton({ position, navigate, createAlert }: CreateAlertButtonProps) {
  useControl(() => new CreateAlertButtonControl({ navigate, createAlert }), {
    position,
  })

  return null
}
