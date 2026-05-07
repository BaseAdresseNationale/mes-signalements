import { useCallback, useState } from 'react'
import { APIAdressePropertyType, APIAdresseResult } from '../api/api-adresse/types'
import { search as searchAPIAdresse } from '../api/api-adresse'
import { lookup as BANLookup } from '../api/ban-plateforme'
import { IBANPlateformeVoie } from '../api/ban-plateforme/types'
import { SearchItemType } from '../composants/common/SearchInput/SearchInput'
import {
  fuseDistricts,
  lyonDistricts,
  marseilleDistricts,
  parisDistricts,
} from '../utils/districts.utils'

const codesToFilter = [
  '75056',
  '69123',
  '13055',
  ...parisDistricts.map((district) => district.id),
  ...lyonDistricts.map((district) => district.id),
  ...marseilleDistricts.map((district) => district.id),
]

export interface MappedAPIAdresseResult {
  code: string
  nom: string
  type: APIAdressePropertyType
  id: string
  label: string
  details: string
  coordinates: [number, number]
  postcode?: string
}

const propertyTypeToLabel: Record<APIAdressePropertyType, string> = {
  [APIAdressePropertyType.MUNICIPALITY]: 'Commune ou arrondissement',
  [APIAdressePropertyType.STREET]: 'Voie',
  [APIAdressePropertyType.LOCALITY]: 'Lieu-dit',
  [APIAdressePropertyType.HOUSE_NUMBER]: 'Numéro',
}

const getDetails = (properties: APIAdresseResult['features'][number]['properties']) => {
  if (
    [
      APIAdressePropertyType.HOUSE_NUMBER,
      APIAdressePropertyType.STREET,
      APIAdressePropertyType.LOCALITY,
    ].includes(properties.type)
  ) {
    return `${properties.postcode} ${properties.city}`
  } else if (properties.type === APIAdressePropertyType.MUNICIPALITY) {
    return properties.postcode
  }
  return ''
}

export function useSearchAPIAdresse() {
  const [isLoading, setIsLoading] = useState(false)

  const fetchAPIAdresse = useCallback(
    (type?: APIAdressePropertyType, citycode?: string) =>
      async (search: string): Promise<SearchItemType<MappedAPIAdresseResult>[]> => {
        setIsLoading(true)
        try {
          const data = await searchAPIAdresse({
            q: search,
            type,
            limit: 10,
            citycode,
          })

          let mappedResults = data.features.map(
            ({ properties, geometry }: APIAdresseResult['features'][number]) => ({
              code: properties.id,
              nom: properties.name,
              id: properties.id,
              label: properties.name,
              type: properties.type,
              coordinates: geometry.coordinates,
              details: getDetails(properties),
              ...(properties.postcode && { postcode: properties.postcode }),
            }),
          ) as SearchItemType<MappedAPIAdresseResult>[]

          // Si Paris, Lyon ou Marseille (ou arrondissements) sont présents dans les résultats, on les filtre pour éviter les doublons
          if (mappedResults.some((result) => codesToFilter.includes(result.code))) {
            mappedResults = mappedResults.filter((result) => {
              if (result.type === APIAdressePropertyType.MUNICIPALITY) {
                return !codesToFilter.includes(result.code)
              }
              return true
            })
          }

          const shouldInjectDistrictResults =
            !citycode && (type === undefined || type === APIAdressePropertyType.MUNICIPALITY)

          if (shouldInjectDistrictResults) {
            const fuseResults = fuseDistricts.search(search, { limit: 3 })
            if (fuseResults.length > 0) {
              mappedResults = [...fuseResults.map((result) => result.item), ...mappedResults]
            }
          }

          const resultsByType = mappedResults.reduce(
            (acc, result) => {
              const featureType = propertyTypeToLabel[result.type]
              acc[featureType].push(result)
              return acc
            },
            {
              [propertyTypeToLabel[APIAdressePropertyType.MUNICIPALITY]]: [],
              [propertyTypeToLabel[APIAdressePropertyType.STREET]]: [],
              [propertyTypeToLabel[APIAdressePropertyType.LOCALITY]]: [],
              [propertyTypeToLabel[APIAdressePropertyType.HOUSE_NUMBER]]: [],
            } as Record<string, SearchItemType<MappedAPIAdresseResult>[]>,
          )

          const featuresWithHeader = Object.entries(resultsByType)
            .filter(([, features]) => features.length > 0)
            .reduce((acc, [type, features]) => {
              features.forEach((feature, index) => {
                if (index === 0) {
                  feature.header = type
                } else {
                  feature.header = undefined
                }
              })
              acc.push(...features)

              return acc
            }, [] as SearchItemType<MappedAPIAdresseResult>[])

          return featuresWithHeader
        } catch (error) {
          console.error(error)
          return []
        } finally {
          setIsLoading(false)
        }
      },
    [],
  )

  const fetchNumeros = useCallback(async (streetCode: string) => {
    setIsLoading(true)
    try {
      const data = (await BANLookup(streetCode)) as IBANPlateformeVoie
      const numeros =
        data?.numeros.map(({ numero, suffixe, id }) => ({
          label: suffixe ? `${numero} ${suffixe}` : `${numero}`,
          code: id,
        })) || []

      return numeros
    } catch (error) {
      console.error(error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { fetchAPIAdresse, fetchNumeros, isLoading }
}
