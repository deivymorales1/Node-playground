// Importaciones
const bcrypt = require("bcrypt");
const { validate } = require("../helpers/validate");
const User = require("../models/user");
const jwt = require("../helpers/jwt");

// accion de prueba
const prueba = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde controllers/user.js",
  });
};

// Registro
const register = async (req, res) => {
  try {
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
    validate(params);

    // Control usuarios duplicados
    const existingUsers = await User.find({
      $or: [
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    });

    if (existingUsers && existingUsers.length >= 1) {
      return res.status(200).send({
        status: "error",
        message: "El usuario ya existe",
      });
    }

    // Cifrar contrasenia
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    // Crear objeto del usuario
    let userToSave = new User(params);

    // Guardar usuario en la bbdd
    const userStored = await userToSave.save();

    // Limpiar el objeto a devolver
    let userCreated = userStored.toObject();
    delete userCreated.password;
    delete userCreated.role;

    // Devolver un resultado
    return res.status(200).send({
      status: "success",
      message: "usuario registrado correctamente",
      user: userCreated,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al registrar usuario",
      error: error,
    });
  }
};

const login = (req, res) => {
  // Recoger los parametros de la peticion
  let params = req.body;

  // Comprobar que me llegan
  if (!params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }

  // Buscar en la bbdd si existe el mail
  User.findOne({ email: params.email })
    .select("+password +role")
    .exec((error, user) => {
      if (error || !user) {
        return res.status(404).send({
          status: "error",
          message: "No existe el usuario",
        });
      }

      // Comprobar su contrase;a
      const pwd = bcrypt.compareSync(params.password, user.password);
      if (!pwd) {
        return res.status(400).send({
          status: "error",
          message: "Login incorrecto",
        });
      }

      // Limpiar objetos
      let identityUser = user.toObject();
      delete identityUser.password;
      delete identityUser.role;
      // Conseguir token jwt
      const token = jwt.createToken(user);

      // Devolver datos usuario y token
      return res.status(200).send({
        status: "success",
        message: "Metodo login",
        user: identityUser,
        token,
      });
    });
};

module.exports = {
  prueba,
  register,
  login,
};
