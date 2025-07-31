import {
  ExistingLocation,
  ExistingNumero,
  ExistingToponyme,
  ExistingVoie,
  Position,
  Signalement,
  ToponymeChangesRequestedDTO,
} from '../api/signalement'
import {
  BANPlateformeResultTypeEnum,
  IBANPlateformeCommune,
  IBANPlateformeLieuDit,
  IBANPlateformeNumero,
  IBANPlateformeResult,
  IBANPlateformeVoie,
} from '../api/ban-plateforme/types'
import { ChangesRequested } from '../types/signalement.types'
import { isDefined } from '../api/signalement/core/request'

export const positionTypeOptions = [
  {
    value: Position.type.ENTR_E,
    label: 'Entrée',
  },
  {
    value: Position.type.D_LIVRANCE_POSTALE,
    label: 'Délivrance postale',
  },
  {
    value: Position.type.B_TIMENT,
    label: 'Bâtiment',
  },
  {
    value: Position.type.CAGE_D_ESCALIER,
    label: 'Cage d’escalier',
  },
  {
    value: Position.type.LOGEMENT,
    label: 'Logement',
  },
  {
    value: Position.type.PARCELLE,
    label: 'Parcelle',
  },
  {
    value: Position.type.SEGMENT,
    label: 'Segment',
  },
  {
    value: Position.type.SERVICE_TECHNIQUE,
    label: 'Service technique',
  },
]

export const getModalTitle = (signalement: Signalement) => {
  switch (signalement.type) {
    case Signalement.type.LOCATION_TO_UPDATE:
      return 'Demande de modification'
    case Signalement.type.LOCATION_TO_CREATE:
      return 'Demande de création'
    case Signalement.type.LOCATION_TO_DELETE:
      return 'Demande de suppression'
    default:
      return 'Demande de signalement'
  }
}

export const getPositionTypeLabel = (positionType: Position.type) => {
  return positionTypeOptions.find(({ value }) => value === positionType)?.label
}

export const getSignalementFromFeatureAPISignalement = (feature: any): Signalement => {
  return {
    ...feature.properties,
    createdAt: JSON.parse(feature.properties.createdAt),
    updatedAt: JSON.parse(feature.properties.updatedAt),
    changesRequested: JSON.parse(feature.properties.changesRequested),
    existingLocation: JSON.parse(feature.properties.existingLocation),
    source: JSON.parse(feature.properties.source),
  }
}

export const getRequestedLocationLabel = (changesRequested: any) => {
  return `${changesRequested.numero} ${
    changesRequested.suffixe ? `${changesRequested.suffixe} ` : ''
  }${changesRequested.nomVoie}`
}

export const getExistingLocationLabel = (
  existingLocation: ExistingNumero | ExistingToponyme | ExistingVoie,
) => {
  let label = ''
  switch (existingLocation.type) {
    case ExistingLocation.type.NUMERO: {
      const existingNumero = existingLocation as ExistingNumero
      label = `${existingNumero.numero} ${
        existingNumero.suffixe ? `${existingNumero.suffixe} ` : ''
      }${existingNumero.toponyme.nom}`
      break
    }
    case ExistingLocation.type.VOIE: {
      const existingVoie = existingLocation as ExistingVoie
      label = existingVoie.nom
      break
    }
    case ExistingLocation.type.TOPONYME: {
      const existingToponyme = existingLocation as ExistingToponyme
      label = existingToponyme.nom
      break
    }
    default:
      label = ''
  }

  return label
}

export const getSignalementLabel = (signalement: Signalement) => {
  let label = ''
  switch (signalement.type) {
    case Signalement.type.LOCATION_TO_UPDATE:
      label = getExistingLocationLabel((signalement as any).existingLocation)
      break
    case Signalement.type.LOCATION_TO_CREATE:
      label = getRequestedLocationLabel(signalement.changesRequested)
      break
    case Signalement.type.LOCATION_TO_DELETE:
      label = getExistingLocationLabel((signalement as any).existingLocation)
      break
    default:
      label = 'Autre demande'
  }

  return `${label} - ${signalement.nomCommune} (${signalement.codeCommune})`
}

export const getSignalementColor = (type: Signalement.type) => {
  let color = ''
  switch (type) {
    case Signalement.type.LOCATION_TO_UPDATE:
      color = 'purple-glycine'
      break
    case Signalement.type.LOCATION_TO_CREATE:
      color = 'green-menthe'
      break
    case Signalement.type.LOCATION_TO_DELETE:
      color = 'orange-terre-battue'
      break
    default:
      color = 'black'
  }

  return color
}

export const getSignalementColorHex = (type: Signalement.type) => {
  let color = ''
  switch (type) {
    case Signalement.type.LOCATION_TO_UPDATE:
      color = '#A558A0'
      break
    case Signalement.type.LOCATION_TO_CREATE:
      color = '#009081'
      break
    case Signalement.type.LOCATION_TO_DELETE:
      color = '#E4794A'
      break
    default:
      color = 'black'
  }

  return color
}

export const getSignalementExistingLocationString = (signalement: Signalement) => {
  if (signalement.existingLocation) {
    return `${getExistingLocationLabel(signalement.existingLocation)} ${signalement.codeCommune}`
  }

  return ''
}

