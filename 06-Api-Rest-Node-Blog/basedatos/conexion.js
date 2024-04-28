const mongoose = require("mongoose");

// Asyncr por si de pronto la conexion demora un poco
const conexion = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mi_blog");

    console.log("Conectado correctamente a la base de datos de mi blog");
  } catch (error) {
    console.log(error);
    throw new Error("No se ha podido conectar a la base de datos");
  }
};

module.exports = {
  conexion,
};
