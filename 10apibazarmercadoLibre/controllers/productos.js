// Import dependecies
import productos from '../data/productos.json' assert {type: "json"};

// End point GetAlls
export const getAllProducts = (req, res) => {
    res.json(productos);
};

// End point searchParams
export const getSearch = (req, res) => {
    // Sacamos la palabra buscada
    const { search } = req.params;
    // Search 
    const products = productos.products.filter(producto => producto.title === search);
    if (products.length > 0) {
        // Si se encontraron productos, los devolvemos como respuesta
        return res.json(products);
    } else {
        // Si no se encontraron productos, respondemos con un código de estado 404
        return res.status(404).json({ message: 'Product not found'});
    }
}


export const getProductById = async(req, res) => {
    // Obtenemos el id 
    const {id} = req.params;
    // Hacer busqueda
    const product = productos.products.find(product => product.id === parseInt(id));
    if (product) return res.json(product)
    res.status(404).json({ message: 'Product not found' });
}



