'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { findCityByName, getCityIndex } from '@/data/cities'
import { continuationValidation } from '@/helpers/validations'
import useStore from '@/store/store'
import type { AcceptedCity } from '@/protocol/types'

export type AtlasWordSubmissionResult =
  | { ok: true; city: AcceptedCity }
  | { ok: false; reason: 'empty' | 'city-data' | 'unknown-city' | 'continuation' }

export const useAtlasWordGame = () => {
  const wordsSubmitted = useStore((state) => state.wordsSubmitted)
  const acceptedCities = useStore((state) => state.acceptedCities)
  const currentCity = useStore((state) => state.currentCity)
  const addAcceptedCity = useStore((state) => state.addAcceptedCity)
  const playerId = useStore((state) => state.playerId)
  const displayName = useStore((state) => state.displayName)
  const [cityDataReady, setCityDataReady] = useState(false)
  const previousWord = wordsSubmitted.at(-1) ?? 'atlas'

  useEffect(() => {
    let cancelled = false

    getCityIndex()
      .then(() => {
        if (!cancelled) setCityDataReady(true)
      })
      .catch(() => {
        if (!cancelled) setCityDataReady(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const validateWord = useCallback(
    (word: string) => {
      const trimmed = word.trim()
      return {
        continuationValid: Boolean(trimmed[0] && continuationValidation(previousWord, trimmed[0])),
        wordValid: Boolean(trimmed),
      }
    },
    [previousWord],
  )

  const submitWord = useCallback(
    async (word: string): Promise<AtlasWordSubmissionResult> => {
      const trimmed = word.trim()
      if (!trimmed) return { ok: false, reason: 'empty' }

      const validation = validateWord(trimmed)
      if (!validation.continuationValid || !validation.wordValid) return { ok: false, reason: 'continuation' }

      const city = await findCityByName(trimmed).catch(() => null)
      if (!city) return { ok: false, reason: cityDataReady ? 'unknown-city' : 'city-data' }

      const acceptedCity: AcceptedCity = {
        ...city,
        submittedByPlayerId: playerId ?? undefined,
        submittedByName: displayName ?? undefined,
        submittedAt: new Date().toISOString(),
      }

      addAcceptedCity(acceptedCity)
      return { ok: true, city: acceptedCity }
    },
    [addAcceptedCity, cityDataReady, displayName, playerId, validateWord],
  )

  return useMemo(
    () => ({
      wordsSubmitted,
      acceptedCities,
      currentCity,
      previousWord,
      cityDataReady,
      validateWord,
      submitWord,
    }),
    [acceptedCities, cityDataReady, currentCity, previousWord, submitWord, validateWord, wordsSubmitted],
  )
}
