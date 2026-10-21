import { getCommune, getDepartement } from '../api/api-geo'
import { SelectOptionType } from '../composants/common/MuiSelectInput'
import {
  alertFilterTypesOptions,
  signalementFilterStatusOptions,
  signalementFilterTypesOptions,
} from '../composants/common/SignalementBrowser/FiltersModal'
import { BrowserFilter, BrowserTabId } from '../composants/common/SignalementBrowser/types'

// HashRouter stores the route and its search params inside window.location.hash.
// Updating it through the History API avoids re-triggering react-router's loaders.
export function updateHashSearchParams(updates: Record<string, string | null>) {
  const url = new URL(window.location.href)
  const [hashPath, hashSearch = ''] = (url.hash.startsWith('#') ? url.hash.slice(1) : '').split('?')
  const params = new URLSearchParams(hashSearch)
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  })
  const search = params.toString()
  url.hash = '#' + (hashPath || '/') + (search ? '?' + search : '')
  window.history.replaceState(window.history.state, '', url.toString())
}

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
    const communesData = await Promise.all(values.map((value) => getCommune(value)))

    return communesData.map((commune) => ({
      value: commune.code,
      label: `${commune.nom} (${commune.code})`,
    }))
  } catch (error) {
    console.error('Error fetching commune data:', error)
    return values.map((value) => ({ value, label: value }))
  }
}

export async function resolveDepartements(
  values: string[] | null,
): Promise<SelectOptionType<string>[]> {
  if (!values) {
    return []
  }

  try {
    const departementsData = await Promise.all(values.map((value) => getDepartement(value)))

    return departementsData.map((departement) => ({
      value: departement.code,
      label: `${departement.nom} (${departement.code})`,
    }))
  } catch (error) {
    console.error('Error fetching departement data:', error)
    return values.map((value) => ({ value, label: value }))
  }
}

export async function getInitialFilter({ request }: { request: Request }): Promise<{
  initialFilters: BrowserFilter
  initialTab: BrowserTabId
  initialPage: number
}> {
  const url = new URL(request.url)

  const initialTab: BrowserTabId =
    url.searchParams.get('tab') === 'alerts' ? 'alerts' : 'signalements'
  const pageParam = Number(url.searchParams.get('page'))
  const initialPage = Number.isInteger(pageParam) && pageParam > 1 ? pageParam : 1

  const communesParam = url.searchParams.get('communes')?.split(',') || null
  const departementsParam = url.searchParams.get('departements')?.split(',') || null
  const statusParam = url.searchParams.get('status')?.split(',') || null
  const signalementTypesParam = url.searchParams.get('signalementTypes')?.split(',') || null
  const alertTypesParam = url.searchParams.get('alertTypes')?.split(',') || null
  const [communes, departements] = await Promise.all([
    resolveCommunes(communesParam),
    resolveDepartements(departementsParam),
  ])

  const initialFilters = {
    status: resolveOptions(statusParam, signalementFilterStatusOptions),
    signalementTypes: resolveOptions(signalementTypesParam, signalementFilterTypesOptions),
    alertTypes: resolveOptions(alertTypesParam, alertFilterTypesOptions),
    communes,
    departements,
    sources: [], // Source filter is only applied on SourcePage and options are loaded in the component, so we can ignore URL params for sources
  } as BrowserFilter

  return { initialFilters, initialTab, initialPage }
}
