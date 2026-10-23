import {
  Alert,
  AlertsService,
  ApiError,
  ExistingLocation,
  ExistingNumero,
  Position,
  Signalement,
  SignalementsService,
} from '../api/signalement'
import { ChangesRequested } from '../types/signalement.types'
import {
  getExistingLocationLabel,
  getPositionTypeLabel,
  getRequestedLocationLabel,
  getSignalementColorHex,
  isToponymeChangesRequested,
} from './signalement.utils'

export type ReportPositionChange = 'unchanged' | 'added' | 'removed' | 'retyped'

// Ajout/suppression/modification reprennent les couleurs des types de signalement.
export const REPORT_COLORS = {
  unchanged: '#0053b3',
  added: getSignalementColorHex(Signalement.type.LOCATION_TO_CREATE),
  removed: getSignalementColorHex(Signalement.type.LOCATION_TO_DELETE),
  retyped: getSignalementColorHex(Signalement.type.LOCATION_TO_UPDATE),
}

export type ReportRole = 'existing' | 'requested'

type RawPosition = { type: string; coordinates: [number, number] }

export interface ReportLocationPosition extends RawPosition {
  change: ReportPositionChange
  // Ancien type, renseigné pour une position dont seul le type a changé (côté demande).
  previousType?: string
}

export interface ReportLocation {
  title: string
  complement?: string
  positions: ReportLocationPosition[]
  parcelles: string[]
}

type RawReportLocation = Omit<ReportLocation, 'positions'> & { positions: RawPosition[] }

export interface ReportMapPosition extends ReportLocationPosition {
  label: string
  role: ReportRole
}

const COORDINATES_TOLERANCE = 1e-7

const isSamePoint = (a: [number, number], b: [number, number]) =>
  Math.abs(a[0] - b[0]) < COORDINATES_TOLERANCE && Math.abs(a[1] - b[1]) < COORDINATES_TOLERANCE

// Un identifiant peut désigner un signalement ou une alerte : on essaie les deux.
export async function fetchReportById(id: string): Promise<Signalement | Alert> {
  try {
    return await SignalementsService.getSignalementById(id)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return AlertsService.getAlertById(id)
    }
    throw error
  }
}

export function isReportSignalement(report: Signalement | Alert): report is Signalement {
  return (
    'type' in report && Object.values(Signalement.type).includes(report.type as Signalement.type)
  )
}

export function isReportAlert(report: Signalement | Alert): report is Alert {
  return 'type' in report && Object.values(Alert.type).includes(report.type as Alert.type)
}

function buildExistingLocation(signalement: Signalement): RawReportLocation | null {
  const { existingLocation } = signalement
  // Une création peut référencer un lieu existant (ex. sa voie), qui n'est pas concerné par la demande.
  if (!existingLocation || signalement.type === Signalement.type.LOCATION_TO_CREATE) {
    return null
  }

  const location = existingLocation as ExistingNumero
  return {
    title: getExistingLocationLabel(location),
    complement: location.type === ExistingLocation.type.NUMERO ? location.nomComplement : undefined,
    // La position d'une voie est calculée à partir de ses adresses : elle n'est pas modifiable.
    positions:
      location.position && location.type !== ExistingLocation.type.VOIE
        ? [
            {
              type: location.position.type,
              coordinates: location.position.point.coordinates as [number, number],
            },
          ]
        : [],
    parcelles: location.parcelles ?? [],
  }
}

function buildRequestedLocation(signalement: Signalement): RawReportLocation | null {
  if (signalement.type === Signalement.type.LOCATION_TO_DELETE) {
    return null
  }

  const changes = signalement.changesRequested as ChangesRequested
  const isVoie =
    changes.numero === undefined && !isToponymeChangesRequested(signalement.changesRequested)

  return {
    title: isVoie ? changes.nom : getRequestedLocationLabel(changes),
    complement: changes.nomComplement,
    positions: (changes.positions ?? []).map(({ point, type }) => ({
      type,
      coordinates: point.coordinates as [number, number],
    })),
    parcelles: changes.parcelles ?? [],
  }
}

