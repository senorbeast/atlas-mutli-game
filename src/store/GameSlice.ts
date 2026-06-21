import { StateCreator } from 'zustand'
import { MyState } from './store'
import type { AcceptedCity } from '@/protocol/types'

enum GameModes {
  notSelected,
  cities,
  countries,
  citiesAndCountries,
}
export interface GameSlice {
  id: number
  name: string

  players: number
  addPlayer: () => void

  gameMode: GameModes
  selectGameMode: (gameMode: GameModes) => void

  wordsSubmitted: string[]
  addWord: (newWord: string) => void
  acceptedCities: AcceptedCity[]
  currentCity: AcceptedCity | null
  addAcceptedCity: (city: AcceptedCity) => void
}
export const createGameSlice: StateCreator<MyState, [['zustand/immer', never]], [], GameSlice> = (set) => ({
  id: 0,
  name: 'Game',

  players: 4,
  addPlayer: () => set((state) => ({ players: state.players + 1 })),

  gameMode: GameModes.notSelected,
  selectGameMode: (gameMode: GameModes) => set((state) => (state.gameMode = gameMode)),

  wordsSubmitted: ['atlas'],
  addWord: (newWord) =>
    set((state) => {
      state.wordsSubmitted.push(newWord)
    }),
  acceptedCities: [],
  currentCity: null,
  addAcceptedCity: (city) =>
    set((state) => {
      state.acceptedCities.push(city)
      state.currentCity = city
      state.wordsSubmitted.push(city.name)
    }),
})
