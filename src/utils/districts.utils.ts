import Fuse from 'fuse.js'
import { APIAdressePropertyType } from '../api/api-adresse/types'
import { MappedAPIAdresseResult } from '../hooks/useSearchAPIAdresse'
import { SearchItemType } from '../composants/common/SearchInput/SearchInput'

export const parisDistricts = [
  {
    id: '75101',
    name: 'Paris 1er arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75001',
  },
  {
    id: '75102',
    name: 'Paris 2e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75002',
  },
  {
    id: '75103',
    name: 'Paris 3e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75003',
  },
  {
    id: '75104',
    name: 'Paris 4e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75004',
  },
  {
    id: '75105',
    name: 'Paris 5e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75005',
  },
  {
    id: '75106',
    name: 'Paris 6e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75006',
  },
  {
    id: '75107',
    name: 'Paris 7e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75007',
  },
  {
    id: '75108',
    name: 'Paris 8e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75008',
  },
  {
    id: '75109',
    name: 'Paris 9e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75009',
  },
  {
    id: '75110',
    name: 'Paris 10e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75010',
  },
  {
    id: '75111',
    name: 'Paris 11e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75011',
  },
  {
    id: '75112',
    name: 'Paris 12e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75012',
  },
  {
    id: '75113',
    name: 'Paris 13e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75013',
  },
  {
    id: '75114',
    name: 'Paris 14e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75014',
  },
  {
    id: '75115',
    name: 'Paris 15e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75015',
  },
  {
    id: '75116',
    name: 'Paris 16e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75016',
  },
  {
    id: '75117',
    name: 'Paris 17e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75017',
  },
  {
    id: '75118',
    name: 'Paris 18e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75018',
  },
  {
    id: '75119',
    name: 'Paris 19e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75019',
  },
  {
    id: '75120',
    name: 'Paris 20e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '75020',
  },
]

export const lyonDistricts = [
  {
    id: '69381',
    name: 'Lyon 1er arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '69001',
  },
  {
    id: '69382',
    name: 'Lyon 2e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '69002',
  },
  {
    id: '69383',
    name: 'Lyon 3e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '69003',
  },
  {
    id: '69384',
    name: 'Lyon 4e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '69004',
  },
  {
    id: '69385',
    name: 'Lyon 5e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '69005',
  },
  {
    id: '69386',
    name: 'Lyon 6e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '69006',
  },
  {
    id: '69387',
    name: 'Lyon 7e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '69007',
  },
  {
    id: '69388',
    name: 'Lyon 8e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '69008',
  },
]

export const marseilleDistricts = [
  {
    id: '13201',
    name: 'Marseille 1er arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13001',
  },
  {
    id: '13202',
    name: 'Marseille 2e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13002',
  },
  {
    id: '13203',
    name: 'Marseille 3e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13003',
  },
  {
    id: '13204',
    name: 'Marseille 4e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13004',
  },
  {
    id: '13205',
    name: 'Marseille 5e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13005',
  },
  {
    id: '13206',
    name: 'Marseille 6e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13006',
  },
  {
    id: '13207',
    name: 'Marseille 7e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13007',
  },
  {
    id: '13208',
    name: 'Marseille 8e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13008',
  },
  {
    id: '13209',
    name: 'Marseille 9e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13009',
  },
  {
    id: '13210',
    name: 'Marseille 10e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13010',
  },
  {
    id: '13211',
    name: 'Marseille 11e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13011',
  },
  {
    id: '13212',
    name: 'Marseille 12e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13012',
  },
  {
    id: '13213',
    name: 'Marseille 13e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13013',
  },
  {
    id: '13214',
    name: 'Marseille 14e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13014',
  },
  {
    id: '13215',
    name: 'Marseille 15e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13015',
  },
  {
    id: '13216',
    name: 'Marseille 16e arrondissement',
    type: APIAdressePropertyType.MUNICIPALITY,
    postcode: '13016',
  },
]

const mappedDistricts = [...parisDistricts, ...lyonDistricts, ...marseilleDistricts].map(
  (district) => ({
    ...district,
    code: district.id,
    label: district.name,
    nom: district.name,
    details: district.postcode,
    coordinates: [0, 0] as [number, number],
  }),
) as SearchItemType<MappedAPIAdresseResult>[]

export const fuseDistricts = new Fuse(mappedDistricts, {
  keys: ['name'],
  threshold: 0.1,
  location: 0,
  minMatchCharLength: 4,
})

fuseDistricts.search('Paris 1er arrondissement', { limit: 3 })
