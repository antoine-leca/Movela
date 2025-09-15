import express from 'express';
import getPersonById from '../controllers/personControllers.js';

const router = express.Router();

router.get('/:id', getPersonById);

export default router;