import { Alert } from '../api/signalement'

export const getAlertTypeLabel = (type: Alert.type) => {
  switch (type) {
    case 'MISSING_ADDRESS':
      return 'Adresse manquante'
    default:
      throw new Error("Type d'alerte inconnu")
  }
}

export const getAlertFromFeatureAPISignalement = (feature: any): Alert => {
  const { createdAt, updatedAt, source } = feature.properties
  return {
    ...feature.properties,
    createdAt: JSON.parse(createdAt),
    updatedAt: JSON.parse(updatedAt),
    source: JSON.parse(source),
  }
}

export const getAlertColor = (type: Alert.type) => {
  switch (type) {
    case 'MISSING_ADDRESS':
      return 'purple-glycine'
    default:
      throw new Error("Type d'alerte inconnu")
  }
}

export const getAlertLabel = (alert: Alert) => {
  let label = ''
  switch (alert.type) {
    case Alert.type.MISSING_ADDRESS:
      label = 'Adresse manquante'
      break
    default:
      label = 'Autre demande'
  }

  return `${label} - ${alert.nomCommune} (${alert.codeCommune})`
}
