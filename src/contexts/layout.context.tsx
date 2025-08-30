import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'
import useWindowSize from '../hooks/useWindowSize'
import { useLocation, useNavigation } from 'react-router-dom'

export const ANIMATION_DURATION = 300

interface LayoutContextValue {
  searchRef: React.RefObject<HTMLDivElement>
  drawerRef: React.RefObject<HTMLDivElement>
  searchMobileButtonRef: React.RefObject<HTMLButtonElement>
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>
  showSearch: boolean
  showDrawer: boolean
}

export const LayoutContext = createContext<LayoutContextValue>({
  searchRef: { current: null },
  drawerRef: { current: null },
  searchMobileButtonRef: { current: null },
  setShowSearch: () => {},
  setShowDrawer: () => {},
  showSearch: true,
  showDrawer: false,
})

export function LayoutContextProvider(props: { children: React.ReactNode }) {
  const { isMobile } = useWindowSize()
  const navigation = useNavigation()
  const location = useLocation()

  const [showSearch, setShowSearch] = useState(!isMobile)
  const [showDrawer, setShowDrawer] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const searchMobileButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (location.pathname !== '/' || navigation.location) {
      setShowSearch(false)
      setShowDrawer(true)
    } else {
      setShowDrawer(false)

      if (isMobile) {
        setShowSearch(false)
      } else {
        setShowSearch(true)
      }
    }
  }, [navigation, location, isMobile])

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
      searchMobileButtonRef,
      setShowSearch,
      setShowDrawer,
      showSearch,
      showDrawer,
    }),
    [showSearch, showDrawer],
  )

  return <LayoutContext.Provider value={value} {...props} />
}

export default LayoutContext
