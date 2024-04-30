import productos from '../data/productos.json' assert {type: "json"};

// End point GetAlls
export const getAllProducts = (req, res) => {
    res.json(productos);
};

export const getProductById = async(req, res) => {

    // Obtenemos el id 
    const {id} = req.params;
    // Hacer busqueda
    const producto = productos.products.find(producto => producto.id === parseInt(id));
    if (producto) return res.json(producto)
    res.status(404).json({ message: 'Product not found' });

}

