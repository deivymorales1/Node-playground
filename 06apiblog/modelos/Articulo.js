// Defino el esquema
const { Schema, model } = require("mongoose");

const ArticuloSchema = Schema({
  //Esquema del articulo dentro de la bb.dd
  titulo: {
    type: String,
    required: true,
  },
  contenido: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  imagen: {
    type: String,
    default: "default.png",
  },
});

// Coleccion articulo y agrega s
module.exports = model("Articulo", ArticuloSchema, "articulos");
