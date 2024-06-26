import styled from 'styled-components'
import Map, { NavigationControl } from 'react-map-gl/maplibre'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Header } from '../composants/common/Header'
import { Drawer } from '../composants/common/Drawer'
import { useLocation, useNavigation } from 'react-router-dom'
import { AdresseSearch } from '../composants/adresse/AdresseSearch'
import Loader from '../composants/common/Loader'
import useNavigateWithPreservedSearchParams from '../hooks/useNavigateWithPreservedSearchParams'
import { useCustomSource } from '../hooks/useCustomSource'
import MapContext from '../contexts/map.context'
import { interactiveLayers } from '../config/map/layers'
import { mapStyles } from '../config/map/styles'
import { StylesSwitch } from '../composants/map/StylesSwitch'
import { AboutModal } from '../composants/about/AboutModal'

const Layout = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;

  > header {
    flex: 0 0 auto;
  }

  > .main-wrapper {
    flex: 1 1 auto;
    position: relative;
    height: 100%;
    overflow: hidden;

    .loader-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`

export const ANIMATION_DURATION = 300

interface MapLayoutProps {
  children?: React.ReactNode
}

export function MapLayout({ children }: MapLayoutProps) {
  const searchRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  const [cursor, setCursor] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const onMouseEnter = useCallback(() => setCursor('pointer'), [])
  const onMouseLeave = useCallback(() => setCursor(null), [])

  const { mapRefCb, mapChildren } = useContext(MapContext)
  const { source: customSource } = useCustomSource()

  const { navigate } = useNavigateWithPreservedSearchParams()
  const navigation = useNavigation()
  const location = useLocation()

  useEffect(() => {
    if (!drawerRef.current || !searchRef.current) {
      return
    }

    if (location.pathname !== '/' || navigation.location) {
      searchRef.current.classList.remove('show')
      searchRef.current.setAttribute('aria-hidden', 'true')
      drawerRef.current.classList.add('open')
      drawerRef.current.setAttribute('aria-hidden', 'false')
    } else {
      searchRef.current.classList.add('show')
      searchRef.current.setAttribute('aria-hidden', 'false')
      drawerRef.current.classList.remove('open')
      drawerRef.current.setAttribute('aria-hidden', 'true')
    }
  }, [navigation, location])

  const handleCloseDrawer = () => {
    navigate('/')
  }

  return (
    <Layout>
      <Header customSource={customSource} toggleShowInfo={() => setShowInfo((state) => !state)} />
      <div className='main-wrapper'>
        <Map
          ref={mapRefCb}
          style={{
            zIndex: 0,
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
          initialViewState={{
            longitude: 2,
            latitude: 47,
            zoom: 5,
          }}
          mapStyle={mapStyles[0].uri}
          attributionControl={false}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          interactiveLayerIds={interactiveLayers.map((layer) => layer.id)}
          {...(cursor ? { cursor } : {})}
        >
          {mapChildren}
          <NavigationControl position='top-right' />
          <StylesSwitch styles={mapStyles} position='top-right' />
        </Map>
        <AdresseSearch ref={searchRef} />
        <Drawer ref={drawerRef} onClose={handleCloseDrawer}>
          {navigation.state === 'loading' && (
            <div className='loader-wrapper'>
              <Loader />
            </div>
          )}
          {children}
        </Drawer>
      </div>
      {showInfo && <AboutModal onClose={() => setShowInfo(false)} />}
    </Layout>
  )
}
