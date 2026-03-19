import { Alert, Signalement } from '../../../api/signalement'
import { SelectOptionType } from '../MuiSelectInput'

export type BrowserFilter<TType extends string, TStatus extends string> = {
  types: SelectOptionType<TType>[]
  status: SelectOptionType<TStatus>[]
  communes: SelectOptionType<string>[]
  sources: SelectOptionType<string>[]
}

export type SignalementBrowserFilter = BrowserFilter<Signalement.type, Signalement.status>
export type AlertBrowserFilter = BrowserFilter<Alert.type, Alert.status>
