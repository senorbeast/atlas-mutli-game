'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { atlasClient } from '@/network/atlasClient'
import { findCityByName, getCityIndex } from '@/data/cities'
import { continuationValidation } from '@/helpers/validations'
import useStore from '@/store/store'
import type { CityEntry } from '@/protocol/types'

export type AtlasWordSubmissionResult =
  | { ok: true; city: CityEntry }
  | {
      ok: false
      reason:
        | 'empty'
        | 'city-data'
        | 'unknown-city'
        | 'continuation'
        | 'duplicate'
        | 'not-connected'
        | 'assigning-turn'
        | 'not-your-turn'
    }

const normalizeSubmittedCity = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ')

export const useAtlasWordGame = () => {
  const wordsSubmitted = useStore((state) => state.wordsSubmitted)
  const acceptedCities = useStore((state) => state.acceptedCities)
  const currentCity = useStore((state) => state.currentCity)
  const connectionStatus = useStore((state) => state.connectionStatus)
  const playerId = useStore((state) => state.playerId)
  const turnMode = useStore((state) => state.turnMode)
  const currentTurnPlayerId = useStore((state) => state.currentTurnPlayerId)
  const currentTurnPlayerName = useStore((state) => state.currentTurnPlayerName)
  const serverError = useStore((state) => state.serverError)
  const [cityDataReady, setCityDataReady] = useState(false)
  const previousWord = wordsSubmitted.at(-1) ?? 'atlas'
  const isAssigningTurn = turnMode === 'strict-turns' && !currentTurnPlayerId
  const isCurrentPlayerTurn = turnMode !== 'strict-turns' || Boolean(playerId && currentTurnPlayerId === playerId)

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

      const normalizedCity = normalizeSubmittedCity(city.name)
      if (acceptedCities.some((acceptedCity) => normalizeSubmittedCity(acceptedCity.name) === normalizedCity)) {
        return { ok: false, reason: 'duplicate' }
      }

      if (connectionStatus !== 'connected') return { ok: false, reason: 'not-connected' }
      if (isAssigningTurn) return { ok: false, reason: 'assigning-turn' }
      if (!isCurrentPlayerTurn) return { ok: false, reason: 'not-your-turn' }

      atlasClient.sendGameUpdate({
        level: 0,
        type: 'submit_city',
        gameKind: 'atlas-word',
        cityName: city.name,
        errorCode: '',
        errorMessage: '',
      })
      return { ok: true, city }
    },
    [acceptedCities, cityDataReady, connectionStatus, isAssigningTurn, isCurrentPlayerTurn, validateWord],
  )

  return useMemo(
    () => ({
      wordsSubmitted,
      acceptedCities,
      currentCity,
      previousWord,
      isAssigningTurn,
      isCurrentPlayerTurn,
      currentTurnPlayerName,
      currentTurnPlayerId,
      serverError,
      serverErrorId: serverError?.id ?? 0,
      cityDataReady,
      validateWord,
      submitWord,
    }),
    [
      acceptedCities,
      cityDataReady,
      currentCity,
      currentTurnPlayerId,
      currentTurnPlayerName,
      isAssigningTurn,
      isCurrentPlayerTurn,
      previousWord,
      serverError,
      submitWord,
      validateWord,
      wordsSubmitted,
    ],
  )
}
