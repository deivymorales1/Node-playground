// Importar modelo
const Follow = require("../models/follow");
const User = require("../models/user");

// Importar servicio
const followService = require("../services/followService");

// Importar dependencias
const mongoosePaginate = require("mongoose-paginate-v2");

// Accion de guardar un follow (accion seguir)
const save = async (req, res) => {
  try {
    // Conseguir datos por body
    const params = req.body;
    // Sacar id del usuario identificado
    const identity = req.user;
    // Crear objeto con modelo follow
    let userToFollow = new Follow({
      user: identity.id,
      followed: params.followed,
    });

    // Guardar objeto en bbdd
    const followStored = await userToFollow.save();

    return res.status(200).send({
      status: "success",
      identity: req.user,
      follow: followStored,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "no se ha podido seguir al usuario",
    });
  }
};

// Accion de borrar un follow (accion dejar de seguir)
const unfollow = async (req, res) => {
  try {
    // Recoger el id del usuario identificado
    const userId = req.user.id;
    console.log(userId);
    // Recoger el id del usuario que sigo y quiero dejar de seguir
    const followedId = req.params.id;

    // Find de las coincidencias y hacer remove
    const followDeleted = await Follow.deleteOne({
      user: userId,
      followed: followedId,
    });

    if (followDeleted.deletedCount === 0) {
      return res.status(500).send({
        status: "success",
        message: "No has dejado de seguir a nadie",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Follow eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al dejar de seguir al usuario",
    });
  }
};

// Accion listado de usuarios que cualquier usuario esta siguiendo (siguiendo)
const following = async (req, res) => {
  try {
    // Sacar el id del usuario identificado
    let userId = req.user.id;

    // Comprobar si me llega el id por parámetro en la URL
    if (req.params.id) userId = req.params.id;

    // Comprobar si me llega la página, si no la página 1
    let page = 1;

    if (req.params.page) page = req.params.page;

    // Usuarios por página que quiero mostrar
    const itemsPerPage = 5;

    // Utilizar Mongoose Paginate para paginar los resultados
    const options = {
      page: page,
      limit: itemsPerPage,
      select: "-password -role -__v",
    };

    // Encontrar los usuarios que está siguiendo el usuario con userId
    const result = await Follow.paginate({ user: userId }, options);

    // Populate de los campos 'user' y 'followed' en cada documento del resultado
    const follows = await Follow.populate(result.docs, {
      path: "user followed",
      select: "-password -role -__v",
    });

    // Obtener el total de usuarios que el usuario está siguiendo
    const totalFollowing = await Follow.countDocuments({ user: userId });

    // Calcular el total de páginas
    const totalPages = Math.ceil(totalFollowing / itemsPerPage);

    // Sacar un array de ids de los usuarios que me siguen y los que sigo
    let followUserIds = await followService.followUserIds(req.user.id);

    return res.status(200).send({
      status: "success",
      message: "Listado de usuarios que estoy siguiendo",
      follows,
      totalFollowing,
      pages: totalPages,
      user_following: followUserIds.following,
      user_follow_me: followUserIds.followers,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al obtener la lista de usuarios seguidos",
      error: error.message,
    });
  }
};

// Accion listado de usuarios que siguen a cualquier otro usuario (soy seguido)
const followers = async (req, res) => {
  try {
    // Sacar el id del usuario identificado
    let userId = req.user.id;

    // Comprobar si me llega el id por parámetro en la URL
    if (req.params.id) userId = req.params.id;

    // Comprobar si me llega la página, si no la página 1
    let page = 1;

    if (req.params.page) page = req.params.page;

    // Usuarios por página que quiero mostrar
    const itemsPerPage = 5;

    // Utilizar Mongoose Paginate para paginar los resultados
    const options = {
      page: page,
      limit: itemsPerPage,
      select: "-password -role -__v",
    };

    // Encontrar los usuarios que está siguiendo el usuario con userId
    const result = await Follow.paginate({ followed: userId }, options);

    // Populate de los campos 'user' y 'followed' en cada documento del resultado
    const follows = await Follow.populate(result.docs, {
      path: "user",
      select: "-password -role -__v",
    });

    // Obtener el total de usuarios que el usuario está siguiendo
    const totalFollowing = await Follow.countDocuments({ user: userId });

    // Calcular el total de páginas
    const totalPages = Math.ceil(totalFollowing / itemsPerPage);

    // Sacar un array de ids de los usuarios que me siguen y los que sigo
    let followUserIds = await followService.followUserIds(req.user.id);

    return res.status(200).send({
      status: "success",
      message: "Listado de usuarios que me siguen",
      follows,
      totalFollowing,
      pages: totalPages,
      user_following: followUserIds.following,
      user_follow_me: followUserIds.followers,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al obtener la lista de usuarios seguidos",
      error: error.message,
    });
  }
};

// Exportar acciones
module.exports = {
  save,
  unfollow,
  following,
  followers,
};
