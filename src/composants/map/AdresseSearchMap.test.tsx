import React from 'react'
import { render } from '@testing-library/react'
import { AdresseSearchMap } from './AdresseSearchMap'
import { adresseCircleLayer, allBANLayers } from '../../config/map/layers'
import { SignalementContext } from '../../contexts/signalement.context'

const mockOn = jest.fn()
const mockOff = jest.fn()
const mockLayer = jest.fn()
const mockNavigate = jest.fn()
const mockMap = { current: { on: mockOn, off: mockOff } }

jest.mock('../../contexts/signalement.context', () => ({
  SignalementContext: jest.requireActual('react').createContext({ signalement: null }),
}))

jest.mock('react-map-gl/maplibre', () => ({
  useMap: () => mockMap,
  Source: ({ children }: { children: React.ReactNode }) => children,
  Layer: (props: unknown) => {
    mockLayer(props)
    return null
  },
}))

jest.mock('../../hooks/useNavigateWithPreservedSearchParams', () => ({
  __esModule: true,
  default: () => ({ navigate: mockNavigate }),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders only the existing layers and preserves base paint', () => {
  render(
    <AdresseSearchMap
      options={{
        adresse: { paint: { 'circle-opacity': 1 } },
        voie: { paint: { 'text-color': '#929292', 'text-opacity': 0.8 } },
      }}
    />,
  )

  const layers = mockLayer.mock.calls.map(([props]) => props)
  expect(layers.map((layer) => layer.id)).toEqual(allBANLayers.map(({ layer }) => layer.id))
  expect(layers.find((layer) => layer.id === 'adresse').paint).toEqual({
    ...adresseCircleLayer.paint,
    'circle-opacity': 1,
  })
  expect(layers.find((layer) => layer.id === 'voie').paint['text-color']).toBe('#929292')
  expect(
    mockOn.mock.calls.filter(([event]) => event === 'click').map(([, layerId]) => layerId),
  ).toEqual(['adresse', 'adresse-label', 'voie', 'toponyme'])
})

test('disables BAN interactions when a report is created and restores them when closed', () => {
  const view = (signalement: unknown) => (
    <SignalementContext.Provider value={{ signalement } as any}>
      <AdresseSearchMap options={{}} />
    </SignalementContext.Provider>
  )
  const { rerender } = render(view(null))
  const handlers = [...mockOn.mock.calls]
  const clickCalls = handlers.filter(([event]) => event === 'click')

  clickCalls.forEach(([, layerId, handler]) => {
    handler({ features: [{ id: layerId }] })
    expect(mockNavigate).toHaveBeenCalledWith(`/${layerId}`)
  })

  mockOn.mockClear()
  rerender(view({ id: 'report' }))
  handlers.forEach(([event, layerId, handler]) => {
    expect(mockOff).toHaveBeenCalledWith(event, layerId, handler)
  })
  expect(mockOn).not.toHaveBeenCalled()

  rerender(view(null))
  expect(mockOn.mock.calls.filter(([event]) => event === 'click')).toHaveLength(4)
})

test('does not attach BAN interactions when a report already exists on mount', () => {
  render(
    <SignalementContext.Provider value={{ signalement: { id: 'report' } } as any}>
      <AdresseSearchMap options={{}} />
    </SignalementContext.Provider>,
  )

  expect(mockLayer).toHaveBeenCalledTimes(4)
  expect(mockOn).not.toHaveBeenCalled()
})
