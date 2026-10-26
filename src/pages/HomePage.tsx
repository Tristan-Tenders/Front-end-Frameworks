import { useMovies } from "../hooks/useMovies";
import { useGenres } from "../hooks/useGenres"
import { useState } from "react";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal";
import type { Movie } from "../types";

const apiUrl = `${import.meta.env.VITE_TMDB_BASE_URL}/movie/popular?language=en-US&page=1`;
const genresUrl = `${import.meta.env.VITE_TMDB_BASE_URL}/genre/movie/list?language=en-US`;

const HomePage = ({
    searchQuery = "",
    fallbackMovies = [] as Movie[],
}: {
    searchQuery?: string;
    fallbackMovies?: Movie[];
}) => {
    const { movies, loading, error } = useMovies(apiUrl);
    const { genres } = useGenres(genresUrl);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [lastRandomId, setLastRandomId] = useState<number | null>(null);

    const displayMovies = (loading || error) ? fallbackMovies : movies;
    const filteredMovies = displayMovies.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Picks a random movie from the current (search-filtered) list,
    // avoiding the previous pick so the same movie doesn't show up twice in a row.
    const pickRandomMovie = () => {
        const pool = filteredMovies.length > 1
            ? filteredMovies.filter((m) => m.id !== lastRandomId)
            : filteredMovies;
        if (pool.length === 0) return;

        const randomMovie = pool[Math.floor(Math.random() * pool.length)];
        setLastRandomId(randomMovie.id);
        setSelectedMovie(randomMovie);
    };

    return (
        <main className="main-container">
            <div className="random-pick-bar">
                <button
                    className="btn-icon-label"
                    onClick={pickRandomMovie}
                    disabled={filteredMovies.length === 0}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 3 21 3 21 8" />
                        <line x1="4" y1="20" x2="21" y2="3" />
                        <polyline points="21 16 21 21 16 21" />
                        <line x1="15" y1="15" x2="21" y2="21" />
                        <line x1="4" y1="4" x2="9" y2="9" />
                    </svg>
                    Random
                </button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>Something went wrong. </p>}
            <MovieList movies={filteredMovies} genres={genres} onMovieClick={setSelectedMovie} />
            {selectedMovie && (
                <MovieModal
                    movie={selectedMovie}
                    genres={genres}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </main>
    )
}

export default HomePage;
