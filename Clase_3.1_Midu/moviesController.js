import { v4 as uuidv4 } from 'uuid';
import movies from './movies.json' assert {type: 'json'};
import { validateMovie, validatePartialMovie } from './schemas/movies.js';

export const getAllMovies = (req, res) => {
    const { genre } = req.query;
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        );
        return res.json(filteredMovies);
    }
    res.json(movies);
};

export const getMovieById = (req, res) => {
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id);
    if (movie) return res.json(movie);
    res.status(404).json({ message: 'Movie not found' });
};

export const createMovie = (req, res) => {
    const result = validateMovie(req.body);
    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = {
        id: uuidv4(),
        ...result.data
    };

    movies.push(newMovie);

    res.status(201).json(newMovie);
};

export const deleteMovie = (req, res) => {
    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    movies.splice(movieIndex, 1);

    return res.json({ message: 'Movie deleted' });
};

export const updateMovie = (req, res) => {
    const result = validatePartialMovie(req.body);
    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data
    };

    movies[movieIndex] = updatedMovie;
    return res.json(updatedMovie);
};
