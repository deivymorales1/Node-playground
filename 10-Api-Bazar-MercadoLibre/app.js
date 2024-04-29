import express from "express";
import cors from cors;
import { ProductoRouter } from "./routers/productos.js";


const app = express();
const port = 12345;

// Uso de cors
app.use(express.json())
app.use(cors());

// Monta las rutas
app.use('/productos', ProductoRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

