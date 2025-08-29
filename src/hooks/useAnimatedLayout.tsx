import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'
import useWindowSize from './useWindowSize'

export const ANIMATION_DURATION = 300

const mobileSearchBtn = document.createElement('button')
mobileSearchBtn.className = 'fr-btn--search fr-btn'
mobileSearchBtn.setAttribute('aria-label', 'Ouvrir la recherche')

export const useAnimatedLayout = () => {
  const { isMobile } = useWindowSize()
  const [showSearch, setShowSearch] = useState(!isMobile)
  const [showDrawer, setShowDrawer] = useState(false)

  const navigation = useNavigation()
  const location = useLocation()

  const searchRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  mobileSearchBtn.style.display = showDrawer ? 'none' : 'block'
  mobileSearchBtn.style.backgroundColor = showSearch ? '#eeeeee' : 'transparent'

  useEffect(() => {
    const mobileNavbar = document.querySelector('.fr-header__navbar')
    const alreadyHasBtn = mobileNavbar?.querySelector('.fr-btn--search')
    if (!mobileNavbar || alreadyHasBtn) {
      return
    }
    mobileSearchBtn.onclick = () => {
      setShowSearch((state) => !state)
    }
    mobileNavbar.prepend(mobileSearchBtn)
  }, [])

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
