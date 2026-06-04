import React, { useCallback, useMemo, useState } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'
import Loader from '../Loader'
import Pagination from '../Pagination'
import { FiltersModal } from './FiltersModal'
import { SelectOptionType } from '../MuiSelectInput'
import { BrowserFilter } from './types'
import { StyledBrowserTabWrapper } from './BrowserTab.styles'
import { PaginatedData } from '../../../hooks/useBrowserData'

export interface BrowserTabFiltersConfig<TType extends string, TStatus extends string> {
  title: string
  statusOptions: SelectOptionType<TStatus>[]
  typeOptions: SelectOptionType<TType>[]
  sourceOptions?: SelectOptionType<string>[]
  sourceHint?: string
  communeHint?: string
}

interface BrowserTabProps<TItem, TType extends string, TStatus extends string> {
  isLoading: boolean
  paginatedData?: PaginatedData<TItem>
  pageSize: number
  page: number
  onPageChange: (page: number) => void
  filter: BrowserFilter<TType, TStatus>
  initialFilter: BrowserFilter<TType, TStatus>
  onFilterChange: (filter: BrowserFilter<TType, TStatus>) => void
  onResetFilter: () => void
  renderItem: (item: TItem) => React.ReactNode
  getItemKey: (item: TItem, index: number) => React.Key
  onItemHover?: (item: TItem | undefined) => void
  onItemSelect?: (item: TItem) => void
  emptyMessage: string
  filterButtonLabel: string
  filterButtonLabelActive: string
  filtersConfig: BrowserTabFiltersConfig<TType, TStatus>
}

export function BrowserTab<TItem, TType extends string, TStatus extends string>({
  isLoading,
  paginatedData,
  pageSize,
  page,
  onPageChange,
  filter,
  initialFilter,
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
}: BrowserTabProps<TItem, TType, TStatus>) {
  const [showFilters, setShowFilters] = useState(false)

  const hasCustomFilters = useMemo(
    () =>
      filter.status.length > 0 ||
      filter.types.length > 0 ||
      filter.communes.length > 0 ||
      JSON.stringify(filter.sources) !== JSON.stringify(initialFilter.sources),
    [filter, initialFilter],
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
          sourceHint={filtersConfig.sourceHint}
          communeHint={filtersConfig.communeHint}
        />
      )}
    </StyledBrowserTabWrapper>
  )
}
