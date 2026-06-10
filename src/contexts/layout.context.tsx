import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'

export const ANIMATION_DURATION = 300

interface LayoutContextProviderProps {
  children: React.ReactNode
  showSearch?: boolean
  showDrawer?: boolean
}

interface LayoutContextValue {
  searchRef: React.RefObject<HTMLDivElement>
  drawerRef: React.RefObject<HTMLDivElement>
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>
  showSearch: boolean
  showDrawer: boolean
}

export const LayoutContext = createContext<LayoutContextValue>({
  searchRef: { current: null },
  drawerRef: { current: null },
  setShowSearch: () => {},
  setShowDrawer: () => {},
  showSearch: true,
  showDrawer: false,
})

export function LayoutContextProvider({
  children,
  showSearch: initialShowSearch,
  showDrawer: initialShowDrawer,
}: LayoutContextProviderProps) {
  const [showSearch, setShowSearch] = useState(Boolean(initialShowSearch))
  const [showDrawer, setShowDrawer] = useState(Boolean(initialShowDrawer))
  const searchRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initialShowSearch ? setShowSearch(true) : setShowSearch(false)
    initialShowDrawer ? setShowDrawer(true) : setShowDrawer(false)
  }, [initialShowSearch, initialShowDrawer])

  useEffect(() => {
    if (searchRef.current) {
      if (showSearch) {
        searchRef.current.classList.add('show')
        searchRef.current.setAttribute('aria-hidden', 'false')
      } else {
        searchRef.current.classList.remove('show')
        searchRef.current.setAttribute('aria-hidden', 'true')
      }
    }
  }, [showSearch])

  useEffect(() => {
    if (drawerRef.current) {
      if (showDrawer) {
        drawerRef.current.classList.add('open')
        drawerRef.current.setAttribute('aria-hidden', 'false')
      } else {
        drawerRef.current.classList.remove('open')
        drawerRef.current.setAttribute('aria-hidden', 'true')
      }
    }
  }, [showDrawer])

  const value = useMemo(
    () => ({
      searchRef,
      drawerRef,
      setShowSearch,
      setShowDrawer,
      showSearch,
      showDrawer,
    }),
    [showSearch, showDrawer],
  )

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export default LayoutContext
