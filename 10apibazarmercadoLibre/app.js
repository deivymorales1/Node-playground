import express from "express";
import cors from 'cors';
import productosRouter from "./routers/productos.js";


const app = express();
const port = 1234;

// Uso de cors
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:3000',
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
app.use('/', productosRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

