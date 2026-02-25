import React, { Fragment, useRef, useState, useCallback } from 'react'
import { useCombobox } from 'downshift'
import { Input, InputProps } from '@codegouvfr/react-dsfr/Input'

import SearchResultHeader from './SearchResultHeader'
import SearchResultItem from './SearchResultItem'

import {
  SearchComboboxWrapper,
  SearchComboboxInputWrapper,
  SearchComboboxInputLoader,
  SearchComboboxDialog,
  SearchComboboxMenu,
  SearchComboboxMenuItem,
} from './SearchInput.styles'

import type { UseComboboxStateChangeOptions, UseComboboxState } from 'downshift'
import { useDebouncedCallback } from '../../../hooks/useDebounce'

export type SearchItemType<T> = T & {
  label: string
  id: string
  header?: string
  details?: string
}

type SearchInputProps<T> = InputProps.RegularInput & {
  onSearch: (inputValue: string, signal: AbortSignal) => Promise<SearchItemType<T>[]>
  onSelect: (selectedItem?: SearchItemType<T> | null) => void
  onError?: (error: Error) => void
  itemToString?: (item?: SearchItemType<T> | null) => string
}

interface TypeActionAndChanges<T> extends UseComboboxStateChangeOptions<SearchItemType<T>> {
  props: { items: SearchItemType<T>[] }
}

export default function SearchInput<T>({
  onSearch,
  onSelect,
  onError,
  itemToString = (item) => (item ? item.label : ''),
  ...inputProps
}: SearchInputProps<T>) {
  const { nativeInputProps, ...restInputProps } = inputProps
  const controller = useRef<AbortController | null>(null)
  const [items, setItems] = useState<SearchItemType<T>[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const onSearchAsync = useCallback(
    async (...args: [string, AbortSignal]) => {
      try {
        setIsLoading(true)
        const results = await onSearch(...args)
        setIsLoading(false)
        return results
      } finally {
        setIsLoading(false)
      }
    },
    [onSearch],
  )

  const stateReducer = useCallback<
    (
      state: unknown,
      actionAndChanges: UseComboboxStateChangeOptions<SearchItemType<T>>,
    ) => Partial<UseComboboxState<SearchItemType<T>>>
  >(
    (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          return {
            ...changes,
            inputValue: (changes.inputValue as string).trimStart(),
          }
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
          // eslint-disable-next-line no-case-declarations
          const selectedValue =
            changes.selectedItem || (actionAndChanges as TypeActionAndChanges<T>)?.props?.items?.[0]
          onSelect(selectedValue)
          return {
            ...changes,
            ...(selectedValue
              ? {
                  inputValue: selectedValue.label,
                }
              : null),
          }
        default:
          return changes
      }
    },
    [onSelect],
  )

  const onInputValueChange = useDebouncedCallback(
    async ({ inputValue }: { inputValue: string }) => {
      if (controller.current) {
        controller.current.abort()
      }

      controller.current = new AbortController()

      try {
        const results = await onSearchAsync(inputValue.trim(), controller.current.signal)
        setItems(results)
      } catch (err: unknown) {
        if (onError) {
          onError(err as Error)
        }
      }
    },
    300,
  )

  const {
    highlightedIndex,
    selectedItem,
    getMenuProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    isOpen,
  } = useCombobox<SearchItemType<T>>({
    onInputValueChange,
    items,
    itemToString,
    stateReducer,
  })

  return (
    <SearchComboboxWrapper>
      <SearchComboboxInputWrapper>
        {isLoading && (
          <SearchComboboxInputLoader>
            <i className='search-combobox-input-loader-icon ri-refresh-line loading' />
          </SearchComboboxInputLoader>
        )}

        <Input
          iconId='fr-icon-search-line'
          state='default'
          nativeInputProps={{
            ...nativeInputProps,
            ...getInputProps(),
          }}
          nativeLabelProps={{ ...getLabelProps() }}
          {...restInputProps}
        />
      </SearchComboboxInputWrapper>

      <SearchComboboxDialog open={isOpen}>
        <SearchComboboxMenu className={`${!isOpen ? 'hidden' : ''}`} {...getMenuProps()}>
          {isOpen &&
            items.map((item, index) => {
              const { id, header, label, details } = item
              return (
                <Fragment key={id || `header-${header}`}>
                  {header && (
                    <SearchComboboxMenuItem>
                      <SearchResultHeader header={header} />
                    </SearchComboboxMenuItem>
                  )}
                  <SearchComboboxMenuItem
                    $isHighlighted={highlightedIndex === index}
                    $isSelected={selectedItem === item}
                    {...getItemProps({ item, index })}
                  >
                    <SearchResultItem
                      label={itemToString ? itemToString(item) : label}
                      details={details}
                    />
                  </SearchComboboxMenuItem>
                </Fragment>
              )
            })}
        </SearchComboboxMenu>
      </SearchComboboxDialog>
    </SearchComboboxWrapper>
  )
}
