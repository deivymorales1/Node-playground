import {randomUUID} from 'node:crypto'
const { readJSON } = readJSON('../utils.json')

const movies = readJSON('../movies.json')

export class MovieModel {
  static getAll({ genre }) {
    if(genre) {
      return movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLocaleLowerCase())
      )
    }
    return movies
  }

  static async getById({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  static async create({ input }) {
    // en base de datos
    const newMovie = {
        id: randomUUID(),
        ...input

    }

    // Esto no es rest por que estamos guardando el estado en memoria
    movies.push(newMovie)

    return newMovie
    
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if(movieIndex === -1) return false

    movies.splice(movieIndex, 1)
    return true

  }

  static async update({ id, input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if(movieIndex === -1) return false

    movies[movieIndex] = {
        ...movies[movieIndex],
        ...input
    }

    return movies[movieIndex]
  }


}