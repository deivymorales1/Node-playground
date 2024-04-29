import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 1234;

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:1234',
            'https://movies.com',
            'https://midu.dev'
        ];
        if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, origin);
        }
        return callback(new Error('Not allowed by CORS'));
    }
}));

// Monta las rutas
app.use('/', routes);89

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`);
});