// Les positions sont appariées par emplacement : un point déplacé est une suppression plus un ajout.
function diffPositions(
  signalement: Signalement,
  existing: RawPosition[],
  requested: RawPosition[],
): { existing: ReportLocationPosition[]; requested: ReportLocationPosition[] } {
  // Une modification de voie ne porte pas de positions : l'existant n'est pas "supprimé".
  const comparesPositions =
    signalement.type === Signalement.type.LOCATION_TO_DELETE ||
    Array.isArray((signalement.changesRequested as ChangesRequested).positions)

  const requestedByExisting = new Map<number, number>()
  const existingByRequested = new Map<number, number>()
  existing.forEach((position, index) => {
    const match = requested.findIndex(
      ({ coordinates }, requestedIndex) =>
        !existingByRequested.has(requestedIndex) && isSamePoint(coordinates, position.coordinates),
    )
    if (match !== -1) {
      requestedByExisting.set(index, match)
      existingByRequested.set(match, index)
    }
  })

  return {
    existing: existing.map((position, index): ReportLocationPosition => {
      const match = requestedByExisting.get(index)
      if (!comparesPositions) {
        return { ...position, change: 'unchanged' }
      }
      if (match === undefined) {
        return { ...position, change: 'removed' }
      }
      return {
        ...position,
        change: requested[match].type === position.type ? 'unchanged' : 'retyped',
      }
    }),
    requested: requested.map((position, index): ReportLocationPosition => {
      const match = existingByRequested.get(index)
      if (match === undefined) {
        return { ...position, change: 'added' }
      }
      const previousType = existing[match].type
      return previousType === position.type
        ? { ...position, change: 'unchanged' }
        : { ...position, change: 'retyped', previousType }
    }),
  }
}

export function getExistingReportLocation(signalement: Signalement): ReportLocation | null {
  const existing = buildExistingLocation(signalement)
  if (!existing) {
    return null
  }

  const requested = buildRequestedLocation(signalement)?.positions ?? []
  return {
    ...existing,
    positions: diffPositions(signalement, existing.positions, requested).existing,
  }
}

export function getRequestedReportLocation(signalement: Signalement): ReportLocation | null {
  const requested = buildRequestedLocation(signalement)
  if (!requested) {
    return null
  }

  const existing = buildExistingLocation(signalement)?.positions ?? []
  return {
    ...requested,
    positions: diffPositions(signalement, existing, requested.positions).requested,
  }
}

export interface ReportParcelle {
  id: string
  change: 'unchanged' | 'added' | 'removed'
}

export function getReportParcelles(signalement: Signalement): ReportParcelle[] {
  const existing = buildExistingLocation(signalement)?.parcelles ?? []
  const requested = buildRequestedLocation(signalement)?.parcelles ?? []
  const existingIds = new Set(existing)
  const requestedIds = new Set(requested)

  return [
    ...existing.map(
      (id): ReportParcelle => ({ id, change: requestedIds.has(id) ? 'unchanged' : 'removed' }),
    ),
    ...requested
      .filter((id) => !existingIds.has(id))
      .map((id): ReportParcelle => ({ id, change: 'added' })),
  ]
}

export function hasReportMapChanges(signalement: Signalement): boolean {
  const positions = [
    ...(getExistingReportLocation(signalement)?.positions ?? []),
    ...(getRequestedReportLocation(signalement)?.positions ?? []),
  ]

  return (
    positions.some(({ change }) => change !== 'unchanged') ||
    getReportParcelles(signalement).some(({ change }) => change !== 'unchanged')
  )
}

export function getReportMapPositions(signalement: Signalement): ReportMapPosition[] {
  const existing = getExistingReportLocation(signalement)?.positions ?? []
  const requested = getRequestedReportLocation(signalement)?.positions ?? []

  const toMapPosition = (position: ReportLocationPosition, role: ReportRole): ReportMapPosition => {
    const typeLabel = getPositionTypeLabel(position.type as Position.type)
    const label = position.previousType
      ? `${getPositionTypeLabel(position.previousType as Position.type)} → ${typeLabel}`
      : typeLabel

    return { ...position, role, label }
  }

  // Une position inchangée ou dont seul le type change existe des deux côtés : on la dessine une fois.
  return [
    ...existing
      .filter(({ change }) => change !== 'retyped')
      .map((position) => toMapPosition(position, 'existing')),
    ...requested
      .filter(({ change }) => change !== 'unchanged')
      .map((position) => toMapPosition(position, 'requested')),
  ]
}
