// Need import productos.json
import productos from '../data/productos.json' assert {type: "json"};
import {Router, json} from "express";

export const ProductoRouter = () => {

  Router.get('/', (req,res) => {
    res.json(productos)
  })

  Router.get('/items', (req,res) => {
    const { search } = req.query;
    // Aqui puedes implementar la logica para filtrar por el parametro de busqueda
     res.send(`Busqueda de productos: ${search}`)
  })

  Router.get('/items/:id', (req,res) => {
    const {id} = req.params;
    res.send(`Detalles del producto con ID ${id}`)
  })
}
  
