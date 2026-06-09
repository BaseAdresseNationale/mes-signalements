import { Alert, Signalement } from '../api/signalement'

export function isReportSignalement(report: Signalement | Alert): report is Signalement {
  return (
    'type' in report && Object.values(Signalement.type).includes(report.type as Signalement.type)
  )
}

export function isReportAlert(report: Signalement | Alert): report is Alert {
  return 'type' in report && Object.values(Alert.type).includes(report.type as Alert.type)
}
