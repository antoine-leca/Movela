import express from 'express';
import {
    searchMovies,
    searchMultiMedia,
    searchPersons,
    searchSeries
} from '../controllers/searchControllers.js';

const router = express.Router();

router.get('/', searchMultiMedia);
router.get('/movies', searchMovies);
router.get('/series', searchSeries);
router.get('/persons', searchPersons);

export default router;