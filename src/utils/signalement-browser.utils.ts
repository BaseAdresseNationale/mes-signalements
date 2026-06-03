import { SelectOptionType } from '../composants/common/MuiSelectInput'
import {
  alertFilterStatusOptions,
  alertFilterTypesOptions,
  signalementFilterStatusOptions,
  signalementFilterTypesOptions,
} from '../composants/common/SignalementBrowser/FiltersModal'
import {
  AlertBrowserFilter,
  SignalementBrowserFilter,
} from '../composants/common/SignalementBrowser/types'

export function resolveOptions<T extends string>(
  values: string[] | null,
  options: SelectOptionType<T>[],
): SelectOptionType<T>[] {
  if (!values) {
    return []
  }
  return values
    .map((value) => options.find((opt) => opt.value === value))
    .filter((opt): opt is SelectOptionType<T> => opt !== undefined)
}

export async function resolveCommunes(
  values: string[] | null,
): Promise<SelectOptionType<string>[]> {
  if (!values) {
    return []
  }

  try {
    const communesData = await Promise.all(
      values.map((value) =>
        fetch(`https://geo.api.gouv.fr/communes/${value}`).then((res) => res.json()),
      ),
    )

    return communesData.map((commune) => ({
      value: commune.code,
      label: `${commune.nom} (${commune.code})`,
    }))
  } catch (error) {
    console.error('Error fetching commune data:', error)
    return values.map((value) => ({ value, label: value }))
  }
}

export async function getInitialFilter({ request }: { request: Request }): Promise<{
  signalementsInitialFilter: SignalementBrowserFilter
  alertsInitialFilter: AlertBrowserFilter
}> {
  const url = new URL(request.url)

  const communesParam = url.searchParams.get('communes')?.split(',') || null
  const typesParam = url.searchParams.get('types')?.split(',') || null
  const statusParam = url.searchParams.get('status')?.split(',') || null

  const signalementsInitialFilter = {
    status: resolveOptions(statusParam, signalementFilterStatusOptions),
    types: resolveOptions(typesParam, signalementFilterTypesOptions),
    communes: await resolveCommunes(communesParam),
    sources: [], // Source filter is only applied on SourcePage and options are loaded in the component, so we can ignore URL params for sources
  } as SignalementBrowserFilter

  const alertsInitialFilter = {
    status: resolveOptions(statusParam, alertFilterStatusOptions),
    types: resolveOptions(typesParam, alertFilterTypesOptions),
    communes: await resolveCommunes(communesParam),
    sources: [], // Source filter is only applied on SourcePage and options are loaded in the component, so we can ignore URL params for sources
  } as AlertBrowserFilter

  return {
    signalementsInitialFilter,
    alertsInitialFilter,
  }
}
