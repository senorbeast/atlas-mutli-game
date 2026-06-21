import type { CityEntry } from '@/protocol/types'

interface RawCityEntry {
  country: string
  name: string
  lat: string
  lng: string
}

interface CityIndex {
  byName: Map<string, CityEntry>
}

let cityIndexPromise: Promise<CityIndex> | null = null

export const normalizeCityName = (value: string) => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase()

export const getCityIndex = async () => {
  cityIndexPromise ??= fetch('/cities.json')
    .then(async (response) => {
      if (!response.ok) throw new Error(`Unable to load city data (${response.status})`)
      return (await response.json()) as RawCityEntry[]
    })
    .then((cities) => {
      const byName = new Map<string, CityEntry>()

      cities.forEach((city) => {
        const key = normalizeCityName(city.name)
        if (byName.has(key)) return

        const lat = Number(city.lat)
        const lng = Number(city.lng)
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

        byName.set(key, {
          name: city.name,
          country: city.country,
          lat,
          lng,
        })
      })

      return { byName }
    })

  return cityIndexPromise
}

export const findCityByName = async (value: string) => {
  const key = normalizeCityName(value)
  if (!key) return null

  const index = await getCityIndex()
  return index.byName.get(key) ?? null
}