export const getSignalementTypeLabel = (type: Signalement.type) => {
  let label = ''
  switch (type) {
    case Signalement.type.LOCATION_TO_UPDATE:
      label = 'Modification'
      break
    case Signalement.type.LOCATION_TO_CREATE:
      label = 'Création'
      break
    case Signalement.type.LOCATION_TO_DELETE:
      label = 'Suppression'
      break
    default:
      label = 'Autre demande'
  }

  return label
}

export function getExistingLocation(
  address: any,
): ExistingNumero | ExistingVoie | ExistingToponyme {
  switch (address.type) {
    case BANPlateformeResultTypeEnum.VOIE:
      return {
        type: ExistingLocation.type.VOIE,
        banId: address.banId,
        nom: address.nomVoie,
        position: {
          point: {
            type: 'Point',
            coordinates: address.position.coordinates,
          },
          type: Position.type.SEGMENT,
        },
      } as ExistingVoie
    case BANPlateformeResultTypeEnum.LIEU_DIT:
      return {
        type: ExistingLocation.type.TOPONYME,
        banId: address.banId,
        nom: address.nomVoie,
        position: {
          point: {
            type: 'Point',
            coordinates: address.position.coordinates,
          },
          type: Position.type.SEGMENT,
        },
        parcelles: address.parcelles,
      } as ExistingToponyme
    case BANPlateformeResultTypeEnum.NUMERO:
      return {
        type: ExistingLocation.type.NUMERO,
        banId: address.banId,
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
        nomComplement: address.lieuDitComplementNom,
      } as ExistingNumero
    default:
      throw new Error(`Impossible de créer un signalement pour le type : ${address.type}`)
  }
}

export const getInitialSignalement = (
  address: IBANPlateformeResult,
  signalementType: Signalement.type,
  creationType?: ExistingLocation.type,
): Signalement | null => {
  if (!address) {
    return null
  }

  const initialSignalement: Partial<Signalement> = {
    type: signalementType,
    codeCommune:
      address.type === BANPlateformeResultTypeEnum.COMMUNE
        ? (address as IBANPlateformeCommune).codeCommune
        : (address as IBANPlateformeNumero).commune.code,
    author: {
      firstName: '',
      lastName: '',
      email: '',
    },
    changesRequested: {} as ChangesRequested,
  }

  switch (signalementType) {
    case Signalement.type.LOCATION_TO_CREATE:
      if (address.type === BANPlateformeResultTypeEnum.COMMUNE) {
        initialSignalement.changesRequested =
          creationType === ExistingLocation.type.TOPONYME
            ? {
                nom: '',
                comment: '',
                positions: [],
                parcelles: [],
              }
            : {
                suffixe: '',
                nomVoie: '',
                nomComplement: '',
                positions: [],
                parcelles: [],
                comment: '',
              }
        initialSignalement.existingLocation = null
      } else if (address.type === BANPlateformeResultTypeEnum.VOIE) {
        initialSignalement.changesRequested = {
          suffixe: '',
          nomVoie: (address as IBANPlateformeVoie).nomVoie,
          nomComplement: '',
          positions: [],
          parcelles: [],
          comment: '',
        }
        initialSignalement.existingLocation = getExistingLocation(address)
      }
      break
    case Signalement.type.LOCATION_TO_UPDATE:
      if (address.type === BANPlateformeResultTypeEnum.VOIE) {
        initialSignalement.changesRequested = {
          nom: (address as IBANPlateformeVoie).nomVoie,
          comment: '',
        }
      } else if (address.type === BANPlateformeResultTypeEnum.LIEU_DIT) {
        initialSignalement.changesRequested = {
          nom: (address as IBANPlateformeLieuDit).nomVoie,
          comment: '',
          positions: [
            {
              point: (address as IBANPlateformeLieuDit).position,
              type: Position.type.SEGMENT,
            },
          ],
          parcelles: (address as IBANPlateformeLieuDit).parcelles,
        }
      } else {
        initialSignalement.changesRequested = {
          numero: (address as IBANPlateformeNumero).numero,
          suffixe: (address as IBANPlateformeNumero).suffixe || '',
          nomVoie: (address as IBANPlateformeNumero).voie.nomVoie,
          nomComplement: (address as IBANPlateformeNumero).lieuDitComplementNom || '',
          positions: (address as IBANPlateformeNumero).positions.map(
            ({ position, positionType }: { position: any; positionType: Position.type }) => ({
              point: {
                type: 'Point',
                coordinates: [...position.coordinates],
              },
              type: positionType || Position.type.ENTR_E,
            }),
          ),
          parcelles: (address as IBANPlateformeNumero).parcelles,
          comment: '',
        }
      }

      initialSignalement.existingLocation = getExistingLocation(address)
      break
    case Signalement.type.LOCATION_TO_DELETE:
      initialSignalement.changesRequested = {
        comment: '',
      }
      initialSignalement.existingLocation = getExistingLocation(address)
      break
    default:
      throw new Error(`Type de signalement inconnu : ${signalementType}`)
  }

  return initialSignalement as Signalement
}

export const isToponymeChangesRequested = (
  changesRequested: any,
): changesRequested is ToponymeChangesRequestedDTO => {
  const { nom, parcelles, positions } = changesRequested as ToponymeChangesRequestedDTO

  return isDefined(nom) && Array.isArray(parcelles) && Array.isArray(positions)
}
