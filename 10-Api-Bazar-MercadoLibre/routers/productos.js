import { Router } from "express";
import { ProductController } from "../controllers/productos";

export const ProductoRouter = () => {
  const productosRouter = Router();

  productosRouter.get('/', ProductController.getAllProducts);

  return productosRouter;
};
