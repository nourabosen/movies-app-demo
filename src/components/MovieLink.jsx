

const BASE_URL='https://www.themoviedb.org/movie/'

const MovieLink = (id) => {
    window.open(`${BASE_URL}${id}`)
}

export default MovieLink