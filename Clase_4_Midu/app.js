import express, { json } from 'express';  
import { randomUUID } from 'node:crypto';
import cors from 'cors';
// Decirle a nodejs que el archivo es json

import { validateMovie, validatePartialMovie } from './schemas/movies.js';

// Como leer un JSON en ESModules recomendado por ahora
import {createRequire} from 'node:module'
const require = createRequire(import.meta.url)
const movies = require('./movies.json')

const app = express()
app.use(json())
app.use(cors({
    origin: (origin, callback ) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:1234',
            'https://movies.com',
            'https://midu.dev'
        ];
       

        
        if(!origin || ACCEPTED_ORIGINS.includes(origin)){
            return callback(null, origin)
        }
    
        return callback(new Error('Not allowed by CORS'));
    }
}))
app.disable('x-powered-by') // deshabilitar el header

// metodos normales: GET/HEAD/POST



// Todos los recursos que sean MOVIES se identifica con /movies
// Endpoint donde hay recursos
app.get('/movies', (req, res) => {

    const {genre} = req.query
    if(genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLocaleLowerCase())
        )

        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.get('/movies/:id', (req,res) => { // path-to-regexp

    const {id} = req.params
    const movie = movies.find(movie => movie.id === id)
    if(movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
    
    const result = validateMovie(req.body)
    if(result.error){
        return res.status(400).json( { error: JSON.parse(result.error.message) })
    }

    // en base de datos
    const newMovie = {
        id: randomUUID(),
        ...result.data

    }

    // Esto no es rest por que estamos guardando el estado en memoria
    movies.push(newMovie)

    res.status(201).json(newMovie) // Actualizar la cache del cliente
})

app.delete('/movies/:id', (req, res) => {
    const {id} = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if(movieIndex === -1){
        return res.status(404).json({ message: 'Movie not found' })
    }

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })

})


app.patch('/movies/:id', (req,res) =>{

    const result = validatePartialMovie(req.body)
    
    if(!result.success){
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const movieIndex = findIndex(movie => movie.id === id)

    if(movieIndex === -1){
        return res.status(404).json({ message: 'Movie not found' })
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie
    return res.json(updateMovie)
})


const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`);
})


