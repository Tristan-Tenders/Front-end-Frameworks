import { useState } from "react"
import { Star, Heart } from "lucide-react"
import type { Movie } from "../types"
import { TMDB_IMAGE_BASE } from "../data/sampleMovies"
import { getGenreNames } from "../data/genres"

const FALLBACK_POSTER =
  "https://via.placeholder.com/300x450/161b22/8b949e?text=No+Poster"

interface MovieCardProps {
  movie: Movie
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false)

  const posterSrc = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : FALLBACK_POSTER

  const genres = getGenreNames(movie.genre_ids)
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—"

  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img className="poster-img" src={posterSrc} alt={movie.title} />
        <div className="poster-overlay">
          <div className="card-top-badges">
            <span className="rating-badge">
              <Star />
              {movie.vote_average.toFixed(1)}
            </span>
            <button
              type="button"
              className={`favorite-btn${isFavorite ? " is-favorite" : ""}`}
              onClick={() => setIsFavorite((prev) => !prev)}
              aria-label={
                isFavorite ? "Remove from favourites" : "Add to favourites"
              }
            >
              <Heart />
            </button>
          </div>
        </div>
      </div>
      <div className="movie-card-info">
        <h2 className="movie-card-title">{movie.title}</h2>
        <div className="movie-card-meta">
          <span>{year}</span>
        </div>
        <div className="movie-genres-tags">
          {genres.map((genre) => (
            <span key={genre} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default MovieCard
