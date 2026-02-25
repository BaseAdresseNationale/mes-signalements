import { useCallback, useState } from 'react'
import { APIAdressePropertyType, APIAdresseResult } from '../api/api-adresse/types'
import { search as searchAPIAdresse } from '../api/api-adresse'
import { lookup as BANLookup } from '../api/ban-plateforme'
import { IBANPlateformeVoie } from '../api/ban-plateforme/types'
import { SearchItemType } from '../composants/common/SearchInput/SearchInput'

export interface MappedAPIAdresseResult {
  code: string
  nom: string
  coordinates: [number, number]
  postcode?: string
}

const propertyTypeToLabel: Record<APIAdressePropertyType, string> = {
  [APIAdressePropertyType.HOUSE_NUMBER]: 'Numéro',
  [APIAdressePropertyType.STREET]: 'Voie',
  [APIAdressePropertyType.LOCALITY]: 'Lieu-dit',
  [APIAdressePropertyType.MUNICIPALITY]: 'Commune',
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

          const mappedResults = data.features.map(
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
          )

          const resultsByType = mappedResults.reduce(
            (acc, result) => {
              const featureType = propertyTypeToLabel[result.type]
              if (!acc[featureType]) {
                acc[featureType] = []
              }
              acc[featureType].push(result)
              return acc
            },
            {} as Record<string, SearchItemType<MappedAPIAdresseResult>[]>,
          )

          const featuresWithHeader = Object.entries(resultsByType).reduce(
            (acc, [type, features]) => {
              features[0].header = type
              acc.push(...features)

              return acc
            },
            [] as SearchItemType<MappedAPIAdresseResult>[],
          )

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
