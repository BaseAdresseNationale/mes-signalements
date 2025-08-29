import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'
import useWindowSize from './useWindowSize'

export const ANIMATION_DURATION = 300

export const useAnimatedLayout = () => {
  const { isMobile } = useWindowSize()
  const [showSearch, setShowSearch] = useState(!isMobile)
  const [showDrawer, setShowDrawer] = useState(false)

  const navigation = useNavigation()
  const location = useLocation()

  const searchRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  const mobileSearchBtn = useMemo(() => {
    const btn = document.createElement('button')
    btn.className = 'fr-btn--search fr-btn'
    btn.setAttribute('aria-label', 'Ouvrir la recherche')
    btn.onclick = () => {
      setShowSearch((state) => !state)
    }

    return btn
  }, [])

  useEffect(() => {
    const mobileNavbar = document.querySelector('.fr-header__navbar')
    if (!mobileNavbar) {
      return
    }
    const alreadyHasBtn = mobileNavbar.querySelector('.fr-btn--search')
    if (alreadyHasBtn) {
      return
    }

    mobileNavbar.prepend(mobileSearchBtn)
  }, [mobileSearchBtn])

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
    mobileSearchBtn.style.backgroundColor = showSearch ? '#eeeeee' : 'transparent'

    if (!searchRef.current) {
      return
    }

    if (showSearch) {
      searchRef.current.classList.add('show')
      searchRef.current.setAttribute('aria-hidden', 'false')
    } else {
      searchRef.current.classList.remove('show')
      searchRef.current.setAttribute('aria-hidden', 'true')
    }
  }, [showSearch])

  useEffect(() => {
    mobileSearchBtn.style.display = showDrawer ? 'none' : 'block'

    if (!drawerRef.current) {
      return
    }

    if (showDrawer) {
      drawerRef.current.classList.add('open')
      drawerRef.current.setAttribute('aria-hidden', 'false')
    } else {
      drawerRef.current.classList.remove('open')
      drawerRef.current.setAttribute('aria-hidden', 'true')
    }
  }, [showDrawer])

  return { searchRef, drawerRef }
}
