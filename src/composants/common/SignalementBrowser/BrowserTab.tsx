import React, { useCallback, useMemo, useState } from 'react'
import { Alert, Signalement } from '../../../api/signalement'
import Button from '@codegouvfr/react-dsfr/Button'
import Loader from '../Loader'
import Pagination from '../Pagination'
import { FiltersModal } from './FiltersModal'
import { SelectOptionType } from '../MuiSelectInput'
import { BrowserFilter } from './types'
import { StyledBrowserTabWrapper } from './BrowserTab.styles'
import { PaginatedData } from '../../../hooks/useBrowserData'

export interface BrowserTabFiltersConfig {
  title: string
  statusOptions: SelectOptionType<Alert.status | Signalement.status>[]
  typeOptions: SelectOptionType<Alert.type | Signalement.type>[]
  typeKey: 'signalementTypes' | 'alertTypes'
  sourceOptions?: SelectOptionType<string>[]
  sourceHint?: string
  communeHint?: string
}

interface BrowserTabProps<TItem> {
  isLoading: boolean
  paginatedData?: PaginatedData<TItem>
  pageSize: number
  page: number
  onPageChange: (page: number) => void
  filter: BrowserFilter
  onFilterChange: (filter: BrowserFilter) => void
  onResetFilter: () => void
  renderItem: (item: TItem) => React.ReactNode
  getItemKey: (item: TItem, index: number) => React.Key
  onItemHover?: (item: TItem | undefined) => void
  onItemSelect?: (item: TItem) => void
  emptyMessage: string
  filterButtonLabel: string
  filterButtonLabelActive: string
  filtersConfig: BrowserTabFiltersConfig
}

export function BrowserTab<TItem>({
  isLoading,
  paginatedData,
  pageSize,
  page,
  onPageChange,
  filter,
  onFilterChange,
  onResetFilter,
  renderItem,
  getItemKey,
  onItemHover,
  onItemSelect,
  emptyMessage,
  filterButtonLabel,
  filterButtonLabelActive,
  filtersConfig,
}: BrowserTabProps<TItem>) {
  const [showFilters, setShowFilters] = useState(false)

  const hasCustomFilters = useMemo(
    () =>
      filter.status.length > 0 ||
      filter.signalementTypes.length > 0 ||
      filter.communes.length > 0 ||
      JSON.stringify(filter.sources) !==
        JSON.stringify(filtersConfig.sourceOptions?.map((option) => option.value) || []),
    [filter, filtersConfig],
  )

  const handleResetFilter = useCallback(() => {
    onResetFilter()
    setShowFilters(false)
  }, [onResetFilter])

  return (
    <StyledBrowserTabWrapper>
      <div className='header'>
        <Button
          iconId={hasCustomFilters ? 'ri-filter-fill' : 'ri-filter-line'}
          onClick={() => setShowFilters(!showFilters)}
          priority='tertiary no outline'
        >
          {hasCustomFilters ? filterButtonLabelActive : filterButtonLabel}
        </Button>
      </div>
      {isLoading && <Loader />}
      {!isLoading && paginatedData && paginatedData.data.length === 0 && (
        <p style={{ padding: 10 }}>{emptyMessage}</p>
      )}
      {!isLoading && paginatedData && paginatedData.data.length > 0 && (
        <>
          <ul className='signalement-list'>
            {paginatedData.data.map((item, index) => (
              <li
                role='button'
                key={getItemKey(item, index)}
                onMouseEnter={() => onItemHover?.(item)}
                onMouseLeave={() => onItemHover?.(undefined)}
                onClick={() => onItemSelect?.(item)}
              >
                {renderItem(item)}
              </li>
            ))}
          </ul>
          <Pagination
            className='pagination'
            count={Math.ceil(paginatedData.total / pageSize)}
            currentPage={page}
            onPageChange={onPageChange}
          />
        </>
      )}
      {showFilters && (
        <FiltersModal
          filters={filter}
          onClose={() => setShowFilters(false)}
          onSubmit={onFilterChange}
          {...(hasCustomFilters ? { onReset: handleResetFilter } : {})}
          sourceOptions={filtersConfig.sourceOptions}
          title={filtersConfig.title}
          statusOptions={filtersConfig.statusOptions}
          typeOptions={filtersConfig.typeOptions}
          typeKey={filtersConfig.typeKey}
          sourceHint={filtersConfig.sourceHint}
          communeHint={filtersConfig.communeHint}
        />
      )}
    </StyledBrowserTabWrapper>
  )
}
