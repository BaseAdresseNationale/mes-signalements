import { Alert, Signalement } from '../../../api/signalement'
import { SelectOptionType } from '../MuiSelectInput'

export type BrowserFilter = {
  signalementTypes: SelectOptionType<Signalement.type>[]
  alertTypes: SelectOptionType<Alert.type>[]
  status: SelectOptionType<Signalement.status | Alert.status>[]
  communes: SelectOptionType<string>[]
  sources: SelectOptionType<string>[]
}
