import express, { json } from 'express';  
import { createMovieRouter } from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';

export const createApp = ({ movieModel }) => {

    const app = express()
    app.use(json())
    app.use(corsMiddleware())
    app.disable('x-powered-by') // deshabilitar el header

    // metodos normales: GET/HEAD/POST
    // Todos los recursos que sean MOVIES se identifica con /movies
    // Endpoint donde hay recursos
    // desde aca le decimos que modelo debe utilizar
    app.use('/movies', createMovieRouter( { movieModel}))

    const PORT = process.env.PORT ?? 1234

    app.listen(PORT, () => {
        console.log(`Escuchando en el puerto: ${PORT}`);
    })
}





