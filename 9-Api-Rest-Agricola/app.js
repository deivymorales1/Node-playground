import express from 'express';
import productos from './data/productos.json';
const app = express();

// 


  app.get('/productos', (req,res) => {
    res.json(productos)
  })

  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(`Server listening on port`);
  })

