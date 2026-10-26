import { createContext, useContext, useReducer, useEffect } from 'react'
import type { Movie, Theme } from '../types'

interface AppState {
  favorites: Movie[]
  theme: Theme
}

type AppAction =
  | { type: 'TOGGLE_FAVOURITE'; payload: Movie }
  | { type: 'SET_THEME'; theme: Theme }

interface AppContextValue extends AppState {
  toggleFavorite: (movie: Movie) => void
  isFavorite: (id: number) => boolean
  toggleTheme: () => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const exists = state.favorites.some((m) => m.id === action.payload.id)
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((m) => m.id !== action.payload.id)
          : [...state.favorites, action.payload],
      }
    }
    case 'SET_THEME':
      return { ...state, theme: action.theme }
    default:
      return state
  }
}

function getInitialState(): AppState {
  const savedFavs = localStorage.getItem('cinegrid_favorites')
  const savedTheme = localStorage.getItem('cinegrid_theme') as Theme | null
  return {
    favorites: savedFavs ? JSON.parse(savedFavs) : [],
    theme: savedTheme ?? 'dark',
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState)

  useEffect(() => {
    localStorage.setItem('cinegrid_favorites', JSON.stringify(state.favorites))
  }, [state.favorites])

  useEffect(() => {
    localStorage.setItem('cinegrid_theme', state.theme)
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  const toggleFavorite = (movie: Movie) =>
    dispatch({ type: 'TOGGLE_FAVOURITE', payload: movie })

  const isFavorite = (id: number) => state.favorites.some((m) => m.id === id)

  const toggleTheme = () =>
    dispatch({ type: 'SET_THEME', theme: state.theme === 'dark' ? 'light' : 'dark' })

  return (
    <AppContext.Provider value={{ ...state, toggleFavorite, isFavorite, toggleTheme }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
