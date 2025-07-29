import { useCallback, useState } from 'react'
import { APIAdressePropertyType } from '../api/api-adresse/types'
import { search as searchAPIAdresse } from '../api/api-adresse'
import { lookup as BANLookup } from '../api/ban-plateforme'
import { IBANPlateformeVoie } from '../api/ban-plateforme/types'

export interface MappedAPIAdresseResult {
  code: string
  nom: string
  coordinates: [number, number]
  postcode?: string
}

export function useSearchAPIAdresse() {
  const [isLoading, setIsLoading] = useState(false)

  const fetchAPIAdresse = useCallback(
    (type: APIAdressePropertyType, citycode?: string) => async (search: string) => {
      setIsLoading(true)
      try {
        const data = await searchAPIAdresse({
          q: search,
          type,
          limit: 10,
          citycode,
        })

        return data.features.map(
          ({
            properties,
            geometry,
          }: {
            properties: { id: string; name: string; postcode?: string }
            geometry: { coordinates: [number, number] }
          }) => ({
            code: properties.id,
            nom: properties.name,
            coordinates: geometry.coordinates,
            ...(properties.postcode && { postcode: properties.postcode }),
          }),
        )
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
