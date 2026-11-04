import { Position, Signalement } from '../api/signalement'
import { BANPlateformeResultTypeEnum, IBANPlateformeNumero } from '../api/ban-plateforme/types'
import { getExistingReportLocation, getRequestedReportLocation } from './report.utils'
import { getInitialSignalement } from './signalement.utils'

const address: IBANPlateformeNumero = {
  id: 'address-id',
  type: BANPlateformeResultTypeEnum.NUMERO,
  numero: 1,
  suffixe: '',
  positions: [
    {
      positionType: Position.type.ENTR_E,
      position: { type: 'Point', coordinates: [2, 48] },
    },
    {
      positionType: Position.type.B_TIMENT,
      position: { type: 'Point', coordinates: [2.001, 48.001] },
    },
  ],
  parcelles: [],
  voie: { id: 'way-id', nomVoie: 'Rue de test' },
  lieuDitComplementNom: '',
  certifie: false,
  lat: 48,
  lon: 2,
  positionType: Position.type.ENTR_E,
  commune: {
    code: '75000',
    id: 'city-id',
    nom: 'Paris',
    departement: { nom: 'Paris', code: '75' },
    region: { nom: 'Île-de-France', code: '11' },
    voies: [],
  },
  codePostal: '75000',
}

describe('draft report positions', () => {
  it('uses the complete BAN snapshot for an unchanged number update without adding it to the API payload', () => {
    const draft = getInitialSignalement(address, Signalement.type.LOCATION_TO_UPDATE)!
    const editedDraft = { ...draft, author: { ...draft.author, firstName: 'Test' } }

    expect(getExistingReportLocation(editedDraft)?.positions).toEqual([
      { type: Position.type.ENTR_E, coordinates: [2, 48], change: 'unchanged' },
      { type: Position.type.B_TIMENT, coordinates: [2.001, 48.001], change: 'unchanged' },
    ])
    expect(getRequestedReportLocation(editedDraft)?.positions.map(({ change }) => change)).toEqual([
      'unchanged',
      'unchanged',
    ])
    expect(JSON.stringify(editedDraft)).not.toContain('draftOriginalPositions')
  })

  it('includes every original BAN position in a number deletion recap', () => {
    const draft = getInitialSignalement(address, Signalement.type.LOCATION_TO_DELETE)!

    expect(getExistingReportLocation(draft)?.positions).toEqual([
      { type: Position.type.ENTR_E, coordinates: [2, 48], change: 'removed' },
      { type: Position.type.B_TIMENT, coordinates: [2.001, 48.001], change: 'removed' },
    ])
  })
})
