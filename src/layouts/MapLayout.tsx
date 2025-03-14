import styled from 'styled-components'
import Map, { Layer, NavigationControl, Source } from 'react-map-gl/maplibre'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Header } from '../composants/common/Header'
import { Drawer } from '../composants/common/Drawer'
import { useLocation, useNavigation } from 'react-router-dom'
import { AdresseSearch } from '../composants/adresse/AdresseSearch'
import Loader from '../composants/common/Loader'
import useNavigateWithPreservedSearchParams from '../hooks/useNavigateWithPreservedSearchParams'
import MapContext from '../contexts/map.context'
import { interactiveLayers, staticCadastreLayers } from '../config/map/layers'
import { mapStyles } from '../config/map/styles'
import { StylesSwitch } from '../composants/map/StylesSwitch'
import { AboutModal } from '../composants/about/AboutModal'
import SourceContext from '../contexts/source.context'
import { MaplibreStyleDefinition } from '../types/maplibre.types'
import { CadastreToggle } from '../composants/map/CadastreToggle'
import { AdresseSearchMap } from '../composants/map/AdresseSearchMap'

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

  const { mapRefCb, mapChildren, showCadastre, setShowCadastre, adresseSearchMapLayersOptions } =
    useContext(MapContext)
  const { source } = useContext(SourceContext)

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
      <Header customSource={source} toggleShowInfo={() => setShowInfo((state) => !state)} />
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
          onLoad={async (e) => {
            const map = e.target
            if (!map) {
              return
            }

            const coneIcon = await map.loadImage('/icons/cone.png')
            map.addImage('cone', coneIcon.data)
          }}
          mapStyle={mapStyles[0].uri}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          interactiveLayerIds={interactiveLayers.map((layer) => layer.id)}
          {...(cursor ? { cursor } : {})}
        >
          <Source
            id='cadastre'
            type='vector'
            url='https://openmaptiles.geo.data.gouv.fr/data/cadastre.json'
          >
            {staticCadastreLayers.map((cadastreLayer) => {
              return (
                <Layer
                  key={cadastreLayer.id}
                  {...(cadastreLayer as any)}
                  layout={{
                    ...cadastreLayer.layout,
                    visibility: showCadastre ? 'visible' : 'none',
                  }}
                />
              )
            })}
          </Source>
          <AdresseSearchMap options={adresseSearchMapLayersOptions} />
          {mapChildren}
          <NavigationControl position='top-right' />
          <CadastreToggle
            layers={staticCadastreLayers.map((layer) => layer.id)}
            showCadastre={showCadastre}
            setShowCadastre={setShowCadastre}
            position='top-right'
          />
          <StylesSwitch
            styles={mapStyles as [MaplibreStyleDefinition, MaplibreStyleDefinition]}
            position='bottom-right'
          />
        </Map>
        <AdresseSearch ref={searchRef} />
        <Drawer ref={drawerRef} onClose={handleCloseDrawer}>
          {navigation.state === 'loading' ? (
            <div className='loader-wrapper'>
              <Loader />
            </div>
          ) : (
            children
          )}
        </Drawer>
      </div>
      {showInfo && <AboutModal onClose={() => setShowInfo(false)} />}
    </Layout>
  )
}
