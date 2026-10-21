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
  isToponymeChangesRequested,
} from './signalement.utils'

export interface ReportLocationPosition {
  type: string
  coordinates: [number, number]
}

export interface ReportLocation {
  title: string
  complement?: string
  positions: ReportLocationPosition[]
  parcelles: string[]
}

export interface ReportMapPosition extends ReportLocationPosition {
  label: string
  role: 'existing' | 'requested'
}

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

export function getExistingReportLocation(signalement: Signalement): ReportLocation | null {
  const { existingLocation } = signalement
  if (!existingLocation) {
    return null
  }

  const location = existingLocation as ExistingNumero
  return {
    title: getExistingLocationLabel(location),
    complement: location.type === ExistingLocation.type.NUMERO ? location.nomComplement : undefined,
    positions: location.position
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

export function getRequestedReportLocation(signalement: Signalement): ReportLocation | null {
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

export function getReportMapPositions(signalement: Signalement): ReportMapPosition[] {
  const existing = getExistingReportLocation(signalement)?.positions ?? []
  const requested = getRequestedReportLocation(signalement)?.positions ?? []
  const isComparison = existing.length > 0 && requested.length > 0

  const toMapPositions = (
    positions: ReportLocationPosition[],
    role: ReportMapPosition['role'],
  ): ReportMapPosition[] =>
    positions.map((position) => {
      const typeLabel = getPositionTypeLabel(position.type as Position.type)
      const prefix = role === 'existing' ? 'Avant' : 'Après'
      return { ...position, role, label: isComparison ? `${prefix} · ${typeLabel}` : typeLabel }
    })

  return [...toMapPositions(existing, 'existing'), ...toMapPositions(requested, 'requested')]
}
