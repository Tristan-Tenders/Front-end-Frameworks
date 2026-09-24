import { useState } from "react"
import SearchBar from "./components/SearchBar"
import MovieList from "./components/MovieList"
import { SAMPLE_MOVIES } from "./data/sampleMovies"

function App() {
  const [query, setQuery] = useState("")

  const filteredMovies = SAMPLE_MOVIES.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="app-layout">
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-logo">
            <span className="logo-dot" />
            <span className="logo-text">Movie App</span>
          </div>
          <SearchBar query={query} onChange={setQuery} />
        </div>
      </header>
      <main className="main-container">
        <h1>Movie App</h1>
        <MovieList movies={filteredMovies} />
      </main>
    </div>
  )
}

export default App
