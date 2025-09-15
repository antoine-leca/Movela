import express from 'express';
import { getNowPlaying, getPopularMovies, getMoviesByMultipleGenres, getMovieDetails, getAllMovies } from '../controllers/moviesControllers.js';

const router = express.Router();

router.get('/now-playing', getNowPlaying);
router.get('/popular', getPopularMovies);
router.get('/by-genres', getMoviesByMultipleGenres);
router.get('/all', getAllMovies);
router.get('/:id', getMovieDetails);

export default router;