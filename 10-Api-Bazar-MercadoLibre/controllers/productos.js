import productos from '../data/productos.json' assert {type: "json"};

export class ProductController {

  // EndPoint GetAll
  getAllProducts = (req, res) => {
    return res.json(productos);
  }
}
