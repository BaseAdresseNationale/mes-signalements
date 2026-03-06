import { Alert } from '../api/signalement'

export const getAlertTypeLabel = (type: Alert.type) => {
  switch (type) {
    case 'MISSING_ADDRESS':
      return 'Adresse manquante'
    case 'ROAD_PROBLEM':
      return 'Problème de voirie'
    case 'OTHER':
      return 'Autre'
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
    case 'ROAD_PROBLEM':
      return 'green-menthe'
    case 'OTHER':
      return 'orange-terre-battue'
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
    case Alert.type.ROAD_PROBLEM:
      label = 'Problème de voirie'
      break
    case Alert.type.OTHER:
      label = 'Autre'
      break
    default:
      label = 'Autre demande'
  }

  return `${label} - ${alert.nomCommune} (${alert.codeCommune})`
}
