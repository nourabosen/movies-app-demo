import { useState, useEffect } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import {useDebounce} from 'react-use';
import { getTrendingMovies, updateSearchCount, getFavMovies } from './appwrite';
import MovieLink from './components/MovieLink';

const API_BASE_URL = "/api/movies";

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const [movieList, setMovieList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [favMovies, setFavMovies] = useState([]);

    useDebounce(()=> setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

    const fetchMovies = async (query='') => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = query
                ? `${API_BASE_URL}?query=${encodeURIComponent(query)}`
                : API_BASE_URL;
            
            const response = await fetch(endpoint);
            
            if(!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            const data = await response.json();
            
            if(data.Response == 'False'){
                setErrorMessage(data.Error || "Failed to fetch the movies. Please try again.");
                setMovieList([]);
                return;
            }
            setMovieList(data.results || []);

            if(query && data.results.length > 0){
                await updateSearchCount(query, data.results[0]);
            }
        }
        catch (error){
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage(error.message || 'Error fetching movies');
        } finally {
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.log(`Error fetching trending movies: ${error}`);
        }
    }

    const loadFavMovies = async () => {
        try {
            const movies = await getFavMovies();
            setFavMovies(movies);
        } catch (error) {
            console.log(`Error fetching favourite movies: ${error}`);
        }
    }
    
    useEffect(()=>{
        const executeFetch = async () => {
            await fetchMovies(debouncedSearchTerm);
        };
        executeFetch();
    }, [debouncedSearchTerm]);
    
    useEffect(()=>{
        const executeTrending = async () => {
            await loadTrendingMovies();
        };
        executeTrending();
    }, []);
    
    useEffect(()=>{
        const executeFavs = async () => {
            await loadFavMovies();
        };
        executeFavs();
    }, []);

    return (
        <main>
            <div className = "pattern"/>
            <div className = "wrapper">
                <header>
                    <img src= "./hero.png" alt ="Hero Banner!"/>
                    <br></br>
                    <h1>
                        Find <span className = "text-gradient">Movies</span> You'll Enjoy
                    </h1>
                    <Search searchTerm = {searchTerm} setSearchTerm = {setSearchTerm} />
                    <br/>
                </header>
                
                {favMovies.length > 0 && (
                    <section className='trending' >
                        <h2>Developer's Favourite Movies</h2>
                        <ul>
                            {favMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie.title} onClick={() => MovieLink(movie.movie_id)}/>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {trendingMovies.length > 0 && (
                    <section className='trending' >
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie.title} onClick={() => MovieLink(movie.movie_id)}/>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className='all-movies'>
                    <h2 className='mt-5'>All Movies</h2>
                    {isLoading ? (
                        <Spinner/>
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie}/>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    )
}

export default App
