import express from 'express';
import { getAllMovies, getMovieById, createMovie, deleteMovie, updateMovie } from './moviesController.js';

const router = express.Router();

// Rutas para las películas
router.get('/movies', getAllMovies);
router.get('/movies/:id', getMovieById);
router.post('/movies', createMovie);
router.delete('/movies/:id', deleteMovie);
router.patch('/movies/:id', updateMovie);

export default router;
