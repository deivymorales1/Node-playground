/* import express from 'express';

const app = express();


export const fetchData = () => {
  const response = fetch('./data/productos.json', {mode: 'no-cors'});
  const data = response.json();
  console.log(data);
}
// 


  app.get('/productos', (req,res) => {
    res.json(data)
  })

  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(`Server listening on port`);
  })

 */

import express from 'express';
import productos from './data/productos.json' assert { type: "json" }; // Aserción de importación de tipo JSON

const app = express();

// Define la ruta para obtener todos los productos
app.get('/productos', (req, res) => {
  res.json(productos); // Envía los datos del archivo JSON como respuesta
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
