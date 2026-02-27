import { ControlPosition, IControl, MapInstance, useControl } from 'react-map-gl/maplibre'
import { CreateAlertDTO } from '../../api/signalement'

const DRAG_THRESHOLD = 5

// Flag shape: two cubic beziers from pole-top (6,4) to pole-attach (6,22)
// Each state = [[cp1x,cp1y],[cp2x,cp2y],[tipX,tipY],[cp3x,cp3y],[cp4x,cp4y]]
const FLAG_DROOP = [
  [7, 7],
  [10, 12],
  [9, 16],
  [8, 19],
  [7, 21],
]
const FLAG_FULL = [
  [16, 2],
  [30, 5],
  [38, 10],
  [30, 15],
  [16, 20],
]

function buildFlagSVG() {
  return `
  <div class="alert-drag-flag">
    <svg width="76" height="48" viewBox="-28 0 76 48" xmlns="http://www.w3.org/2000/svg">
      <line x1="6" y1="2" x2="6" y2="46" stroke="white" stroke-width="5" stroke-linecap="round"/>
      <line x1="6" y1="2" x2="6" y2="46" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
      <path class="alert-flag-path-outline" d="M6,4 C7,7 10,12 9,16 C8,19 7,21 6,22 Z" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round"/>
      <path class="alert-flag-path" d="M6,4 C7,7 10,12 9,16 C8,19 7,21 6,22 Z" fill="#E1000F" stroke="#b0000c" stroke-width="0.5"/>
      <circle cx="6" cy="46" r="4" fill="white"/>
      <circle cx="6" cy="46" r="2.5" fill="#333"/>
    </svg>
  </div>
  <div class="alert-drag-shadow-dot"></div>
`
}

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

  // Velocity-driven flag animation
  private flagPath: SVGPathElement | null = null
  private flagPathOutline: SVGPathElement | null = null
  private lastMoveX = 0
  private lastMoveY = 0
  private lastMoveTime = 0
  private rawSpeed = 0
  private displayedInflation = 0
  private animFrameId = 0
  private horizontalDir = -1 // -1 = moving left (flag right), 1 = moving right (flag left)
  private displayedDir = -1

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
    buttonElement.addEventListener('touchstart', (e) => this.onTouchStart(e))

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
        this.props.navigate('/alert')
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
        this.props.navigate('/alert')
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
      }
    }

    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('touchend', onTouchEnd)
  }

  // ─── Ghost management ──────────────────────────────────────

  private createGhost(x: number, y: number) {
    this.dragGhost = document.createElement('div')
    this.dragGhost.className = 'alert-drag-ghost'
    this.dragGhost.innerHTML = buildFlagSVG()
    this.dragGhost.style.left = `${x}px`
    this.dragGhost.style.top = `${y}px`
    document.body.appendChild(this.dragGhost)

    // Grab reference to the flag path for dynamic morphing
    this.flagPath = this.dragGhost.querySelector('.alert-flag-path')
    this.flagPathOutline = this.dragGhost.querySelector('.alert-flag-path-outline')
    this.lastMoveX = x
    this.lastMoveY = y
    this.lastMoveTime = performance.now()
    this.rawSpeed = 0
    this.displayedInflation = 0
    this.updateFlagPath(0, -1)
    this.startFlagAnimation()

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

    // Compute instantaneous speed for flag inflation
    const now = performance.now()
    const dt = now - this.lastMoveTime
    if (dt > 0) {
      const dx = x - this.lastMoveX
      const dy = y - this.lastMoveY
      this.rawSpeed = Math.sqrt(dx * dx + dy * dy) / dt // px/ms

      // Track horizontal direction — only update when meaningful horizontal movement
      if (Math.abs(dx) > 1) {
        this.horizontalDir = dx > 0 ? 1 : -1
      }
    }
    this.lastMoveX = x
    this.lastMoveY = y
    this.lastMoveTime = now

    // Detect if cursor is over the map canvas
    const mapCanvas = this.map?.getCanvas()
    if (mapCanvas) {
      const rect = mapCanvas.getBoundingClientRect()
      const isOverMap = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      this.dragGhost.classList.toggle('over-map', isOverMap)
    }
  }

  // ─── Flag velocity animation ───────────────────────────────

  private startFlagAnimation() {
    const animate = () => {
      // Decay raw speed when no mouse move feeds it
      this.rawSpeed *= 0.9

      // Map speed to 0..1 inflation (1.2 px/ms ≈ full)
      const targetInflation = Math.min(this.rawSpeed / 1.2, 1)

      // Smooth interpolation: fast attack, slow decay
      const rate = targetInflation > this.displayedInflation ? 0.28 : 0.06
      this.displayedInflation += (targetInflation - this.displayedInflation) * rate

      // Smoothly interpolate direction (for fluid flip)
      const dirRate = 0.15
      this.displayedDir += (this.horizontalDir - this.displayedDir) * dirRate

      // Clamp tiny values
      if (this.displayedInflation < 0.001) this.displayedInflation = 0

      this.updateFlagPath(this.displayedInflation, this.displayedDir)

      if (this.dragGhost) {
        this.animFrameId = requestAnimationFrame(animate)
      }
    }
    this.animFrameId = requestAnimationFrame(animate)
  }

  private updateFlagPath(t: number, dir: number) {
    if (!this.flagPath) return
    // POLE_X is the pivot axis
    const POLE_X = 6
    const pts = FLAG_DROOP.map((d, i) => {
      const f = FLAG_FULL[i]
      const rawX = d[0] + (f[0] - d[0]) * t
      const rawY = d[1] + (f[1] - d[1]) * t
      // Mirror around POLE_X based on direction: dir=-1 → flag to the right, dir=1 → flag to the left
      const mirroredX = POLE_X + (rawX - POLE_X) * -dir
      return [mirroredX, rawY]
    })
    const d = `M6,4 C${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} ${pts[1][0].toFixed(1)},${pts[1][1].toFixed(1)} ${pts[2][0].toFixed(1)},${pts[2][1].toFixed(1)} C${pts[3][0].toFixed(1)},${pts[3][1].toFixed(1)} ${pts[4][0].toFixed(1)},${pts[4][1].toFixed(1)} 6,22 Z`
    this.flagPath.setAttribute('d', d)
    if (this.flagPathOutline) {
      this.flagPathOutline.setAttribute('d', d)
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
    cancelAnimationFrame(this.animFrameId)
    this.flagPath = null
    this.flagPathOutline = null
    this.rawSpeed = 0
    this.displayedInflation = 0
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
