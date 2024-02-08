// Importaciones
const { validate } = require("../helpers/validate");
const User = require("../models/user");

// accion de prueba
const prueba = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde controllers/user.js",
  });
};

// Registro
const register = (req, res) => {
  // Recoger datos de la peticion
  let params = req.body;
  console.log(params);
  // Comprobar que me llegan bien
  if (!params.name || !params.nick || !params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }
  // Validar los datos
  try {
    validate(params);
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "Validacion no superada",
      error,
    });
  }
  // Control usuarios duplicados
  User.find({
    $or: [
      { email: params.email.toLowerCase() },
      { nick: params.nick.toLowerCase() },
    ],
  }).exec((error, users) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Error en la consulta de control de usuarios duplicados",
      });
    }

    if (users && users.length >= 1) {
      return res.status(200).send({
        status: "error",
        message: "El usuario ya existe",
      });
    }

    // Cifrar contrasenia

    // Crear objeto del usuario

    // Guardar usuario en la bbdd

    // Limpiar el objeto a devolver

    // Devolver un resultado

    return res.status(200).send({
      status: "success",
      message: "Metodo de registro",
    });
  });
};

module.exports = {
  prueba,
  register,
};
