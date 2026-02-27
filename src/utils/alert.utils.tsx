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
