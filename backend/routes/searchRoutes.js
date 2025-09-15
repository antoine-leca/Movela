import express from 'express';
import { searchMultiMedia } from '../controllers/searchControllers.js';

const router = express.Router();

router.get('/', searchMultiMedia);

export default router;