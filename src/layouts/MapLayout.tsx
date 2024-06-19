import styled from 'styled-components'
import Map from 'react-map-gl/maplibre'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Header } from '../composants/common/Header'
import { Drawer } from '../composants/common/Drawer'
import { useLocation, useNavigation } from 'react-router-dom'
import { AdresseSearch } from '../composants/adresse/AdresseSearch'
import Loader from '../composants/common/Loader'
import useNavigateWithPreservedSearchParams from '../hooks/useNavigateWithPreservedSearchParams'
import { useCustomSource } from '../hooks/useCustomSource'
import MapContext from '../contexts/map.context'
import { interactiveLayers } from '../composants/map/layers'

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
  const onMouseEnter = useCallback(() => setCursor('pointer'), [])
  const onMouseLeave = useCallback(() => setCursor(null), [])

  const { mapRef, mapChildren } = useContext(MapContext)
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
      <Header customSource={customSource} />
      <div className='main-wrapper'>
        <Map
          ref={mapRef}
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
            zoom: 5.5,
          }}
          mapStyle='https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          interactiveLayerIds={interactiveLayers.map((layer) => layer.id)}
          {...(cursor ? { cursor } : {})}
        >
          {mapChildren}
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
    </Layout>
  )
}
