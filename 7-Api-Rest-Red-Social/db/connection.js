const mongoose = require("mongoose");

const connection = async () => {
  // Manejo de error
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect("mongodb://localhost:27017/mi_red_social");

    console.log("Conectado correctamente a bd: mi_redsocial");
  } catch (error) {
    console.log(error);
    throw new Error("No se ha encontrado la base de datos");
  }
};

module.exports = {
  connection,
};
