// accion de prueba
const album = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde controllers/album.js",
  });
};

module.exports = {
  album,
};
