import express from 'express';
import { getAllSeries, getPopularSeries, getSeriesByMultipleGenres, getSeriesDetails } from '../controllers/seriesControllers.js';

const router = express.Router();

router.get('/popular', getPopularSeries);
router.get('/by-genres', getSeriesByMultipleGenres);
router.get('/all', getAllSeries);
router.get('/:id', getSeriesDetails);

export default router;