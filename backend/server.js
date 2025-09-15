import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import movieRoutes from './routes/moviesRoutes.js';
import personRoutes from './routes/personRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import seriesRoutes from './routes/seriesRoutes.js';

dotenv.config();

console.log('API Key loaded:', process.env.TMDB_API_KEY ? 'YES' : 'NO');

console.log('=== DEBUG ENV ===');
console.log('✅ Variables d\'environnement chargées');
console.log('Node.js version:', process.version);
console.log('=== PACKAGES CHECK ===');
console.log('Express:', express.version || 'loaded');
console.log('CORS:', cors ? '✅ loaded' : '❌ missing');
console.log('Dotenv:', dotenv ? '✅ loaded' : '❌ missing');
console.log('==================');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://movela.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Routes de l'api à réutiliser dans le fetch en front
app.use('/api/movies', movieRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/person', personRoutes);

app.listen(PORT, () => {
  console.log(`✅ Backend prêt sur http://localhost:${PORT}`);
});
