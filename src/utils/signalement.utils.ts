import {
  ChangesRequested,
  ExistingLocation,
  ExistingNumero,
  ExistingToponyme,
  ExistingVoie,
  Position,
  Signalement,
} from '../api/signalement'
import {
  BANPlateformeResultTypeEnum,
  IBANPlateformeLieuDit,
  IBANPlateformeNumero,
  IBANPlateformeResult,
  IBANPlateformeVoie,
} from '../api/ban-plateforme/types'

export const positionTypeOptions = [
  {
    value: Position.type.ENTR_E,
    label: 'Entrée',
    color: 'var(--background-action-high-blue-france)',
  },
  {
    value: Position.type.D_LIVRANCE_POSTALE,
    label: 'Délivrance postale',
    color: 'var(--background-action-high-red-marianne)',
  },
  {
    value: Position.type.B_TIMENT,
    label: 'Bâtiment',
    color: 'var(--background-action-high-green-tilleul-verveine)',
  },
  {
    value: Position.type.CAGE_D_ESCALIER,
    label: 'Cage d’escalier',
    color: 'var(--background-action-high-green-bourgeon)',
  },
  {
    value: Position.type.LOGEMENT,
    label: 'Logement',
    color: 'var(--background-action-high-green-menthe)',
  },
  {
    value: Position.type.PARCELLE,
    label: 'Parcelle',
    color: 'var(--background-action-high-blue-ecume)',
  },
  {
    value: Position.type.SEGMENT,
    label: 'Segment',
    color: 'var(--background-action-high-purple-glycine)',
  },
  {
    value: Position.type.SERVICE_TECHNIQUE,
    label: 'Service technique',
    color: 'var(--background-action-high-pink-macaron)',
  },
  { value: Position.type.INCONNUE, label: 'Inconnu', color: 'black' },
]

export const getPositionTypeLabel = (positionType: Position.type) => {
  return positionTypeOptions.find(({ value }) => value === positionType)?.label
}

export function getExistingLocationType(type: string) {
  switch (type) {
    case BANPlateformeResultTypeEnum.VOIE:
      return ExistingLocation.type.VOIE
    case BANPlateformeResultTypeEnum.LIEU_DIT:
      return ExistingLocation.type.TOPONYME
    case BANPlateformeResultTypeEnum.NUMERO:
      return ExistingLocation.type.NUMERO
    default:
      throw new Error(`Impossible de créer un signalement pour le type : ${type}`)
  }
}

export function getExistingLocationLabel(address: IBANPlateformeResult) {
  switch (address.type) {
    case BANPlateformeResultTypeEnum.VOIE:
      return (address as IBANPlateformeVoie).nomVoie
    case BANPlateformeResultTypeEnum.LIEU_DIT:
      return (address as IBANPlateformeLieuDit).nomVoie
    case BANPlateformeResultTypeEnum.NUMERO:
      return `${(address as IBANPlateformeNumero).numero} ${
        (address as IBANPlateformeNumero).suffixe || ''
      } ${(address as IBANPlateformeNumero).voie.nomVoie}`
    default:
      throw new Error(
        `Impossible de créer un signalement pour le type : ${
          (address as IBANPlateformeResult).type
        }`,
      )
  }
}

export function getExistingLocation(
  address: any,
): ExistingNumero | ExistingVoie | ExistingToponyme {
  switch (address.type) {
    case BANPlateformeResultTypeEnum.VOIE:
      return {
        type: ExistingLocation.type.VOIE,
        nom: address.nomVoie,
      } as ExistingVoie
    case BANPlateformeResultTypeEnum.LIEU_DIT:
      return {
        type: ExistingLocation.type.TOPONYME,
        nom: address.nomVoie,
        position: {
          point: {
            type: 'Point',
            coordinates: [address.lon, address.lat],
          },
          type: address.positionType,
        },
        parcelles: address.parcelles,
      } as ExistingToponyme
    case BANPlateformeResultTypeEnum.NUMERO:
      return {
        type: ExistingLocation.type.NUMERO,
        numero: address.numero,
        suffixe: address.suffixe,
        position: {
          point: {
            type: 'Point',
            coordinates: [address.lon, address.lat],
          },
          type: address.positionType,
        },
        parcelles: address.parcelles,
        toponyme: {
          type: ExistingLocation.type.VOIE,
          nom: address.voie.nomVoie,
        },
      } as ExistingNumero
    default:
      throw new Error(`Impossible de créer un signalement pour le type : ${address.type}`)
  }
}

export const getSignalementPositionColor = (positionType: Position.type) => {
  return positionTypeOptions.find(({ value }) => value === positionType)?.color || 'black'
}

export const getInitialSignalement = (
  address: any,
  signalementType: Signalement.type,
  changesRequested?: ChangesRequested,
): Signalement | null => {
  if (!address) {
    return null
  }

  const initialSignalement: Partial<Signalement> = {
    type: signalementType,
    codeCommune: address.commune.code,
    author: {
      firstName: '',
      lastName: '',
      email: '',
    },
    changesRequested: {},
  }

  switch (signalementType) {
    case Signalement.type.LOCATION_TO_CREATE:
      initialSignalement.changesRequested = {
        numero: null,
        suffixe: '',
        nomVoie: address.nomVoie,
        positions: [],
        parcelles: [],
        ...(changesRequested ? changesRequested : {}),
      }
      initialSignalement.existingLocation = {
        type: ExistingLocation.type.VOIE,
        nom: address.nomVoie,
      }
      break
    case Signalement.type.LOCATION_TO_UPDATE:
      if (address.type === BANPlateformeResultTypeEnum.VOIE) {
        initialSignalement.changesRequested = {
          nom: address.nomVoie,
          ...(changesRequested ? changesRequested : {}),
        }
      } else if (address.type === BANPlateformeResultTypeEnum.LIEU_DIT) {
        initialSignalement.changesRequested = {
          nom: address.nomVoie,
          // For the moment we don't allow to change the position of a toponyme
          // positions: address.positions,
          // parcelles: address.parcelles
          ...(changesRequested ? changesRequested : {}),
        }
      } else {
        initialSignalement.changesRequested = {
          numero: address.numero,
          suffixe: address.suffixe,
          nomVoie: address.voie.nomVoie,
          positions: address.positions.map(
            ({ position, positionType }: { position: any; positionType: Position.type }) => ({
              point: {
                type: 'Point',
                coordinates: [...position.coordinates],
              },
              type: positionType,
            }),
          ),
          parcelles: address.parcelles,
          ...(changesRequested ? changesRequested : {}),
        }
      }

      initialSignalement.existingLocation = getExistingLocation(address)
      break
    case Signalement.type.LOCATION_TO_DELETE:
      initialSignalement.changesRequested = {
        comment: '',
        ...(changesRequested ? changesRequested : {}),
      }
      initialSignalement.existingLocation = getExistingLocation(address)
      break
    default:
      throw new Error(`Type de signalement inconnu : ${signalementType}`)
  }

  return initialSignalement as Signalement
}
