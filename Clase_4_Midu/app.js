import express, { json } from 'express';  
import { moviesRouter } from './routes/movies';
import { corsMiddleware } from './middlewares/cors';

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by') // deshabilitar el header

// metodos normales: GET/HEAD/POST



// Todos los recursos que sean MOVIES se identifica con /movies
// Endpoint donde hay recursos
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`);
})


