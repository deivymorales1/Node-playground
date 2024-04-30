import { Router } from "express";
import { getAllProducts, getProductById } from '../controllers/productos.js';

// Inicialimos el Router()
const productosRouter = Router()


// Declaramos las rutas
productosRouter.get('/', getAllProducts);
productosRouter.get('/:id', getProductById);


// Exportamos las rutas
export default productosRouter;

